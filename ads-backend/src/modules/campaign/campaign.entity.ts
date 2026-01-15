import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../wallet/wallet.entity';
import { CampaignVariant } from './campaign-variant.entity';

@Entity({ name: 'ads_campaign' })
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'ad_title' })
  adTitle: string;

  @Column({ name: 'ad_description' })
  adDescription: string;

  @Column()
  target: string;

  @Column({ name: 'is_active' })
  isActive: boolean;

  @Column({ name: 'total_amount' })
  totalAmount: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @OneToMany(
    () => CampaignVariant,
    (campaignVariant) => campaignVariant.campaign,
  )
  variants: CampaignVariant[];
}
