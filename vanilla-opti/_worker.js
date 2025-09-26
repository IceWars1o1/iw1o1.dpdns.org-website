export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/changelog/api/logs') {
      const upstream = await fetch(
        'https://cysunk.mlzi.top/vanilla_optimizations/changelog/assets/2025/secure/gateway.php',
        {
          method: 'POST',
          headers: {
            'X-API-Key': 'miku_dream_2025_secure_api_v1',
            'X-Request-Type': 'logs',
            'Content-Type': 'application/json'
          }
        }
      );
      const text = await upstream.text();
      return new Response(text, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
