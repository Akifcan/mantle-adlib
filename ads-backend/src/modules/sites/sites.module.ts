import { Module } from '@nestjs/common';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './site.entity';
import { Wallet } from '../wallet/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Site, Wallet])],
  providers: [SitesService],
  controllers: [SitesController],
})
export class SitesModule {}
