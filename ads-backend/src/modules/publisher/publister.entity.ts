import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';

@Entity({ name: 'ads_publisher' })
export class Publisher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  wallet: string;

  @Column()
  publisherId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.publisherId = `ads-${nanoid(10)}`;
  }
}
