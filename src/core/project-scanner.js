/**
 * 项目扫描模块 v3.2.0
 * 提供递归遍历目录和文件扫描功能
 * 新增：CLI 进度条显示
 */

const fs = require('fs');
const path = require('path');
const { shouldExclude, isCodeFile, isDocFile, isLibraryFile } = require('../utils/file-utils');
const { analyzeFile } = require('../analyzers/file-analyzer');
const { ProgressBar, Spinner } = require('../utils/progress-bar');

/**
 * 处理单个文件
 * @param {string} fullPath - 文件完整路径
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 */
async function processFile(fullPath, stats, config) {
  if (isCodeFile(fullPath, config) || isDocFile(fullPath, config)) {
    // 检查是否为第三方库文件（用于文字提取和代码统计）
    if (isLibraryFile(fullPath, config, false)) {
      stats.files.excluded.libraries++;
      stats.files.excluded.total++;
    } else {
      // 分析文件 (analyzeFile 内部处理了二进制检测和读取)
      await analyzeFile(fullPath, stats, config);
    }
  }
}

/**
 * 递归遍历目录并分析文件
 * 优化: 使用 withFileTypes: true 减少 fs.stat 调用
 * 优化: 限制并发数以避免 EMFILE 错误 (简单实现)
 * @param {string} dir - 目录路径
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 */
async function walkDirectory(dir, stats, config, gitignorePatterns) {
  try {
    // 优化: 直接获取 Dirent 对象，包含文件类型信息，减少 stat 调用
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    
    // 并行处理目录中的所有项
    const promises = items.map(async (item) => {
      const fullPath = path.join(dir, item.name);
      
      if (shouldExclude(fullPath, config, gitignorePatterns)) {
        return;
      }
      
      try {
        if (item.isDirectory()) {
          await walkDirectory(fullPath, stats, config, gitignorePatterns);
        } else if (item.isFile()) {
          await processFile(fullPath, stats, config);
        }
      } catch (itemError) {
        // 处理单个文件/目录的错误，不影响整体扫描
        if (itemError.code === 'EACCES' || itemError.code === 'EPERM') {
          // 权限错误，静默跳过
        } else if (itemError.code === 'ENOENT') {
          // 文件在扫描过程中被删除，跳过
        } else {
          // 其他错误记录日志
          console.warn(`⚠️  无法访问: ${fullPath} (${itemError.message})`);
        }
      }
    });

    // 等待该目录下所有直接子项处理完成
    await Promise.all(promises);

  } catch (error) {
    // 处理目录级别的错误
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      // 无权限访问目录，静默跳过
    } else if (error.code === 'ENOENT') {
      // 目录不存在，静默跳过
    } else {
      // 其他错误记录日志
      console.warn(`⚠️  无法读取目录: ${dir} (${error.message})`);
    }
  }
}

/**
 * 预扫描：快速统计文件数量（用于进度条）
 * @param {string} dir - 目录路径
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @returns {Promise<number>} 文件数量
 */
async function countFiles(dir, config, gitignorePatterns) {
  let count = 0;
  
  try {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (shouldExclude(fullPath, config, gitignorePatterns)) {
        continue;
      }
      
      if (item.isDirectory()) {
        count += await countFiles(fullPath, config, gitignorePatterns);
      } else if (item.isFile()) {
        if (isCodeFile(fullPath, config) || isDocFile(fullPath, config)) {
          count++;
        }
      }
    }
  } catch (error) {
    // 忽略错误
  }
  
  return count;
}

/**
 * 扫描整个项目
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @param {object} options - 扫描选项
 * @param {boolean} options.showProgress - 是否显示进度条（默认 true）
 */
async function scanProject(stats, config, gitignorePatterns, options = {}) {
  const showProgress = options.showProgress !== false && process.stdout.isTTY;
  const startTime = Date.now();
  
  let progressBar = null;
  let spinner = null;
  
  // 检查根路径是文件还是目录
  try {
    const rootStat = await fs.promises.stat(config.rootDir);
    
    if (rootStat.isFile()) {
      // 如果是文件，直接分析
      if (!shouldExclude(config.rootDir, config, gitignorePatterns)) {
        await processFile(config.rootDir, stats, config);
      }
      console.log('✓ 文件分析完成');
    } else if (rootStat.isDirectory()) {
      if (showProgress) {
        // 显示预扫描 spinner
        spinner = new Spinner('正在预扫描文件数量');
        spinner.start();
        
        // 快速统计文件数量
        const totalFiles = await countFiles(config.rootDir, config, gitignorePatterns);
        spinner.succeed(`发现 ${totalFiles} 个待分析文件`);
        
        if (totalFiles > 0) {
          // 创建进度条
          progressBar = new ProgressBar({
            total: totalFiles,
            title: '扫描分析',
            showETA: true
          });
          
          // 开始遍历（带进度条）
          await walkDirectoryWithProgress(config.rootDir, stats, config, gitignorePatterns, progressBar);
        }
      } else {
        // 无进度条模式
        console.log('🚀 开始高速扫描...');
        await walkDirectory(config.rootDir, stats, config, gitignorePatterns);
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✅ 扫描完成，耗时 ${duration} 秒`);
      }
    }
  } catch (error) {
    if (spinner) spinner.fail(`无法访问项目路径`);
    if (progressBar) progressBar.abort('扫描出错');
    console.error(`❌ 错误: ${config.rootDir} (${error.message})`);
  }
}

/**
 * 带进度条的目录遍历
 */
async function walkDirectoryWithProgress(dir, stats, config, gitignorePatterns, progressBar) {
  try {
    const items = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (shouldExclude(fullPath, config, gitignorePatterns)) {
        continue;
      }
      
      try {
        if (item.isDirectory()) {
          await walkDirectoryWithProgress(fullPath, stats, config, gitignorePatterns, progressBar);
        } else if (item.isFile()) {
          if (isCodeFile(fullPath, config) || isDocFile(fullPath, config)) {
            // 显示当前文件名
            const relativePath = path.relative(config.rootDir, fullPath);
            const shortName = relativePath.length > 40
              ? '...' + relativePath.slice(-37)
              : relativePath;
            
            await processFile(fullPath, stats, config);
            progressBar.tick(1, shortName);
          }
        }
      } catch (itemError) {
        if (itemError.code !== 'EACCES' && itemError.code !== 'EPERM' && itemError.code !== 'ENOENT') {
          // 静默处理常见错误
        }
      }
    }
  } catch (error) {
    if (error.code !== 'EACCES' && error.code !== 'EPERM' && error.code !== 'ENOENT') {
      console.warn(`⚠️  无法读取目录: ${dir}`);
    }
  }
}

module.exports = {
  scanProject,
  walkDirectory
};