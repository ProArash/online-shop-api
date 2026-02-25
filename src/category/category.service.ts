// category.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with id ${createCategoryDto.parentId} not found`,
        );
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['products', 'parent', 'children'],
    });
  }

  async findAllTree(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({
      relations: ['children', 'products'],
      where: { parentId: IsNull() },
    });

    for (const category of categories) {
      await this.loadChildrenRecursively(category);
    }

    return categories;
  }

  private async loadChildrenRecursively(category: Category): Promise<void> {
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.loadChildrenRecursively(child);
      }
    } else {
      category.children = await this.categoryRepository.find({
        where: { parentId: category.id },
        relations: ['children', 'products'],
      });
      for (const child of category.children) {
        await this.loadChildrenRecursively(child);
      }
    }
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products', 'parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async findWithAllChildren(id: number): Promise<Category> {
    const category = await this.findOne(id);
    await this.loadChildrenRecursively(category);
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      const parent = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent category with id ${updateCategoryDto.parentId} not found`,
        );
      }

      const isDescendant = await this.isDescendant(
        id,
        updateCategoryDto.parentId,
      );
      if (isDescendant) {
        throw new BadRequestException(
          'Cannot set a descendant category as parent',
        );
      }
    }

    Object.assign(category, updateCategoryDto);

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.softRemove(category);
  }

  private async isDescendant(
    ancestorId: number,
    descendantId: number,
  ): Promise<boolean> {
    const descendant = await this.categoryRepository.findOne({
      where: { id: descendantId },
      relations: ['children'],
    });

    if (!descendant) {
      return false;
    }

    await this.loadChildrenRecursively(descendant);

    return this.checkDescendant(descendant, ancestorId);
  }

  private checkDescendant(category: Category, targetId: number): boolean {
    if (!category.children || category.children.length === 0) {
      return false;
    }

    for (const child of category.children) {
      if (child.id === targetId) {
        return true;
      }
      if (this.checkDescendant(child, targetId)) {
        return true;
      }
    }

    return false;
  }
}
