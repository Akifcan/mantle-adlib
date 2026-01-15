import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './site.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Wallet } from '../wallet/wallet.entity';

@Controller('sites')
export class SitesController {
  @Inject() siteService: SitesService;

  @Post()
  createSite(
    @Body() createSiteDto: CreateSiteDto,
    @CurrentUser() user: Wallet,
  ) {
    return this.siteService.createSite(createSiteDto, user.address);
  }

  @Get()
  sites(@CurrentUser() user: Wallet) {
    return this.siteService.sites(user.address);
  }

  @Get(':id')
  site(@Param('id') id: number, @CurrentUser() user: Wallet) {
    return this.siteService.site(user.address, id);
  }
}
