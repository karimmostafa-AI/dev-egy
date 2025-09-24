import { db, orders, orderItems, products, addresses } from "../db";
import { eq } from "drizzle-orm";
import { CartService } from "./cartService";

export class OrderService {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }
  // Create a new order from cart with atomic transactions
  async createOrderFromCart(orderData: any) {
    try {
      // Start a transaction for atomic order creation
      return await db.transaction(async (tx) => {
        // First, reserve inventory
        await this.cartService.reserveInventory(orderData.cartId);

        // Calculate final totals from cart
        const checkoutTotals = await this.cartService.calculateCheckoutTotals(orderData.cartId, orderData.shippingAddress);

        if (checkoutTotals.items.length === 0) {
          throw new Error("Cart is empty");
        }

        // Create shipping address if provided
        let shippingAddressId = orderData.shippingAddressId;
        if (orderData.shippingAddress && !shippingAddressId) {
          const [shippingAddr] = await tx.insert(addresses).values({
            userId: orderData.userId,
            firstName: orderData.shippingAddress.firstName || orderData.shippingAddress.fullName?.split(' ')[0] || "",
            lastName: orderData.shippingAddress.lastName || orderData.shippingAddress.fullName?.split(' ').slice(1).join(' ') || "",
            address1: orderData.shippingAddress.address1,
            address2: orderData.shippingAddress.address2 || "",
            city: orderData.shippingAddress.city,
            province: orderData.shippingAddress.state || orderData.shippingAddress.province,
            country: orderData.shippingAddress.country,
            zip: orderData.shippingAddress.zip,
            phone: orderData.shippingAddress.phone,
            isDefault: orderData.shippingAddress.isDefault || false
          }).returning();
          shippingAddressId = shippingAddr.id;
        }

        // Create the order
        const [order] = await tx.insert(orders).values({
          userId: orderData.userId,
          orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          status: "pending",
          subtotal: checkoutTotals.subtotal.toString(),
          shippingCost: checkoutTotals.shippingCost.toString(),
          tax: checkoutTotals.tax.toString(),
          total: checkoutTotals.total.toString(),
          currency: "USD",
          firstName: orderData.shippingAddress?.firstName || orderData.shippingAddress?.fullName?.split(' ')[0] || "",
          lastName: orderData.shippingAddress?.lastName || orderData.shippingAddress?.fullName?.split(' ').slice(1).join(' ') || "",
          email: orderData.email || "",
          phone: orderData.shippingAddress?.phone || "",
          billingAddressId: orderData.billingAddressId || shippingAddressId,
          shippingAddressId: shippingAddressId,
          notes: orderData.notes || "",
          paymentMethod: "Credit Card",
          paymentStatus: "pending"
        }).returning();
        
        // Create order items from cart
        for (const item of checkoutTotals.items) {
          await tx.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            name: item.name,
            sku: item.sku,
            price: item.price.toString(),
            quantity: item.quantity
          });
        }
        
        return {
          order,
          checkoutTotals
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
      throw new Error("Failed to create order due to an unexpected error.");
    }
  }

  // Create a new order (legacy method for compatibility)
  async createOrder(orderData: any) {
    try {
      // Start a transaction
      return await db.transaction(async (tx) => {
        // Create the order
        const [order] = await tx.insert(orders).values({
          userId: orderData.userId,
          orderNumber: `ORD-${Date.now()}`,
          status: "pending",
          subtotal: orderData.subtotal,
          shippingCost: orderData.shipping,
          tax: orderData.taxes,
          total: orderData.total,
          currency: "USD",
          firstName: orderData.shippingAddress?.firstName || "",
          lastName: orderData.shippingAddress?.lastName || "",
          email: orderData.email || "",
          phone: orderData.shippingAddress?.phone || "",
          // For now, we'll use the same address for both billing and shipping
          // In a real app, you'd want separate addresses
          billingAddressId: null,
          shippingAddressId: null,
          notes: orderData.notes || "",
          paymentMethod: "Credit Card",
          paymentStatus: "pending"
        }).returning();
        
        // Create order items
        if (orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            // Get product details to store with the order item
            const productResult = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1);
            const product = productResult[0];
            
            await tx.insert(orderItems).values({
              orderId: order.id,
              productId: item.productId,
              name: product?.name || "Unknown Product",
              sku: product?.sku || "",
              price: item.price,
              quantity: item.quantity
            });
          }
        }
        
        return order;
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
      throw new Error("Failed to create order due to an unexpected error.");
    }
  }

  // Get order by ID
  async getOrderById(id: string) {
    try {
      const order = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
      return order[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get order by ID: ${error.message}`);
      }
      throw new Error("Failed to get order by ID due to an unexpected error.");
    }
  }

  // Get order status
  async getOrderStatus(id: string) {
    try {
      const order = await db.select({
        id: orders.id,
        status: orders.status,
        paymentStatus: orders.paymentStatus
      }).from(orders).where(eq(orders.id, id)).limit(1);
      
      return order[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get order status: ${error.message}`);
      }
      throw new Error("Failed to get order status due to an unexpected error.");
    }
  }

  // Complete order after successful payment
  async completeOrder(orderId: string, cartId?: string): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        // Update order status
        await tx.update(orders)
          .set({ 
            status: "confirmed",
            paymentStatus: "paid",
            updatedAt: new Date()
          })
          .where(eq(orders.id, orderId));

        // Update inventory if cart ID is provided
        if (cartId) {
          await this.cartService.updateInventoryAfterOrder(cartId);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to complete order: ${error.message}`);
      }
      throw new Error("Failed to complete order due to an unexpected error.");
    }
  }

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    try {
      await db.update(orders)
        .set({ 
          status: "cancelled",
          paymentStatus: "failed",
          cancelledAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(orders.id, orderId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to cancel order: ${error.message}`);
      }
      throw new Error("Failed to cancel order due to an unexpected error.");
    }
  }
}