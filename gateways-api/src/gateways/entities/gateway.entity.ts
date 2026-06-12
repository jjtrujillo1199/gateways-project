import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

export enum GatewayType {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CRYPTO = 'CRYPTO',
}

export enum GatewayStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('gateways')
export class Gateway {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'simple-enum', enum: GatewayType })
  type: GatewayType;

  @Column({ type: 'simple-enum', enum: GatewayStatus })
  status: GatewayStatus;

  @Column()
  country: string;

  @Column('decimal', { precision: 5, scale: 2 })
  commissionRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PaymentMethod, (pm) => pm.gateway, {
    cascade: true,
    eager: true,
  })
  paymentMethods: PaymentMethod[];
}
