/**
 * HTML 报告模板生成器 v2.11.0 (模块化版本)
 *
 * 🆕 v2.11.0 新增:
 * - 完全模块化架构（CSS/JS/组件分离）
 * - 全局禁止文字选中（user-select: none）
 * - 保留代码区域可选中功能
 * - 优化Night Theme美观度
 * - 改进交互动画效果
 *
 * 📂 模块结构:
 * - templates/styles.css.js - 完整CSS样式
 * - templates/scripts.js - JavaScript逻辑
 * - templates/components.js - HTML组件
 *
 * @param {Object} stats - 完整的统计数据对象
 * @param {string} timestamp - 生成时间戳
 * @param {Object} fileTreeData - 文件树数据
 * @param {Function} formatNumber - 数字格式化函数
 * @param {Function} formatSize - 文件大小格式化函数
 * @param {Object} options - 可选配置对象
 * @param {Object} [options.libs] - 内嵌的第三方库（Chart.js, Particles.js）
 * @param {Object|null} [options.trendData] - 历史趋势数据
 * @param {Object|null} [options.comparisonData] - 历史对比数据
 * @returns {string} 完整的 HTML 报告字符串
 */

// 导入所有模块
const styles = require('./templates/styles.css.js');
const generateScripts = require('./templates/scripts.js');
const {
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
  generateFooter
} = require('./templates/components.js');

module.exports = function generateEnhancedHTML(
  stats,
  timestamp,
  fileTreeData,
  formatNumber,
  formatSize,
  options = {}
) {
  const {
    libs = {},
    trendData = null,
    comparisonData = null
  } = options;
  // 准备数据
  const projectName = stats.project.name;
  const projectType = stats.project.type;
  const hasLanguageStats = Object.keys(stats.languageStats || {}).length > 0;
  const hasTrendData = (trendData?.totalLines?.length || 0) > 1;
  
  // 生成各个部分
  const headSection = generateHead(projectName, libs);
  const headerSection = generateHeader(projectName);
  const metaSection = generateMetaCards(timestamp, projectType);
  const coreStatsSection = generateCoreStats(stats, formatNumber, formatSize, stats.languageStats || {});
  const chartSection = generateChartSection();
  const languageCodeSection = generateLanguageCodeChart(hasLanguageStats);
  const trendSection = generateTrendSection(hasTrendData, hasTrendData ? trendData.totalLines.length : 0);
  const fileTreeSection = generateFileTreeSection();
  const languageTableSection = generateLanguageStatsTable(stats.languageStats || {}, formatNumber, formatSize);
  const complexitySection = generateComplexitySection(stats, formatNumber, formatSize);
  const comparisonSection = generateComparisonSection(comparisonData, formatNumber);
  const footerSection = generateFooter(timestamp);
  
  // 生成JavaScript脚本
  const scripts = generateScripts(stats, fileTreeData, trendData);
  
  // 组装完整HTML
  const html = `${headSection}
<body>
  <div id="particles-js"></div>
  
  <div class="container">
    ${headerSection}
    ${metaSection}
    ${comparisonSection}
    ${coreStatsSection}
    ${chartSection}
    ${languageCodeSection}
    ${trendSection}
    ${fileTreeSection}
    ${languageTableSection}
    ${complexitySection}
    ${footerSection}
  </div>
  
  <script>
    ${scripts}
  </script>
</body>
</html>`;

  // 将CSS样式插入到占位符位置
  return html.replace('<!-- STYLES_PLACEHOLDER -->', styles);
};