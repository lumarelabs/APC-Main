import { supabase } from '@/app/services/supabase/config';

export interface PaymentData {
  amount: number;
  orderId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  bookingId?: string;
}

export interface PaymentResult {
  success: boolean;
  token?: string;
  iframe_url?: string;
  error?: string;
}

export class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentToken(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const response = await fetch('/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Payment token creation failed:', error);
      return {
        success: false,
        error: error.message || 'Ödeme servisi ile bağlantı kurulamadı'
      };
    }
  }

  async verifyPayment(orderId: string): Promise<boolean> {
    try {
      // In a real implementation, you would verify the payment status
      // with PayTR or check your database for payment confirmation
      
      // For now, we'll check if there's a booking with this order ID
      // and if it's marked as paid
      
      const { data, error } = await supabase
        .from('bookings')
        .select('status')
        .eq('order_id', orderId)
        .single();

      if (error) {
        console.error('Error verifying payment:', error);
        return false;
      }

      return data?.status === 'confirmed';
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async updateBookingPaymentStatus(bookingId: string, status: 'paid' | 'failed', orderId: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: status,
          order_id: orderId,
          status: status === 'paid' ? 'confirmed' : 'canceled'
        })
        .eq('id', bookingId);

      if (error) {
        throw error;
      }

      console.log(`Booking ${bookingId} payment status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking payment status:', error);
      throw error;
    }
  }

  generateOrderId(prefix: string = 'booking'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const paymentService = PaymentService.getInstance();