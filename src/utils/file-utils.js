/**
 * 文件工具模块
 * 提供文件判断、路径处理等功能
 */

const fs = require('fs');
const path = require('path');

/**
 * 判断是否为第三方库文件
 * @param {string} filePath - 文件路径
 * @param {object} config - 配置对象
 * @param {boolean} forVisualization - 是否用于可视化（文件树展示）
 * @returns {boolean}
 */
function isLibraryFile(filePath, config, forVisualization = false) {
  const relativePath = path.relative(config.rootDir, filePath).replace(/\\/g, '/');
  const fileName = path.basename(filePath).toLowerCase();
  
  // 检查是否在库目录中
  const pathParts = relativePath.split('/');
  for (const part of pathParts) {
    if (config.libraryDirs.includes(part.toLowerCase())) {
      return true;
    }
  }
  
  // 检查文件名特征
  for (const pattern of config.libraryFilePatterns) {
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
 * @param {string} filePath - 文件路径
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @returns {boolean}
 */
function shouldExclude(filePath, config, gitignorePatterns) {
  const relativePath = path.relative(config.rootDir, filePath);
  const normalizedPath = relativePath.replace(/\\/g, '/');
  
  // 检查默认排除规则（使用 Set 优化性能）
  // 如果 config 还没有 excludeSet，创建一个
  if (!config._excludeSet) {
    config._excludeSet = new Set(config.defaultExclude);
  }
  
  for (const pattern of config._excludeSet) {
    if (normalizedPath.includes(pattern)) {
      return true;
    }
  }
  
  // 智能排除：如果目录包含 project-stats.js，但不是根目录本身，则排除该目录
  // 注意：这里使用同步 fs.existsSync 是为了保持 shouldExclude 为同步函数
  // 因为它在遍历循环中被频繁调用，且通常只检查路径字符串
  // 只有这个特定的智能排除逻辑需要文件系统访问
  // 在大规模项目中，这可能成为性能瓶颈，但在当前架构下是可以接受的
  const dirPath = path.dirname(filePath);
  try {
    const isToolDir = fs.existsSync(path.join(dirPath, 'project-stats.js'));
    const isRootDir = path.resolve(dirPath) === path.resolve(config.rootDir);
    
    if (isToolDir && !isRootDir) {
      return true;
    }
  } catch (e) {
    // 忽略文件系统错误
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
 * @param {string} filePath - 文件路径
 * @param {object} config - 配置对象
 * @returns {boolean}
 */
function isCodeFile(filePath, config) {
  const ext = path.extname(filePath).toLowerCase();
  return config.extensions.code.includes(ext);
}

/**
 * 判断是否为文档文件
 * @param {string} filePath - 文件路径
 * @param {object} config - 配置对象
 * @returns {boolean}
 */
function isDocFile(filePath, config) {
  const ext = path.extname(filePath).toLowerCase();
  return config.extensions.docs.includes(ext);
}

/**
 * 检测文件是否为二进制文件
 * 通过读取文件前 4KB 内容并检查空字节来判断
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>}
 */
async function isBinaryFile(filePath) {
  let handle;
  try {
    handle = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(4096);
    const { bytesRead } = await handle.read(buffer, 0, 4096, 0);
    
    // 检查空字节 (Null Byte)
    // 文本文件通常不包含空字节，而二进制文件通常包含
    for (let i = 0; i < bytesRead; i++) {
      if (buffer[i] === 0) {
        return true;
      }
    }
    return false;
  } catch (error) {
    // 如果读取失败，假设不是二进制文件（或者让上层处理错误）
    return false;
  } finally {
    if (handle) await handle.close();
  }
}

module.exports = {
  isLibraryFile,
  shouldExclude,
  isCodeFile,
  isDocFile,
  isBinaryFile
};