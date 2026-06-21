import { FixEntity } from '@/lib/fix.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

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
