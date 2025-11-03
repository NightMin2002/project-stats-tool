/**
 * 项目统计工具 v2.3
 * 智能统计项目的文字数量、代码行数和 tokens 估算
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

// 获取命令行参数指定的目录，默认为当前工作目录
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

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
    '统计工具', 'stats-tool', 'project-stats', 'results'
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
 */
function isLibraryFile(filePath) {
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
  
  // 智能排除：如果目录包含 project-stats.js，排除该目录
  const dirPath = path.dirname(filePath);
  if (fs.existsSync(path.join(dirPath, 'project-stats.js'))) {
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
          // 检查是否为第三方库文件
          if (isLibraryFile(fullPath)) {
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
> **工具版本**: v2.3  
> **智能过滤**: 已排除第三方库文件

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

*由 [项目统计工具 v2.3](https://github.com) 自动生成*
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
  console.log('║              📊 项目统计结果 v2.3                      ║');
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
  
  const latestJsonPath = path.join(resultsDir, '最新_统计数据.json');
  const latestMdPath = path.join(resultsDir, '最新_统计报告.md');
  fs.writeFileSync(latestJsonPath, JSON.stringify(statsForJson, null, 2), 'utf8');
  fs.writeFileSync(latestMdPath, markdownReport, 'utf8');
  
  console.log(`\n📌 快速访问文件:`);
  console.log(`   📊 ${latestMdPath}`);
  console.log(`   📝 ${path.join(resultsDir, '最新_完整提取.txt')}\n`);
  
  console.log(`✨ 统计完成！所有结果已保存到 results 文件夹\n`);
}

main();