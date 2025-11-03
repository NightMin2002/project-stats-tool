/**
 * 项目统计工具 v2.7 - 全面优化版
 * 智能统计项目的文字数量、代码行数和 tokens 估算
 *
 * v2.7 更新内容:
 * - 修复HTML可视化报告的动画效果
 * - 增强文件树交互功能（折叠/展开）
 * - 智能区分可视化展示和统计分析的过滤规则
 * - 优化图表显示和响应式布局
 * - 提升大型项目的渲染性能
 *
 * 使用方法:
 *   node project-stats.js [项目路径]
 *
 * 示例:
 *   node project-stats.js              # 统计当前目录
 *   node project-stats.js ../my-app    # 统计指定项目
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数指定的目录，默认为上级目录（统计项目而非工具本身）
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(process.cwd(), '..');

// 配置
const CONFIG = {
  // 项目根目录
  rootDir: targetDir,
  
  // 需要统计的文件扩展名（更全面）
  extensions: {
    code: [
      // Web 前端
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.css', '.scss', '.sass', '.less', '.stylus',
      '.html', '.htm', '.xml', '.svg',
      // 后端
      '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h',
      '.php', '.rb', '.cs', '.swift', '.kt',
      // 配置和数据
      '.json', '.yaml', '.yml', '.toml', '.ini', '.env',
      // Shell 和脚本
      '.sh', '.bash', '.bat', '.ps1',
      // 其他
      '.sql', '.graphql', '.prisma'
    ],
    docs: ['.md', '.txt', '.rst', '.adoc']
  },
  
  // 通用排除目录
  defaultExclude: [
    'node_modules', '.git', '.svn', '.hg',
    'dist', 'build', 'out', 'target',
    '.next', '.nuxt', '.vuepress',
    'vendor', 'venv', '__pycache__',
    '.idea', '.vscode', '.DS_Store',
    'coverage', '.nyc_output',
    '统计工具', 'stats-tool', 'project-stats-tool', 'results'
  ],
  
  // 第三方库目录（智能识别）
  libraryDirs: [
    'lib', 'libs', 'library', 'libraries',
    'vendor', 'vendors', 'third-party', 'third_party',
    'external', 'dependencies', 'plugins',
    'bower_components', 'jspm_packages', 'packages'
  ],
  
  // 第三方库文件特征
  libraryFilePatterns: [
    '.min.js', '.min.css',
    '-min.js', '-min.css',
    '.bundle.js', '.bundle.css',
    '.vendor.js', '.vendor.css',
    'jquery', 'bootstrap', 'lodash', 'underscore',
    'react.', 'vue.', 'angular.',
    'moment.', 'axios.', 'd3.',
    'chart.', 'echarts.', 'three.',
    'katex', 'markdown-it', 'markdown-it-',
    'highlight', 'prism', 'codemirror', 'ace-',
    'dompurify', 'texmath', 'mathjax'
  ],
  
  // tokens 估算规则
  tokenEstimate: {
    chineseCharPerToken: 1.5,
    englishWordPerToken: 1.3,
    codeCharPerToken: 3.5
  }
};

// 从 .gitignore 读取排除规则
let gitignorePatterns = [];
const gitignorePath = path.join(CONFIG.rootDir, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  try {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    gitignorePatterns = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => pattern.replace(/\/$/, ''));
  } catch (error) {
    // 忽略读取错误
  }
}

// 统计数据
const stats = {
  project: {
    path: targetDir,
    name: path.basename(targetDir),
    type: 'unknown'
  },
  files: {
    total: 0,
    byType: {},
    largest: { path: '', size: 0, lines: 0 },
    byLanguage: {},
    list: [],
    excluded: {
      libraries: 0,
      total: 0
    }
  },
  text: {
    chineseChars: 0,
    englishWords: 0,
    totalChars: 0,
    codeChars: 0
  },
  code: {
    totalLines: 0,
    codeLines: 0,
    commentLines: 0,
    blankLines: 0
  },
  tokens: {
    estimated: 0,
    breakdown: {
      fromChinese: 0,
      fromEnglish: 0,
      fromCode: 0
    }
  },
  complexity: {
    avgLineLength: 0,
    avgFileSize: 0,
    longestLine: { file: '', length: 0, lineNum: 0 }
  }
};

// 语言映射
const LANGUAGE_MAP = {
  '.js': 'JavaScript', '.jsx': 'JavaScript',
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.py': 'Python', '.java': 'Java',
  '.go': 'Go', '.rs': 'Rust',
  '.cpp': 'C++', '.c': 'C', '.h': 'C/C++',
  '.css': 'CSS', '.scss': 'SCSS', '.sass': 'Sass',
  '.html': 'HTML', '.vue': 'Vue', '.svelte': 'Svelte',
  '.php': 'PHP', '.rb': 'Ruby', '.cs': 'C#',
  '.md': 'Markdown', '.json': 'JSON'
};

/**
 * 判断是否为第三方库文件
 * @param {string} filePath - 文件路径
 * @param {boolean} forVisualization - 是否用于可视化（文件树展示）
 * @returns {boolean}
 */
function isLibraryFile(filePath, forVisualization = false) {
  const relativePath = path.relative(CONFIG.rootDir, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath).toLowerCase();
  
  // 检查是否在库目录中
  const pathParts = relativePath.split('/');
  for (const part of pathParts) {
    if (CONFIG.libraryDirs.includes(part.toLowerCase())) {
      return true;
    }
  }
  
  // 检查文件名特征
  for (const pattern of CONFIG.libraryFilePatterns) {
    if (fileName.includes(pattern.toLowerCase())) {
      return true;
    }
  }
  
  // 如果是用于可视化，不排除第三方库
  // 这样文件树可以显示完整的项目结构
  if (forVisualization) {
    return false;
  }
  
  return false;
}

/**
 * 判断路径是否应该被排除
 */
function shouldExclude(filePath) {
  const relativePath = path.relative(CONFIG.rootDir, filePath);
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  // 检查默认排除规则
  if (CONFIG.defaultExclude.some(pattern => normalizedPath.includes(pattern))) {
    return true;
  }
  
  // 智能排除：如果目录包含 project-stats.js，但不是根目录本身，则排除该目录
  const dirPath = path.dirname(filePath);
  const isToolDir = fs.existsSync(path.join(dirPath, 'project-stats.js'));
  const isRootDir = path.resolve(dirPath) === path.resolve(CONFIG.rootDir);
  
  if (isToolDir && !isRootDir) {
    return true;
  }
  
  // 检查 .gitignore 规则
  for (const pattern of gitignorePatterns) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(normalizedPath)) {
        return true;
      }
    } else if (normalizedPath.includes(pattern)) {
      return true;
    }
  }
  
  return false;
}

/**
 * 判断是否为代码文件
 */
function isCodeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.extensions.code.includes(ext);
}

/**
 * 判断是否为文档文件
 */
function isDocFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONFIG.extensions.docs.includes(ext);
}

/**
 * 统计中文字符数
 */
function countChineseChars(text) {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const matches = text.match(chineseRegex);
  return matches ? matches.length : 0;
}

/**
 * 统计英文单词数
 */
function countEnglishWords(text) {
  const textWithoutChinese = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const words = textWithoutChinese.match(/\b[a-zA-Z]+\b/g);
  return words ? words.length : 0;
}

/**
 * 分析代码行类型
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

/**
 * 检测项目类型
 */
function detectProjectType() {
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
    if (fs.existsSync(path.join(CONFIG.rootDir, file))) {
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

/**
 * 统计单个文件
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    const lines = content.split('\n');
    const fileSize = content.length;
    
    stats.files.total++;
    stats.files.byType[ext] = (stats.files.byType[ext] || 0) + 1;
    
    const language = LANGUAGE_MAP[ext] || ext.slice(1).toUpperCase();
    stats.files.byLanguage[language] = (stats.files.byLanguage[language] || 0) + 1;
    
    stats.files.list.push({
      path: filePath,
      relativePath: path.relative(CONFIG.rootDir, filePath),
      content: content,
      size: fileSize,
      lines: lines.length,
      ext: ext
    });
    
    if (lines.length > stats.files.largest.lines) {
      stats.files.largest = {
        path: path.relative(CONFIG.rootDir, filePath),
        size: fileSize,
        lines: lines.length
      };
    }
    
    stats.text.chineseChars += countChineseChars(content);
    stats.text.englishWords += countEnglishWords(content);
    stats.text.totalChars += fileSize;
    
    if (isCodeFile(filePath)) {
      stats.text.codeChars += fileSize;
      stats.code.totalLines += lines.length;
      
      lines.forEach((line, index) => {
        const lineType = analyzeCodeLine(line, ext);
        if (lineType === 'blank') {
          stats.code.blankLines++;
        } else if (lineType === 'comment') {
          stats.code.commentLines++;
        } else {
          stats.code.codeLines++;
        }
        
        if (line.length > stats.complexity.longestLine.length) {
          stats.complexity.longestLine = {
            file: path.relative(CONFIG.rootDir, filePath),
            length: line.length,
            lineNum: index + 1
          };
        }
      });
    }
    
  } catch (error) {
    // 忽略读取错误
  }
}

/**
 * 递归遍历目录
 */
function walkDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      if (shouldExclude(fullPath)) {
        return;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (isCodeFile(fullPath) || isDocFile(fullPath)) {
          // 检查是否为第三方库文件（用于文字提取和代码统计）
          if (isLibraryFile(fullPath, false)) {
            stats.files.excluded.libraries++;
            stats.files.excluded.total++;
          } else {
            analyzeFile(fullPath);
          }
        }
      }
    });
  } catch (error) {
    // 忽略无权限目录
  }
}

/**
 * 计算复杂度指标
 */
function calculateComplexity() {
  if (stats.code.codeLines > 0) {
    stats.complexity.avgLineLength = Math.round(stats.text.codeChars / stats.code.totalLines);
  }
  
  if (stats.files.total > 0) {
    stats.complexity.avgFileSize = Math.round(stats.text.totalChars / stats.files.total);
  }
}

/**
 * 计算 tokens 估算
 */
function calculateTokens() {
  const { chineseCharPerToken, englishWordPerToken, codeCharPerToken } = CONFIG.tokenEstimate;
  
  stats.tokens.breakdown.fromChinese = Math.ceil(stats.text.chineseChars / chineseCharPerToken);
  stats.tokens.breakdown.fromEnglish = Math.ceil(stats.text.englishWords / englishWordPerToken);
  stats.tokens.breakdown.fromCode = Math.ceil(stats.text.codeChars / codeCharPerToken);
  
  stats.tokens.estimated = 
    stats.tokens.breakdown.fromChinese + 
    stats.tokens.breakdown.fromEnglish + 
    stats.tokens.breakdown.fromCode;
}

/**
 * 格式化数字
 */
function formatNumber(num) {
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
/**
 * 构建目录树结构
 */
function buildDirectoryTree(dir, prefix = '', isLast = true) {
  let tree = '';
  
  try {
    const items = fs.readdirSync(dir).sort();
    const validItems = items.filter(item => {
      const fullPath = path.join(dir, item);
      return !shouldExclude(fullPath);
    });
    
    validItems.forEach((item, index) => {
      const fullPath = path.join(dir, item);
      const isLastItem = index === validItems.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const extension = isLastItem ? '    ' : '│   ';
      
      try {
        const stat = fs.statSync(fullPath);
        const isDirectory = stat.isDirectory();
        const icon = isDirectory ? '📁' : '📄';
        
        tree += `${prefix}${connector}${icon} ${item}\n`;
        
        if (isDirectory) {
          tree += buildDirectoryTree(fullPath, prefix + extension, isLastItem);
        }
      } catch (error) {
        // 忽略无权限文件
      }
    });
  } catch (error) {
    // 忽略无权限目录
  }
  
  return tree;
}

/**
 * 生成项目结构树形图
 */
function generateProjectStructure() {
  console.log('\n🌳 正在生成项目结构树...');
  
  const projectName = stats.project.name;
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let structure = `╔════════════════════════════════════════════════════════╗
║           ${projectName} - 项目结构树                
║           生成时间: ${timestamp}
╚════════════════════════════════════════════════════════╝

项目路径: ${stats.project.path}
项目类型: ${stats.project.type}

📦 ${projectName}/
`;
  
  structure += buildDirectoryTree(CONFIG.rootDir, '');
  
  structure += `
════════════════════════════════════════════════════════

📊 统计摘要:
   • 总文件数: ${formatNumber(stats.files.total)} 个
   • 总目录数: (已包含在树中)
   • 排除文件: ${formatNumber(stats.files.excluded.libraries)} 个第三方库

*由项目统计工具 v2.6 自动生成*
`;
  
  return structure;
}

/**
 * 生成完整文件列表
 */
function generateFileList() {
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
  fileList += `*由项目统计工具 v2.5 自动生成*\n`;

  return fileList;
}

/**
 * 生成 HTML 可视化报告
/**
 * 构建文件树的 JSON 数据结构（用于可视化）
 */
function buildFileTreeData(dir, rootPath = CONFIG.rootDir) {
  const tree = {
    name: path.basename(dir),
    path: path.relative(rootPath, dir) || '.',
    type: 'directory',
    children: []
  };
  
  try {
    const items = fs.readdirSync(dir).sort((a, b) => {
      // 目录优先排序
      const fullPathA = path.join(dir, a);
      const fullPathB = path.join(dir, b);
      try {
        const statA = fs.statSync(fullPathA);
        const statB = fs.statSync(fullPathB);
        if (statA.isDirectory() && !statB.isDirectory()) return -1;
        if (!statA.isDirectory() && statB.isDirectory()) return 1;
        return a.localeCompare(b);
      } catch {
        return a.localeCompare(b);
      }
    });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      // 跳过排除的路径
      if (shouldExclude(fullPath)) {
        return;
      }
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 递归处理子目录
          const subTree = buildFileTreeData(fullPath, rootPath);
          // 始终包含目录节点，即使为空（用户可能想看到结构）
          tree.children.push(subTree);
        } else {
          const ext = path.extname(fullPath).toLowerCase();
          // 对于可视化文件树，包含所有代码和文档文件（包括第三方库）
          if (isCodeFile(fullPath) || isDocFile(fullPath)) {
            tree.children.push({
              name: item,
              path: path.relative(rootPath, fullPath),
              type: 'file',
              ext: ext,
              size: stat.size
            });
          }
        }
      } catch (error) {
        // 记录错误但继续处理其他文件
        console.warn(`警告: 无法访问 ${fullPath}: ${error.message}`);
      }
    });
  } catch (error) {
    console.warn(`警告: 无法读取目录 ${dir}: ${error.message}`);
  }
  
  return tree;
}

/**
 * 生成 HTML 可视化报告 v2.7 - 全面优化版（内嵌本地库）
 */
function generateHTMLReport() {
  // 读取本地库文件
  const chartJs = fs.existsSync(path.join(__dirname, 'lib/chart.min.js'))
    ? fs.readFileSync(path.join(__dirname, 'lib/chart.min.js'), 'utf8')
    : '';
  const particlesJs = fs.existsSync(path.join(__dirname, 'lib/particles.min.js'))
    ? fs.readFileSync(path.join(__dirname, 'lib/particles.min.js'), 'utf8')
    : '';
  
  // 引入外部模板函数
  const generateEnhancedHTML = require('./html-report-template.js');
  
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const fileTreeData = buildFileTreeData(CONFIG.rootDir);
  
  return generateEnhancedHTML(stats, timestamp, fileTreeData, formatNumber, formatSize, {
    chartJs,
    particlesJs
  });
}

/**
 * 旧版 HTML 报告生成函数（备份）
 */
function generateHTMLReportOld() {
  const timestamp = new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  // 准备图表数据
  const languageData = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count: count }));
  
  const codeDistribution = [
    { type: '代码行', value: stats.code.codeLines, color: '#4CAF50' },
    { type: '注释行', value: stats.code.commentLines, color: '#2196F3' },
    { type: '空白行', value: stats.code.blankLines, color: '#9E9E9E' }
  ];
  
  const tokenDistribution = [
    { type: '中文', value: stats.tokens.breakdown.fromChinese, color: '#FF9800' },
    { type: '英文', value: stats.tokens.breakdown.fromEnglish, color: '#9C27B0' },
    { type: '代码', value: stats.tokens.breakdown.fromCode, color: '#00BCD4' }
  ];

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>📊 ${stats.project.name} - 项目统计报告</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container {
      max-width: 1400px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    
    .header .subtitle {
      font-size: 1.1em;
      opacity: 0.9;
    }
    
    .meta {
      background: #f5f5f5;
      padding: 20px 40px;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .meta-item {
      text-align: center;
    }
    
    .meta-item .label {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 5px;
    }
    
    .meta-item .value {
      font-size: 1.3em;
      font-weight: bold;
      color: #333;
    }
    
    .content {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 1.8em;
      color: #333;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #667eea;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      border-radius: 15px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
    }
    
    .stat-card .label {
      font-size: 0.9em;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    
    .stat-card .value {
      font-size: 2em;
      font-weight: bold;
    }
    
    .chart-container {
      background: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .chart-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 30px;
    }
    
    .chart-wrapper {
      position: relative;
      height: 300px;
    }
    
    .table-container {
      overflow-x: auto;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }
    
    th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 0.9em;
    }
    
    @media (max-width: 768px) {
      .header h1 {
        font-size: 1.8em;
      }
      
      .chart-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 ${stats.project.name}</h1>
      <div class="subtitle">项目统计可视化报告</div>
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
        <div class="value">v2.5</div>
      </div>
    </div>
    
    <div class="content">
      <!-- 核心统计 -->
      <div class="section">
        <h2 class="section-title">📈 核心统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">统计文件</div>
            <div class="value">${formatNumber(stats.files.total)}</div>
          </div>
          <div class="stat-card">
            <div class="label">总字符数</div>
            <div class="value">${formatSize(stats.text.totalChars)}</div>
          </div>
          <div class="stat-card">
            <div class="label">代码行数</div>
            <div class="value">${formatNumber(stats.code.totalLines)}</div>
          </div>
          <div class="stat-card">
            <div class="label">估算 Tokens</div>
            <div class="value">${formatNumber(stats.tokens.estimated)}</div>
          </div>
        </div>
      </div>
      
      <!-- 图表区域 -->
      <div class="section">
        <h2 class="section-title">📊 数据可视化</h2>
        <div class="chart-grid">
          <div class="chart-container">
            <h3 style="margin-bottom: 15px; color: #333;">语言分布</h3>
            <div class="chart-wrapper">
              <canvas id="languageChart"></canvas>
            </div>
          </div>
          <div class="chart-container">
            <h3 style="margin-bottom: 15px; color: #333;">代码组成</h3>
            <div class="chart-wrapper">
              <canvas id="codeChart"></canvas>
            </div>
          </div>
          <div class="chart-container">
            <h3 style="margin-bottom: 15px; color: #333;">Token 分布</h3>
            <div class="chart-wrapper">
              <canvas id="tokenChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 详细数据表 -->
      <div class="section">
        <h2 class="section-title">📋 详细数据</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>语言</th>
                <th>文件数</th>
                <th>占比</th>
              </tr>
            </thead>
            <tbody>
              ${languageData.map(item => `
                <tr>
                  <td><strong>${item.language}</strong></td>
                  <td>${formatNumber(item.count)}</td>
                  <td>${((item.count / stats.files.total) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 复杂度分析 -->
      <div class="section">
        <h2 class="section-title">🔍 复杂度分析</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">平均行长度</div>
            <div class="value">${stats.complexity.avgLineLength} 字符</div>
          </div>
          <div class="stat-card">
            <div class="label">平均文件大小</div>
            <div class="value">${formatSize(stats.complexity.avgFileSize)}</div>
          </div>
          <div class="stat-card">
            <div class="label">最大文件</div>
            <div class="value" style="font-size: 1em;">${stats.files.largest.path}</div>
          </div>
          <div class="stat-card">
            <div class="label">最大文件行数</div>
            <div class="value">${formatNumber(stats.files.largest.lines)}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      由项目统计工具 v2.5 自动生成 | ${timestamp}
    </div>
  </div>
  
  <script>
    // 语言分布图
    const languageCtx = document.getElementById('languageChart').getContext('2d');
    new Chart(languageCtx, {
      type: 'doughnut',
      data: {
        labels: ${JSON.stringify(languageData.map(d => d.language))},
        datasets: [{
          data: ${JSON.stringify(languageData.map(d => d.count))},
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
    
    // 代码组成图
    const codeCtx = document.getElementById('codeChart').getContext('2d');
    new Chart(codeCtx, {
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
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
    
    // Token 分布图
    const tokenCtx = document.getElementById('tokenChart').getContext('2d');
    new Chart(tokenCtx, {
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
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  </script>
</body>
</html>`;

  return html;
}


/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport() {
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
> **工具版本**: v2.7
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

  Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .forEach(([lang, count]) => {
      markdown += `| ${lang} | ${formatNumber(count)} |\n`;
    });

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

*由 [项目统计工具 v2.7](https://github.com) 自动生成*
`;

  return markdown;
}

/**
 * 提取所有文字内容
 */
function extractAllText(resultsDir) {
  console.log('\n📝 正在提取所有文字内容...');
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
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

  const fullTextPath = path.join(resultsDir, `${projectName}_完整提取_${timestamp}.txt`);
  fs.writeFileSync(fullTextPath, fullText, 'utf8');
  console.log(`   ✅ 完整文字: ${fullTextPath}`);
  console.log(`   📊 文件大小: ${formatSize(Buffer.byteLength(fullText, 'utf8'))}`);
  
  const latestFullTextPath = path.join(resultsDir, '最新_完整提取.txt');
  fs.writeFileSync(latestFullTextPath, fullText, 'utf8');
  
  return fullTextPath;
}

/**
 * 打印统计结果
 */
function printResults() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║              📊 项目统计结果 v2.7                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('📁 项目信息');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   名称: ${stats.project.name}`);
  console.log(`   路径: ${stats.project.path}`);
  console.log(`   类型: ${stats.project.type}`);
  
  console.log('\n📂 文件统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   统计文件: ${formatNumber(stats.files.total)} 个`);
  if (stats.files.excluded.libraries > 0) {
    console.log(`   排除库文件: ${formatNumber(stats.files.excluded.libraries)} 个 🎯`);
  }
  console.log('   语言分布:');
  Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([lang, count]) => {
      console.log(`     ${lang.padEnd(15)} ${formatNumber(count)} 个`);
    });
  
  console.log('\n📝 文字统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   中文字符: ${formatNumber(stats.text.chineseChars)} 个`);
  console.log(`   英文单词: ${formatNumber(stats.text.englishWords)} 个`);
  console.log(`   总字符数: ${formatNumber(stats.text.totalChars)} 个 (${formatSize(stats.text.totalChars)})`);
  
  console.log('\n💻 代码统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   总行数:   ${formatNumber(stats.code.totalLines)} 行`);
  console.log(`   代码行:   ${formatNumber(stats.code.codeLines)} 行 (${((stats.code.codeLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  console.log(`   注释行:   ${formatNumber(stats.code.commentLines)} 行 (${((stats.code.commentLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  console.log(`   空白行:   ${formatNumber(stats.code.blankLines)} 行 (${((stats.code.blankLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  
  console.log('\n📈 复杂度分析');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   平均行长度: ${stats.complexity.avgLineLength} 字符/行`);
  console.log(`   平均文件大小: ${formatSize(stats.complexity.avgFileSize)}`);
  console.log(`   最大文件: ${stats.files.largest.path}`);
  console.log(`              ${formatNumber(stats.files.largest.lines)} 行, ${formatSize(stats.files.largest.size)}`);
  if (stats.complexity.longestLine.length > 0) {
    console.log(`   最长行: ${stats.complexity.longestLine.file}:${stats.complexity.longestLine.lineNum}`);
    console.log(`           ${formatNumber(stats.complexity.longestLine.length)} 字符`);
  }
  
  console.log('\n🎯 Tokens 估算');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   来自中文: ${formatNumber(stats.tokens.breakdown.fromChinese)} tokens`);
  console.log(`   来自英文: ${formatNumber(stats.tokens.breakdown.fromEnglish)} tokens`);
  console.log(`   来自代码: ${formatNumber(stats.tokens.breakdown.fromCode)} tokens`);
  console.log(`   ─────────────────────────────────────────────────────`);
  console.log(`   总计估算: ${formatNumber(stats.tokens.estimated)} tokens`);
  
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('💡 估算说明:');
  console.log('   • 中文: ~1.5 字符/token');
  console.log('   • 英文: ~1.3 单词/token');
  console.log('   • 代码: ~3.5 字符/token');
  console.log('   • 自动排除 node_modules, .git 等目录');
  console.log('   • 自动读取 .gitignore 规则');
  console.log('   • 智能排除统计工具所在目录');
  console.log('   • 智能识别并排除第三方库文件 🆕');
  console.log('─────────────────────────────────────────────────────────\n');
}

/**
 * 主函数
 */
function main() {
  if (!fs.existsSync(CONFIG.rootDir)) {
    console.error(`❌ 错误: 目录不存在: ${CONFIG.rootDir}`);
    process.exit(1);
  }
  
  console.log(`\n🔍 正在分析项目: ${CONFIG.rootDir}\n`);
  
  walkDirectory(CONFIG.rootDir);
  
  stats.project.type = detectProjectType();
  
  calculateComplexity();
  calculateTokens();
  
  printResults();
  
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const projectName = stats.project.name;
  
  console.log('📦 正在保存结果文件...\n');
  
  const statsForJson = JSON.parse(JSON.stringify(stats));
  statsForJson.files.list = statsForJson.files.list.map(f => ({
    relativePath: f.relativePath,
    size: f.size,
    lines: f.lines,
    ext: f.ext
  }));
  
  const jsonOutputPath = path.join(resultsDir, `${projectName}_${timestamp}.json`);
  fs.writeFileSync(jsonOutputPath, JSON.stringify(statsForJson, null, 2), 'utf8');
  console.log(`   ✅ JSON 数据: ${jsonOutputPath}`);
  
  const markdownReport = generateMarkdownReport();
  const mdOutputPath = path.join(resultsDir, `${projectName}_${timestamp}.md`);
  fs.writeFileSync(mdOutputPath, markdownReport, 'utf8');
  console.log(`   ✅ Markdown 报告: ${mdOutputPath}`);
  
  extractAllText(resultsDir);
  // 生成 HTML 可视化报告
  console.log('\n🎨 正在生成 HTML 可视化报告...');
  const htmlReport = generateHTMLReport();
  const htmlPath = path.join(resultsDir, `${projectName}_可视化报告_${timestamp}.html`);
  fs.writeFileSync(htmlPath, htmlReport, 'utf8');
  console.log(`   ✅ HTML 报告: ${htmlPath}`);
  
  
  // 生成项目结构树
  const projectStructure = generateProjectStructure();
  const structurePath = path.join(resultsDir, `${projectName}_项目结构_${timestamp}.txt`);
  fs.writeFileSync(structurePath, projectStructure, 'utf8');
  console.log(`   ✅ 项目结构: ${structurePath}`);
  
  // 生成完整文件列表
  const fileList = generateFileList();
  const fileListPath = path.join(resultsDir, `${projectName}_文件列表_${timestamp}.txt`);
  fs.writeFileSync(fileListPath, fileList, 'utf8');
  console.log(`   ✅ 文件列表: ${fileListPath}`);
  
  const latestJsonPath = path.join(resultsDir, '最新_统计数据.json');
  const latestMdPath = path.join(resultsDir, '最新_统计报告.md');
  const latestStructurePath = path.join(resultsDir, '最新_项目结构.txt');
  const latestFileListPath = path.join(resultsDir, '最新_文件列表.txt');
  const latestHtmlPath = path.join(resultsDir, '最新_可视化报告.html');
  
  fs.writeFileSync(latestJsonPath, JSON.stringify(statsForJson, null, 2), 'utf8');
  fs.writeFileSync(latestMdPath, markdownReport, 'utf8');
  fs.writeFileSync(latestStructurePath, projectStructure, 'utf8');
  fs.writeFileSync(latestFileListPath, fileList, 'utf8');
  fs.writeFileSync(latestHtmlPath, htmlReport, 'utf8');
  
  console.log(`\n📌 快速访问文件:`);
  console.log(`   📊 ${latestMdPath}`);
  console.log(`   📝 ${path.join(resultsDir, '最新_完整提取.txt')}`);
  console.log(`   🌳 ${latestStructurePath}`);
  console.log(`   📋 ${latestFileListPath}`);
  console.log(`   🎨 ${latestHtmlPath} ⭐ 推荐在浏览器中打开！\n`);
  
  console.log(`✨ 统计完成！所有结果已保存到 results 文件夹\n`);
}

main();