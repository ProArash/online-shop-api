import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { User } from '@/user/entities/user.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';
import { Payment } from '@/payment/entities/payment.entity';
import { CartStatus } from '@/lib/cart.status';

@Entity()
export class Cart extends FixEntity {
  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.ACTIVE })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  finalAmount: number;

  @Column({ nullable: true })
  couponCode: string;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];

  @OneToMany(() => Payment, (payment) => payment.cart)
  payments: Payment[];
}
