import Stripe from 'stripe';
import { db, orders, payments } from '../db';
import { eq } from 'drizzle-orm';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

export class PaymentService {
  private stripe: Stripe | null;

  constructor() {
    // Only initialize Stripe if we have a secret key
    if (STRIPE_SECRET_KEY && STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
      this.stripe = new Stripe(STRIPE_SECRET_KEY, {
        apiVersion: '2025-08-27.basil',
      });
    } else {
      this.stripe = null;
      console.warn('Stripe secret key not provided. Payment functionality will be disabled.');
    }
  }

  // Get order by ID
  async getOrderById(orderId: string) {
    try {
      const orderResults = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      
      if (orderResults.length === 0) {
        throw new Error('Order not found');
      }
      
      return orderResults[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get order: ${error.message}`);
      }
      throw new Error('Failed to get order due to an unexpected error.');
    }
  }

  // Process payment using Stripe
  async processPayment(orderId: string, paymentData: any) {
    // If Stripe is not configured, return a mock response
    if (!this.stripe) {
      console.warn('Stripe not configured. Returning mock payment response.');
      return {
        clientSecret: 'mock_client_secret',
        paymentId: 'mock_payment_id'
      };
    }

    try {
      // Get the order from the database
      const orderResults = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      
      if (orderResults.length === 0) {
        throw new Error('Order not found');
      }
      
      const order = orderResults[0];
      
      // Create a Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(parseFloat(order.total) * 100), // Convert to cents
        currency: order.currency || 'usd',
        payment_method_types: ['card'],
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber
        }
      });
      
      // Store payment information in database
      const [payment] = await db.insert(payments).values({
        orderId: order.id,
        paymentIntentId: paymentIntent.id,
        amount: parseFloat(order.total).toString(),
        currency: order.currency || 'usd',
        status: 'pending',
        method: paymentData.method || 'card',
        gateway: 'stripe',
        createdAt: new Date()
      }).returning();
      
      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process payment: ${error.message}`);
      }
      throw new Error('Failed to process payment due to an unexpected error.');
    }
  }

  // Confirm payment status after Stripe webhook notification
  async confirmPayment(paymentIntentId: string, status: string) {
    try {
      // Update payment status in database
      const [payment] = await db.update(payments)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(payments.paymentIntentId, paymentIntentId))
        .returning();
      
      if (!payment) {
        throw new Error('Payment record not found');
      }
      
      // Update order status if payment succeeded
      if (status === 'succeeded') {
        await db.update(orders)
          .set({ 
            status: 'confirmed',
            paymentStatus: 'paid',
            updatedAt: new Date()
          })
          .where(eq(orders.id, payment.orderId));
      } else if (status === 'failed') {
        await db.update(orders)
          .set({ 
            status: 'cancelled',
            paymentStatus: 'failed',
            updatedAt: new Date()
          })
          .where(eq(orders.id, payment.orderId));
      }
      
      return payment;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to confirm payment: ${error.message}`);
      }
      throw new Error('Failed to confirm payment due to an unexpected error.');
    }
  }

  // Get payment details by ID
  async getPayment(paymentId: string) {
    try {
      const paymentResults = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
      
      if (paymentResults.length === 0) {
        throw new Error('Payment not found');
      }
      
      return paymentResults[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get payment: ${error.message}`);
      }
      throw new Error('Failed to get payment due to an unexpected error.');
    }
  }

  // Refund a payment (in a real implementation, you would integrate with Stripe's refund API)
  async refundPayment(paymentId: string, reason?: string) {
    // If Stripe is not configured, return a mock response
    if (!this.stripe) {
      console.warn('Stripe not configured. Returning mock refund response.');
      return {
        payment: { id: paymentId },
        refundId: 'mock_refund_id'
      };
    }

    try {
      // Get payment details
      const payment = await this.getPayment(paymentId);
      
      // Create a refund (mock implementation)
      // In a real implementation, you would call Stripe's refund API
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.paymentIntentId,
        reason: reason as Stripe.RefundCreateParams.Reason || 'requested_by_customer'
      });
      
      // Update payment status in database
      const [updatedPayment] = await db.update(payments)
        .set({ 
          status: 'refunded',
          updatedAt: new Date()
        })
        .where(eq(payments.id, paymentId))
        .returning();
      
      // Update order status
      await db.update(orders)
        .set({ 
          status: 'refunded',
          paymentStatus: 'refunded',
          updatedAt: new Date()
        })
        .where(eq(orders.id, payment.orderId));
      
      return {
        payment: updatedPayment,
        refundId: refund.id
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to refund payment: ${error.message}`);
      }
      throw new Error('Failed to refund payment due to an unexpected error.');
    }
  }
}