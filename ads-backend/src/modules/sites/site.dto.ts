import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}
