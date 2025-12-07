/**
 * 文件分析模块
 * 提供单个文件的完整分析功能
 */

const fs = require('fs');
const path = require('path');
const { LANGUAGE_MAP } = require('../config');
const { countChineseChars, countEnglishWords } = require('./text-analyzer');
const { analyzeCodeLine } = require('./code-analyzer');
const { isCodeFile, isBinaryFile, isDocFile } = require('../utils/file-utils');
const { formatSize } = require('../utils/formatters');

// 最大文件大小限制（50MB）
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * 分析单个文件并更新统计数据
 * @param {string} filePath - 文件路径
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 */
async function analyzeFile(filePath, stats, config) {
  try {
    // 先检查文件大小，避免读取超大文件导致内存溢出
    const fileStat = await fs.promises.stat(filePath);
    if (fileStat.size > MAX_FILE_SIZE) {
      console.warn(`⚠️  文件过大，跳过: ${path.relative(config.rootDir, filePath)} (${formatSize(fileStat.size)})`);
      stats.files.excluded.total++;
      return;
    }

    // 优化：如果是已知的代码或文档文件，跳过二进制检查，强制尝试按文本读取
    // 这解决了某些 UTF-16 或包含特殊字符的源代码文件被误判为二进制的问题
    let shouldCheckBinary = true;
    if (isCodeFile(filePath, config) || isDocFile(filePath, config)) {
      shouldCheckBinary = false;
    }

    // 检查是否为二进制文件
    if (shouldCheckBinary && await isBinaryFile(filePath)) {
      console.warn(`⚠️  检测到二进制文件，跳过: ${path.relative(config.rootDir, filePath)}`);
      // 可以在这里决定是否统计为"排除的文件"或者只是不进行文本分析
      // 目前保持与旧版本一致的行为：跳过
      return;
    }
    
    const content = await fs.promises.readFile(filePath, 'utf8');
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
    // 处理文件读取错误
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      // 权限错误，静默跳过
    } else if (error.code === 'ENOENT') {
      // 文件不存在（可能在扫描过程中被删除）
    } else if (error.message && error.message.includes('invalid') || error.message.includes('encoding')) {
      // 编码错误，可能是二进制文件
      console.warn(`⚠️  文件编码错误，跳过: ${path.relative(config.rootDir, filePath)}`);
    } else {
      // 其他未知错误
      console.warn(`⚠️  分析文件失败: ${path.relative(config.rootDir, filePath)} (${error.message})`);
    }
  }
}

module.exports = {
  analyzeFile
};