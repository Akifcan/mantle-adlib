import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTConfig } from 'src/config/config.types';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSevice: ConfigService) => {
        return {
          global: true,
          secret: configSevice.get<JWTConfig>('jwt')!.secret,
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
