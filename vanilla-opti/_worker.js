// _worker.js
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/changelog/dev/api/logs') {
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
      const data = await upstream.text();
      return new Response(data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    return env.ASSETS.fetch(req);
  }
};
