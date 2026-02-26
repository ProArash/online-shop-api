import { FixEntity } from '@/lib/fix.entity';
import { Cart } from '@/cart/entities/cart.entity';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity()
export class Payment extends FixEntity {
  @Column()
  orderId: string;

  @Column({ type: 'varchar', default: 'zibal' })
  gateway: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  callbackUrl: string;

  @Column({ nullable: true })
  paymentUrl: string;

  @Column({ nullable: true, unique: true })
  trackId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column({ type: 'int', nullable: true })
  gatewayResult: number;

  @Column({ type: 'int', nullable: true })
  gatewayStatus: number;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ type: 'datetime', nullable: true })
  paidAt: Date;

  @Column({ type: 'datetime', nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  cardNumber: string;

  @Column({ nullable: true })
  refNumber: string;

  @ManyToOne(() => User, (user) => user.payments, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Cart, (cart) => cart.payments, { onDelete: 'SET NULL' })
  cart: Cart;
}
