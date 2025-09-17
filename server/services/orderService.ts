import { db, orders, orderItems } from "../db";
import { eq } from "drizzle-orm";

export class OrderService {
  // Create a new order
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
          shippingCost: orderData.shippingCost || 0,
          tax: orderData.tax || 0,
          total: orderData.total,
          currency: orderData.currency || "USD",
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          billingAddressId: orderData.billingAddressId,
          shippingAddressId: orderData.shippingAddressId,
          notes: orderData.notes,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: "pending"
        }).returning();
        
        // Create order items
        if (orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            await tx.insert(orderItems).values({
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              sku: item.sku,
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
}