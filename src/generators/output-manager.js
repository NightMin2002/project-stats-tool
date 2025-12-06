/**
 * 输出管理模块
 * 负责将所有生成的报告保存到文件系统
 * v2.5 更新: 并行文件写入
 */

const fs = require('fs');
const path = require('path');
const { formatSize } = require('../utils/formatters');

/**
 * 格式化文件系统安全的项目名称
 * @param {string} name - 原始项目名称
 * @returns {string} 安全的名称
 */
function sanitizeFolderName(name) {
  return name.replace(/[\\/:*?"<>|]/g, '_');
}

/**
 * 异步写入文件
 * @param {string} filePath 
 * @param {string} content 
 * @param {string} description 
 */
async function writeFileAsync(filePath, content, description) {
  await fs.promises.writeFile(filePath, content, 'utf8');
  console.log(`   ✅ ${description}: ${path.basename(filePath)}`);
  if (description.includes('完整文字')) {
    console.log(`   📊 文件大小: ${formatSize(Buffer.byteLength(content, 'utf8'))}`);
  }
}

/**
 * 保存所有报告到文件系统
 * @param {object} reports - 包含所有报告内容的对象
 * @param {object} stats - 统计数据对象
 * @param {string} resultsDir - 结果根目录路径
 * @returns {Promise<object>} 包含保存路径信息的对象
 */
async function saveAllReports(reports, stats, resultsDir) {
  // 生成时间戳
  const now = new Date();
  const folderTimestamp = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-').replace(/:/g, '-').replace(/ /g, '_');
  
  // 获取项目安全名称
  const projectSafeName = sanitizeFolderName(stats.project.name);
  
  // v2.4 变更: 创建项目专属文件夹 (results/<ProjectName>/<Timestamp>)
  const projectBaseDir = path.join(resultsDir, projectSafeName);
  const currentResultDir = path.join(projectBaseDir, folderTimestamp);
  
  // 递归创建目录
  if (!fs.existsSync(currentResultDir)) {
    fs.mkdirSync(currentResultDir, { recursive: true });
  }
  
  console.log('📦 正在保存结果文件...\n');
  console.log(`📁 结果保存位置: results/${projectSafeName}/${folderTimestamp}\n`);
  
  // 准备 JSON 数据（移除文件内容）
  const statsForJson = JSON.parse(JSON.stringify(stats));
  statsForJson.files.list = statsForJson.files.list.map(f => ({
    relativePath: f.relativePath,
    size: f.size,
    lines: f.lines,
    ext: f.ext
  }));
  
  const statsJsonContent = JSON.stringify(statsForJson, null, 2);

  // 并行写入所有文件
  await Promise.all([
    writeFileAsync(path.join(currentResultDir, '统计数据.json'), statsJsonContent, 'JSON 数据'),
    writeFileAsync(path.join(currentResultDir, '统计报告.md'), reports.markdown, 'Markdown 报告'),
    writeFileAsync(path.join(currentResultDir, '完整提取.txt'), reports.fullText, '完整文字'),
    writeFileAsync(path.join(currentResultDir, '可视化报告.html'), reports.html, 'HTML 报告'),
    writeFileAsync(path.join(currentResultDir, '项目结构.txt'), reports.structure, '项目结构'),
    writeFileAsync(path.join(currentResultDir, '文件列表.txt'), reports.fileList, '文件列表')
  ]);
  
  // 创建或更新"最新"文件夹 (results/<ProjectName>/最新)
  const latestDir = path.join(projectBaseDir, '最新');
  if (fs.existsSync(latestDir)) {
    // 删除旧的最新文件夹中的文件
    const latestFiles = await fs.promises.readdir(latestDir);
    await Promise.all(latestFiles.map(async file => {
      const filePath = path.join(latestDir, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }));
  } else {
    fs.mkdirSync(latestDir, { recursive: true });
  }
  
  // 并行复制所有文件到"最新"文件夹
  await Promise.all([
    fs.promises.writeFile(path.join(latestDir, '统计数据.json'), statsJsonContent, 'utf8'),
    fs.promises.writeFile(path.join(latestDir, '统计报告.md'), reports.markdown, 'utf8'),
    fs.promises.writeFile(path.join(latestDir, '项目结构.txt'), reports.structure, 'utf8'),
    fs.promises.writeFile(path.join(latestDir, '文件列表.txt'), reports.fileList, 'utf8'),
    fs.promises.writeFile(path.join(latestDir, '可视化报告.html'), reports.html, 'utf8'),
    fs.promises.writeFile(path.join(latestDir, '完整提取.txt'), reports.fullText, 'utf8')
  ]);
  
  return {
    currentResultDir,
    folderTimestamp,
    latestDir,
    projectSafeName
  };
}

module.exports = {
  saveAllReports
};