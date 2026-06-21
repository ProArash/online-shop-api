import { FixEntity } from '@/lib/fix.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class CartItem extends FixEntity {
  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
