export async function GET(request: Request) {
  // This endpoint handles PayTR success redirects
  // In a real implementation, you would verify the payment and redirect appropriately
  
  const url = new URL(request.url);
  const orderId = url.searchParams.get('merchant_oid');
  
  // Redirect to app with success status
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/(tabs)/?payment=success&order=' + (orderId || ''),
    },
  });
}