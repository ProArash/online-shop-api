import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from '@/modules/cart/cart.controller';
import { CartService } from '@/modules/cart/cart.service';
import { CartItem } from '@/modules/cart/entities/cart-item.entity';
import { Cart } from '@/modules/cart/entities/cart.entity';
import { CouponModule } from '@/modules/coupon/coupon.module';
import { ProductModule } from '@/modules/product/product.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    ProductModule,
    UserModule,
    CouponModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
