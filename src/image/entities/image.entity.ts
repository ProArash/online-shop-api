import { Entity, Column, ManyToOne } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { Product } from '@/product/entities/product.entity';

@Entity()
export class Image extends FixEntity {
  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
