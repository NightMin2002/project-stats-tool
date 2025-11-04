/**
 * 统一错误处理工具模块
 * 提供标准化的错误处理和日志记录功能
 */

/**
 * 自定义文件操作错误类
 */
class FileOperationError extends Error {
  constructor(operation, filePath, originalError) {
    super(`${operation} 失败: ${filePath}`);
    this.name = 'FileOperationError';
    this.operation = operation;
    this.filePath = filePath;
    this.originalError = originalError;
    this.code = originalError?.code;
  }
}

/**
 * 处理文件操作错误的统一函数
 * @param {Error} error - 原始错误对象
 * @param {string} operation - 操作类型（如 "读取文件"、"写入文件"）
 * @param {string} filePath - 文件路径
 * @param {object} options - 选项
 * @param {boolean} options.silent - 是否静默处理（默认 false）
 * @param {*} options.fallback - 错误时返回的默认值（默认 null）
 * @param {boolean} options.throwOnCritical - 是否在严重错误时抛出异常（默认 false）
 * @returns {*} fallback 值或抛出异常
 */
function handleFileError(error, operation, filePath, options = {}) {
  const { 
    silent = false, 
    fallback = null, 
    throwOnCritical = false 
  } = options;
  
  // 权限错误 - 通常可以安全忽略
  if (error.code === 'EACCES' || error.code === 'EPERM') {
    if (!silent) {
      console.warn(`⚠️  无权限${operation}: ${filePath}`);
    }
    return fallback;
  }
  
  // 文件/目录不存在 - 通常可以安全忽略
  if (error.code === 'ENOENT') {
    if (!silent) {
      console.warn(`⚠️  ${operation}失败，路径不存在: ${filePath}`);
    }
    return fallback;
  }
  
  // 磁盘空间不足 - 严重错误
  if (error.code === 'ENOSPC') {
    console.error(`❌ 磁盘空间不足，${operation}失败: ${filePath}`);
    if (throwOnCritical) {
      throw new FileOperationError(operation, filePath, error);
    }
    return fallback;
  }
  
  // 文件已存在（写入时）
  if (error.code === 'EEXIST') {
    if (!silent) {
      console.warn(`⚠️  文件已存在: ${filePath}`);
    }
    return fallback;
  }
  
  // 其他未知错误 - 记录详细信息
  console.error(`❌ ${operation}失败: ${filePath}`);
  console.error(`   错误类型: ${error.code || 'UNKNOWN'}`);
  console.error(`   错误信息: ${error.message}`);
  
  if (throwOnCritical) {
    throw new FileOperationError(operation, filePath, error);
  }
  
  return fallback;
}

/**
 * 安全的文件读取函数
 * @param {string} filePath - 文件路径
 * @param {object} options - 选项
 * @returns {string|null} 文件内容或 null
 */
function safeReadFile(filePath, options = {}) {
  const fs = require('fs');
  const { encoding = 'utf8', silent = false, maxSize = null } = options;
  
  try {
    // 检查文件大小（如果设置了限制）
    if (maxSize) {
      const stat = fs.statSync(filePath);
      if (stat.size > maxSize) {
        const { formatSize } = require('./formatters');
        if (!silent) {
          console.warn(`⚠️  文件过大，跳过: ${filePath} (${formatSize(stat.size)})`);
        }
        return null;
      }
    }
    
    return fs.readFileSync(filePath, encoding);
  } catch (error) {
    return handleFileError(error, '读取文件', filePath, { silent });
  }
}

/**
 * 安全的文件写入函数
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @param {object} options - 选项
 * @returns {boolean} 是否成功
 */
function safeWriteFile(filePath, content, options = {}) {
  const fs = require('fs');
  const path = require('path');
  const { encoding = 'utf8', silent = false } = options;
  
  try {
    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, encoding);
    return true;
  } catch (error) {
    handleFileError(error, '写入文件', filePath, { silent, throwOnCritical: true });
    return false;
  }
}

/**
 * 安全的目录读取函数
 * @param {string} dirPath - 目录路径
 * @param {object} options - 选项
 * @returns {string[]|null} 文件列表或 null
 */
function safeReadDir(dirPath, options = {}) {
  const fs = require('fs');
  const { silent = true } = options;
  
  try {
    return fs.readdirSync(dirPath);
  } catch (error) {
    return handleFileError(error, '读取目录', dirPath, { silent, fallback: [] });
  }
}

/**
 * 安全的文件状态获取函数
 * @param {string} filePath - 文件路径
 * @param {object} options - 选项
 * @returns {fs.Stats|null} 文件状态或 null
 */
function safeStat(filePath, options = {}) {
  const fs = require('fs');
  const { silent = true } = options;
  
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return handleFileError(error, '获取文件信息', filePath, { silent });
  }
}

module.exports = {
  FileOperationError,
  handleFileError,
  safeReadFile,
  safeWriteFile,
  safeReadDir,
  safeStat
};