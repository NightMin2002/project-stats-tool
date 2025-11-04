/**
 * 配置管理模块
 * 集中管理所有配置项和常量
 */

const fs = require('fs');
const path = require('path');

/**
 * 语言扩展名映射
 */
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
 * 创建配置对象
 * @param {string} targetDir - 目标目录
 * @returns {object} 配置对象
 */
function createConfig(targetDir) {
  return {
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
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => pattern.replace(/\/$/, ''));
  } catch (error) {
    // 忽略读取错误
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