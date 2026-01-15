import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignTransaction } from './campaign-transaction.entity';
import { Wallet } from '../wallet/wallet.entity';
import { CampaignVariant } from './campaign-variant.entity';
import { AdLog } from '../publisher/ad-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CampaignTransaction,
      Wallet,
      CampaignVariant,
      AdLog,
    ]),
  ],
  providers: [CampaignService],
  controllers: [CampaignController],
})
export class CampaignModule {}
