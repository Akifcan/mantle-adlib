import { Injectable } from '@nestjs/common';
import { AddAmountDto, CreateCampaignDto } from './campaign.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { Repository } from 'typeorm';
import { CampaignTransaction, FeeProps } from './campaign-transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { formatEther, parseEther } from 'ethers';
import { CampaignVariant } from './campaign-variant.entity';
import { AdLog } from '../publisher/ad-log.entity';

@Injectable()
export class CampaignService {
  @InjectRepository(Campaign) campaignRepository: Repository<Campaign>;
  @InjectRepository(CampaignVariant)
  campaignVariantRepository: Repository<CampaignVariant>;
  @InjectRepository(CampaignTransaction)
  campaignTransactionRepository: Repository<CampaignTransaction>;
  @InjectRepository(Wallet) walletRepository: Repository<Wallet>;
  @InjectRepository(AdLog) adLogRepository: Repository<AdLog>;

  async adStats(wallet: string) {
    const adCount = await this.campaignRepository.count({
      where: { wallet: { address: wallet } },
    });
    const budgets = await this.campaignTransactionRepository.find({
      select: { id: true, amount: true },
      where: { wallet: { address: wallet } },
    });

    const amounts = budgets.map((x) => parseFloat(x.amount));
    const total = amounts.reduce((total, acc) => {
      return total + acc;
    }, 0);

    return {
      adCount,
      totalSpend: total,
    };
  }

  async createCampaign(createCampaignDto: CreateCampaignDto, address: string) {
    const fees = this.handleBudgetWithComission(createCampaignDto.budget);
    const wallet = await this.walletRepository.findOneOrFail({
      where: { address },
    });

    const campaign = await this.campaignRepository.save(
      this.campaignRepository.create({
        name: createCampaignDto.name,
        adTitle: createCampaignDto.adTitle,
        adDescription: createCampaignDto.adDescription,
        target: createCampaignDto.target,
        isActive: true,
        totalAmount: fees.amount,
        wallet,
      }),
    );

    const variants = await this.campaignVariantRepository.save(
      createCampaignDto.creative.map((creative) => {
        return {
          campaign: { id: campaign.id },
          type: creative.type,
          url: creative.url,
          title: creative.title,
          subtitle: creative.subtitle,
          redirectLink: creative.redirectLink,
        };
      }),
    );

    const transcation = await this.saveToTransactions(
      campaign.id,
      createCampaignDto,
      fees,
      wallet,
    );

    return {
      campaign,
      transcation,
      variants,
    };
  }

  async saveToTransactions(
    campaignId: number,
    createCampaignDto: CreateCampaignDto,
    fees: FeeProps,
    wallet: Wallet,
  ) {
    const campaign = await this.campaignRepository.findOneOrFail({
      where: { id: campaignId },
    });

    return await this.campaignTransactionRepository.save(
      this.campaignTransactionRepository.create({
        campaign,
        amount: fees.amount,
        serviceFee: fees.serviceFee,
        totalFee: fees.totalFee,
        transaction: createCampaignDto.transactionId,
        wallet,
      }),
    );
  }

  async addBudget(campaignId: number, amount: AddAmountDto, wallet: Wallet) {
    const fees = this.handleBudgetWithComission(amount.budget);
    const campaign = await this.campaignRepository.findOneOrFail({
      where: { id: campaignId, wallet: { id: wallet.id } },
    });

    const totalAmount = parseFloat(campaign.totalAmount);
    const addingAmount = parseFloat(amount.budget);

    const newAmount = totalAmount + addingAmount;
    await this.campaignRepository.update(
      { id: campaign.id },
      { totalAmount: newAmount.toString() },
    );

    const transaction = await this.campaignTransactionRepository.save(
      this.campaignTransactionRepository.create({
        campaign,
        transaction: amount.transaction,
        amount: amount.budget,
        serviceFee: fees.serviceFee,
        totalFee: fees.totalFee,
      }),
    );

    return {
      newAmount,
      transaction,
    };
  }

  async campaigns(wallet: string) {
    const Wallet = await this.walletRepository.findOneOrFail({
      where: { address: wallet },
    });
    return await this.campaignRepository.find({
      where: { wallet: { id: Wallet.id } },
    });
  }

  async campaign(id: number) {
    const campaign = await this.campaignRepository.findOneOrFail({
      where: { id },
      relations: ['variants'],
    });
    const totalAmount = await this.getTotalAmount(campaign.id);
    const totalView = await this.adLogRepository.count({
      where: { campaign: { id: campaign.id }, viewCompleted: true },
    });
    return { campaign: { ...campaign, totalView }, totalAmount: totalAmount };
  }

  async campaignTransactions(id: number) {
    const campaign = await this.campaignRepository.findOneOrFail({
      where: { id },
    });
    const transcations = await this.campaignTransactionRepository.find({
      where: { campaign: { id: campaign.id } },
    });
    return transcations;
  }

  handleBudgetWithComission(budget: string): FeeProps {
    const commissionRate = 0.05;
    const weiAmount = parseEther(budget);
    const commission = (weiAmount * BigInt(commissionRate * 100)) / BigInt(100);
    const totalFee = weiAmount + commission;

    return {
      serviceFee: formatEther(commission),
      totalFee: formatEther(totalFee),
      amount: budget,
    };
  }

  private async getTotalAmount(campaignId: number) {
    const transcations = await this.campaignTransactionRepository.find({
      select: { id: true, amount: true },
      where: { campaign: { id: campaignId } },
    });

    const totalAmount = transcations.reduce((curr, acc) => {
      return (curr += parseFloat(acc.amount));
    }, 0);

    return parseEther(totalAmount.toString()).toString();
  }
}
