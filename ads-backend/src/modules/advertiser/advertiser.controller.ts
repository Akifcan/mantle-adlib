import { Controller, Get, Inject } from '@nestjs/common';
import { AdvertiserService } from './advertiser.service';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Wallet } from '../wallet/wallet.entity';

@Controller('advertiser')
export class AdvertiserController {
  @Inject() advertiserService: AdvertiserService;

  @Get('stats')
  stats(@CurrentUser() user: Wallet) {
    return this.advertiserService.stats(user);
  }
}
