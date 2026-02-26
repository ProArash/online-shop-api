import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentPaginationDto } from './dto/payment-pagination.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { CurrentUser } from '@/lib/user.payload';
import { RolesGuard } from '@/auth/roles.guard';
import { Roles } from '@/auth/roles.decorator';
import { UserRole } from '@/lib/user.role';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-url')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create payment URL for current user' })
  @ApiResponse({ status: 201, description: 'Payment URL created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createPaymentUrl(
    @CurrentUser('sub') userId: number,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPaymentUrl(userId, createPaymentDto);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Zibal payment callback endpoint' })
  @ApiResponse({ status: 200, description: 'Payment callback handled' })
  handleCallback(@Query() callbackDto: PaymentCallbackDto) {
    return this.paymentService.handleCallback(callbackDto);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get my payments with pagination' })
  @ApiResponse({ status: 200, description: 'Return current user payments' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findMine(
    @CurrentUser('sub') userId: number,
    @Query() paginationDto: PaymentPaginationDto,
  ) {
    return this.paymentService.findMine(userId, paginationDto);
  }

  @Get('my/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get my payment by id' })
  @ApiResponse({ status: 200, description: 'Return payment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findMyOne(
    @CurrentUser('sub') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.paymentService.findMyOne(id, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all payments with pagination (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all payments' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll(@Query() paginationDto: PaymentPaginationDto) {
    return this.paymentService.findAll(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get payment by id (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return payment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.findOne(id);
  }
}
