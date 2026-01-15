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

@Entity({ name: 'ads_campaign_variant' })
export class CampaignVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column({ name: 'redirect_link' })
  redirectLink: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

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
