import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreativeDto {
  @IsIn(['square', 'rectangle', 'popup', 'reward'])
  type: string;

  @IsNotEmpty()
  url: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  redirectLink: string;
}

export class FeePreviewDto {
  @IsNotEmpty()
  budget: string;
}

export class CreateCampaignDto {
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @IsNotEmpty()
  @MaxLength(80)
  adTitle: string;

  @IsNotEmpty()
  @MaxLength(2000)
  adDescription: string;

  @IsNotEmpty()
  @IsArray()
  creative: CreativeDto[];

  @IsString()
  @IsNotEmpty()
  budget: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsIn([
    'automotive',
    'technology',
    'travel',
    'fashion',
    'fitness',
    'crypto',
    'e-commerce',
    'home-decor',
    'food-cooking',
    'gaming',
    'mobile-apps ',
    'luxury-lifestyle',
    'photography',
    'music',
    'movies-tv-shows',
    'health-wellness',
    'parenting-baby-products',
    'career-investing',
    'sports-football-basketball ',
    'second-hand-shopping',
  ])
  @IsNotEmpty()
  target: string;
}

export class AddAmountDto {
  @IsNotEmpty()
  budget: string;

  @IsNotEmpty()
  transaction: string;
}
