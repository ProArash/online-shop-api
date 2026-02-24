import { Entity, Column, ManyToOne } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { Product } from '@/product/entities/product.entity';

@Entity()
export class ProductFeature extends FixEntity {
  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => Product, (product) => product.features, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
