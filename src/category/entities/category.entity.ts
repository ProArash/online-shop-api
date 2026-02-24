import { Entity, Column, OneToMany } from 'typeorm';
import { FixEntity } from '@/lib/fix.entity';
import { Product } from '@/product/entities/product.entity';

@Entity()
export class Category extends FixEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  keywords: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
