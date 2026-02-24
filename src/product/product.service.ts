import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFeature } from './entities/product-feature.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ImageService } from '@/image/image.service';
import { CategoryService } from '@/category/category.service';

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
    const { categoryId, images, features, ...productData } = createProductDto;

    const product = this.productRepository.create(productData);

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      product.category = category;
    }

    const savedProduct = await this.productRepository.save(product);

    if (images?.length) {
      const imageEntities = images.map((url) => ({
        url,
        productId: savedProduct.id,
      }));
      await this.imageService.createMany(imageEntities);
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
      where: { category: { id: categoryId } },
      relations: ['category', 'images', 'features'],
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    const { categoryId, images, features, ...productData } = updateProductDto;

    Object.assign(product, productData);

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      product.category = category;
    }

    await this.productRepository.save(product);

    if (images?.length) {
      await this.imageService.removeByProductId(id);
      const imageEntities = images.map((url) => ({
        url,
        productId: id,
      }));
      await this.imageService.createMany(imageEntities);
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
