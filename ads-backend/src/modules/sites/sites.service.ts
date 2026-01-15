import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Site } from './site.entity';
import { Repository } from 'typeorm';
import { CreateSiteDto } from './site.dto';
import { Wallet } from '../wallet/wallet.entity';

@Injectable()
export class SitesService {
  @InjectRepository(Site) siteRepository: Repository<Site>;
  @InjectRepository(Wallet) walletRepository: Repository<Wallet>;

  async createSite(
    @Body() createSiteDto: CreateSiteDto,
    walletAddress: string,
  ) {
    const wallet = await this.walletRepository.findOneOrFail({
      where: { address: walletAddress },
    });

    const isUrlExists = await this.siteRepository.count({
      where: {
        wallet: { id: wallet.id },
        url: createSiteDto.url,
      },
    });

    if (isUrlExists) {
      throw new BadRequestException({ message: 'This url already exists' });
    }

    const isNameExists = await this.siteRepository.count({
      where: {
        wallet: { id: wallet.id },
        name: createSiteDto.name,
      },
    });

    if (isNameExists) {
      throw new BadRequestException({ message: 'This name already exists' });
    }

    return this.siteRepository.save(
      this.siteRepository.create({
        url: createSiteDto.url,
        name: createSiteDto.name,
        wallet,
      }),
    );
  }

  async sites(walletAddress: string) {
    const wallet = await this.walletRepository.findOneOrFail({
      where: { address: walletAddress },
    });
    return await this.siteRepository.find({
      where: { wallet: { id: wallet.id } },
    });
  }

  async site(walletAddress: string, siteId: number) {
    const address = await this.walletRepository.findOneOrFail({
      where: { address: walletAddress },
    });
    const site = await this.siteRepository.findOne({
      where: {
        wallet: { id: address.id },
        id: siteId,
      },
    });

    if (!site) {
      throw new BadRequestException({ message: 'Site not found' });
    }

    return site;
  }
}
