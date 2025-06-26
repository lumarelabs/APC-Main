import { NextRequest, NextResponse } from 'next/server';

// Helper function to convert string to ArrayBuffer
function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Helper function to convert ArrayBuffer to Base64
function ab2b64(ab: ArrayBuffer) {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(ab))));
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // PayTR callback parameters
    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    
    // You can get the other fields if you need them
    // const failed_reason_code = formData.get('failed_reason_code') as string;
    // const failed_reason_msg = formData.get('failed_reason_msg') as string;

    // PayTR configuration
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';

    if (!merchant_key || !merchant_salt) {
      console.error('PAYTR configuration missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify hash using Web Crypto API
    const hashstr = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    
    // 1. Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      str2ab(merchant_key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // 2. Sign the data
    const signature = await crypto.subtle.sign('HMAC', key, str2ab(hashstr));

    // 3. Convert signature to Base64
    const calculated_hash = ab2b64(signature);

    if (hash !== calculated_hash) {
      console.error('PayTR hash verification failed.');
      console.log('Received hash:', hash);
      console.log('Calculated hash:', calculated_hash);
      // It's important to still return a 200 OK with "OK" for PayTR,
      // but log the error internally for your own debugging.
      // PayTR will keep sending notifications if it doesn't get an "OK" response.
      // However, during testing, you might want to return an error to see it fail.
      return Response.json({ status: 'ok' }); 
    }

    // Handle payment result
    if (status === 'success') {
      console.log(`Payment successful for order: ${merchant_oid}`);
      // TODO: Update your database here.
      // Make sure this logic is idempotent (running it multiple times won't cause issues).
    } else {
      console.log(`Payment failed for order: ${merchant_oid}`);
      // TODO: Update your database to reflect the failed payment.
    }

    // IMPORTANT: PayTR requires you to return the text "OK" for the request to be considered successful.
    // Do not return JSON here.
    return Response.json({ status: 'ok' });

  } catch (error) {
    console.error('Error in PayTR callback:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    // Return a JSON error for your own debugging, but know that PayTR will likely ignore it.
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}