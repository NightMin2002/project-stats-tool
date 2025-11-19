/**
 * 项目扫描模块
 * 提供递归遍历目录和文件扫描功能
 */

const fs = require('fs');
const path = require('path');
const { shouldExclude, isCodeFile, isDocFile, isLibraryFile } = require('../utils/file-utils');
const { analyzeFile } = require('../analyzers/file-analyzer');

/**
 * 递归遍历目录并分析文件
 * @param {string} dir - 目录路径
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 */
async function walkDirectory(dir, stats, config, gitignorePatterns) {
  try {
    const items = await fs.promises.readdir(dir);
    
    // 并行处理目录中的所有项
    await Promise.all(items.map(async (item) => {
      const fullPath = path.join(dir, item);
      
      if (shouldExclude(fullPath, config, gitignorePatterns)) {
        return;
      }
      
      try {
        const stat = await fs.promises.stat(fullPath);
        
        if (stat.isDirectory()) {
          await walkDirectory(fullPath, stats, config, gitignorePatterns);
        } else if (stat.isFile()) {
          const ext = path.extname(fullPath).toLowerCase();
          if (isCodeFile(fullPath, config) || isDocFile(fullPath, config)) {
            // 检查是否为第三方库文件（用于文字提取和代码统计）
            if (isLibraryFile(fullPath, config, false)) {
              stats.files.excluded.libraries++;
              stats.files.excluded.total++;
            } else {
              await analyzeFile(fullPath, stats, config);
            }
          }
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
    }));
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
 * 扫描整个项目
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 */
async function scanProject(stats, config, gitignorePatterns) {
  await walkDirectory(config.rootDir, stats, config, gitignorePatterns);
}

module.exports = {
  scanProject,
  walkDirectory
};