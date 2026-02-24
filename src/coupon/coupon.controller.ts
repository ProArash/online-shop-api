import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiOperation({ summary: 'Create coupon' })
  @ApiResponse({ status: 201, description: 'Coupon created successfully' })
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all coupons' })
  @ApiResponse({ status: 200, description: 'Return all coupons' })
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get coupon by id' })
  @ApiResponse({ status: 200, description: 'Return coupon' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.findOne(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get coupon by code' })
  @ApiResponse({ status: 200, description: 'Return coupon' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  findByCode(@Param('code') code: string) {
    return this.couponService.findByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon by id' })
  @ApiResponse({ status: 200, description: 'Coupon updated successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon by id' })
  @ApiResponse({ status: 200, description: 'Coupon deleted successfully' })
  @ApiResponse({ status: 404, description: 'Coupon not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.remove(id);
  }
}
