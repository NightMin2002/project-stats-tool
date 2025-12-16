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
  // 如果是用于可视化，不排除第三方库，显示完整结构
  if (forVisualization) {
    return false;
  }

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
  
  // 如果 config 还没有 excludeSet，创建一个
  if (!config._excludeSet) {
    config._excludeSet = new Set(config.defaultExclude);
  }
  
  // 1. 精确匹配排除目录（如 node_modules, build）
  const pathParts = normalizedPath.split('/');
  for (const part of pathParts) {
    if (!part) continue;
    if (config._excludeSet.has(part)) {
      return true;
    }
  }
  
  // 2. 智能排除工具自身：仅当在扫描父目录时，才排除工具目录
  // 如果用户明确指定要扫描工具所在的目录（Target == ToolRoot），则绝不排除！
  if (config.toolRoot) {
    const absFilePath = path.resolve(filePath);
    const absToolRoot = path.resolve(config.toolRoot);
    const absTargetRoot = path.resolve(config.rootDir);

    // 如果当前扫描的目标目录 就是 工具所在的目录
    // 那么用户显然是想统计工具本身的源码，这种情况下不进行自我排除
    if (absToolRoot === absTargetRoot) {
        // pass，不排除
    } 
    // 否则，如果文件位于工具目录下，说明是在扫描父级或其他目录时遇到了工具目录
    // 这时为了避免污染数据，应该排除工具目录
    else if (absFilePath.startsWith(absToolRoot) && absFilePath !== absToolRoot) {
        // 但还需要排除一种情况：如果工具目录就在目标目录下（例如目标是父目录）
        // 我们只排除工具目录下的非代码资源？不，通常直接排除整个工具目录
        return true;
    }
  }
  
  // 3. 检查 .gitignore 规则（改进版：更精确的匹配逻辑）
  for (const pattern of gitignorePatterns) {
    // 跳过空模式
    if (!pattern) continue;
    
    // 处理通配符模式（如 *.log, build/*, *.min.js 等）
    if (pattern.includes('*')) {
      // 转换 gitignore glob 模式为正则表达式
      // 将 ** 转换为匹配任意路径的模式
      // 将 * 转换为匹配非路径分隔符的模式
      let regexPattern = pattern
        .replace(/\./g, '\\.')           // 转义点号
        .replace(/\*\*/g, '<<<GLOBSTAR>>>')  // 临时标记 **
        .replace(/\*/g, '[^/]*')         // * 匹配非斜杠字符
        .replace(/<<<GLOBSTAR>>>/g, '.*'); // ** 匹配任意字符（包括斜杠）
      
      // 如果模式不以路径分隔符开头，允许在任意目录层级匹配
      if (!pattern.startsWith('/')) {
        regexPattern = '(^|/)' + regexPattern;
      } else {
        regexPattern = '^' + regexPattern.slice(1); // 移除开头的 /
      }
      
      // 如果模式以 / 结尾，只匹配目录
      if (pattern.endsWith('/')) {
        regexPattern = regexPattern.slice(0, -1) + '(/|$)';
      } else {
        regexPattern = regexPattern + '($|/)';
      }
      
      try {
        const regex = new RegExp(regexPattern);
        if (regex.test(normalizedPath)) {
          return true;
        }
      } catch (e) {
        // 正则表达式无效，跳过此模式
      }
    } else {
      // 非通配符模式：作为目录名或路径段精确匹配
      // 不再使用 includes()，改为检查路径段是否精确匹配
      
      // 如果模式包含路径分隔符，作为路径前缀匹配
      if (pattern.includes('/')) {
        const cleanPattern = pattern.replace(/^\//, '').replace(/\/$/, '');
        if (normalizedPath === cleanPattern ||
            normalizedPath.startsWith(cleanPattern + '/')) {
          return true;
        }
      } else {
        // 单个名称：检查是否是路径中的某个完整段（目录或文件名）
        // 例如模式 "build" 应该匹配 "build/xxx" 或 "src/build/xxx"
        // 但不应该匹配 "rebuild/xxx" 或 "builder.tsx"
        const pathSegments = normalizedPath.split('/');
        if (pathSegments.includes(pattern)) {
          return true;
        }
      }
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
 */
async function isBinaryFile(filePath) {
  let handle;
  try {
    handle = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(4096);
    const { bytesRead } = await handle.read(buffer, 0, 4096, 0);
    
    if (bytesRead === 0) return false; 

    let startCheckOffset = 0;

    if (bytesRead >= 2) {
      if (buffer[0] === 0xFF && buffer[1] === 0xFE) return false; 
      if (buffer[0] === 0xFE && buffer[1] === 0xFF) return false;
    }
    
    if (bytesRead >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        startCheckOffset = 3;
    }

    for (let i = startCheckOffset; i < bytesRead; i++) {
      if (buffer[i] === 0) return true; 
    }
    return false;
  } catch (error) {
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