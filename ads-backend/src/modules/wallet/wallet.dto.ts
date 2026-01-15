import { IsNotEmpty, Matches } from 'class-validator';
import { ETH_WALLET_REGEX } from '../../utils/regex';

export class AcconuntDto {
  @IsNotEmpty()
  @Matches(ETH_WALLET_REGEX, { message: 'not a valid eth wallet address' })
  address: string;
}
