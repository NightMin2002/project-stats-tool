/**
 * Night Theme HTML 组件模块 v3.0.0
 * 全面升级：SVG 图标集成、现代化布局结构
 */

// ================= SVG ICONS =================
const ICONS = {
  // Common
  calendar: `<svg class="icon" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>`,
  tag: `<svg class="icon" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>`,
  info: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
  
  // Stats
  files: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>`,
  chars: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z"/></svg>`,
  code: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>`,
  tokens: `<svg class="icon icon-lg" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L12 14.17l3.59-3.59L17 12l-5 5z"/></svg>`,
  
  // Charts
  chartPie: `<svg class="icon" viewBox="0 0 24 24"><path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z"/></svg>`,
  chartBar: `<svg class="icon" viewBox="0 0 24 24"><path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/><path d="M19 19H5V5h14v14z" fill="none"/></svg>`,
  chartLine: `<svg class="icon" viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>`,
  
  // Tree
  folder: `<svg class="icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`,
  file: `<svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>`,
  expand: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>`,
  collapse: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>`,

  // Comparison
  trendUp: `<svg class="icon" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>`,
  trendDown: `<svg class="icon" viewBox="0 0 24 24"><path d="M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"/></svg>`,
  trendFlat: `<svg class="icon" viewBox="0 0 24 24"><path d="M22 12l-4-4v3H3v2h15v3z"/></svg>`,
  history: `<svg class="icon" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>`,

  // Misc
  complexity: `<svg class="icon" viewBox="0 0 24 24"><path d="M13.5 2c-1.93 0-3.5 1.57-3.5 3.5H8v10h2v3.5c0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5V5.5c0-1.93-1.57-3.5-3.5-3.5zm0 17c-1.1 0-2-.9-2-2v-3.5h4V17c0 1.1-.9 2-2 2zm0-7.5h-2v-4h4v4zm0-6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>`,
  menu: `<svg class="icon" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>`
};

/**
 * 生成HTML文档头部
 */
function generateHead(projectName, libs) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🌙 ${projectName} - 项目统计报告</title>
  ${libs.chartJs ? `<script>${libs.chartJs}</script>` : '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>'}
  ${libs.particlesJs ? `<script>${libs.particlesJs}</script>` : '<script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js"></script>'}
  <style><!-- STYLES_PLACEHOLDER --></style>
</head>`;
}

/**
 * 生成页面头部区域
 */
function generateHeader(projectName, subtitle = '项目统计可视化报告 · Night Theme') {
  return `
  <div class="header">
    <div class="moon-container">
      <div class="moon">
        <div class="crater crater-1"></div>
        <div class="crater crater-2"></div>
        <div class="crater crater-3"></div>
      </div>
    </div>
    <div class="header-content">
      <h1>
        ${ICONS.code} ${projectName}
      </h1>
      <div class="subtitle">
        ${ICONS.chartLine} ${subtitle}
      </div>
    </div>
  </div>`;
}

/**
 * 生成Meta信息卡片
 */
function generateMetaCards(timestamp, projectType) {
  return `
  <div class="meta-grid">
    <div class="meta-card">
      <div class="meta-icon-wrapper">${ICONS.calendar}</div>
      <div class="meta-content">
        <div class="meta-label">生成时间</div>
        <div class="meta-value">${timestamp}</div>
      </div>
    </div>
    <div class="meta-card">
      <div class="meta-icon-wrapper">${ICONS.tag}</div>
      <div class="meta-content">
        <div class="meta-label">项目类型</div>
        <div class="meta-value">${projectType}</div>
      </div>
    </div>
    <div class="meta-card">
      <div class="meta-icon-wrapper">${ICONS.info}</div>
      <div class="meta-content">
        <div class="meta-label">工具版本</div>
        <div class="meta-value">v3.0.0</div>
      </div>
    </div>
  </div>`;
}

/**
 * 生成历史对比分析区域
 */
function generateComparisonSection(comparison, formatNumber) {
  if (!comparison || comparison.isFirstRun || !comparison.comparison) {
    return '';
  }

  const previousLabel = new Date(comparison.previousTime).toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  const metrics = [
    { key: 'files', label: '文件数' },
    { key: 'totalLines', label: '总行数' },
    { key: 'codeLines', label: '代码行' },
    { key: 'tokens', label: 'Tokens' }
  ];

  const cardsHtml = metrics.map(({ key, label }) => {
    const change = comparison.comparison[key];
    if (!change) return '';

    const trendClass = change.trend === 'up' ? 'diff-up' : change.trend === 'down' ? 'diff-down' : 'diff-flat';
    const trendIcon = change.trend === 'up' ? ICONS.trendUp : change.trend === 'down' ? ICONS.trendDown : ICONS.trendFlat;

    return `
      <div class="comp-card">
        <div class="comp-header">
          ${label}
        </div>
        <div class="comp-diff ${trendClass}">
          ${trendIcon}
          <span>${change.diffFormatted}</span>
          <span style="font-size: 0.8em; opacity: 0.8;">(${change.rateFormatted})</span>
        </div>
        <div style="font-size: 0.8em; color: var(--text-secondary); display: flex; justify-content: space-between;">
          <span>前: ${formatNumber(change.old)}</span>
          <span>现: ${formatNumber(change.new)}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
  <div class="section" id="comparisonSection">
    <div class="section-header">
      <h2 class="section-title">${ICONS.history} 历史对比分析</h2>
      <button id="toggleComparisonBtn" class="btn btn-primary">隐藏对比</button>
    </div>
    <div class="meta-label" style="margin-bottom: 1rem;">
      对比基准: <span style="color: var(--accent-secondary);">${previousLabel}</span>
      ${comparison.previousTag ? `<span class="tag">#${comparison.previousTag}</span>` : ''}
    </div>
    <div id="comparisonContent">
      <div class="comparison-grid">
        ${cardsHtml}
      </div>
    </div>
  </div>`;
}

/**
 * 生成核心统计卡片区域
 */
function generateCoreStats(stats, formatNumber, formatSize, languageStats) {
  let html = `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.chartBar} 核心统计</h2>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">${ICONS.files}</div>
          <div class="stat-label">文件统计</div>
        </div>
        <div class="stat-value">${formatNumber(stats.files.total)}</div>
        <div class="stat-sub">总计文件数量</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">${ICONS.chars}</div>
          <div class="stat-label">总字符数</div>
        </div>
        <div class="stat-value">${formatNumber(stats.text.totalChars)}</div>
        <div class="stat-sub">${formatSize(stats.text.totalChars)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">${ICONS.code}</div>
          <div class="stat-label">代码行数</div>
        </div>
        <div class="stat-value">${formatNumber(stats.code.totalLines)}</div>
        <div class="stat-sub">有效代码行</div>
      </div>
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon">${ICONS.tokens}</div>
          <div class="stat-label">估算 Tokens</div>
        </div>
        <div class="stat-value">${formatNumber(stats.tokens.estimated)}</div>
        <div class="stat-sub">AI 上下文开销</div>
      </div>
    </div>`;
  
  // 语言详细统计卡片
  if (Object.keys(languageStats).length > 0) {
    html += `
    <h3 style="margin: 2rem 0 1rem; color: var(--accent-secondary); font-size: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
      ${ICONS.menu} 主要语言详情
    </h3>
    <div class="lang-detail-grid">
      ${Object.entries(languageStats)
        .sort((a, b) => b[1].totalLines - a[1].totalLines)
        .slice(0, 6)
        .map(([lang, langStats]) => `
          <div class="lang-card">
            <div class="lang-header">
              <div class="lang-name">${lang}</div>
              <div style="font-size: 0.85rem; color: var(--text-secondary);">${formatNumber(langStats.files)} 文件</div>
            </div>
            <div class="lang-stats">
              <div class="lang-stat-item">
                <span class="lang-stat-label">代码行</span>
                <span class="lang-stat-val" style="color: var(--accent-primary);">${formatNumber(langStats.codeLines)}</span>
              </div>
              <div class="lang-stat-item">
                <span class="lang-stat-label">注释行</span>
                <span class="lang-stat-val" style="color: var(--accent-secondary);">${formatNumber(langStats.commentLines)}</span>
              </div>
              <div class="lang-stat-item">
                <span class="lang-stat-label">大小</span>
                <span class="lang-stat-val" style="color: var(--text-secondary);">${formatSize(langStats.totalChars)}</span>
              </div>
            </div>
          </div>
        `).join('')}
    </div>`;
  }
  
  html += `</div>`;
  return html;
}

/**
 * 生成可视化图表区域
 */
function generateChartSection() {
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.chartPie} 数据可视化</h2>
    </div>
    <div class="chart-grid">
      <div class="chart-container">
        <div class="chart-title">语言分布（文件数）</div>
        <div class="chart-wrapper">
          <canvas id="languageChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">代码组成</div>
        <div class="chart-wrapper">
          <canvas id="codeChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">Token 分布</div>
        <div class="chart-wrapper">
          <canvas id="tokenChart"></canvas>
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * 生成语言代码量对比图区域
 */
function generateLanguageCodeChart(hasLanguageStats) {
  if (!hasLanguageStats) return '';
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.chartBar} 语言代码量对比</h2>
    </div>
    <div class="chart-container" style="height: 500px;">
      <div class="chart-wrapper" style="height: 100%;">
        <canvas id="languageCodeChart"></canvas>
      </div>
    </div>
  </div>`;
}

/**
 * 生成历史趋势分析区域
 */
function generateTrendSection(hasTrendData, trendDataLength) {
  if (!hasTrendData) return '';
  
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.trendUp} 历史趋势分析 (最近 ${trendDataLength} 次)</h2>
    </div>
    <div class="chart-grid">
      <div class="chart-container">
        <div class="chart-title">代码行数趋势</div>
        <div class="chart-wrapper">
          <canvas id="trendLinesChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">文件数量趋势</div>
        <div class="chart-wrapper">
          <canvas id="trendFilesChart"></canvas>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-title">Token估算趋势</div>
        <div class="chart-wrapper">
          <canvas id="trendTokensChart"></canvas>
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * 生成项目结构区域
 */
function generateFileTreeSection() {
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.folder} 项目结构</h2>
      <div class="tree-controls">
        <button onclick="expandAll()" class="btn">全部展开</button>
        <button onclick="collapseAll()" class="btn">全部折叠</button>
      </div>
    </div>
    <div class="tree-stats" style="margin-bottom: 1rem; color: var(--text-secondary);">
      <!-- populated by js -->
    </div>
    <div id="fileTree" class="file-tree-container"></div>
  </div>`;
}

/**
 * 生成语言详细统计表格
 */
function generateLanguageStatsTable(languageStats, formatNumber, formatSize) {
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.menu} 语言详细统计表</h2>
    </div>
    <div class="table-container">
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
          ${Object.entries(languageStats)
            .sort((a, b) => b[1].totalLines - a[1].totalLines)
            .map(([lang, langStats]) => {
              const codeRate = langStats.totalLines > 0
                ? ((langStats.codeLines / langStats.totalLines) * 100).toFixed(1)
                : '0.0';
              
              let rateClass = 'rate-low';
              if (codeRate > 70) rateClass = 'rate-high';
              else if (codeRate > 50) rateClass = 'rate-mid';

              return `
                <tr>
                  <td style="font-weight: 600; color: var(--accent-tertiary);">${lang}</td>
                  <td>${formatNumber(langStats.files)}</td>
                  <td>${formatSize(langStats.totalChars)}</td>
                  <td>${formatNumber(langStats.totalLines)}</td>
                  <td style="color: var(--accent-primary);">${formatNumber(langStats.codeLines)}</td>
                  <td style="color: var(--accent-secondary);">${formatNumber(langStats.commentLines)}</td>
                  <td style="color: var(--text-secondary);">${formatNumber(langStats.blankLines)}</td>
                  <td><span class="rate-badge ${rateClass}">${codeRate}%</span></td>
                </tr>
              `;
            }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

/**
 * 生成复杂度分析区域
 */
function generateComplexitySection(stats, formatNumber, formatSize) {
  return `
  <div class="section">
    <div class="section-header">
      <h2 class="section-title">${ICONS.complexity} 复杂度分析</h2>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">平均行长度</div>
        <div class="stat-value">${stats.complexity.avgLineLength}</div>
        <div class="stat-sub">字符/行</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均文件大小</div>
        <div class="stat-value">${formatSize(stats.complexity.avgFileSize)}</div>
        <div class="stat-sub">每文件</div>
      </div>
      <div class="stat-card" style="grid-column: span 2;">
        <div class="stat-label">最大文件</div>
        <div class="stat-value" style="font-size: 1.5rem; word-break: break-all;">${stats.files.largest.path}</div>
        <div class="stat-sub">
          <span style="color: var(--accent-primary);">${formatNumber(stats.files.largest.lines)} 行</span>
        </div>
      </div>
    </div>
  </div>`;
}

/**
 * 生成页脚
 */
function generateFooter(timestamp) {
  return `
  <div class="footer">
    由项目统计工具 v3.0.0 自动生成 | ${timestamp} | 🌙 Night Theme V3
  </div>`;
}

module.exports = {
  generateHead,
  generateHeader,
  generateMetaCards,
  generateCoreStats,
  generateChartSection,
  generateLanguageCodeChart,
  generateTrendSection,
  generateFileTreeSection,
  generateLanguageStatsTable,
  generateComplexitySection,
  generateComparisonSection,
  generateFooter,
  ICONS // 导出 ICONS 供 scripts.js 可能使用 (如果需要动态插入)
};