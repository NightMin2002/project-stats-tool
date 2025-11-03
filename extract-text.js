/**
 * 文字提取工具 v1.0
 * 提取项目中所有代码和文档的文字内容到单个文件
 * 
 * 使用方法:
 *   node extract-text.js [项目路径]
 */

const fs = require('fs');
const path = require('path');

// 获取命令行参数
const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();

// 配置
const CONFIG = {
  rootDir: targetDir,
  
  // 要提取的文件类型
  extensions: [
    // 代码
    '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
    '.css', '.scss', '.sass', '.less',
    '.html', '.htm', '.xml',
    '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h',
    '.php', '.rb', '.cs', '.swift', '.kt',
    '.json', '.yaml', '.yml', '.toml',
    '.sh', '.bash', '.bat', '.ps1',
    '.sql', '.graphql',
    // 文档
    '.md', '.txt', '.rst', '.adoc'
  ],
  
  // 排除目录
  exclude: [
    'node_modules', '.git', '.svn', '.hg',
    'dist', 'build', 'out', 'target',
    '.next', '.nuxt', '.vuepress',
    'vendor', 'venv', '__pycache__',
    '.idea', '.vscode', '.DS_Store',
    'coverage', '.nyc_output',
    '统计工具', 'stats-tool', 'project-stats', 'results'
  ]
};

// 文件收集器
const files = [];
let totalSize = 0;

/**
 * 判断是否排除
 */
function shouldExclude(filePath) {
  const relativePath = path.relative(CONFIG.rootDir, filePath).replace(/\\/g, '/');
  
  // 检查排除规则
  if (CONFIG.exclude.some(pattern => relativePath.includes(pattern))) {
    return true;
  }
  
  // 排除包含提取脚本的目录
  const dirPath = path.dirname(filePath);
  if (fs.existsSync(path.join(dirPath, 'extract-text.js'))) {
    return true;
  }
  
  return false;
}

/**
 * 递归扫描目录
 */
function scanDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      if (shouldExclude(fullPath)) {
        return;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (CONFIG.extensions.includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const relativePath = path.relative(CONFIG.rootDir, fullPath);
            
            files.push({
              path: fullPath,
              relativePath: relativePath,
              content: content,
              size: stat.size,
              ext: ext
            });
            
            totalSize += stat.size;
          } catch (error) {
            // 跳过无法读取的文件
          }
        }
      }
    });
  } catch (error) {
    // 跳过无权限目录
  }
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
 * 生成提取文件
 */
function generateExtractedText() {
  const projectName = path.basename(CONFIG.rootDir);
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let output = `╔════════════════════════════════════════════════════════╗
║           ${projectName} - 完整文字提取                
║           生成时间: ${timestamp}
╚════════════════════════════════════════════════════════╝

项目路径: ${CONFIG.rootDir}
文件总数: ${files.length} 个
总大小: ${formatSize(totalSize)}

════════════════════════════════════════════════════════

`;

  // 按扩展名分组
  const filesByExt = {};
  files.forEach(file => {
    const ext = file.ext || 'other';
    if (!filesByExt[ext]) {
      filesByExt[ext] = [];
    }
    filesByExt[ext].push(file);
  });

  // 按文件数量排序
  const sortedExts = Object.entries(filesByExt).sort((a, b) => b[1].length - a[1].length);

  // 输出每个类型的文件
  sortedExts.forEach(([ext, extFiles]) => {
    output += `\n\n${'='.repeat(60)}\n`;
    output += `文件类型: ${ext} (${extFiles.length} 个文件)\n`;
    output += `${'='.repeat(60)}\n\n`;
    
    extFiles.forEach(file => {
      output += `\n${'-'.repeat(60)}\n`;
      output += `文件: ${file.relativePath}\n`;
      output += `大小: ${formatSize(file.size)}\n`;
      output += `${'-'.repeat(60)}\n\n`;
      output += file.content;
      output += '\n\n';
    });
  });

  return output;
}

/**
 * 主函数
 */
function main() {
  if (!fs.existsSync(CONFIG.rootDir)) {
    console.error(`❌ 错误: 目录不存在: ${CONFIG.rootDir}`);
    process.exit(1);
  }

  console.log(`\n📝 文字提取工具 v1.0\n`);
  console.log(`🔍 正在扫描: ${CONFIG.rootDir}\n`);
  
  // 扫描目录
  scanDirectory(CONFIG.rootDir);
  
  console.log(`✅ 找到 ${files.length} 个文件\n`);
  console.log(`📊 总大小: ${formatSize(totalSize)}\n`);
  
  // 生成提取文本
  console.log(`🔄 正在生成提取文件...\n`);
  const extractedText = generateExtractedText();
  
  // 创建 results 目录
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // 保存文件
  const projectName = path.basename(CONFIG.rootDir);
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const outputPath = path.join(resultsDir, `${projectName}_提取_${timestamp}.txt`);
  const latestPath = path.join(resultsDir, '最新_文字提取.txt');
  
  fs.writeFileSync(outputPath, extractedText, 'utf8');
  fs.writeFileSync(latestPath, extractedText, 'utf8');
  
  const outputSize = Buffer.byteLength(extractedText, 'utf8');
  
  console.log(`✨ 提取完成！\n`);
  console.log(`📄 保存位置: ${outputPath}`);
  console.log(`📏 文件大小: ${formatSize(outputSize)}\n`);
  console.log(`📌 快速访问: ${latestPath}\n`);
}

// 执行
main();