// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImageService } from '@/image/image.service';
import { CategoryService } from '@/category/category.service';
import { Category } from '@/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductFeature)
    private readonly productFeatureRepository: Repository<ProductFeature>,
    private readonly imageService: ImageService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, imageIds, features, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      product.category = category;
      product.categoryId = categoryId;
    }

    const savedProduct = await this.productRepository.save(product);

    if (imageIds?.length) {
      await this.imageService.assignToProduct(imageIds, savedProduct.id);
    }

    if (features?.length) {
      const featureEntities = features.map((feature) =>
        this.productFeatureRepository.create({
          ...feature,
          product: savedProduct,
        }),
      );
      await this.productFeatureRepository.save(featureEntities);
    }

    return this.findOne(savedProduct.id);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'images', 'features'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'images', 'features'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { categoryId },
      relations: ['category', 'images', 'features'],
    });
  }

  async findByCategoryAndChildren(categoryId: number): Promise<Product[]> {
    const category = await this.categoryService.findWithAllChildren(categoryId);
    const categoryIds = this.extractAllCategoryIds(category);

    return this.productRepository.find({
      where: { categoryId: In(categoryIds) },
      relations: ['category', 'images', 'features'],
    });
  }

  private extractAllCategoryIds(category: Category): number[] {
    const ids = [category.id];

    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        ids.push(...this.extractAllCategoryIds(child));
      }
    }

    return ids;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, imageIds, removeImageIds, features, ...productData } =
      updateProductDto;

    Object.assign(product, productData);

    if (categoryId !== undefined) {
      if (categoryId) {
        const category = await this.categoryService.findOne(categoryId);
        product.category = category;
        product.categoryId = categoryId;
      } else {
        product.category = null;
        product.categoryId = null;
      }
    }

    await this.productRepository.save(product);

    if (removeImageIds?.length) {
      await this.imageService.removeFromProduct(removeImageIds);
    }

    if (imageIds?.length) {
      await this.imageService.addToProduct(imageIds, id);
    }

    if (features?.length) {
      await this.productFeatureRepository.delete({ product: { id } });
      const featureEntities = features.map((feature) =>
        this.productFeatureRepository.create({
          ...feature,
          product,
        }),
      );
      await this.productFeatureRepository.save(featureEntities);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.softRemove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stockCount += quantity;
    return this.productRepository.save(product);
  }

  async incrementSoldCount(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.soldCount += quantity;
    product.stockCount -= quantity;
    return this.productRepository.save(product);
  }
}
