import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AcconuntDto } from './wallet.dto';
import { Public } from '../../decorators/is-public.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Wallet } from './wallet.entity';

@Controller('wallet')
export class WalletController {
  @Inject() walletService: WalletService;

  @Public()
  @Post()
  getAccount(@Body() accountDto: AcconuntDto) {
    return this.walletService.login(accountDto.address);
  }

  @Public()
  @Post('publisher')
  publisherRegister(@Body() accountDto: AcconuntDto) {
    return this.walletService.register(accountDto, 'publisher');
  }

  @Public()
  @Post('advertiser')
  advertiser(@Body() accountDto: AcconuntDto) {
    return this.walletService.register(accountDto, 'advertiser');
  }
}
