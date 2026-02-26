import { Entity, Column, OneToMany } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { UserRole } from '@/lib/user.role';
import { Cart } from '@/cart/entities/cart.entity';
import { Payment } from '@/payment/entities/payment.entity';

@Entity()
export class User extends FixEntity {
  @Column()
  mobile: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  device_id: string;

  @Column({ nullable: true })
  last_ip_address: string;

  @Column({ nullable: true })
  client_id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  user_agent: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
