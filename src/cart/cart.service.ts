import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductService } from '@/product/product.service';
import { UserService } from '@/user/user.service';
import { CouponService } from '@/coupon/coupon.service';
import { CartStatus } from '@/lib/cart.status';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly couponService: CouponService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, items, ...cartData } = createCartDto;

    const user = await this.userService.findOne(userId);

    const cart = this.cartRepository.create({
      ...cartData,
      user,
      status: CartStatus.ACTIVE,
    });

    const savedCart = await this.cartRepository.save(cart);

    if (items?.length) {
      for (const item of items) {
        await this.addItem(savedCart.id, item);
      }
    }

    return this.findOne(savedCart.id);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException(`Cart with id ${id} not found`);
    }

    return cart;
  }

  async findByUserId(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findActiveByUserId(userId: number): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { user: { id: userId }, status: CartStatus.ACTIVE },
      relations: ['user', 'items', 'items.product'],
    });
  }

  async getOrCreateActiveCart(userId: number): Promise<Cart> {
    let cart = await this.findActiveByUserId(userId);

    if (!cart) {
      const user = await this.userService.findOne(userId);
      cart = this.cartRepository.create({
        user,
        status: CartStatus.ACTIVE,
      });
      cart = await this.cartRepository.save(cart);
    }

    return this.findOne(cart.id);
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    const { items, ...cartData } = updateCartDto;

    Object.assign(cart, cartData);

    await this.cartRepository.save(cart);

    if (items?.length) {
      await this.cartItemRepository.delete({ cart: { id } });

      for (const item of items) {
        if (item.productId && item.quantity) {
          await this.addItem(id, {
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.softRemove(cart);
  }

  async addItem(cartId: number, addToCartDto: AddToCartDto): Promise<Cart> {
    const cart = await this.findOne(cartId);
    const product = await this.productService.findOne(addToCartDto.productId);

    if (product.stockCount < addToCartDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    let cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cartId },
        product: { id: addToCartDto.productId },
      },
    });

    const price = product.hasDiscount ? product.discountPrice : product.price;

    if (cartItem) {
      cartItem.quantity += addToCartDto.quantity;
      cartItem.totalPrice = cartItem.quantity * price;
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: addToCartDto.quantity,
        price,
        totalPrice: addToCartDto.quantity * price,
      });
    }

    await this.cartItemRepository.save(cartItem);
    await this.calculateTotals(cartId);

    return this.findOne(cartId);
  }

  async removeItem(cartId: number, productId: number): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);
    await this.calculateTotals(cartId);

    return this.findOne(cartId);
  }

  async updateItemQuantity(
    cartId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    if (quantity <= 0) {
      return this.removeItem(cartId, productId);
    }

    const cartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cartId },
        product: { id: productId },
      },
      relations: ['product'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (cartItem.product.stockCount < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = quantity * cartItem.price;

    await this.cartItemRepository.save(cartItem);
    await this.calculateTotals(cartId);

    return this.findOne(cartId);
  }

  async clearCart(cartId: number): Promise<Cart> {
    await this.cartItemRepository.delete({ cart: { id: cartId } });

    const cart = await this.findOne(cartId);
    cart.totalAmount = 0;
    cart.discountAmount = 0;
    cart.finalAmount = 0;
    cart.couponCode = '';

    await this.cartRepository.save(cart);

    return this.findOne(cartId);
  }

  async calculateTotals(cartId: number): Promise<void> {
    const cart = await this.findOne(cartId);

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    cart.totalAmount = totalAmount;

    if (cart.couponCode) {
      try {
        const coupon = await this.couponService.validate(
          cart.couponCode,
          totalAmount,
        );
        cart.discountAmount = this.couponService.calculateDiscount(
          coupon,
          totalAmount,
        );
      } catch {
        cart.couponCode = '';
        cart.discountAmount = 0;
      }
    }

    cart.finalAmount = totalAmount - cart.discountAmount;

    await this.cartRepository.save(cart);
  }

  async applyCoupon(cartId: number, couponCode: string): Promise<Cart> {
    const cart = await this.findOne(cartId);

    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.totalPrice),
      0,
    );

    const coupon = await this.couponService.validate(couponCode, totalAmount);
    const discountAmount = this.couponService.calculateDiscount(
      coupon,
      totalAmount,
    );

    cart.couponCode = couponCode;
    cart.discountAmount = discountAmount;
    cart.finalAmount = totalAmount - discountAmount;

    await this.cartRepository.save(cart);

    return this.findOne(cartId);
  }

  async removeCoupon(cartId: number): Promise<Cart> {
    const cart = await this.findOne(cartId);

    cart.couponCode = '';
    cart.discountAmount = 0;

    await this.cartRepository.save(cart);
    await this.calculateTotals(cartId);

    return this.findOne(cartId);
  }

  async checkout(cartId: number): Promise<Cart> {
    const cart = await this.findOne(cartId);

    if (!cart.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    if (cart.couponCode) {
      await this.couponService.incrementUsage(
        (await this.couponService.findByCode(cart.couponCode)).id,
      );
    }

    for (const item of cart.items) {
      await this.productService.incrementSoldCount(
        item.product.id,
        item.quantity,
      );
    }

    cart.status = CartStatus.COMPLETED;
    await this.cartRepository.save(cart);

    return this.findOne(cartId);
  }
}
