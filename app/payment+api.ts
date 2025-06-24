export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, userEmail, userName, userPhone } = body;

    // PayTR configuration
    const merchant_id = process.env.PAYTR_MERCHANT_ID || ''; // Your PayTR merchant ID
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || ''; // Your PayTR merchant key
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || ''; // Your PayTR merchant salt

    if (!merchant_id || !merchant_key || !merchant_salt) {
      return new Response(JSON.stringify({ 
        error: 'PayTR configuration missing' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // PayTR payment parameters
    const payment_amount = Math.round(amount * 100); // Convert to kuruş
    const currency = 'TL';
    const test_mode = '1'; // Set to '0' for production
    const no_installment = '0'; // Allow installments
    const max_installment = '0'; // No limit on installments
    const merchant_oid = orderId;
    const user_name = userName;
    const user_address = 'Alaçatı Padel Club';
    const user_phone = userPhone;
    const merchant_ok_url = `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081'}/payment-success`;
    const merchant_fail_url = `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081'}/payment-fail`;
    const user_basket = JSON.stringify([
      ['Kort Rezervasyonu', `${amount} TL`, 1]
    ]);
    const user_ip = '127.0.0.1'; // In production, get real IP
    const timeout_limit = '30';
    const debug_on = '1';
    const lang = 'tr';

    // Create hash string for PayTR
    const hashstr = `${merchant_id}${user_ip}${merchant_oid}${userEmail}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;
    
    // Generate hash using crypto
    const crypto = require('crypto');
    const paytr_token = crypto.createHmac('sha256', merchant_key).update(hashstr).digest('base64');

    // PayTR API request data
    const postData = {
      merchant_id,
      user_ip,
      merchant_oid,
      email: userEmail,
      payment_amount,
      paytr_token,
      user_basket,
      debug_on,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit,
      currency,
      test_mode,
      lang
    };

    // Make request to PayTR
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData).toString()
    });

    const paytrResult = await paytrResponse.text();
    const result = JSON.parse(paytrResult);

    if (result.status === 'success') {
      return Response.json({
        success: true,
        token: result.token,
        iframe_url: `https://www.paytr.com/odeme/guvenli/${result.token}`
      });
    } else {
      return Response.json({
        success: false,
        error: result.reason || 'Payment token generation failed'
      });
    }

  } catch (error: any) {
    console.error('PayTR API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Payment processing failed',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}