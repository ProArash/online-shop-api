import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { ImageModule } from './image/image.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CouponModule } from './coupon/coupon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'arash',
      password: 'password',
      database: 'sataneye',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CartModule,
    ImageModule,
    CategoryModule,
    ProductModule,
    CouponModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
