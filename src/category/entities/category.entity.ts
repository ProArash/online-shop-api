// category.entity.ts
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
