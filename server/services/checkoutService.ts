import { db, carts, cartItems, orders, orderItems, products } from "../db";
import { eq } from "drizzle-orm";
import { PaymentService } from "./paymentService";

export class CheckoutService {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  // Process checkout
  async processCheckout(checkoutData: any) {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Get cart items
        const cartItemsList = await tx.select({
          cartItem: cartItems,
          product: products
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.cartId, checkoutData.cartId));
        
        if (cartItemsList.length === 0) {
          throw new Error("Cart is empty");
        }
        
        // Calculate totals
        let subtotal = 0;
        for (const item of cartItemsList) {
          subtotal += item.product.price * item.cartItem.quantity;
        }
        
        const shippingCost = checkoutData.shippingCost || 0;
        const tax = checkoutData.tax || 0;
        const total = subtotal + shippingCost + tax;
        
        // Create the order
        const [order] = await tx.insert(orders).values({
          userId: checkoutData.userId,
          orderNumber: `ORD-${Date.now()}`,
          status: "pending",
          subtotal: subtotal,
          shippingCost: shippingCost,
          tax: tax,
          total: total,
          currency: checkoutData.currency || "USD",
          firstName: checkoutData.firstName,
          lastName: checkoutData.lastName,
          email: checkoutData.email,
          phone: checkoutData.phone,
          billingAddressId: checkoutData.billingAddressId,
          shippingAddressId: checkoutData.shippingAddressId,
          notes: checkoutData.notes,
          paymentMethod: checkoutData.paymentMethod,
          paymentStatus: "pending"
        }).returning();
        
        // Create order items
        for (const item of cartItemsList) {
          await tx.insert(orderItems).values({
            orderId: order.id,
            productId: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            price: item.product.price,
            quantity: item.cartItem.quantity
          });
        }
        
        // Process payment
        const paymentResult = await this.paymentService.processPayment(order.id, checkoutData.paymentData);
        
        // Clear the cart
        await tx.delete(cartItems).where(eq(cartItems.cartId, checkoutData.cartId));
        
        return {
          order,
          payment: paymentResult,
          message: "Checkout processed successfully"
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process checkout: ${error.message}`);
      }
      throw new Error("Failed to process checkout due to an unexpected error.");
    }
  }

  // Get checkout session details
  async getCheckoutSession(id: string) {
    try {
      // In a real implementation, you would retrieve session details from your database
      // For now, we'll return a mock session
      return {
        id,
        status: "active",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get checkout session: ${error.message}`);
      }
      throw new Error("Failed to get checkout session due to an unexpected error.");
    }
  }
}