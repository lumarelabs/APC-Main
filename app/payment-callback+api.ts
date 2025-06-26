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
  // --- DEBUG 1: Check if the function is being triggered ---
  console.log('--- PAYTR CALLBACK ENDPOINT HIT ---');

  try {
    // --- DEBUG 2: Attempting to parse form data ---
    console.log('Attempting to parse form data...');
    const formData = await request.formData();
    console.log('✅ Form data parsed successfully.');

    // --- DEBUG 3: Log the entire form data to see what we received ---
    console.log('Received Form Data:', JSON.stringify(Object.fromEntries(formData.entries()), null, 2));

    const merchant_oid = formData.get('merchant_oid') as string;
    const status = formData.get('status') as string;
    const total_amount = formData.get('total_amount') as string;
    const hash = formData.get('hash') as string;
    
    // --- DEBUG 4: Check if environment variables are loaded ---
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || '';
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || '';
    console.log(`Is Merchant Key loaded: ${!!merchant_key}`);
    console.log(`Is Merchant Salt loaded: ${!!merchant_salt}`);

    if (!merchant_key || !merchant_salt) {
      console.error('🔴 CRITICAL: PAYTR configuration missing. Stopping.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // --- DEBUG 5: Check the exact string that will be hashed ---
    const hashstr = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    console.log('String to be Hashed:', hashstr);
    
    // --- DEBUG 6: Attempting crypto operations ---
    console.log('Attempting crypto operations...');
    const key = await crypto.subtle.importKey(
      'raw',
      str2ab(merchant_key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, str2ab(hashstr));
    const calculated_hash = ab2b64(signature);
    console.log('✅ Crypto operations completed.');

    // --- DEBUG 7: Compare the received hash with the calculated one ---
    console.log('Received Hash from PayTR:', hash);
    console.log('Calculated Hash by Server:', calculated_hash);

    if (hash !== calculated_hash) {
      console.error('🔴 HASH VERIFICATION FAILED. The request is not authentic.');
      // Still returning OK as required by PayTR
      return new Response('OK', { status: 200 }); 
    }

    console.log('✅ Hash verification successful.');

    // Handle payment result
    if (status === 'success') {
      console.log(`✅ Payment successful for order: ${merchant_oid}`);
      // TODO: Update database
    } else {
      console.log(`⚠️ Payment failed for order: ${merchant_oid}`);
      // TODO: Update database
    }

    console.log('--- Sending final "OK" response to PayTR ---');
    return new Response('OK', { status: 200 });

  } catch (error) {
    // --- DEBUG 8: This block runs if any of the `await` calls in the `try` block fail ---
    console.error('🔴 CATCH BLOCK TRIGGERED: An unexpected error occurred.', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}