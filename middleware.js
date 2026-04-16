export default async function middleware(request) {
  const url = new URL(request.url);
  
  // Prepare the data for abuse detection
  const payload = {
    user_id: request.headers.get('x-user-id') || 'unauthenticated',
    ip: request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1',
    endpoint: url.pathname,
    method: request.method,
    user_agent: request.headers.get('user-agent') || '',
    timestamp: Date.now() / 1000,
  };

  try {
    // Call the API Abuse Detection service on Render
    const detectionUrl = 'https://api-abuse-detection.onrender.com/detect'; 
    const response = await fetch(detectionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Standard fetch timeout isn't directly supported in Edge, 
      // but Vercel Edge has a short execution limit anyway.
    });

    if (response.ok) {
      const result = await response.json();
      
      // If the service decides to block the request
      if (result.action === 'block') {
        return new Response(
          JSON.stringify({ 
            error: 'Security Block', 
            reason: result.reason || 'Malicious activity detected',
            incident_id: result.details?.id 
          }),
          { 
            status: 403, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  } catch (err) {
    // Fail open: if the security service is down, don't break the website
    console.warn('Security layer unreachable, failing open:', err);
  }

  // Allow the request to proceed
  return;
}

// Ensure this only runs on specific routes if needed
// For now, it will protect everything
