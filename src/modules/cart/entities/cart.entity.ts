import { CartStatus } from '@/lib/cart.status';
import { FixEntity } from '@/lib/fix.entity';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { Payment } from '@/modules/payment/entities/payment.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';

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
