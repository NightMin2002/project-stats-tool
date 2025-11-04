/**
 * HTML 报告模板生成器 v2.10.0
 *
 * 生成 Night Theme 风格的项目统计可视化报告
 *
 * 🆕 v2.10.0 新增:
 * - 语言级别的详细统计卡片（显示代码行、注释、文件数等）
 * - 语言代码量对比的堆叠柱状图
 * - 完整的语言详细统计表格（包含代码率等指标）
 *
 * @param {Object} stats - 完整的统计数据对象
 * @param {string} timestamp - 生成时间戳
 * @param {Object} fileTreeData - 文件树数据
 * @param {Function} formatNumber - 数字格式化函数
 * @param {Function} formatSize - 文件大小格式化函数
 * @param {Object} libs - 内嵌的第三方库（Chart.js, Particles.js）
 * @param {Object|null} trendData - 历史趋势数据（可选）
 * @returns {string} 完整的 HTML 报告字符串
 */
module.exports = function generateEnhancedHTML(stats, timestamp, fileTreeData, formatNumber, formatSize, libs = {}, trendData = null) {
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
  ${libs.chartJs ? `<script>${libs.chartJs}</script>` : '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>'}
  ${libs.particlesJs ? `<script>${libs.particlesJs}</script>` : '<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>'}
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
      top: 50%;
      left: 50%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      animation: pulse 4s ease-in-out infinite;
      pointer-events: none;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1.1);
      }
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
      max-height: 600px;
      overflow-y: auto;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.9em;
      position: relative;
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
      transition: all 0.2s ease;
      user-select: none;
    }
    
    .tree-item.clickable {
      cursor: pointer;
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
      overflow: hidden;
      transition: max-height 0.3s ease, opacity 0.3s ease;
    }
    
    .tree-children.collapsed {
      max-height: 0;
      opacity: 0;
      display: none;
    }
    
    .tree-children.expanded {
      max-height: none;
      opacity: 1;
    }
    
    .tree-count {
      color: #888;
      font-size: 0.85em;
      font-weight: normal;
    }
    
    .tree-size {
      color: #666;
      font-size: 0.8em;
      font-weight: normal;
      margin-left: 8px;
    }
    
    .tree-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      padding: 10px;
      background: rgba(0, 212, 255, 0.05);
      border-radius: 8px;
    }
    
    .tree-btn {
      background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
      color: #0a0e27;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9em;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
    }
    
    .tree-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 212, 255, 0.5);
    }
    
    .tree-btn:active {
      transform: translateY(0);
    }
    
    .tree-stats {
      padding: 10px;
      margin-bottom: 10px;
      background: rgba(199, 112, 240, 0.1);
      border-radius: 8px;
      color: #c770f0;
      font-weight: 600;
      text-align: center;
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
    
    /* 平滑滚动 */
    html {
      scroll-behavior: smooth;
    }
    
    /* 加载动画 */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .section {
      animation: fadeIn 0.6s ease-out;
    }
    
    /* 响应式优化 */
    @media (max-width: 1200px) {
      .chart-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 2em;
      }
      
      .header {
        padding: 40px 20px;
      }
      
      .container {
        padding: 10px;
      }
      
      .section {
        padding: 20px;
      }
      
      .chart-grid, .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .meta {
        grid-template-columns: 1fr;
      }
      
      .file-tree {
        font-size: 0.8em;
        max-height: 400px;
      }
    }
    
    /* 打印样式 */
    @media print {
      #particles-js {
        display: none;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .tree-controls {
        display: none;
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
        <div class="value">v2.10.0</div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📈 核心统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">📁 统计文件</div>
          <div class="value">${formatNumber(stats.files.total)}</div>
        </div>
        <div class="stat-card">
          <div class="label">📝 总字符数</div>
          <div class="value">${formatNumber(stats.text.totalChars)}</div>
          <div class="label" style="margin-top: 8px; font-size: 0.8em;">${formatSize(stats.text.totalChars)}</div>
        </div>
        <div class="stat-card">
          <div class="label">📊 代码行数</div>
          <div class="value">${formatNumber(stats.code.totalLines)}</div>
        </div>
        <div class="stat-card">
          <div class="label">🎯 估算 Tokens</div>
          <div class="value">${formatNumber(stats.tokens.estimated)}</div>
        </div>
      </div>
      
      ${Object.keys(stats.languageStats || {}).length > 0 ? `
      <div style="margin-top: 30px;">
        <h3 style="color: #00d4ff; font-size: 1.5em; margin-bottom: 20px; padding-left: 10px; border-left: 4px solid #00d4ff;">
          🔥 主要语言详情
        </h3>
        <div class="stats-grid">
          ${Object.entries(stats.languageStats)
            .sort((a, b) => b[1].totalLines - a[1].totalLines)
            .slice(0, 6)
            .map(([lang, langStats]) => `
              <div class="stat-card" style="background: linear-gradient(135deg, #1a0f3a 0%, #0f1729 100%);">
                <div class="label" style="color: #c770f0; font-size: 1.1em; font-weight: 700;">${lang}</div>
                <div class="value" style="font-size: 2em;">${formatNumber(langStats.totalLines)}</div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0, 212, 255, 0.2); display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 0.85em;">
                  <div>
                    <div style="color: #888;">文件</div>
                    <div style="color: #00ff88; font-weight: 600;">${langStats.files}</div>
                  </div>
                  <div>
                    <div style="color: #888;">大小</div>
                    <div style="color: #00d4ff; font-weight: 600;">${formatSize(langStats.totalChars)}</div>
                  </div>
                  <div>
                    <div style="color: #888;">代码</div>
                    <div style="color: #00ff88; font-weight: 600;">${formatNumber(langStats.codeLines)}</div>
                  </div>
                  <div>
                    <div style="color: #888;">注释</div>
                    <div style="color: #00d4ff; font-weight: 600;">${formatNumber(langStats.commentLines)}</div>
                  </div>
                </div>
              </div>
            `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="section">
      <h2 class="section-title">📊 数据可视化</h2>
      <div class="chart-grid">
        <div class="chart-container">
          <h3>语言分布（文件数）</h3>
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
    
    ${Object.keys(stats.languageStats || {}).length > 0 ? `
    <div class="section">
      <h2 class="section-title">🔥 语言代码量对比</h2>
      <div class="chart-container" style="padding: 30px;">
        <div class="chart-wrapper" style="height: 400px;">
          <canvas id="languageCodeChart"></canvas>
        </div>
      </div>
      <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 10px; border: 1px solid rgba(0, 255, 136, 0.3);">
        <p style="color: #00ff88; font-weight: 600; margin-bottom: 8px;">📊 图表说明</p>
        <p style="color: #888; font-size: 0.9em; line-height: 1.6;">
          • 此图展示各编程语言的代码量分布<br>
          • 深色部分为代码行，浅色为注释行，灰色为空白行<br>
          • 帮助快速识别项目的主要语言构成
        </p>
      </div>
    </div>
    ` : ''}
    
    ${trendData && trendData.totalLines && trendData.totalLines.length > 1 ? `
    <div class="section">
      <h2 class="section-title">📈 历史趋势分析</h2>
      <div class="chart-grid">
        <div class="chart-container">
          <h3>代码行数趋势</h3>
          <div class="chart-wrapper">
            <canvas id="trendLinesChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3>文件数量趋势</h3>
          <div class="chart-wrapper">
            <canvas id="trendFilesChart"></canvas>
          </div>
        </div>
        <div class="chart-container">
          <h3>Token估算趋势</h3>
          <div class="chart-wrapper">
            <canvas id="trendTokensChart"></canvas>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; padding: 15px; background: rgba(0, 255, 136, 0.1); border-radius: 10px; border: 1px solid rgba(0, 255, 136, 0.3);">
        <p style="color: #00ff88; font-weight: 600; margin-bottom: 8px;">💡 趋势分析说明</p>
        <p style="color: #888; font-size: 0.9em; line-height: 1.6;">
          • 显示最近 ${trendData.length} 次统计结果的变化趋势<br>
          • 每次运行统计工具都会自动记录历史数据<br>
          • 历史记录保存在 <code style="color: #00d4ff;">results/history.json</code>
        </p>
      </div>
    </div>
    ` : ''}
    
    <div class="section">
      <h2 class="section-title">🌳 项目结构</h2>
      <div id="fileTree" class="file-tree"></div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📋 语言详细统计</h2>
      <div style="overflow-x: auto;">
        <table>
          <thead>
            <tr>
              <th>语言</th>
              <th>文件数</th>
              <th>总字符</th>
              <th>总行数</th>
              <th>代码行</th>
              <th>注释行</th>
              <th>空白行</th>
              <th>代码率</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(stats.languageStats || {})
              .sort((a, b) => b[1].totalLines - a[1].totalLines)
              .map(([lang, langStats]) => {
                const codeRate = langStats.totalLines > 0
                  ? ((langStats.codeLines / langStats.totalLines) * 100).toFixed(1)
                  : '0.0';
                return `
                  <tr>
                    <td><strong>${lang}</strong></td>
                    <td>${formatNumber(langStats.files)}</td>
                    <td>${formatSize(langStats.totalChars)}</td>
                    <td>${formatNumber(langStats.totalLines)}</td>
                    <td style="color: #00ff88;">${formatNumber(langStats.codeLines)}</td>
                    <td style="color: #00d4ff;">${formatNumber(langStats.commentLines)}</td>
                    <td style="color: #888;">${formatNumber(langStats.blankLines)}</td>
                    <td><span style="color: ${codeRate > 70 ? '#00ff88' : codeRate > 50 ? '#ffd700' : '#ff6b9d'};">${codeRate}%</span></td>
                  </tr>
                `;
              }).join('')}
          </tbody>
        </table>
      </div>
      
      <div style="margin-top: 30px; padding: 15px; background: rgba(199, 112, 240, 0.1); border-radius: 10px; border: 1px solid rgba(199, 112, 240, 0.3);">
        <p style="color: #c770f0; font-weight: 600; margin-bottom: 8px;">💡 数据说明</p>
        <p style="color: #888; font-size: 0.9em; line-height: 1.6;">
          • <strong style="color: #00ff88;">代码行</strong>: 实际包含代码的行数<br>
          • <strong style="color: #00d4ff;">注释行</strong>: 代码注释和文档<br>
          • <strong style="color: #888;">空白行</strong>: 提升可读性的空行<br>
          • <strong>代码率</strong>: 代码行占总行数的百分比（绿色>70%，黄色>50%，粉色≤50%）
        </p>
      </div>
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
      由项目统计工具 v2.10.0 自动生成 | ${timestamp} | 🌙 Night Theme - 代码质量优化版
    </div>
  </div>
  
  <script>
    // 粒子背景初始化（包含兼容性检查）
    if (typeof particlesJS !== 'undefined' && particlesJS !== null) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#00ff88', '#00d4ff', '#c770f0'] },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
          size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.5 } },
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
    } else {
      // 静默跳过粒子背景初始化（库未加载）
      console.info('ℹ️ particlesJS 库未加载，跳过粒子背景效果');
    }
    
    // Chart.js 全局配置
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 14, 39, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#00ff88';
    Chart.defaults.plugins.tooltip.bodyColor = '#e0e0e0';
    Chart.defaults.plugins.tooltip.borderColor = '#00d4ff';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 12;
    
    // 动画配置
    const animationConfig = {
      duration: 1500,
      easing: 'easeInOutQuart'
    };
    
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
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return \`\${label}: \${value} 个 (\${percentage}%)\`;
              }
            }
          }
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
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return \`\${label}: \${value.toLocaleString()} 行\`;
              }
            }
          }
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
        animation: animationConfig,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed.y || 0;
                return \`Tokens: \${value.toLocaleString()}\`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          },
          x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
      }
    });
    
    // 语言代码量对比图（堆叠柱状图）
    ${Object.keys(stats.languageStats || {}).length > 0 ? `
    const languageStatsData = ${JSON.stringify(stats.languageStats)};
    const languageNames = Object.keys(languageStatsData).sort((a, b) =>
      languageStatsData[b].totalLines - languageStatsData[a].totalLines
    );
    
    new Chart(document.getElementById('languageCodeChart'), {
      type: 'bar',
      data: {
        labels: languageNames,
        datasets: [
          {
            label: '代码行',
            data: languageNames.map(lang => languageStatsData[lang].codeLines),
            backgroundColor: '#00ff88',
            borderColor: '#00ff88',
            borderWidth: 1
          },
          {
            label: '注释行',
            data: languageNames.map(lang => languageStatsData[lang].commentLines),
            backgroundColor: '#00d4ff',
            borderColor: '#00d4ff',
            borderWidth: 1
          },
          {
            label: '空白行',
            data: languageNames.map(lang => languageStatsData[lang].blankLines),
            backgroundColor: '#666',
            borderColor: '#666',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationConfig,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 13, weight: '600' },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return \`\${label}: \${value.toLocaleString()} 行\`;
              },
              footer: function(tooltipItems) {
                let total = 0;
                tooltipItems.forEach(item => {
                  total += item.parsed.y;
                });
                return '总计: ' + total.toLocaleString() + ' 行';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              color: '#e0e0e0',
              font: { size: 11 }
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              color: '#e0e0e0',
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });
    ` : ''}
    
    // 趋势图表（如果有历史数据）
    ${trendData && trendData.totalLines && trendData.totalLines.length > 1 ? `
    const trendData = ${JSON.stringify(trendData)};
    
    // 趋势图通用配置
    const trendChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: animationConfig,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(context) {
              const item = trendData.totalLines[context[0].dataIndex];
              return item.tag ? \`\${item.label} [\${item.tag}]\` : item.label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    };
    
    // 代码行数趋势图
    new Chart(document.getElementById('trendLinesChart'), {
      type: 'line',
      data: {
        labels: trendData.totalLines.map(d => d.label),
        datasets: [{
          label: '总行数',
          data: trendData.totalLines.map(d => d.value),
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#00ff88',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    
    // 文件数量趋势图
    new Chart(document.getElementById('trendFilesChart'), {
      type: 'line',
      data: {
        labels: trendData.files.map(d => d.label),
        datasets: [{
          label: '文件数',
          data: trendData.files.map(d => d.value),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#00d4ff',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    
    // Token 估算趋势图
    new Chart(document.getElementById('trendTokensChart'), {
      type: 'line',
      data: {
        labels: trendData.tokens.map(d => d.label),
        datasets: [{
          label: 'Tokens',
          data: trendData.tokens.map(d => d.value),
          borderColor: '#c770f0',
          backgroundColor: 'rgba(199, 112, 240, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#c770f0',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    ` : ''}
    
    // 文件树渲染（增强版 - 支持折叠/展开）
    let expandedFolders = new Set();
    let fileCount = 0;
    let folderCount = 0;
    
    function renderTree(node, level = 0, parentPath = '') {
      if (!node) return '';
      
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      const indent = '  '.repeat(level);
      let html = '';
      
      if (node.type === 'directory') {
        folderCount++;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedFolders.has(currentPath);
        const expandIcon = hasChildren ? (isExpanded ? '▼' : '▶') : '○';
        const itemClass = hasChildren ? 'tree-folder clickable' : 'tree-folder';
        
        html += \`<div class="tree-item \${itemClass}" data-path="\${currentPath}" onclick="toggleFolder(this, '\${currentPath}')">\`;
        html += \`\${indent}\${expandIcon} 📁 \${node.name}\`;
        if (hasChildren) {
          html += \` <span class="tree-count">(\${node.children.length})</span>\`;
        }
        html += \`</div>\`;
        
        if (hasChildren) {
          const childrenClass = isExpanded ? 'tree-children expanded' : 'tree-children collapsed';
          html += \`<div class="\${childrenClass}">\`;
          node.children
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            })
            .forEach(child => {
              html += renderTree(child, level + 1, currentPath);
            });
          html += '</div>';
        }
      } else {
        fileCount++;
        const ext = node.ext || '';
        const sizeLabel = node.size ? formatBytes(node.size) : '';
        html += \`<div class="tree-item tree-file" title="\${currentPath}">\`;
        html += \`\${indent}📄 \${node.name}\`;
        if (sizeLabel) {
          html += \` <span class="tree-size">\${sizeLabel}</span>\`;
        }
        html += \`</div>\`;
      }
      
      return html;
    }
    
    function toggleFolder(element, path) {
      if (expandedFolders.has(path)) {
        expandedFolders.delete(path);
      } else {
        expandedFolders.add(path);
      }
      refreshTree();
    }
    
    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + 'B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
      return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    }
    
    function refreshTree() {
      fileCount = 0;
      folderCount = 0;
      document.getElementById('fileTree').innerHTML = renderTree(fileTreeData);
      updateTreeStats();
    }
    
    function updateTreeStats() {
      const statsHtml = \`<div class="tree-stats">📊 \${folderCount} 个文件夹, \${fileCount} 个文件</div>\`;
      const existingStats = document.querySelector('.tree-stats');
      if (existingStats) {
        existingStats.innerHTML = statsHtml;
      } else {
        document.getElementById('fileTree').insertAdjacentHTML('beforebegin', statsHtml);
      }
    }
    
    function expandAll() {
      function collectAllPaths(node, parentPath = '') {
        const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
        if (node.type === 'directory' && node.children && node.children.length > 0) {
          expandedFolders.add(currentPath);
          node.children.forEach(child => collectAllPaths(child, currentPath));
        }
      }
      collectAllPaths(fileTreeData);
      refreshTree();
    }
    
    function collapseAll() {
      expandedFolders.clear();
      refreshTree();
    }
    
    // 初始化文件树数据
    const fileTreeData = ${JSON.stringify(fileTreeData)};
    
    // 默认展开根目录
    expandedFolders.add(fileTreeData.name);
    
    // 渲染树
    refreshTree();
    
    // 添加控制按钮
    const treeControls = \`
      <div class="tree-controls">
        <button onclick="expandAll()" class="tree-btn">全部展开</button>
        <button onclick="collapseAll()" class="tree-btn">全部折叠</button>
      </div>
    \`;
    document.getElementById('fileTree').insertAdjacentHTML('beforebegin', treeControls);
  </script>
</body>
</html>`;
};