// 这是一个临时文件，用于生成超炫酷的HTML报告模板
// 将在 project-stats.js 中被引用

module.exports = function generateEnhancedHTML(stats, timestamp, fileTreeData, formatNumber, formatSize) {
  const languageData = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count: count }));
  
  const codeDistribution = [
    { type: '代码行', value: stats.code.codeLines, color: '#00ff88' },
    { type: '注释行', value: stats.code.commentLines, color: '#00d4ff' },
    { type: '空白行', value: stats.code.blankLines, color: '#666' }
  ];
  
  const tokenDistribution = [
    { type: '中文', value: stats.tokens.breakdown.fromChinese, color: '#ff6b9d' },
    { type: '英文', value: stats.tokens.breakdown.fromEnglish, color: '#c770f0' },
    { type: '代码', value: stats.tokens.breakdown.fromCode, color: '#00d4ff' }
  ];

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌙 ${stats.project.name} - 项目统计报告</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
      background: #0a0e27;
      color: #e0e0e0;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    #particles-js {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 0;
    }
    
    .container {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
      border-radius: 20px;
      padding: 60px 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1);
      margin-bottom: 30px;
      border: 1px solid rgba(0, 255, 136, 0.2);
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(0,255,136,0.1) 0%, transparent 70%);
      animation: glow 8s ease-in-out infinite;
    }
    
    @keyframes glow {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(180deg); }
    }
    
    .header h1 {
      font-size: 3em;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #00ff88, #00d4ff, #c770f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 1;
      text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
    }
    
    .header .subtitle {
      font-size: 1.2em;
      color: #00d4ff;
      position: relative;
      z-index: 1;
    }
    
    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .meta-item {
      background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
      padding: 25px;
      border-radius: 15px;
      text-align: center;
      border: 1px solid rgba(0, 212, 255, 0.2);
      transition: all 0.3s ease;
    }
    
    .meta-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
      border-color: #00d4ff;
    }
    
    .meta-item .label {
      color: #888;
      font-size: 0.9em;
      margin-bottom: 10px;
    }
    
    .meta-item .value {
      font-size: 1.5em;
      font-weight: bold;
      color: #00ff88;
    }
    
    .section {
      background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      border: 1px solid rgba(199, 112, 240, 0.2);
    }
    
    .section-title {
      font-size: 2em;
      margin-bottom: 25px;
      color: #00ff88;
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 15px;
      border-bottom: 2px solid rgba(0, 255, 136, 0.3);
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
      padding: 30px;
      border-radius: 15px;
      border: 1px solid rgba(0, 212, 255, 0.3);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
      transition: left 0.5s ease;
    }
    
    .stat-card:hover::before {
      left: 100%;
    }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 15px 40px rgba(0, 255, 136, 0.2);
      border-color: #00ff88;
    }
    
    .stat-card .label {
      color: #888;
      font-size: 0.95em;
      margin-bottom: 12px;
    }
    
    .stat-card .value {
      font-size: 2.5em;
      font-weight: bold;
      background: linear-gradient(90deg, #00ff88, #00d4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .chart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 25px;
    }
    
    .chart-container {
      background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
      padding: 25px;
      border-radius: 15px;
      border: 1px solid rgba(199, 112, 240, 0.3);
    }
    
    .chart-container h3 {
      color: #c770f0;
      margin-bottom: 20px;
      font-size: 1.3em;
    }
    
    .chart-wrapper {
      position: relative;
      height: 300px;
    }
    
    .file-tree {
      background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
      padding: 20px;
      border-radius: 10px;
      border: 1px solid rgba(0, 212, 255, 0.2);
      max-height: 500px;
      overflow-y: auto;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9em;
    }
    
    .file-tree::-webkit-scrollbar {
      width: 8px;
    }
    
    .file-tree::-webkit-scrollbar-track {
      background: #0a0e27;
      border-radius: 4px;
    }
    
    .file-tree::-webkit-scrollbar-thumb {
      background: #00d4ff;
      border-radius: 4px;
    }
    
    .tree-item {
      padding: 5px 0;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .tree-item:hover {
      color: #00ff88;
      padding-left: 5px;
    }
    
    .tree-folder {
      color: #00d4ff;
      font-weight: bold;
    }
    
    .tree-file {
      color: #c770f0;
    }
    
    .tree-children {
      margin-left: 20px;
      border-left: 1px dashed rgba(0, 212, 255, 0.3);
      padding-left: 10px;
    }
    
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0 8px;
    }
    
    th {
      background: linear-gradient(90deg, #00ff88, #00d4ff);
      color: #0a0e27;
      padding: 15px;
      text-align: left;
      font-weight: 700;
      border-radius: 8px;
    }
    
    td {
      padding: 15px;
      background: rgba(0, 212, 255, 0.05);
      border-radius: 8px;
    }
    
    tr:hover td {
      background: rgba(0, 255, 136, 0.1);
    }
    
    .footer {
      text-align: center;
      padding: 30px;
      color: #666;
      font-size: 0.95em;
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 2em;
      }
      
      .chart-grid, .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div id="particles-js"></div>
  
  <div class="container">
    <div class="header">
      <h1>🌙 ${stats.project.name}</h1>
      <div class="subtitle">项目统计可视化报告 · Night Theme</div>
    </div>
    
    <div class="meta">
      <div class="meta-item">
        <div class="label">生成时间</div>
        <div class="value">${timestamp}</div>
      </div>
      <div class="meta-item">
        <div class="label">项目类型</div>
        <div class="value">${stats.project.type}</div>
      </div>
      <div class="meta-item">
        <div class="label">工具版本</div>
        <div class="value">v2.6</div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📈 核心统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">统计文件</div>
          <div class="value">${formatNumber(stats.files.total)}</div>
        </div>
        <div class="stat-card">
          <div class="label">总字符数</div>
          <div class="value">${formatSize(stats.text.totalChars)}</div>
        </div>
        <div class="stat-card">
          <div class="label">代码行数</div>
          <div class="value">${formatNumber(stats.code.totalLines)}</div>
        </div>
        <div class="stat-card">
          <div class="label">估算 Tokens</div>
          <div class="value">${formatNumber(stats.tokens.estimated)}</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📊 数据可视化</h2>
      <div class="chart-grid">
        <div class="chart-container">
          <h3>语言分布</h3>
          <div class="chart-wrapper">
            <canvas id="languageChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3>代码组成</h3>
          <div class="chart-wrapper">
            <canvas id="codeChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3>Token 分布</h3>
          <div class="chart-wrapper">
            <canvas id="tokenChart"></canvas>
          </div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">🌳 项目结构</h2>
      <div id="fileTree" class="file-tree"></div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📋 详细数据</h2>
      <table>
        <thead>
          <tr>
            <th>语言</th>
            <th>文件数</th>
            <th>占比</th>
          </tr>
        </thead>
        <tbody>
          ${languageData.map(item => `
            <tr>
              <td><strong>${item.language}</strong></td>
              <td>${formatNumber(item.count)}</td>
              <td>${((item.count / stats.files.total) * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="section">
      <h2 class="section-title">🔍 复杂度分析</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">平均行长度</div>
          <div class="value">${stats.complexity.avgLineLength}</div>
        </div>
        <div class="stat-card">
          <div class="label">平均文件大小</div>
          <div class="value">${formatSize(stats.complexity.avgFileSize)}</div>
        </div>
        <div class="stat-card">
          <div class="label">最大文件</div>
          <div class="value" style="font-size: 1.2em;">${stats.files.largest.path}</div>
        </div>
        <div class="stat-card">
          <div class="label">最大文件行数</div>
          <div class="value">${formatNumber(stats.files.largest.lines)}</div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      由项目统计工具 v2.6 自动生成 | ${timestamp} | 🌙 Night Theme
    </div>
  </div>
  
  <script>
    // 粒子背景初始化
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#00ff88', '#00d4ff', '#c770f0'] },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#00d4ff',
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 2,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
    
    // Chart.js 图表配置
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    
    // 语言分布图
    new Chart(document.getElementById('languageChart'), {
      type: 'doughnut',
      data: {
        labels: ${JSON.stringify(languageData.map(d => d.language))},
        datasets: [{
          data: ${JSON.stringify(languageData.map(d => d.count))},
          backgroundColor: ['#00ff88', '#00d4ff', '#c770f0', '#ff6b9d', '#ffd700', 
                          '#ff4757', '#5f27cd', '#00d2d3', '#ff6348', '#1e90ff']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: '#e0e0e0', padding: 15 } }
        }
      }
    });
    
    // 代码组成图
    new Chart(document.getElementById('codeChart'), {
      type: 'pie',
      data: {
        labels: ${JSON.stringify(codeDistribution.map(d => d.type))},
        datasets: [{
          data: ${JSON.stringify(codeDistribution.map(d => d.value))},
          backgroundColor: ${JSON.stringify(codeDistribution.map(d => d.color))}
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#e0e0e0', padding: 15 } }
        }
      }
    });
    
    // Token 分布图
    new Chart(document.getElementById('tokenChart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(tokenDistribution.map(d => d.type))},
        datasets: [{
          label: 'Tokens',
          data: ${JSON.stringify(tokenDistribution.map(d => d.value))},
          backgroundColor: ${JSON.stringify(tokenDistribution.map(d => d.color))}
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
          x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
      }
    });
    
    // 文件树渲染
    function renderTree(node, level = 0) {
      const indent = '  '.repeat(level);
      let html = '';
      
      if (node.type === 'directory') {
        html += \`<div class="tree-item tree-folder">\${indent}📁 \${node.name}</div>\`;
        if (node.children && node.children.length > 0) {
          html += '<div class="tree-children">';
          node.children.forEach(child => {
            html += renderTree(child, level + 1);
          });
          html += '</div>';
        }
      } else {
        html += \`<div class="tree-item tree-file">\${indent}📄 \${node.name}</div>\`;
      }
      
      return html;
    }
    
    const fileTreeData = ${JSON.stringify(fileTreeData)};
    document.getElementById('fileTree').innerHTML = renderTree(fileTreeData);
  </script>
</body>
</html>`;
};