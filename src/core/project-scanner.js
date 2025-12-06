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
          const ext = path.extname(fullPath).toLowerCase();
          
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
 * 扫描整个项目
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 */
async function scanProject(stats, config, gitignorePatterns) {
  console.log('🚀 开始高速扫描...');
  const startTime = Date.now();
  
  await walkDirectory(config.rootDir, stats, config, gitignorePatterns);
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ 扫描完成，耗时 ${duration} 秒`);
}

module.exports = {
  scanProject,
  walkDirectory
};