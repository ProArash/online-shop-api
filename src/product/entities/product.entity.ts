// product.entity.ts
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { Category } from '@/category/entities/category.entity';
import { Image } from '@/image/entities/image.entity';
import { ProductFeature } from '@/product/entities/product-feature.entity';
import { CartItem } from '@/cart/entities/cart-item.entity';

@Entity()
export class Product extends FixEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  keywords: string;

  @Column({ default: 0 })
  stockCount: number;

  @Column({ default: 0 })
  soldCount: number;

  @Column({ default: false })
  hasDiscount: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountPrice: number;

  @Column({ nullable: true })
  categoryId: number | null;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category | null;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @OneToMany(() => ProductFeature, (feature) => feature.product, {
    cascade: true,
  })
  features: ProductFeature[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}
