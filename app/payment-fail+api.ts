export async function GET(request: Request) {
  // This endpoint handles PayTR failure redirects
  // In a real implementation, you would log the failure and redirect appropriately
  
  const url = new URL(request.url);
  const orderId = url.searchParams.get('merchant_oid');
  const reason = url.searchParams.get('failed_reason_msg');
  
  // Redirect to app with failure status
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/(tabs)/?payment=failed&order=' + (orderId || '') + '&reason=' + (reason || ''),
    },
  });
}