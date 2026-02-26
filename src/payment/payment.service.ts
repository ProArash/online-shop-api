import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentPaginationDto } from './dto/payment-pagination.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { CartService } from '@/cart/cart.service';
import { CartStatus } from '@/lib/cart.status';
import { Payment, PaymentStatus } from './entities/payment.entity';

interface ZibalRequestResponse {
  result: number;
  message?: string;
  trackId?: number;
}

interface ZibalVerifyResponse {
  result: number;
  message?: string;
  status?: number;
  amount?: number;
  orderId?: string;
  refNumber?: string;
  cardNumber?: string;
  paidAt?: string;
}

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) {}

  async createPaymentUrl(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<Payment> {
    const cart = await this.cartService.findOne(createPaymentDto.cartId);

    if (cart.user.id !== userId) {
      throw new ForbiddenException(
        'You can only create payment for your own cart',
      );
    }

    const payableAmount = Number(cart.finalAmount || cart.totalAmount);
    if (!payableAmount || payableAmount < 1000) {
      throw new BadRequestException(
        'Payment amount should be at least 1000 rials',
      );
    }

    const callbackUrl =
      createPaymentDto.callbackUrl ||
      this.configService.get<string>('ZIBAL_CALLBACK_URL');

    if (!callbackUrl) {
      throw new BadRequestException('Callback URL is required');
    }

    const payment = this.paymentRepository.create({
      orderId: this.createOrderId(userId),
      gateway: 'zibal',
      amount: payableAmount,
      callbackUrl,
      description: createPaymentDto.description,
      mobile: createPaymentDto.mobile || cart.user.mobile,
      status: PaymentStatus.PENDING,
      user: cart.user,
      cart,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    const zibalMerchant =
      this.configService.get<string>('ZIBAL_MERCHANT') || 'zibal';

    const requestResult = await this.zibalRequest({
      merchant: zibalMerchant,
      callbackUrl,
      amount: Math.round(payableAmount),
      orderId: savedPayment.orderId,
      mobile: savedPayment.mobile,
      description: savedPayment.description,
    });

    savedPayment.gatewayResult = requestResult.result;

    if (requestResult.result !== 100 || !requestResult.trackId) {
      savedPayment.status = PaymentStatus.FAILED;
      savedPayment.failureReason =
        requestResult.message || 'Zibal request failed';
      await this.paymentRepository.save(savedPayment);
      throw new BadRequestException(savedPayment.failureReason);
    }

    savedPayment.trackId = String(requestResult.trackId);
    savedPayment.paymentUrl = this.getPaymentUrl(savedPayment.trackId);
    savedPayment.status = PaymentStatus.PENDING;

    return this.paymentRepository.save(savedPayment);
  }

  async handleCallback(callbackDto: PaymentCallbackDto): Promise<Payment> {
    const payment = await this.findByCallback(callbackDto);

    if (payment.status === PaymentStatus.SUCCESS) {
      return payment;
    }

    const callbackStatus = this.toNumber(callbackDto.status);
    if (callbackStatus !== null) {
      payment.gatewayStatus = callbackStatus;
    }

    const isSuccessfulCallback =
      callbackDto.success === '1' && callbackDto.status === '2';

    if (!isSuccessfulCallback) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Payment failed or cancelled by user';
      return this.paymentRepository.save(payment);
    }

    const zibalMerchant =
      this.configService.get<string>('ZIBAL_MERCHANT') || 'zibal';

    const verifyResult = await this.zibalVerify({
      merchant: zibalMerchant,
      trackId: Number(payment.trackId),
    });

    payment.gatewayResult = verifyResult.result;
    payment.gatewayStatus = verifyResult.status ?? payment.gatewayStatus;

    if (verifyResult.result !== 100) {
      payment.status = PaymentStatus.FAILED;
      payment.failureReason = verifyResult.message || 'Payment verify failed';
      return this.paymentRepository.save(payment);
    }

    payment.status = PaymentStatus.SUCCESS;
    payment.verifiedAt = new Date();
    payment.paidAt = verifyResult.paidAt
      ? new Date(verifyResult.paidAt)
      : new Date();
    payment.cardNumber = verifyResult.cardNumber || payment.cardNumber;
    payment.refNumber = verifyResult.refNumber || payment.refNumber;
    payment.failureReason = '';

    const savedPayment = await this.paymentRepository.save(payment);

    if (savedPayment.cart?.status === CartStatus.ACTIVE) {
      await this.cartService.checkout(savedPayment.cart.id);
    }

    return this.findOne(savedPayment.id);
  }

  async findAll(paginationDto: PaymentPaginationDto) {
    const { skip, limit } = this.resolvePagination(paginationDto);

    const [items, total] = await this.paymentRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user', 'cart'],
      order: { id: 'DESC' },
    });

    return { items, total, skip, limit };
  }

  async findMine(userId: number, paginationDto: PaymentPaginationDto) {
    const { skip, limit } = this.resolvePagination(paginationDto);

    const [items, total] = await this.paymentRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take: limit,
      relations: ['user', 'cart'],
      order: { id: 'DESC' },
    });

    return { items, total, skip, limit };
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['user', 'cart'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }

    return payment;
  }

  async findMyOne(id: number, userId: number): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.user.id !== userId) {
      throw new ForbiddenException('You can only retrieve your own payments');
    }

    return payment;
  }

  private resolvePagination(paginationDto: PaymentPaginationDto) {
    const skip = Number(paginationDto.skip ?? 0);
    const limit = Math.min(Number(paginationDto.limit ?? 20), 20);

    return { skip, limit };
  }

  private createOrderId(userId: number): string {
    return `ORD-${userId}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  private getPaymentUrl(trackId: string): string {
    return `https://gateway.zibal.ir/start/${trackId}`;
  }

  private toNumber(value?: string): number | null {
    if (value === undefined) {
      return null;
    }

    const number = Number(value);
    return Number.isNaN(number) ? null : number;
  }

  private async findByCallback(
    callbackDto: PaymentCallbackDto,
  ): Promise<Payment> {
    if (!callbackDto.trackId && !callbackDto.orderId) {
      throw new BadRequestException('trackId or orderId is required');
    }

    const payment = await this.paymentRepository.findOne({
      where: callbackDto.trackId
        ? { trackId: callbackDto.trackId }
        : { orderId: callbackDto.orderId },
      relations: ['user', 'cart'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found for callback data');
    }

    return payment;
  }

  private async zibalRequest(payload: {
    merchant: string;
    callbackUrl: string;
    amount: number;
    orderId: string;
    mobile?: string;
    description?: string;
  }): Promise<ZibalRequestResponse> {
    const response = await fetch('https://gateway.zibal.ir/v1/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to call Zibal request API');
    }

    return (await response.json()) as ZibalRequestResponse;
  }

  private async zibalVerify(payload: {
    merchant: string;
    trackId: number;
  }): Promise<ZibalVerifyResponse> {
    const response = await fetch('https://gateway.zibal.ir/v1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new BadRequestException('Failed to call Zibal verify API');
    }

    return (await response.json()) as ZibalVerifyResponse;
  }
}
