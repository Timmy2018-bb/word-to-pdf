export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理静态文件请求
    if (request.method === 'GET') {
      // 如果是根路径，返回 index.html
      if (url.pathname === '/' || url.pathname === '') {
        return new Response(HTML_CONTENT, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }

    // 处理 404
    return new Response('Not Found', { status: 404 });
  },
};

// 将 index.html 的内容直接嵌入到这里
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
... // 这里是完整的 index.html 内容
</html>`;