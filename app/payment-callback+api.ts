export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // PayTR callback parameters
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    const failed_reason_code = formData.get('failed_reason_code') as string;
    const failed_reason_msg = formData.get('failed_reason_msg') as string;
    const test_mode = formData.get('test_mode') as string;
    const payment_type = formData.get('payment_type') as string;
    const currency = formData.get('currency') as string;
    const payment_amount = formData.get('payment_amount') as string;

    // PayTR configuration
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';

    if (!merchant_key || !merchant_salt) {
      return new Response('PAYTR configuration missing', { status: 500 });
    }

    // Verify hash
    const hashstr = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const crypto = require('crypto');
    const calculated_hash = crypto.createHmac('sha256', merchant_key).update(hashstr).digest('base64');

    if (hash !== calculated_hash) {
      console.error('PayTR hash verification failed');
      return new Response('Hash verification failed', { status: 400 });
    }

    // Handle payment result
    if (status === 'success') {
      // Payment successful - update booking status in database
      console.log(`Payment successful for order: ${merchant_oid}`);
      
      // Here you would typically update your database
      // For example, mark the booking as paid
      
      return new Response('OK', { status: 200 });
    } else {
      // Payment failed
      console.log(`Payment failed for order: ${merchant_oid}, reason: ${failed_reason_msg}`);
      
      // Handle failed payment - maybe update booking status to failed
      
      return new Response('OK', { status: 200 });
    }

  } catch (error: any) {
    console.error('PayTR callback error:', error);
    return new Response('Error processing callback', { status: 500 });
  }
}