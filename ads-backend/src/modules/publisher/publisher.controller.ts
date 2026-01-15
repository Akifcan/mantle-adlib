import {
  Body,
  Controller,
  Get,
  Inject,
  Ip,
  NotFoundException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { CompleteDto, DisplayDto } from './publisher.dto';
import { Public } from '../../decorators/is-public.decorator';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { Wallet } from '../wallet/wallet.entity';

@Controller('publisher')
export class PublisherController {
  @Inject() publisherSerivce: PublisherService;

  @Public()
  @Post('complete')
  completeView(@Body() completeDto: CompleteDto) {
    return this.publisherSerivce.completeView(completeDto);
  }

  @Get('available-earn')
  availableEarn(@CurrentUser() user: Wallet) {
    return this.publisherSerivce.availableEarn(user);
  }

  @Public()
  @Post('display')
  getAd(@Body() body: DisplayDto, @Req() req: Request, @Ip() ip: string) {
    const apiKey = (req.headers as any)?.apikey;

    if (!apiKey) {
      throw new NotFoundException('No api key found');
    }

    return this.publisherSerivce.displayAd(body, apiKey, ip);
  }

  @Public()
  @Post('display/:target')
  getAdByTarget(
    @Body() body: DisplayDto,
    @Req() req: Request,
    @Param('target') target: string,
    @Ip() ip: string,
  ) {
    const apiKey = (req.headers as any)?.apikey;
    return this.publisherSerivce.displayAd(body, apiKey, ip, target);
  }

  @Post('withdraw')
  withdraw(@CurrentUser() user: Wallet) {
    return this.publisherSerivce.createSignature(user);
  }

  @Public()
  @Post(':id')
  singleAd(
    @Param('id') id: number,
    @Ip() ip: string,
    @Body() body: DisplayDto,
  ) {
    return this.publisherSerivce.displaySingleAd(id, ip, body);
  }

  @Get('stats')
  stats(@CurrentUser() user: Wallet) {
    return this.publisherSerivce.stats(user);
  }
}
