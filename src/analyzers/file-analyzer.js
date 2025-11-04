/**
 * 文件分析模块
 * 提供单个文件的完整分析功能
 */

const fs = require('fs');
const path = require('path');
const { LANGUAGE_MAP } = require('../config');
const { countChineseChars, countEnglishWords } = require('./text-analyzer');
const { analyzeCodeLine } = require('./code-analyzer');
const { isCodeFile } = require('../utils/file-utils');

/**
 * 分析单个文件并更新统计数据
 * @param {string} filePath - 文件路径
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 */
function analyzeFile(filePath, stats, config) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    const lines = content.split('\n');
    const fileSize = content.length;
    
    // 更新文件统计
    stats.files.total++;
    stats.files.byType[ext] = (stats.files.byType[ext] || 0) + 1;
    
    // 获取语言名称
    const language = LANGUAGE_MAP[ext] || ext.slice(1).toUpperCase();
    stats.files.byLanguage[language] = (stats.files.byLanguage[language] || 0) + 1;
    
    // 初始化语言详细统计数据结构
    if (!stats.languageStats[language]) {
      stats.languageStats[language] = {
        files: 0,
        totalLines: 0,
        codeLines: 0,
        commentLines: 0,
        blankLines: 0,
        totalChars: 0,
        chineseChars: 0,
        englishWords: 0
      };
    }
    
    // 添加到文件列表
    stats.files.list.push({
      path: filePath,
      relativePath: path.relative(config.rootDir, filePath),
      content: content,
      size: fileSize,
      lines: lines.length,
      ext: ext
    });
    
    // 更新最大文件
    if (lines.length > stats.files.largest.lines) {
      stats.files.largest = {
        path: path.relative(config.rootDir, filePath),
        size: fileSize,
        lines: lines.length
      };
    }
    
    // 文本分析
    const chineseChars = countChineseChars(content);
    const englishWords = countEnglishWords(content);
    
    stats.text.chineseChars += chineseChars;
    stats.text.englishWords += englishWords;
    stats.text.totalChars += fileSize;
    
    // 语言级别的基础统计
    stats.languageStats[language].files++;
    stats.languageStats[language].totalChars += fileSize;
    stats.languageStats[language].chineseChars += chineseChars;
    stats.languageStats[language].englishWords += englishWords;
    
    // 代码文件的详细分析
    if (isCodeFile(filePath, config)) {
      stats.text.codeChars += fileSize;
      stats.code.totalLines += lines.length;
      stats.languageStats[language].totalLines += lines.length;
      
      // 逐行分析代码类型
      lines.forEach((line, index) => {
        const lineType = analyzeCodeLine(line, ext);
        
        if (lineType === 'blank') {
          stats.code.blankLines++;
          stats.languageStats[language].blankLines++;
        } else if (lineType === 'comment') {
          stats.code.commentLines++;
          stats.languageStats[language].commentLines++;
        } else {
          stats.code.codeLines++;
          stats.languageStats[language].codeLines++;
        }
        
        // 更新最长行
        if (line.length > stats.complexity.longestLine.length) {
          stats.complexity.longestLine = {
            file: path.relative(config.rootDir, filePath),
            length: line.length,
            lineNum: index + 1
          };
        }
      });
    }
    
  } catch (error) {
    // 静默忽略文件读取错误（可能是编码问题或权限不足）
  }
}

module.exports = {
  analyzeFile
};