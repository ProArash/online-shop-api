import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { UserModule } from '@/user/user.module';
import { CartModule } from '@/cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), UserModule, CartModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
