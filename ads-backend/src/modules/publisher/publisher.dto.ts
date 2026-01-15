import { IsIn, IsNotEmpty, MaxLength } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  wallet: string;
}

export class DisplayDto {
  @IsNotEmpty()
  @IsIn(['popup', 'reward', 'square', 'rectangle'])
  type: 'popup' | 'reward' | 'square' | 'rectangle';
}

export class CompleteDto {
  @IsNotEmpty()
  @MaxLength(100)
  tx: string;
}
