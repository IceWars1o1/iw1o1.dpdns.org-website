// _worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ✅ 匹配新的路径
    if (url.pathname === '/changelog/dev/api/logs') {
      const targetUrl = 'https://cysunk.mlzi.top/vanilla_optimizations/changelog/api/logs.php';
      const response = await fetch(targetUrl);
      const data = await response.text();

      return new Response(data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // ✅ 其他路径正常返回静态资源
    return env.ASSETS.fetch(request);
  }
}
