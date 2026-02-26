import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { ImageModule } from './image/image.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        url: configService.get<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    CartModule,
    ImageModule,
    CategoryModule,
    ProductModule,
    CouponModule,
    PaymentModule,
  ],
})
export class AppModule {}
