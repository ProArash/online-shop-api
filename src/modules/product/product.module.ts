import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '@/modules/category/category.module';
import { ImageModule } from '@/modules/image/image.module';
import { ProductFeature } from '@/modules/product/entities/product-feature.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductController } from '@/modules/product/product.controller';
import { ProductService } from '@/modules/product/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductFeature]),
    ImageModule,
    CategoryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
