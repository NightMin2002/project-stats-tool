/**
 * 树结构生成器模块
 * 提供目录树和文件树数据结构生成功能
 */

const fs = require('fs');
const path = require('path');
const { shouldExclude, isCodeFile, isDocFile } = require('../utils/file-utils');
const { formatNumber, formatSize } = require('../utils/formatters');

/**
 * 构建目录树结构（文本格式）
 * @param {string} dir - 目录路径
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @param {string} prefix - 前缀字符
 * @param {boolean} isLast - 是否为最后一项
 * @returns {string} 树结构字符串
 */
function buildDirectoryTree(dir, config, gitignorePatterns, prefix = '', isLast = true) {
  let tree = '';
  
  try {
    const items = fs.readdirSync(dir).sort();
    const validItems = items.filter(item => {
      const fullPath = path.join(dir, item);
      return !shouldExclude(fullPath, config, gitignorePatterns);
    });
    
    validItems.forEach((item, index) => {
      const fullPath = path.join(dir, item);
      const isLastItem = index === validItems.length - 1;
      const connector = isLastItem ? '└── ' : '├── ';
      const extension = isLastItem ? '    ' : '│   ';
      
      try {
        const stat = fs.statSync(fullPath);
        const isDirectory = stat.isDirectory();
        const icon = isDirectory ? '📁' : '📄';
        
        tree += `${prefix}${connector}${icon} ${item}\n`;
        
        if (isDirectory) {
          tree += buildDirectoryTree(fullPath, config, gitignorePatterns, prefix + extension, isLastItem);
        }
      } catch (error) {
        // 静默忽略无权限文件错误
      }
    });
  } catch (error) {
    // 静默忽略无权限目录错误
  }
  
  return tree;
}

/**
 * 生成项目结构树形图（完整格式）
 * @param {object} stats - 统计数据对象
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @returns {string} 完整的项目结构树字符串
 */
function generateProjectStructure(stats, config, gitignorePatterns) {
  console.log('\n🌳 正在生成项目结构树...');
  
  const projectName = stats.project.name;
  const timestamp = new Date().toLocaleString('zh-CN');
  
  let structure = `╔════════════════════════════════════════════════════════╗
║           ${projectName} - 项目结构树                
║           生成时间: ${timestamp}
╚════════════════════════════════════════════════════════╝

项目路径: ${stats.project.path}
项目类型: ${stats.project.type}

📦 ${projectName}/
`;
  
  structure += buildDirectoryTree(config.rootDir, config, gitignorePatterns, '');
  
  structure += `
════════════════════════════════════════════════════════

📊 统计摘要:
   • 总文件数: ${formatNumber(stats.files.total)} 个
   • 总目录数: (已包含在树中)
   • 排除文件: ${formatNumber(stats.files.excluded.libraries)} 个第三方库

*由项目统计工具 v2.10.0 自动生成*
`;
  
  return structure;
}

/**
 * 构建文件树的 JSON 数据结构（用于可视化）
 * @param {string} dir - 目录路径
 * @param {object} config - 配置对象
 * @param {string[]} gitignorePatterns - gitignore 模式数组
 * @param {string} rootPath - 根路径
 * @returns {object} 文件树数据结构
 */
function buildFileTreeData(dir, config, gitignorePatterns, rootPath = config.rootDir) {
  const tree = {
    name: path.basename(dir),
    path: path.relative(rootPath, dir) || '.',
    type: 'directory',
    children: []
  };
  
  try {
    const items = fs.readdirSync(dir).sort((a, b) => {
      // 目录优先排序
      const fullPathA = path.join(dir, a);
      const fullPathB = path.join(dir, b);
      try {
        const statA = fs.statSync(fullPathA);
        const statB = fs.statSync(fullPathB);
        if (statA.isDirectory() && !statB.isDirectory()) return -1;
        if (!statA.isDirectory() && statB.isDirectory()) return 1;
        return a.localeCompare(b);
      } catch {
        return a.localeCompare(b);
      }
    });
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      
      // 跳过排除的路径
      if (shouldExclude(fullPath, config, gitignorePatterns)) {
        return;
      }
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 递归处理子目录
          const subTree = buildFileTreeData(fullPath, config, gitignorePatterns, rootPath);
          // 始终包含目录节点，即使为空（用户可能想看到结构）
          tree.children.push(subTree);
        } else {
          const ext = path.extname(fullPath).toLowerCase();
          // 对于可视化文件树，包含所有代码和文档文件（包括第三方库）
          if (isCodeFile(fullPath, config) || isDocFile(fullPath, config)) {
            tree.children.push({
              name: item,
              path: path.relative(rootPath, fullPath),
              type: 'file',
              ext: ext,
              size: stat.size
            });
          }
        }
      } catch (error) {
        // 记录错误但继续处理其他文件
        console.warn(`警告: 无法访问 ${fullPath}: ${error.message}`);
      }
    });
  } catch (error) {
    console.warn(`警告: 无法读取目录 ${dir}: ${error.message}`);
  }
  
  return tree;
}

module.exports = {
  buildDirectoryTree,
  generateProjectStructure,
  buildFileTreeData
};