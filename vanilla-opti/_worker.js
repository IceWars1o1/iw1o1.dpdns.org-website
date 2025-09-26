export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    /* 只拦截这一条虚拟路径 */
    if (url.pathname === '/assets/gateway.php') {
      // 1. 复制浏览器发来的头
      const headers = new Headers(req.headers);
      headers.set('X-Forwarded-Host', url.host);   // 可选，调试用

      // 2. 原样转发到源站
      const upstream = await fetch(
        'https://cysunk.mlzi.top/vanilla_optimizations/changelog/assets/gateway.php',
        {
          method: 'POST',
          headers: headers,
          body: req.body,        // ← 必须带原始 body
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

    /* 其余走静态 */
    return env.ASSETS.fetch(req);
  }
};
