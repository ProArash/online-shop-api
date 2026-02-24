import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['carts', 'carts.items', 'carts.items.product'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['carts', 'carts.items', 'carts.items.product'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { mobile },
      relations: ['carts', 'carts.items', 'carts.items.product'],
    });
  }

  async profile(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['carts', 'carts.items', 'carts.items.product'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async updateProfile(
    id: number,
    updateProfileDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, updateProfileDto);

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
