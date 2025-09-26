export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* 只拦截这一条虚拟路径 */
    if (url.pathname === '/changelog/assets/gateway.php') {
      // 1. 复制浏览器发来的所有头（包含 X-API-Key / X-Request-Type 等）
      const headers = new Headers(request.headers);

      // 2. 原样转发到源站（带 body）
      const upstream = await fetch(
        'https://cysunk.mlzi.top/vanilla_optimizations/changelog/assets/gateway.php',
        {
          method: 'POST',
          headers: headers,
          body: request.body,
          redirect: 'follow'
        }
      );

      // 3. 把源站回复原样返给浏览器（只加 CORS）
      const body = await upstream.text();
      return new Response(body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: {
          'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    /* 其余走静态资源 */
    return env.ASSETS.fetch(request);
  }
};
