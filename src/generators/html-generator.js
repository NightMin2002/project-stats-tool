/**
 * HTML 报告生成器模块
 * 负责生成 HTML 可视化报告
 */

const fs = require('fs');
const path = require('path');
const { formatNumber, formatSize } = require('../utils/formatters');

/**
 * 生成 HTML 可视化报告
 * @param {object} stats - 统计数据对象
 * @param {object} fileTreeData - 文件树数据
 * @param {object} historyManager - 历史管理器实例
 * @returns {string} HTML 报告内容
 */
function generateHTMLReport(stats, fileTreeData, historyManager) {
  console.log('\n🎨 正在生成 HTML 可视化报告...');
  
  // 读取本地库文件
  const chartJs = fs.existsSync(path.join(__dirname, '../../lib/chart.min.js'))
    ? fs.readFileSync(path.join(__dirname, '../../lib/chart.min.js'), 'utf8')
    : '';
  const particlesJs = fs.existsSync(path.join(__dirname, '../../lib/particles.min.js'))
    ? fs.readFileSync(path.join(__dirname, '../../lib/particles.min.js'), 'utf8')
    : '';
  
  // 引入外部模板函数
  const generateEnhancedHTML = require('../html-report-template.js');
  
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // 生成趋势数据
  let trendData = null;
  if (historyManager && historyManager.getRecordCount() >= 2) {
    trendData = {
      totalLines: historyManager.generateTrendData('totalLines', 10),
      files: historyManager.generateTrendData('files', 10),
      tokens: historyManager.generateTrendData('tokens', 10),
      codeLines: historyManager.generateTrendData('codeLines', 10)
    };
  }
  
  return generateEnhancedHTML(stats, timestamp, fileTreeData, formatNumber, formatSize, {
    chartJs,
    particlesJs
  }, trendData);
}

module.exports = {
  generateHTMLReport
};