import { NextResponse } from 'next/server';

// Your Google Cloud Run API Gateway URL
const GATEWAY_ANALYZE_URL = "https://api-gateway-385749714263.asia-south1.run.app/analyze";

export async function middleware(request) {
  try {
    const ip = request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    
    // 1. Ask your Cloud Run Gateway to analyze the visitor
    const analyzeRequest = await fetch(GATEWAY_ANALYZE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: ip, 
        ip: ip,
        endpoint: request.nextUrl.pathname,
        method: request.method,
        user_agent: request.headers.get('user-agent') || ''
      })
    });

    const decision = await analyzeRequest.json();

    // 2. Read the Gateway's verdict
    if (decision.action === 'block') {
      return new NextResponse("<h2>Access Denied</h2><p>Our AI Security system detected malicious behavior.</p>", { 
        status: 403, 
        headers: { 'content-type': 'text/html' } 
      });
    }

    if (decision.action === 'rate_limit') {
      return new NextResponse("<h2>Too Many Requests</h2><p>Please slow down.</p>", { 
        status: 429, 
        headers: { 'content-type': 'text/html' } 
      });
    }

    // 3. Traffic is clean, load the website normally!
    return NextResponse.next();
    
  } catch (error) {
    // If the Gateway fails for any reason, let the user in (fail-safe)
    return NextResponse.next();
  }
}

// Ensure the middleware runs on all pages and API routes
export const config = {
  matcher: '/:path*',
};
