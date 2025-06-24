export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, orderId, userEmail, userName, userPhone } = body;

    console.log('Payment API called with:', { amount, orderId, userEmail, userName });

    // PayTR configuration - CRITICAL: These must be set in your .env file
    const merchant_id = process.env.PAYTR_MERCHANT_ID;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

    // FIXED: Better error handling for missing credentials
    if (!merchant_id || !merchant_key || !merchant_salt) {
      console.error('PayTR credentials missing:', {
        merchant_id: !!merchant_id,
        merchant_key: !!merchant_key,
        merchant_salt: !!merchant_salt
      });
      
      return Response.json({ 
        success: false,
        error: 'PayTR yapılandırması eksik. Lütfen sistem yöneticisi ile iletişime geçin.' 
      }, { status: 500 });
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
    
    // FIXED: Use proper URLs for success/fail redirects
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8081';
    const merchant_ok_url = `${baseUrl}/payment-success`;
    const merchant_fail_url = `${baseUrl}/payment-fail`;
    
    const user_basket = JSON.stringify([
      ['Kort Rezervasyonu', `${amount} TL`, 1]
    ]);
    const user_ip = '127.0.0.1'; // In production, get real IP
    const timeout_limit = '30';
    const debug_on = '1';
    const lang = 'tr';

    // Create hash string for PayTR
    const hashstr = `${merchant_id}${user_ip}${merchant_oid}${userEmail}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;
    
    // FIXED: Use Web Crypto API for hash generation (works in both Node.js and browser)
    const encoder = new TextEncoder();
    const data = encoder.encode(hashstr);
    const keyData = encoder.encode(merchant_key);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const paytr_token = btoa(String.fromCharCode(...new Uint8Array(signature)));

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

    console.log('PayTR request data:', { ...postData, paytr_token: 'HIDDEN' });

    // Make request to PayTR
    const paytrResponse = await fetch('https://www.paytr.com/odeme/api/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(postData).toString()
    });

    const paytrResult = await paytrResponse.text();
    console.log('PayTR response:', paytrResult);
    
    let result;
    try {
      result = JSON.parse(paytrResult);
    } catch (parseError) {
      console.error('PayTR response parse error:', parseError);
      return Response.json({
        success: false,
        error: 'PayTR servisi geçici olarak kullanılamıyor'
      }, { status: 500 });
    }

    if (result.status === 'success') {
      return Response.json({
        success: true,
        token: result.token,
        iframe_url: `https://www.paytr.com/odeme/guvenli/${result.token}`
      });
    } else {
      console.error('PayTR error:', result);
      return Response.json({
        success: false,
        error: result.reason || 'Ödeme token oluşturulamadı'
      });
    }

  } catch (error: any) {
    console.error('PayTR API Error:', error);
    return Response.json({ 
      success: false,
      error: 'Ödeme işlemi başlatılamadı',
      details: error.message 
    }, { status: 500 });
  }
}