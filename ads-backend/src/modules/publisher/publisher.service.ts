import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CompleteDto, DisplayDto, SignInDto } from './publisher.dto';
import { Campaign } from '../campaign/campaign.entity';
import { CampaignVariant } from '../campaign/campaign-variant.entity';
import { AdLog } from './ad-log.entity';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { EthConfig } from '../../config/config.types';
import { Site } from '../sites/site.entity';
import { Wallet } from '../wallet/wallet.entity';
import { nanoid } from 'nanoid';

@Injectable()
export class PublisherService {
  @InjectRepository(Campaign) campaignRepository: Repository<Campaign>;
  @InjectRepository(CampaignVariant)
  campaignVariantRepository: Repository<CampaignVariant>;
  @InjectRepository(AdLog) adLogRepository: Repository<AdLog>;
  @InjectRepository(Site) siteRepository: Repository<Site>;
  @Inject() configService: ConfigService;

  private async handleSaveToLog(
    tx: string,
    ip: string,
    campaign: Campaign,
    apiKey: string,
    variant: CampaignVariant,
  ) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    const existingLog = await this.adLogRepository.findOne({
      where: {
        ipAddress: ip,
        adStartAt: MoreThan(oneMinuteAgo),
      },
      order: { adStartAt: 'DESC' },
    });

    // if (existingLog) {
    //     console.log("NOT SAVED!")
    //     return;
    // }

    const site = await this.siteRepository.findOne({
      relations: ['wallet'],
      select: { id: true, wallet: true },
      where: { apiKey },
    });

    let earn = '0.0001';
    if (variant.type === 'reward') {
      earn = '0.0003';
    }

    if (variant.type === 'popup') {
      earn = '0.0002';
    }

    const substract = parseFloat(earn);
    const remainAmount = parseFloat(campaign.totalAmount) - substract;

    await this.campaignRepository.update(
      { id: campaign.id },
      {
        isActive: remainAmount <= 0 ? false : true,
        totalAmount: remainAmount.toString(),
      },
    );
    console.log('UPDATED REMAIN AMOUNT:' + remainAmount);

    await this.adLogRepository.save(
      this.adLogRepository.create({
        tx,
        apiKey,
        adStartAt: now,
        earn,
        ipAddress: ip,
        variant: variant.type,
        viewCompleted: false,
        // viewCompleted: variant.type !== 'reward' ? true : false,
        adEndAt: variant.type !== 'reward' ? now : undefined,
        campaign: { id: campaign.id },
        campaign_variant_id: { id: variant.id },
        wallet: { id: site?.wallet?.id },
      }),
    );
    console.log('SAVED TO AD LOG');
  }

  private async handleSaveAdvertiserAdLog(
    ip: string,
    campaign: Campaign,
    variant: CampaignVariant,
  ) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    const existingLog = await this.adLogRepository.findOne({
      where: {
        ipAddress: ip,
        adStartAt: MoreThan(oneMinuteAgo),
      },
      order: { adStartAt: 'DESC' },
    });

    if (existingLog) {
      console.log('NOT SAVED!');
      return;
    }

    await this.adLogRepository.save(
      this.adLogRepository.create({
        tx: nanoid(),
        apiKey: '',
        adStartAt: now,
        earn: '0',
        ipAddress: ip,
        variant: variant.type,
        viewCompleted: variant.type !== 'reward' ? true : false,
        adEndAt: variant.type !== 'reward' ? now : undefined,
        campaign: { id: campaign.id },
        campaign_variant_id: { id: variant.id },
      }),
    );
  }

  async displayAd(
    body: DisplayDto,
    apiKey: string,
    ip: string,
    target?: string,
  ) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const query = this.campaignRepository
        .createQueryBuilder('campaign')
        .select(['campaign.id', 'campaign.isActive', 'campaign.totalAmount'])
        .where('campaign.isActive = :isActive', { isActive: true })
        .orderBy('rand()')
        .limit(1);

      if (!query) {
        if (attempt === maxRetries) {
          return { display: false };
        }
        continue;
      }

      if (target) {
        query.where('target = :target', { target });
      }

      const campaigns = await query.getMany();

      if (!campaigns || campaigns.length === 0) {
        if (attempt === maxRetries) {
          return { display: false };
        }
        continue;
      }

      const campaign = campaigns[0];

      const variant = await this.campaignVariantRepository.findOne({
        select: {
          id: true,
          type: true,
          url: true,
          redirectLink: true,
          title: true,
          subtitle: true,
        },
        where: { campaign: { id: campaign.id }, type: body.type },
      });

      if (!variant) {
        if (attempt === maxRetries) {
          return { display: false };
        }
        continue;
      }

      const tx = nanoid();

      await this.handleSaveToLog(tx, ip, campaign, apiKey, variant);

      return { tx, campaign, variant };
    }

    return { display: false };
  }

  async displaySingleAd(adId: number, ip: string, body: DisplayDto) {
    const ad = await this.campaignVariantRepository.findOne({
      relations: ['campaign'],
      select: {
        id: true,
        type: true,
        url: true,
        campaign: true,
        title: true,
        subtitle: true,
        redirectLink: true,
      },
      where: { id: adId, type: body.type },
    });
    if (!ad) {
      return { display: false };
    }
    this.handleSaveAdvertiserAdLog(ip, ad.campaign, ad);
    const { campaign, ...rest } = ad;

    return {
      campaign: {
        id: campaign.id,
      },
      variant: rest,
    };
  }

  async completeView(completeDto: CompleteDto) {
    return await this.adLogRepository.update(
      { tx: completeDto.tx },
      { viewCompleted: true },
    );
  }

  async createSignature(wallet: Wallet) {
    try {
      const publisherAddress = wallet.address;
      const adLogs = await this.adLogRepository.find({
        select: { id: true, earn: true },
        where: {
          viewCompleted: true,
          withdrawal: false,
          wallet: { id: wallet.id },
        },
      });

      const config = this.configService.get<EthConfig>('eth')!;
      const currentAmountEth = adLogs
        .reduce((sum, log) => sum + Number(log.earn), 0)
        .toFixed(10);
      const currentAmountWei = ethers.parseEther(currentAmountEth);

      console.log(config);
      // Sepolia provider'ı kur (Infura key'ini gerçek key ile değiştir)
      const provider = new ethers.JsonRpcProvider(config.rpcProvider);

      // Master wallet'ı provider'a bağla
      const masterWallet = new ethers.Wallet(config.masterWallet, provider);

      // Hash oluştur
      const hash = ethers.solidityPackedKeccak256(
        ['address', 'uint256', 'uint256'],
        [publisherAddress, currentAmountWei, 1],
      );

      const signature = await masterWallet.signMessage(ethers.getBytes(hash));

      // PARA GÖNDERİMİ - Master wallet'tan publisher'a
      console.log(
        `Master wallet'tan ${publisherAddress} adresine ${currentAmountEth} ETH gönderiliyor...`,
      );
      const transferTx = await masterWallet.sendTransaction({
        to: publisherAddress,
        value: currentAmountWei,
      });
      await transferTx.wait();
      console.log('✅ Para transferi başarılı! TX:', transferTx.hash);

      await this.adLogRepository.update(
        { wallet: { id: wallet.id } },
        { withdrawal: true },
      );

      return {
        amount: currentAmountWei.toString(),
        nonce: 1,
        signature: signature,
        transferTx: transferTx.hash,
        message: `${currentAmountEth} ETH başarıyla gönderildi!`,
      };
    } catch (error) {
      console.error('❌ Signature/Transfer hatası:', error);
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }

  async stats(user: Wallet) {
    const totalViews = await this.adLogRepository.count({
      where: { wallet: { id: user.id } },
    });

    const now = new Date();
    const firstDayOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
    );

    const monthlyViews = await this.adLogRepository.count({
      where: {
        wallet: { id: user.id },
        createdAt: MoreThanOrEqual(firstDayOfMonth),
      },
    });

    const logs = await this.adLogRepository.find({
      where: { wallet: { id: user.id }, viewCompleted: true },
    });

    const totalEarn = logs.reduce((sum, log) => sum + Number(log.earn || 0), 0);

    const monthlyLogs = await this.adLogRepository.find({
      where: {
        wallet: { id: user.id },
        viewCompleted: true,
        createdAt: MoreThanOrEqual(firstDayOfMonth),
      },
    });
    const monthlyEarn = monthlyLogs.reduce(
      (sum, log) => sum + Number(log.earn || 0),
      0,
    );

    return {
      totalViews,
      monthlyViews,
      totalEarn: totalEarn.toFixed(6),
      monthlyEarn: monthlyEarn.toFixed(6),
    };
  }

  async availableEarn(user: Wallet) {
    const adLogs = await this.adLogRepository.find({
      select: { id: true, earn: true },
      where: {
        viewCompleted: true,
        withdrawal: false,
        wallet: { id: user.id },
      },
    });

    return {
      earn: adLogs.reduce((sum, log) => sum + Number(log.earn), 0).toFixed(4),
    };
  }
}
