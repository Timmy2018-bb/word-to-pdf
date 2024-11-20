export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'GET') {
      if (url.pathname === '/' || url.pathname === '') {
        return new Response(HTML_CONTENT, {
          headers: { 'Content-Type': 'text/html' },
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  },
};

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="zh">
<!-- 复制 public/index.html 的完整内容 -->
<!-- 但需要修改 convertSingleFile 函数，改为使用纯前端转换 -->
<script>
async function convertSingleFile(file) {
    const fileItem = document.getElementById(\`file-\${file.name}\`);
    if (!fileItem) {
        showStatus(\`\${file.name} 处理异常\`, 'error');
        return;
    }

    const progressBar = fileItem.querySelector('.progress');
    if (!progressBar) {
        showStatus(\`\${file.name} 进度条加载失败\`, 'error');
        return;
    }

    progressBar.style.width = '0%';

    try {
        // 使用 mammoth.js 进行转换
        const response = await mammoth.convertToHtml(file);
        const html = response.value;

        // 使用 html2pdf.js 将 HTML 转换为 PDF
        const pdf = await html2pdf().from(html).outputPdf();
        
        progressBar.style.width = '100%';

        // 创建下载链接
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name.replace('.docx', '.pdf');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showStatus(\`\${file.name} 转换成功！\`);
    } catch (error) {
        throw error;
    }
}
</script>
</html>`;