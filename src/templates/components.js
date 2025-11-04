/**
 * Night Theme HTML 组件模块 v2.11.0
 * 可复用的UI组件生成器
 */

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
    <h1>🌙 ${projectName}</h1>
    <div class="subtitle">${subtitle}</div>
  </div>`;
}

/**
 * 生成Meta信息卡片
 */
function generateMetaCards(timestamp, projectType) {
  return `
  <div class="meta">
    <div class="meta-item">
      <div class="label">生成时间</div>
      <div class="value">${timestamp}</div>
    </div>
    <div class="meta-item">
      <div class="label">项目类型</div>
      <div class="value">${projectType}</div>
    </div>
    <div class="meta-item">
      <div class="label">工具版本</div>
      <div class="value">v2.11.0</div>
    </div>
  </div>`;
}

/**
 * 生成核心统计卡片区域
 */
function generateCoreStats(stats, formatNumber, formatSize, languageStats) {
  let html = `
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
    </div>`;
  
  // 如果有语言详细统计，添加语言详情卡片
  if (Object.keys(languageStats).length > 0) {
    html += `
    <div style="margin-top: 30px;">
      <h3 style="color: #00d4ff; font-size: 1.5em; margin-bottom: 20px; padding-left: 10px; border-left: 4px solid #00d4ff;">
        🔥 主要语言详情
      </h3>
      <div class="stats-grid">
        ${Object.entries(languageStats)
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
    </div>`;
  }
  
  html += `
  </div>`;
  
  return html;
}

/**
 * 生成可视化图表区域
 */
function generateChartSection() {
  return `
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
  </div>`;
}

/**
 * 生成语言代码量对比图区域
 */
function generateLanguageCodeChart(hasLanguageStats) {
  if (!hasLanguageStats) return '';
  
  return `
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
  </div>`;
}

/**
 * 生成历史趋势分析区域
 */
function generateTrendSection(hasTrendData, trendDataLength) {
  if (!hasTrendData) return '';
  
  return `
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
        • 显示最近 ${trendDataLength} 次统计结果的变化趋势<br>
        • 每次运行统计工具都会自动记录历史数据<br>
        • 历史记录保存在 <code style="color: #00d4ff;">results/history.json</code>
      </p>
    </div>
  </div>`;
}

/**
 * 生成项目结构区域
 */
function generateFileTreeSection() {
  return `
  <div class="section">
    <h2 class="section-title">🌳 项目结构</h2>
    <div id="fileTree" class="file-tree"></div>
  </div>`;
}

/**
 * 生成语言详细统计表格
 */
function generateLanguageStatsTable(languageStats, formatNumber, formatSize) {
  return `
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
          ${Object.entries(languageStats)
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
  </div>`;
}

/**
 * 生成复杂度分析区域
 */
function generateComplexitySection(stats, formatNumber, formatSize) {
  return `
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
  </div>`;
}

/**
 * 生成页脚
 */
function generateFooter(timestamp) {
  return `
  <div class="footer">
    由项目统计工具 v2.11.0 自动生成 | ${timestamp} | 🌙 Night Theme - 模块化优化版
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
  generateFooter
};