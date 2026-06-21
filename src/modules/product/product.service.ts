// product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '@/modules/category/category.service';
import { Category } from '@/modules/category/entities/category.entity';
import { ImageService } from '@/modules/image/image.service';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
import { ProductFeature } from '@/modules/product/entities/product-feature.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { Repository, In } from 'typeorm';

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
      relations: {
        category: true,
        images: true,
        features: true,
      },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        features: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { categoryId },
      relations: {
        category: true,
        images: true,
        features: true,
      },
    });
  }

  async findByCategoryAndChildren(categoryId: number): Promise<Product[]> {
    const category = await this.categoryService.findWithAllChildren(categoryId);
    const categoryIds = this.extractAllCategoryIds(category);

    return this.productRepository.find({
      where: { categoryId: In(categoryIds) },
      relations: {
        category: true,
        images: true,
        features: true,
      },
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
