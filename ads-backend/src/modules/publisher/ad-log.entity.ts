import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Campaign } from '../campaign/campaign.entity';
import { CampaignVariant } from '../campaign/campaign-variant.entity';
import { Wallet } from '../wallet/wallet.entity';

@Entity({ name: 'ads_log' })
export class AdLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tx: string;

  @Column({ name: 'ad_start_at' })
  adStartAt: Date;

  @Column({ name: 'ad_end_at', nullable: true })
  adEndAt?: Date;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'api_key' })
  apiKey: string;

  @Column()
  variant: string;

  @Column({ default: false })
  withdrawal: boolean;

  @Column()
  earn: string;

  @ManyToOne(() => CampaignVariant, (campaign) => campaign.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'campaign_variant_id' })
  campaign_variant_id?: CampaignVariant;

  @ManyToOne(() => Campaign, (campaign) => campaign.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign?: Campaign;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet?: Wallet;

  @Column({ name: 'view_completed' })
  viewCompleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
