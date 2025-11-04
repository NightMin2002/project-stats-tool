/**
 * 文本报告生成器模块
 * 提供 Markdown 报告、文件列表和完整文字提取功能
 */

const fs = require('fs');
const path = require('path');
const { LANGUAGE_MAP } = require('../config');
const { formatNumber, formatSize } = require('../utils/formatters');
const { getVersion } = require('../version');

/**
 * 生成 Markdown 报告
 * @param {object} stats - 统计数据对象
 * @returns {string} Markdown 报告内容
 */
function generateMarkdownReport(stats) {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  let markdown = `# 📊 项目统计报告

> **生成时间**: ${timestamp}
> **工具版本**: v2.10.0
> **智能过滤**: 已排除第三方库文件（统计分析）
> **可视化**: 完整项目结构展示（包括第三方库）

---

## 📁 项目信息

| 项目 | 信息 |
|------|------|
| **名称** | ${stats.project.name} |
| **路径** | \`${stats.project.path}\` |
| **类型** | ${stats.project.type} |

---

## 📂 文件统计

**统计文件**: ${formatNumber(stats.files.total)} 个  
**排除文件**: ${formatNumber(stats.files.excluded.libraries)} 个第三方库文件

### 语言分布

| 语言 | 文件数 |
|------|--------|
`;

  // 使用数组 join 优化字符串拼接性能
  const languageRows = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => `| ${lang} | ${formatNumber(count)} |`);
  
  markdown += languageRows.join('\n') + '\n';

  markdown += `
---

## 📝 文字统计

| 类型 | 数量 |
|------|------|
| **中文字符** | ${formatNumber(stats.text.chineseChars)} 个 |
| **英文单词** | ${formatNumber(stats.text.englishWords)} 个 |
| **总字符数** | ${formatNumber(stats.text.totalChars)} 个 (${formatSize(stats.text.totalChars)}) |

---

## 💻 代码统计

| 类型 | 数量 | 占比 |
|------|------|------|
| **总行数** | ${formatNumber(stats.code.totalLines)} | 100% |
| **代码行** | ${formatNumber(stats.code.codeLines)} | ${((stats.code.codeLines/stats.code.totalLines)*100).toFixed(1)}% |
| **注释行** | ${formatNumber(stats.code.commentLines)} | ${((stats.code.commentLines/stats.code.totalLines)*100).toFixed(1)}% |
| **空白行** | ${formatNumber(stats.code.blankLines)} | ${((stats.code.blankLines/stats.code.totalLines)*100).toFixed(1)}% |

---

## 📈 复杂度分析

| 指标 | 值 |
|------|-----|
| **平均行长度** | ${stats.complexity.avgLineLength} 字符/行 |
| **平均文件大小** | ${formatSize(stats.complexity.avgFileSize)} |
| **最大文件** | \`${stats.files.largest.path}\` |
| | ${formatNumber(stats.files.largest.lines)} 行, ${formatSize(stats.files.largest.size)} |
`;

  if (stats.complexity.longestLine.length > 0) {
    markdown += `| **最长行** | \`${stats.complexity.longestLine.file}:${stats.complexity.longestLine.lineNum}\` |\n`;
    markdown += `| | ${formatNumber(stats.complexity.longestLine.length)} 字符 |\n`;
  }

  markdown += `
---

## 🎯 Tokens 估算

| 来源 | Tokens |
|------|--------|
| 来自中文 | ${formatNumber(stats.tokens.breakdown.fromChinese)} |
| 来自英文 | ${formatNumber(stats.tokens.breakdown.fromEnglish)} |
| 来自代码 | ${formatNumber(stats.tokens.breakdown.fromCode)} |
| **总计估算** | **${formatNumber(stats.tokens.estimated)}** |

### 估算规则

- 中文: ~1.5 字符/token
- 英文: ~1.3 单词/token
- 代码: ~3.5 字符/token

> ⚠️ **注意**: 此为粗略估算，实际值可能有 ±20% 的偏差

---

## 🔧 统计说明

- ✅ 自动排除 \`node_modules\`、\`.git\` 等依赖目录
- ✅ 自动读取项目 \`.gitignore\` 规则
- ✅ 智能识别并排除统计工具所在目录
- ✅ **智能排除第三方库文件**（lib、vendor 等）
- ✅ 支持 40+ 种编程语言
- ✅ 支持完整文字提取功能

---

*由 [项目统计工具 ${getVersion()}](https://github.com/NightMin2002/project-stats-tool) 自动生成*
`;

  return markdown;
}

/**
 * 生成完整文件列表
 * @param {object} stats - 统计数据对象
 * @returns {string} 文件列表内容
 */
function generateFileList(stats) {
  console.log('\n📋 正在生成完整文件列表...');
  
  const projectName = stats.project.name;
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let fileList = `╔════════════════════════════════════════════════════════╗
║           ${projectName} - 完整文件列表                
║           生成时间: ${timestamp}
╚════════════════════════════════════════════════════════╝

项目路径: ${stats.project.path}
项目类型: ${stats.project.type}
统计文件: ${stats.files.total} 个

════════════════════════════════════════════════════════

`;

  // 按语言分组
  const filesByLanguage = {};
  stats.files.list.forEach(file => {
    const lang = LANGUAGE_MAP[file.ext] || file.ext.slice(1).toUpperCase();
    if (!filesByLanguage[lang]) {
      filesByLanguage[lang] = [];
    }
    filesByLanguage[lang].push(file);
  });

  // 按文件数量排序
  const sortedLanguages = Object.entries(filesByLanguage)
    .sort((a, b) => b[1].length - a[1].length);

  sortedLanguages.forEach(([lang, files]) => {
    fileList += `\n${'='.repeat(60)}\n`;
    fileList += `📚 ${lang} (${files.length} 个文件)\n`;
    fileList += `${'='.repeat(60)}\n\n`;
    
    // 按文件路径排序
    files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
    
    files.forEach((file, index) => {
      fileList += `${(index + 1).toString().padStart(3)}. 📄 ${file.relativePath}\n`;
      fileList += `     大小: ${formatSize(file.size).padEnd(10)} | 行数: ${file.lines.toString().padStart(6)}\n\n`;
    });
  });

  fileList += `\n${'='.repeat(60)}\n`;
  fileList += `📊 总计: ${stats.files.total} 个文件\n`;
  fileList += `📦 总大小: ${formatSize(stats.text.totalChars)}\n`;
  fileList += `📝 总行数: ${formatNumber(stats.code.totalLines)} 行\n`;
  fileList += `${'='.repeat(60)}\n\n`;
  fileList += `*由项目统计工具 ${getVersion()} 自动生成*\n`;

  return fileList;
}

/**
 * 提取所有文字内容
 * @param {object} stats - 统计数据对象
 * @returns {string} 完整文字提取内容
 */
function extractAllText(stats) {
  console.log('\n📝 正在提取所有文字内容...');
  
  const projectName = stats.project.name;
  
  let fullText = `╔════════════════════════════════════════════════════════╗
║           ${projectName} - 完整文字提取
║           生成时间: ${new Date().toLocaleString('zh-CN')}
╚════════════════════════════════════════════════════════╝

项目路径: ${stats.project.path}
项目类型: ${stats.project.type}
统计文件: ${stats.files.total} 个
排除文件: ${stats.files.excluded.libraries} 个第三方库
总字符数: ${formatNumber(stats.text.totalChars)} 个

════════════════════════════════════════════════════════

`;

  const filesByType = {};
  stats.files.list.forEach(file => {
    const lang = LANGUAGE_MAP[file.ext] || file.ext.slice(1).toUpperCase();
    if (!filesByType[lang]) {
      filesByType[lang] = [];
    }
    filesByType[lang].push(file);
  });

  Object.entries(filesByType)
    .sort((a, b) => b[1].length - a[1].length)
    .forEach(([lang, files]) => {
      fullText += `\n\n${'='.repeat(60)}\n`;
      fullText += `语言: ${lang} (${files.length} 个文件)\n`;
      fullText += `${'='.repeat(60)}\n\n`;
      
      files.forEach(file => {
        fullText += `\n${'-'.repeat(60)}\n`;
        fullText += `文件: ${file.relativePath}\n`;
        fullText += `大小: ${formatSize(file.size)} | 行数: ${file.lines}\n`;
        fullText += `${'-'.repeat(60)}\n\n`;
        fullText += file.content;
        fullText += '\n\n';
      });
    });

  return fullText;
}

module.exports = {
  generateMarkdownReport,
  generateFileList,
  extractAllText
};