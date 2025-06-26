import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) { // Changed to NextRequest
  try {
    const body = await request.json();
    const { amount, orderId, userEmail, userName, userPhone } = body;

    console.log('Payment API called with:', { amount, orderId, userEmail, userName });

    // PayTR configuration
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('PayTR credentials missing:', {
        merchant_id: !!merchant_id,
        merchant_key: !!merchant_key,
        merchant_salt: !!merchant_salt
      });
      return NextResponse.json({ 
        success: false,
        error: 'PayTR configuration is missing. Please contact the system administrator.' 
      }, { status: 500 });
    }

    // PayTR payment parameters
    const payment_amount = Math.round(amount * 100);
    const currency = 'TL';
    const test_mode = '1';
    const no_installment = '0';
    const max_installment = '0';
    const merchant_oid = orderId;
    const user_name = userName;
    const user_address = 'Alaçatı Padel Club';
    const user_phone = userPhone;
    
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';
    const merchant_ok_url = `${baseUrl}/payment-success`;
    const merchant_fail_url = `${baseUrl}/payment-fail`;
    
    const user_basket = JSON.stringify([['Kort Rezervasyonu', `${amount} TL`, 1]]);
    
    // --- FIXED: Get the real user IP from the request ---
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const user_ip = ip.split(',')[0].trim();
    
    const timeout_limit = '30';
    const debug_on = '1';
    const lang = 'tr';

    const hashstr = `${merchant_id}${user_ip}${merchant_oid}${userEmail}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashstr);
    const keyData = encoder.encode(merchant_key);
    
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const paytr_token = btoa(String.fromCharCode(...new Uint8Array(signature)));

    const postData = {
      merchant_id, user_ip, merchant_oid, email: userEmail, payment_amount,
      paytr_token, user_basket, debug_on, no_installment, max_installment,
      user_name, user_address, user_phone, merchant_ok_url, merchant_fail_url,
      timeout_limit, currency, test_mode, lang
    };

    console.log('Sending data to PayTR:', { ...postData, paytr_token: 'HIDDEN' });

    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(postData as any).toString()
    });

    const paytrResultText = await paytrResponse.text();
    console.log('Raw response from PayTR:', paytrResultText);
    
    let result;
    try {
      result = JSON.parse(paytrResultText);
    } catch (parseError) {
      console.error('PayTR response could not be parsed as JSON.', parseError);
      return NextResponse.json({
        success: false,
        error: 'PayTR service returned an invalid response.'
      }, { status: 500 });
    }

    if (result.status === 'success') {
      return NextResponse.json({
        success: true,
        iframe_url: `https://www.paytr.com/odeme/guvenli/${result.token}`
      });
    } else {
      console.error('PayTR returned an error:', result);
      return NextResponse.json({
        success: false,
        error: result.reason || 'Could not create payment token.'
      });
    }

  } catch (error: any) {
    console.error('General error in PayTR API function:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Could not initialize payment.',
      details: error.message 
    }, { status: 500 });
  }
}