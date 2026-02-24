import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType } from './entities/coupon.entity';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    const coupon = this.couponRepository.create(createCouponDto);
    return this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.find();
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { id } });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${id} not found`);
    }

    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({ where: { code } });

    if (!coupon) {
      throw new NotFoundException(`Coupon with code ${code} not found`);
    }

    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    Object.assign(coupon, updateCouponDto);

    return this.couponRepository.save(coupon);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.findOne(id);
    await this.couponRepository.softRemove(coupon);
  }

  async validate(code: string, orderAmount: number): Promise<Coupon> {
    const coupon = await this.findByCode(code);

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is not active');
    }

    const now = new Date();

    if (coupon.startDate && now < coupon.startDate) {
      throw new BadRequestException('Coupon is not yet valid');
    }

    if (coupon.endDate && now > coupon.endDate) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      throw new BadRequestException(
        `Minimum order amount is ${coupon.minOrderAmount}`,
      );
    }

    return coupon;
  }

  calculateDiscount(coupon: Coupon, orderAmount: number): number {
    let discount = 0;

    if (coupon.type === CouponType.PERCENTAGE) {
      discount = (orderAmount * coupon.value) / 100;
    } else if (coupon.type === CouponType.FIXED) {
      discount = coupon.value;
    }

    if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    if (discount > orderAmount) {
      discount = orderAmount;
    }

    return discount;
  }

  async incrementUsage(id: number): Promise<void> {
    await this.couponRepository.increment({ id }, 'usedCount', 1);
  }
}
