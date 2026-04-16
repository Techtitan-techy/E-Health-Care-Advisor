// Standard Vercel Edge Middleware (Web API compatible)
const GATEWAY_ANALYZE_URL = "https://api-gateway-385749714263.asia-south1.run.app/analyze";

export default async function middleware(request) {
  try {
    const url = new URL(request.url);
    // Vercel provides the client IP in the headers or request object
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // 1. Ask your Cloud Run Gateway to analyze the visitor
    const analyzeRequest = await fetch(GATEWAY_ANALYZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: ip, 
        ip: ip,
        endpoint: url.pathname,
        method: request.method,
        user_agent: request.headers.get('user-agent') || ''
      })
    });

    const decision = await analyzeRequest.json();

    // 2. Read the Gateway's verdict
    if (decision.action === 'block') {
      return new Response("<h2>Access Denied</h2><p>Our AI Security system detected malicious behavior.</p>", { 
        status: 403, 
        headers: { 'Content-Type': 'text/html' } 
      });
    }

    if (decision.action === 'rate_limit') {
      return new Response("<h2>Too Many Requests</h2><p>Please slow down.</p>", { 
        status: 429, 
        headers: { 'Content-Type': 'text/html' } 
      });
    }

    // 3. Traffic is clean, let the request proceed
    return; // In non-Next.js middleware, returning nothing allows the request to continue
    
  } catch (error) {
    console.error('Middleware Error:', error);
    // If the Gateway fails, let the user in (fail-safe)
    return;
  }
}

// Ensure the middleware runs on application pages and APIs, but ignores static files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any file with an extension like .css, .js, .png, .jpg, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
};
