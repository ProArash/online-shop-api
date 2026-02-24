import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { CurrentUser } from '@/lib/user.payload';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Create cart' })
  @ApiResponse({ status: 201, description: 'Cart created successfully' })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'Return all carts' })
  findAll() {
    return this.cartService.findAll();
  }

  @Get('my-cart')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user active cart' })
  @ApiResponse({ status: 200, description: 'Return active cart' })
  getMyCart(@CurrentUser('sub') userId: number) {
    return this.cartService.getOrCreateActiveCart(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get carts by user id' })
  @ApiResponse({ status: 200, description: 'Return carts' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cart by id' })
  @ApiResponse({ status: 200, description: 'Return cart' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart by id' })
  @ApiResponse({ status: 200, description: 'Cart updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete cart by id' })
  @ApiResponse({ status: 200, description: 'Cart deleted successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.remove(id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addItem(id, addToCartDto);
  }

  @Post('my-cart/items')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Add item to my cart' })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  async addItemToMyCart(
    @CurrentUser('sub') userId: number,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.addItem(cart.id, addToCartDto);
  }

  @Delete(':id/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  removeItem(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(id, productId);
  }

  @Patch(':id/items/:productId/quantity/:quantity')
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiResponse({ status: 200, description: 'Quantity updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  updateItemQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Param('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.cartService.updateItemQuantity(id, productId, quantity);
  }

  @Delete(':id/clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  clearCart(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.clearCart(id);
  }

  @Post(':id/coupon/:couponCode')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  applyCoupon(
    @Param('id', ParseIntPipe) id: number,
    @Param('couponCode') couponCode: string,
  ) {
    return this.cartService.applyCoupon(id, couponCode);
  }

  @Delete(':id/coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  @ApiResponse({ status: 200, description: 'Coupon removed successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  removeCoupon(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeCoupon(id);
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Checkout cart' })
  @ApiResponse({ status: 200, description: 'Checkout successful' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  checkout(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.checkout(id);
  }

  @Post('my-cart/checkout')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Checkout my cart' })
  @ApiResponse({ status: 200, description: 'Checkout successful' })
  @ApiResponse({ status: 400, description: 'Cart is empty' })
  async checkoutMyCart(@CurrentUser('sub') userId: number) {
    const cart = await this.cartService.getOrCreateActiveCart(userId);
    return this.cartService.checkout(cart.id);
  }
}
