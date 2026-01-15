import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { AcconuntDto } from './wallet.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WalletService {
  @InjectRepository(Wallet) walletRepository: Repository<Wallet>;
  @Inject() jwtService: JwtService;

  async login(wallet: string) {
    const result = await this.walletRepository.findOne({
      select: { id: true, name: true, address: true, type: true },
      where: { address: wallet },
    });

    if (!result) {
      throw new NotFoundException({ errorCode: 'account.not_found' });
    }

    const token = this.jwtService.sign({
      address: result.address,
      id: result.id,
    });

    return { ...result, token };
  }

  async register(
    @Body() accountDto: AcconuntDto,
    type: 'publisher' | 'advertiser',
  ) {
    const newAccount = await this.walletRepository.save(
      this.walletRepository.create({
        name: 'MetaMask Wallet',
        address: accountDto.address,
        type,
      }),
    );

    const token = this.jwtService.sign({
      address: newAccount.address,
      id: newAccount.id,
    });

    return {
      id: newAccount.id,
      name: newAccount.name,
      address: newAccount.address,
      token,
    };
  }
}
