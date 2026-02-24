import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = this.imageRepository.create(createImageDto);
    return this.imageRepository.save(image);
  }

  async createMany(createImageDtos: CreateImageDto[]): Promise<Image[]> {
    const images = this.imageRepository.create(createImageDtos);
    return this.imageRepository.save(images);
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepository.find({
      relations: ['product'],
    });
  }

  async findByIds(ids: number[]): Promise<Image[]> {
    return this.imageRepository.find({
      where: { id: In(ids) },
    });
  }

  async findByProductId(productId: number): Promise<Image[]> {
    return this.imageRepository.find({
      where: { product: { id: productId } },
    });
  }

  async findOne(id: number): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    return image;
  }

  async update(id: number, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);

    Object.assign(image, updateImageDto);

    return this.imageRepository.save(image);
  }

  async assignToProduct(
    imageIds: number[],
    productId: number,
  ): Promise<Image[]> {
    await this.imageRepository.update(
      { id: In(imageIds) },
      { product: { id: productId } },
    );

    return this.findByIds(imageIds);
  }

  async addToProduct(imageIds: number[], productId: number): Promise<Image[]> {
    await this.imageRepository.update(
      { id: In(imageIds) },
      { product: { id: productId } },
    );

    return this.findByProductId(productId);
  }

  async removeFromProduct(imageIds: number[]): Promise<void> {
    await this.imageRepository
      .createQueryBuilder()
      .update(Image)
      .set({ productId: () => 'NULL' })
      .whereInIds(imageIds)
      .execute();
  }

  async remove(id: number): Promise<void> {
    const image = await this.findOne(id);
    await this.imageRepository.softRemove(image);
  }

  async removeByProductId(productId: number): Promise<void> {
    const images = await this.findByProductId(productId);
    await this.imageRepository.softRemove(images);
  }
}
