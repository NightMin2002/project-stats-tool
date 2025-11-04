/**
 * 统计计算模块
 * 提供复杂度分析和 tokens 估算功能
 */

const fs = require('fs');
const path = require('path');

/**
 * 计算复杂度指标
 * @param {object} stats - 统计数据对象
 */
function calculateComplexity(stats) {
  // 计算平均行长度（安全的除法操作）
  if (stats.code.totalLines > 0 && stats.text.codeChars >= 0) {
    stats.complexity.avgLineLength = Math.round(stats.text.codeChars / stats.code.totalLines);
  } else {
    stats.complexity.avgLineLength = 0;
  }
  
  // 计算平均文件大小（安全的除法操作）
  if (stats.files.total > 0 && stats.text.totalChars >= 0) {
    stats.complexity.avgFileSize = Math.round(stats.text.totalChars / stats.files.total);
  } else {
    stats.complexity.avgFileSize = 0;
  }
}

/**
 * 计算 tokens 估算
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 */
function calculateTokens(stats, config) {
  const { chineseCharPerToken, englishWordPerToken, codeCharPerToken } = config.tokenEstimate;
  
  // 确保除数不为零
  const safeChinesePerToken = chineseCharPerToken > 0 ? chineseCharPerToken : 1.5;
  const safeEnglishPerToken = englishWordPerToken > 0 ? englishWordPerToken : 1.3;
  const safeCodePerToken = codeCharPerToken > 0 ? codeCharPerToken : 3.5;
  
  stats.tokens.breakdown.fromChinese = Math.ceil(stats.text.chineseChars / safeChinesePerToken);
  stats.tokens.breakdown.fromEnglish = Math.ceil(stats.text.englishWords / safeEnglishPerToken);
  stats.tokens.breakdown.fromCode = Math.ceil(stats.text.codeChars / safeCodePerToken);
  
  stats.tokens.estimated =
    stats.tokens.breakdown.fromChinese +
    stats.tokens.breakdown.fromEnglish +
    stats.tokens.breakdown.fromCode;
}

/**
 * 检测项目类型
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @returns {string} 项目类型
 */
function detectProjectType(stats, config) {
  const indicators = {
    'package.json': 'Node.js/JavaScript',
    'requirements.txt': 'Python',
    'go.mod': 'Go',
    'Cargo.toml': 'Rust',
    'pom.xml': 'Java/Maven',
    'build.gradle': 'Java/Gradle',
    'composer.json': 'PHP',
    'Gemfile': 'Ruby'
  };
  
  for (const [file, type] of Object.entries(indicators)) {
    if (fs.existsSync(path.join(config.rootDir, file))) {
      return type;
    }
  }
  
  const totalFiles = stats.files.byType;
  const jsCount = (totalFiles['.js'] || 0) + (totalFiles['.jsx'] || 0);
  const tsCount = (totalFiles['.ts'] || 0) + (totalFiles['.tsx'] || 0);
  const pyCount = totalFiles['.py'] || 0;
  
  if (jsCount > 0 || tsCount > 0) return 'Web/Frontend';
  if (pyCount > 0) return 'Python';
  
  return 'Mixed/Other';
}

module.exports = {
  calculateComplexity,
  calculateTokens,
  detectProjectType
};