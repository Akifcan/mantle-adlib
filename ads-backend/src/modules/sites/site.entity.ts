import {
  BeforeInsert,
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
import { v4 } from 'uuid';
import { Wallet } from '../wallet/wallet.entity';

@Entity({ name: 'ads_site' })
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ name: 'api_key' })
  apiKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'wallet_id' })
  wallet: Wallet;

  @BeforeInsert()
  beforeInsert() {
    this.apiKey = `ads-app-${v4()}`;
  }
}
