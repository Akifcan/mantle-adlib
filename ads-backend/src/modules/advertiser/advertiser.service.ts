import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from '../campaign/campaign.entity';
import { Repository } from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { AdLog } from '../publisher/ad-log.entity';

@Injectable()
export class AdvertiserService {
  @InjectRepository(Campaign) campaignRepository: Repository<Campaign>;
  @InjectRepository(AdLog) adLogRepository: Repository<AdLog>;

  async stats(user: Wallet) {
    const createdCampaigns = await this.campaignRepository.count({
      where: { wallet: { id: user.id } },
    });
    const activeCampaigns = await this.campaignRepository.count({
      where: { isActive: true, wallet: { id: user.id } },
    });
    const totalCampaignViews = await this.adLogRepository.count({
      where: { viewCompleted: true, campaign: { wallet: { id: user.id } } },
      relations: ['campaign', 'campaign.wallet'],
    });

    return {
      createdCampaigns,
      activeCampaigns,
      totalCampaignViews,
    };
  }
}
