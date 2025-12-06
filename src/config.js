/**
 * 配置管理模块
 * 集中管理所有配置项和常量
 */

const fs = require('fs');
const path = require('path');

/**
 * 语言扩展名映射（50+ 种编程语言）
 */
const LANGUAGE_MAP = {
  // Web 前端
  '.js': 'JavaScript', '.jsx': 'JavaScript', '.mjs': 'JavaScript',
  '.ts': 'TypeScript', '.tsx': 'TypeScript',
  '.css': 'CSS', '.scss': 'SCSS', '.sass': 'Sass', '.less': 'Less',
  '.html': 'HTML', '.htm': 'HTML',
  '.vue': 'Vue', '.svelte': 'Svelte',
  
  // 后端语言
  '.py': 'Python', '.pyw': 'Python', '.pyx': 'Python',
  '.java': 'Java',
  '.go': 'Go',
  '.rs': 'Rust',
  '.cpp': 'C++', '.cc': 'C++', '.cxx': 'C++',
  '.c': 'C',
  '.h': 'C/C++', '.hpp': 'C++', '.hxx': 'C++',
  '.php': 'PHP',
  '.rb': 'Ruby',
  '.cs': 'C#',
  '.swift': 'Swift',
  '.kt': 'Kotlin', '.kts': 'Kotlin',
  '.scala': 'Scala',
  '.dart': 'Dart',
  '.lua': 'Lua',
  '.r': 'R',
  '.m': 'Objective-C',
  '.mm': 'Objective-C++',
  
  // 函数式语言
  '.ex': 'Elixir', '.exs': 'Elixir',
  '.erl': 'Erlang', '.hrl': 'Erlang',
  '.elm': 'Elm',
  '.hs': 'Haskell',
  '.clj': 'Clojure', '.cljs': 'ClojureScript',
  '.fs': 'F#', '.fsx': 'F#',
  
  // 配置和数据
  '.json': 'JSON',
  '.yaml': 'YAML', '.yml': 'YAML',
  '.toml': 'TOML',
  '.xml': 'XML',
  '.ini': 'INI',
  '.env': 'ENV',
  
  // 脚本语言
  '.sh': 'Shell', '.bash': 'Bash',
  '.bat': 'Batch', '.cmd': 'Batch',
  '.ps1': 'PowerShell',
  '.pl': 'Perl',
  
  // 数据库和查询
  '.sql': 'SQL',
  '.graphql': 'GraphQL', '.gql': 'GraphQL',
  '.prisma': 'Prisma',
  
  // 标记语言
  '.md': 'Markdown', '.markdown': 'Markdown',
  '.rst': 'reStructuredText',
  '.tex': 'LaTeX',
  
  // 其他
  '.proto': 'Protocol Buffers',
  '.sol': 'Solidity',
  '.v': 'Verilog',
  '.vhd': 'VHDL'
};

/**
 * 创建配置对象
 * @param {string} targetDir - 目标目录
 * @param {string} toolRoot - 工具所在的根目录（用于智能排除自身）
 * @returns {object} 配置对象
 */
function createConfig(targetDir, toolRoot = null) {
  return {
    // 项目根目录
    rootDir: targetDir,
    
    // 工具根目录（用于排除）
    toolRoot: toolRoot,
    
    // 需要统计的文件扩展名（50+ 种语言）
    extensions: {
      code: [
        // Web 前端
        '.js', '.jsx', '.mjs', '.ts', '.tsx', '.vue', '.svelte',
        '.css', '.scss', '.sass', '.less', '.stylus',
        '.html', '.htm', '.xml', '.svg',
        // 后端
        '.py', '.pyw', '.pyx', '.java', '.go', '.rs',
        '.cpp', '.cc', '.cxx', '.c', '.h', '.hpp', '.hxx',
        '.php', '.rb', '.cs', '.swift', '.kt', '.kts',
        '.scala', '.dart', '.lua', '.r', '.m', '.mm',
        // 函数式语言
        '.ex', '.exs', '.erl', '.hrl', '.elm', '.hs',
        '.clj', '.cljs', '.fs', '.fsx',
        // 配置和数据
        '.json', '.yaml', '.yml', '.toml', '.ini', '.env',
        // Shell 和脚本
        '.sh', '.bash', '.bat', '.cmd', '.ps1', '.pl',
        // 数据库和查询
        '.sql', '.graphql', '.gql', '.prisma',
        // 其他
        '.proto', '.sol', '.v', '.vhd'
      ],
      docs: ['.md', '.markdown', '.txt', '.rst', '.adoc', '.tex']
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
}

/**
 * 读取 .gitignore 文件中的排除规则
 * @param {string} rootDir - 项目根目录
 * @returns {string[]} gitignore 模式数组
 */
function loadGitignorePatterns(rootDir) {
  const gitignorePath = path.join(rootDir, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    const patterns = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => pattern.replace(/\/$/, ''));
    
    return patterns;
  } catch (error) {
    console.warn(`⚠️  无法读取 .gitignore: ${error.message}`);
    return [];
  }
}

/**
 * 初始化统计数据结构
 * @param {string} targetDir - 目标目录
 * @returns {object} 统计数据对象
 */
function initStats(targetDir) {
  return {
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
    },
    languageStats: {}
  };
}

module.exports = {
  LANGUAGE_MAP,
  createConfig,
  loadGitignorePatterns,
  initStats
};