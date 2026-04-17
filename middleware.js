// Standard Vercel Edge Middleware (Web API compatible)
const GATEWAY_ANALYZE_URL = "https://api-gateway-385749714263.asia-south1.run.app/analyze";

export default async function middleware(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname.toLowerCase();
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // 1. ABSOLUTE BYPASS for Loader.io verification tokens and bot traffic
    // This MUST happen before any external calls or logic to prevent 429s during verification
    if (pathname.includes('loaderio-') || userAgent.includes('loaderio')) {
      // Serve the verification token directly if the path matches the pattern
      if (pathname.includes('loaderio-8ebb1aaefdde594ff4ff07cddc91775b')) {
        return new Response("loaderio-8ebb1aaefdde594ff4ff07cddc91775b", { 
          status: 200, 
          headers: { 
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          } 
        });
      }
      // For any other loaderio bot requests (e.g. testing the home page), allow them through
      return; 
    }

    // Vercel provides the client IP in the headers or request object
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    // Ignore static assets for security analysis
    if (pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|css|js|txt|ico)$/)) {
      return;
    }

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

    // Fail-safe: If the gateway itself errors or rate-limits the middleware call,
    // allow the user through rather than blocking legitimate traffic
    if (!analyzeRequest.ok) {
      console.warn(`Gateway returned ${analyzeRequest.status}, failing open`);
      return; // allow the request
    }

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

// Ensure the middleware runs on application pages and APIs
export const config = {
  matcher: '/:path*',
};
