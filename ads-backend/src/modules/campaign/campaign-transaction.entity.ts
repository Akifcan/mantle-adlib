import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { Wallet } from '../wallet/wallet.entity';

export interface FeeProps {
  serviceFee: string;
  totalFee: string;
  amount: string;
}

@Entity({ name: 'ads_campaign_transaction' })
export class CampaignTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  transaction: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'service_fee' })
  serviceFee: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @Column()
  amount: string;

  @Column({ name: 'total_fee' })
  totalFee: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Campaign, (campaign) => campaign.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;
}
