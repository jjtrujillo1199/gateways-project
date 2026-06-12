import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Gateway } from './gateway.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 5, scale: 2 })
  commissionRate: number;

  @ManyToOne(() => Gateway, (gateway) => gateway.paymentMethods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'gatewayId' })
  gateway: Gateway;
}
