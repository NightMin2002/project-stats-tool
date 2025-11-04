/**
 * 代码分析模块
 * 提供代码行类型分析功能
 */

/**
 * 分析代码行类型
 * @param {string} line - 代码行内容
 * @param {string} ext - 文件扩展名
 * @returns {string} 行类型：'blank'、'comment' 或 'code'
 */
function analyzeCodeLine(line, ext) {
  const trimmed = line.trim();
  
  if (trimmed.length === 0) {
    return 'blank';
  }
  
  const commentPatterns = {
    '.js': ['//', '/*', '*', '*/'],
    '.ts': ['//', '/*', '*', '*/'],
    '.jsx': ['//', '/*', '*', '*/'],
    '.tsx': ['//', '/*', '*', '*/'],
    '.css': ['/*', '*', '*/'],
    '.html': ['<!--', '-->'],
    '.py': ['#', '"""', "'''"],
    '.rb': ['#'],
    '.php': ['//', '#', '/*'],
    '.java': ['//', '/*', '*'],
    '.go': ['//', '/*', '*'],
    '.rs': ['//', '/*', '*']
  };
  
  const patterns = commentPatterns[ext] || ['//', '/*', '*', '#'];
  for (const pattern of patterns) {
    if (trimmed.startsWith(pattern)) {
      return 'comment';
    }
  }
  
  return 'code';
}

module.exports = {
  analyzeCodeLine
};