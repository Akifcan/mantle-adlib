import { Module } from '@nestjs/common';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publisher } from './publister.entity';
import { Campaign } from '../campaign/campaign.entity';
import { CampaignVariant } from '../campaign/campaign-variant.entity';
import { AdLog } from './ad-log.entity';
import { Site } from '../sites/site.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Publisher,
      Campaign,
      CampaignVariant,
      AdLog,
      Site,
    ]),
  ],
  providers: [PublisherService],
  controllers: [PublisherController],
})
export class PublisherModule {}
