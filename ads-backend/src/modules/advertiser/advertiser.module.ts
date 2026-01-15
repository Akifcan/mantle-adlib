import { Module } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { AdvertiserController } from './advertiser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../campaign/campaign.entity';
import { AdLog } from '../publisher/ad-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, AdLog])],
  providers: [AdvertiserService],
  controllers: [AdvertiserController],
})
export class AdvertiserModule {}
