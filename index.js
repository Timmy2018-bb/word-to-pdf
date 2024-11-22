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
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DocConverter - 专业的文档转换工具</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.0/mammoth.browser.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <style>
        :root {
            --primary-color: #2196F3;
            --secondary-color: #1976D2;
            --background-color: #ffffff;
            --text-color: #333333;
            --border-color: #e0e0e0;
            --card-background: #ffffff;
            --feature-card-bg: #f8f9fa;
        }

        [data-theme="dark"] {
            --primary-color: #64B5F6;
            --secondary-color: #42A5F5;
            --background-color: #121212;
            --text-color: #ffffff;
            --border-color: #333333;
            --card-background: #1E1E1E;
            --feature-card-bg: #2D2D2D;
        }

        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--background-color);
            color: var(--text-color);
            transition: all 0.3s ease;
        }

        .header {
            padding: 15px;
            background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            min-height: 50px;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -150%;
            left: -50%;
            width: 200%;
            height: 300%;
            background: repeating-linear-gradient(
                60deg,
                rgba(99, 102, 241, 0.1) 0%,
                rgba(99, 102, 241, 0.1) 5%,
                transparent 5%,
                transparent 10%
            );
            animation: rays 20s linear infinite;
            transform-origin: center;
        }

        .header::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(
                circle at 30% 50%,
                rgba(99, 102, 241, 0.12) 0%,
                rgba(0, 217, 245, 0.08) 25%,
                rgba(0, 245, 160, 0.04) 50%,
                transparent 70%
            );
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            z-index: 1;
            height: 100%;
        }

        .logo {
            font-size: 32px;
            font-weight: 700;
            background: linear-gradient(120deg, #0ea5e9 0%, #2563eb 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 2px 4px rgba(0,0,0,0.05);
            letter-spacing: -0.5px;
            position: relative;
            padding: 5px 0;
            display: flex;
            align-items: center;
        }

        .logo::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #0ea5e9, #2563eb);
            transform: scaleX(0);
            transform-origin: right;
            transition: transform 0.3s ease;
        }

        .logo:hover::after {
            transform: scaleX(1);
            transform-origin: left;
        }

        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .controls {
            display: flex;
            gap: 20px;
            align-items: center;
            height: 100%;
        }

        .toggle-button {
            padding: 8px 16px;
            font-size: 14px;
            height: fit-content;
            border: none;
            border-radius: 8px;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            color: #374151;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .toggle-button:hover {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
        }

        [data-theme="dark"] .toggle-button {
            background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%);
            color: #e5e7eb;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .toggle-button:hover {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            border: 1px solid transparent;
        }

        .main-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }

        .hero-section {
            text-align: center;
            margin-bottom: 40px;
        }

        .hero-title {
            font-size: 48px;
            font-weight: 600;
            margin-bottom: 20px;
            background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
            font-size: 18px;
            color: var(--text-color);
            opacity: 0.8;
            margin-bottom: 30px;
        }

        .upload-container {
            text-align: center;
            padding: 60px 40px;
            border: 2px dashed var(--border-color);
            border-radius: 20px;
            background-color: var(--card-background);
            transition: all 0.3s ease;
            margin: 40px auto;
            max-width: 800px;
        }

        .upload-container.drag-over {
            border-color: var(--primary-color);
            background-color: rgba(33, 150, 243, 0.05);
        }

        .upload-text {
            font-size: 18px;
            color: var(--text-color);
            margin: 20px 0;
            line-height: 1.5;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 40px;
            text-align: center;
            padding: 0 20px;
        }

        .feature-card {
            padding: 25px 20px;
            border-radius: 12px;
            background-color: var(--feature-card-bg);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .feature-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.08);
        }

        .feature-icon {
            font-size: 28px;
            margin-bottom: 12px;
            color: var(--primary-color);
        }

        .feature-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-color);
        }

        .feature-description {
            color: var(--text-color);
            opacity: 0.8;
            font-size: 14px;
            line-height: 1.4;
            margin: 0;
        }

        #fileInput {
            display: none;
        }

        .upload-button {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.15);
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        .upload-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.25);
            background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        }

        .upload-button:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
        }

        .upload-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                120deg,
                transparent,
                rgba(255, 255, 255, 0.2),
                transparent
            );
            transition: 0.5s;
        }

        .upload-button:hover::before {
            left: 100%;
        }

        .upload-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
            box-shadow: none;
        }

        .file-list {
            margin-top: 30px;
            text-align: left;
        }

        .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            background-color: var(--feature-card-bg);
            margin: 10px 0;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .file-item:hover {
            transform: translateX(5px);
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background-color: var(--border-color);
            border-radius: 2px;
            margin-top: 8px;
            overflow: hidden;
        }

        .progress {
            width: 0%;
            height: 100%;
            background-color: var(--primary-color);
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .remove-file {
            color: #ff4444;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .remove-file:hover {
            background-color: rgba(255, 68, 68, 0.1);
        }

        @media (max-width: 768px) {
            .hero-title {
                font-size: 36px;
            }
            
            .hero-subtitle {
                font-size: 18px;
            }

            .features-grid {
                grid-template-columns: 1fr;
            }
        }

        #convertButton {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }

        #convertButton:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25);
        }

        #convertButton:active {
            box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
        }

        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }

        .upload-button, .toggle-button {
            position: relative;
            isolation: isolate;
        }

        .upload-button::after, .toggle-button::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 100px;
            height: 100px;
            margin-left: -50px;
            margin-top: -50px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }

        .upload-button:active::after, .toggle-button:active::after {
            animation: ripple 0.5s ease-out;
        }

        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            pointer-events: none;
        }

        .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
        }

        [data-theme="dark"] .header {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
        }

        [data-theme="dark"] .header::before {
            background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 50%);
        }

        [data-theme="dark"] .header::after {
            background: linear-gradient(90deg, 
                rgba(99, 102, 241, 0.1) 0%,
                rgba(0, 217, 245, 0.1) 50%,
                rgba(0, 245, 160, 0.1) 100%
            );
        }

        @keyframes rays {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes particle-float {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-15px) translateX(15px);
            }
            50% {
                transform: translateY(0) translateX(30px);
            }
            75% {
                transform: translateY(15px) translateX(15px);
            }
        }

        @keyframes particle-glow {
            0%, 100% {
                opacity: 0.3;
            }
            50% {
                opacity: 0.8;
            }
        }

        .particles-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .file-name {
            margin-bottom: 8px;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="nav-container">
            <div class="logo">DocConverter</div>
            <div class="controls">
                <button class="toggle-button" onclick="toggleLanguage()" id="langToggle">EN</button>
                <button class="toggle-button" onclick="toggleTheme()" id="themeToggle">🌙</button>
            </div>
        </div>
    </header>

    <div class="main-container">
        <section class="hero-section">
            <h1 class="hero-title" data-lang="title">专的文档转换工具</h1>
            <p class="hero-subtitle" data-lang="subtitle">快速、安全、高效地将Word文档转换为PDF格式</p>
        </section>

        <div class="upload-container" id="dropZone">
            <input type="file" id="fileInput" accept=".docx" multiple />
            <p class="upload-text" data-lang="dragText">
                将Word文档拖拽到此处，或点击下方按钮选择文件<br>
                <span style="font-size: 14px; opacity: 0.7;">支持 .docx 格式，单个文件最大10MB</span>
            </p>
            <button class="upload-button" onclick="document.getElementById('fileInput').click()" data-lang="selectButton">选择文件</button>
            <button class="upload-button" onclick="convertFiles()" id="convertButton" style="display: none;" data-lang="convertButton">开始转换</button>
            <div id="status"></div>
            <div class="file-list" id="fileList"></div>
        </div>

        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3 class="feature-title" data-lang="secureTitle">安全可靠</h3>
                <p class="feature-description" data-lang="secureDesc">所有文件处理都在本地完成，确保您的数据安全</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title" data-lang="fastTitle">快速处理</h3>
                <p class="feature-description" data-lang="fastDesc">采用最新技术，瞬间完成转换</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3 class="feature-title" data-lang="compatibleTitle">全平台兼容</h3>
                <p class="feature-description" data-lang="compatibleDesc">支持各种设备，随时随地使用</p>
            </div>
        </div>
    </div>

    <script>
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        let files = [];

        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const convertButton = document.getElementById('convertButton');
        const fileList = document.getElementById('fileList');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
        });

        function highlight(e) {
            dropZone.classList.add('drag-over');
        }

        function unhighlight(e) {
            dropZone.classList.remove('drag-over');
        }

        dropZone.addEventListener('drop', handleDrop, false);
        fileInput.addEventListener('change', handleFileSelect, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const newFiles = [...dt.files];
            addFiles(newFiles);
        }

        function handleFileSelect(e) {
            const newFiles = [...e.target.files];
            addFiles(newFiles);
        }

        function addFiles(newFiles) {
            const maxFiles = 10; // 最大文件数限制
            const existingCount = files.length;
            let addedCount = 0;

            for (const file of newFiles) {
                if (existingCount + addedCount >= maxFiles) {
                    showStatus(\`最多只能同时转换\${maxFiles}个文件\`, 'error');
                    break;
                }

                if (!file.name.endsWith('.docx')) {
                    showStatus(\`\${file.name} 不是Word文档\`, 'error');
                    continue;
                }

                if (file.size > MAX_FILE_SIZE) {
                    showStatus(\`\${file.name} 超过10MB限制\`, 'error');
                    continue;
                }

                if (!files.some(f => f.name === file.name)) {
                    files.push(file);
                    addedCount++;
                } else {
                    showStatus(\`\${file.name} 已在列表中\`, 'error');
                }
            }

            updateFileList();
            convertButton.style.display = files.length ? 'inline-block' : 'none';
        }

        function removeFile(fileName) {
            files = files.filter(f => f.name !== fileName);
            updateFileList();
            convertButton.style.display = files.length ? 'inline-block' : 'none';
        }

        function updateFileList() {
            fileList.innerHTML = files.map(file => \`
                <div class="file-item" id="file-\${file.name}">
                    <div style="width: 100%;">
                        <div class="file-name">\${file.name}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%"></div>
                        </div>
                    </div>
                    <span class="remove-file" onclick="removeFile('\${file.name}')">✕</span>
                </div>
            \`).join('');
        }

        function showStatus(message, type = 'info') {
            const statusDiv = document.getElementById('status');
            statusDiv.textContent = message;
            statusDiv.style.color = type === 'error' ? '#ff4444' : 
                                  type === 'success' ? '#4CAF50' : '#666';
            
            // 3秒后自动清除成功消息
            if (type === 'success') {
                setTimeout(() => {
                    if (statusDiv.textContent === message) {
                        statusDiv.textContent = '';
                    }
                }, 3000);
            }
        }

        async function convertSingleFile(file) {
            const fileItem = document.getElementById(\`file-\${file.name}\`);
            if (!fileItem) {
                showStatus(\`\${file.name} 处理异常\`, 'error');
                return null;
            }

            const progressBar = fileItem.querySelector('.progress');
            if (!progressBar) {
                showStatus(\`\${file.name} 进度条加载失败\`, 'error');
                return null;
            }

            progressBar.style.width = '0%';

            try {
                // 使用 mammoth.js 进行转换，保持原始样式
                progressBar.style.width = '30%';
                const arrayBuffer = await file.arrayBuffer();
                const response = await mammoth.convertToHtml(
                    { arrayBuffer },
                    {
                        preserveStyles: true,
                        styleMap: [
                            "p[style-name='Normal'] => p:fresh",
                            "p[style-name='Heading 1'] => h1:fresh",
                            "p[style-name='Heading 2'] => h2:fresh",
                            "p[style-name='Heading 3'] => h3:fresh",
                            "r[style-name='Strong'] => strong",
                            "table => table.table",
                            "p[style-name='Table Normal'] => p.table-cell",
                            "r[style-name='Emphasis'] => em",
                            "r[style-name='Underline'] => u"
                        ],
                        ignoreEmptyParagraphs: false
                    }
                );
                const html = response.value;

                // 添加基础样式，完全匹配 Word 格式
                const styledHtml = \`
                    <html>
                    <head>
                        <style>
                            @page {
                                size: A4;
                                margin: 2.54cm;
                            }
                            body {
                                font-family: "Times New Roman", Times, serif;
                                font-size: 12pt;
                                line-height: 1.15;
                                margin: 0;
                                padding: 0;
                                -webkit-font-smoothing: antialiased;
                                -moz-osx-font-smoothing: grayscale;
                            }
                            p {
                                margin: 0;
                                padding: 0;
                                margin-bottom: 1.15em;
                                text-align: inherit;
                                text-indent: inherit;
                                line-height: inherit;
                                font-size: inherit;
                                font-family: inherit;
                            }
                            h1, h2, h3, h4, h5, h6 {
                                font-weight: bold;
                                line-height: 1.2;
                                margin: 1em 0 0.5em 0;
                                page-break-after: avoid;
                            }
                            h1 { font-size: 16pt; }
                            h2 { font-size: 14pt; }
                            h3 { font-size: 12pt; }
                            table {
                                border-collapse: collapse;
                                margin: 1em 0;
                                width: auto;
                                page-break-inside: avoid;
                            }
                            td, th {
                                border: 1px solid black;
                                padding: 0.2cm;
                                vertical-align: top;
                                text-align: left;
                            }
                            img {
                                max-width: 100%;
                                height: auto;
                                page-break-inside: avoid;
                            }
                            ul, ol {
                                margin: 1em 0;
                                padding-left: 40px;
                            }
                            li {
                                margin-bottom: 0.5em;
                            }
                            a {
                                color: blue;
                                text-decoration: underline;
                            }
                            sup, sub {
                                font-size: smaller;
                                line-height: 0;
                            }
                        </style>
                    </head>
                    <body>
                        \${html}
                    </body>
                    </html>\`;

                // 使用 html2pdf.js 将 HTML 转换为 PDF，优化设置
                progressBar.style.width = '60%';
                const pdfOptions = {
                    margin: 0,
                    filename: file.name.replace('.docx', '.pdf'),
                    image: { type: 'jpeg', quality: 1.0 },
                    html2canvas: { 
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        scrollY: 0,
                        logging: false,
                        allowTaint: true,
                        foreignObjectRendering: true
                    },
                    jsPDF: { 
                        unit: 'pt', 
                        format: 'a4', 
                        orientation: 'portrait',
                        compress: false,
                        precision: 32,
                        floatPrecision: "smart"
                    }
                };

                const pdf = await html2pdf().set(pdfOptions).from(styledHtml).outputPdf('blob');
                progressBar.style.width = '100%';
                showStatus(\`\${file.name} 转换成功！\`);
                return pdf;
            } catch (error) {
                showStatus(\`\${file.name} 转换失败: \${error.message}\`, 'error');
                throw error;
            }
        }

        async function convertFiles() {
            if (!files.length) {
                showStatus('请选择文件');
                return;
            }

            convertButton.disabled = true;
            const zip = new JSZip();
            const pdfs = [];
            
            for (const file of files) {
                try {
                    const pdfBlob = await convertSingleFile(file);
                    if (pdfBlob) {
                        pdfs.push({ name: file.name.replace('.docx', '.pdf'), blob: pdfBlob });
                    }
                } catch (error) {
                    showStatus(\`\${file.name} 转换失败: \${error.message}\`, 'error');
                }
            }

            // 如果有多个文件，打包下载
            if (pdfs.length > 1) {
                for (const pdf of pdfs) {
                    zip.file(pdf.name, pdf.blob);
                }
                const zipBlob = await zip.generateAsync({ 
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 9 }
                });
                const url = window.URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`converted_pdfs_\${new Date().toISOString().slice(0,10)}.zip\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } 
            // 如果只有一个文件，直接下载
            else if (pdfs.length === 1) {
                const url = window.URL.createObjectURL(pdfs[0].blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = pdfs[0].name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }

            convertButton.disabled = false;
        }

        function toggleTheme() {
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');
            const currentTheme = body.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                body.removeAttribute('data-theme');
                themeToggle.textContent = '🌙';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeToggle.textContent = '☀️';
            }
        }

        const translations = {
            zh: {
                title: '专业的文档转换工具',
                subtitle: '快速、安全、高效地将Word文档转换为PDF格式',
                dragText: '将Word文档拖拽到此处，或点击下方按钮选择文件\\n支持 .docx 格式，单个文件最大10MB',
                selectButton: '选择文件',
                convertButton: '开始转换',
                secureTitle: '安全可靠',
                secureDesc: '所有文件处理都在本地完成，确保您的数据安全',
                fastTitle: '快速处理',
                fastDesc: '采用最新技术，瞬间完成转换',
                compatibleTitle: '全平台兼容',
                compatibleDesc: '支持各种设备，随时随地使用'
            },
            en: {
                title: 'Professional Document Converter',
                subtitle: 'Convert Word to PDF quickly, safely and efficiently',
                dragText: 'Drag Word documents here or click the button below\\nSupports .docx format, max 10MB per file',
                selectButton: 'Select Files',
                convertButton: 'Convert Now',
                secureTitle: 'Secure & Reliable',
                secureDesc: 'All processing is done locally, ensuring your data security',
                fastTitle: 'Lightning Fast',
                fastDesc: 'Using cutting-edge technology for instant conversion',
                compatibleTitle: 'Cross-Platform',
                compatibleDesc: 'Works on all devices, anywhere, anytime'
            }
        };

        let currentLang = 'zh';

        function toggleLanguage() {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            const langToggle = document.getElementById('langToggle');
            langToggle.textContent = currentLang === 'zh' ? 'EN' : '中文';
            updateLanguage();
        }

        function updateLanguage() {
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (translations[currentLang][key]) {
                    element.textContent = translations[currentLang][key];
                }
            });
        }
    </script>
</body>
</html>`;