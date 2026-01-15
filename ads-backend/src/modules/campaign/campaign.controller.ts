import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { AddAmountDto, CreateCampaignDto, FeePreviewDto } from './campaign.dto';
import { CampaignService } from './campaign.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Wallet } from '../wallet/wallet.entity';

@Controller('campaign')
export class CampaignController {
  @Inject() campaignService: CampaignService;

  @Post()
  create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: Wallet,
  ) {
    return this.campaignService.createCampaign(createCampaignDto, user.address);
  }

  @Get('stats')
  adStats(@CurrentUser() user: Wallet) {
    return this.campaignService.adStats(user.address);
  }

  @Post('fee-preview')
  getFee(@Body() feePreviewDto: FeePreviewDto) {
    return this.campaignService.handleBudgetWithComission(feePreviewDto.budget);
  }

  @Patch(':id/budget')
  addBudget(
    @Param('id') id: number,
    @Body() addAmountDto: AddAmountDto,
    @CurrentUser() user: Wallet,
  ) {
    return this.campaignService.addBudget(id, addAmountDto, user);
  }

  @Get()
  campaings(@Req() req: { headers: { wallet: string } }) {
    const wallet = req.headers.wallet;
    return this.campaignService.campaigns(wallet);
  }

  @Get(':id')
  campaign(@Param('id') id: number) {
    return this.campaignService.campaign(id);
  }

  @Get(':id/transactions')
  campaignTransactions(@Param('id') id: number) {
    return this.campaignService.campaignTransactions(id);
  }
}
