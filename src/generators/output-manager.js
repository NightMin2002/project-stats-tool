/**
 * 输出管理模块
 * 负责将所有生成的报告保存到文件系统
 */

const fs = require('fs');
const path = require('path');
const { formatSize } = require('../utils/formatters');

/**
 * 保存所有报告到文件系统
 * @param {object} reports - 包含所有报告内容的对象
 * @param {object} stats - 统计数据对象
 * @param {string} resultsDir - 结果目录路径
 * @returns {object} 包含保存路径信息的对象
 */
function saveAllReports(reports, stats, resultsDir) {
  // 生成时间戳和文件夹名称
  const now = new Date();
  const folderTimestamp = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\//g, '-').replace(/:/g, '-').replace(/ /g, '_');
  
  // 创建本次统计的专属文件夹
  const currentResultDir = path.join(resultsDir, folderTimestamp);
  fs.mkdirSync(currentResultDir, { recursive: true });
  
  console.log('📦 正在保存结果文件...\n');
  console.log(`📁 本次结果文件夹: ${folderTimestamp}\n`);
  
  // 准备 JSON 数据（移除文件内容）
  const statsForJson = JSON.parse(JSON.stringify(stats));
  statsForJson.files.list = statsForJson.files.list.map(f => ({
    relativePath: f.relativePath,
    size: f.size,
    lines: f.lines,
    ext: f.ext
  }));
  
  // 保存到时间戳文件夹
  fs.writeFileSync(
    path.join(currentResultDir, '统计数据.json'),
    JSON.stringify(statsForJson, null, 2),
    'utf8'
  );
  console.log(`   ✅ JSON 数据: 统计数据.json`);
  
  fs.writeFileSync(
    path.join(currentResultDir, '统计报告.md'),
    reports.markdown,
    'utf8'
  );
  console.log(`   ✅ Markdown 报告: 统计报告.md`);
  
  fs.writeFileSync(
    path.join(currentResultDir, '完整提取.txt'),
    reports.fullText,
    'utf8'
  );
  console.log(`   ✅ 完整文字: 完整提取.txt`);
  console.log(`   📊 文件大小: ${formatSize(Buffer.byteLength(reports.fullText, 'utf8'))}`);
  
  fs.writeFileSync(
    path.join(currentResultDir, '可视化报告.html'),
    reports.html,
    'utf8'
  );
  console.log(`   ✅ HTML 报告: 可视化报告.html`);
  
  fs.writeFileSync(
    path.join(currentResultDir, '项目结构.txt'),
    reports.structure,
    'utf8'
  );
  console.log(`   ✅ 项目结构: 项目结构.txt`);
  
  fs.writeFileSync(
    path.join(currentResultDir, '文件列表.txt'),
    reports.fileList,
    'utf8'
  );
  console.log(`   ✅ 文件列表: 文件列表.txt`);
  
  // 创建或更新"最新"文件夹
  const latestDir = path.join(resultsDir, '最新');
  if (fs.existsSync(latestDir)) {
    // 删除旧的最新文件夹中的文件
    const latestFiles = fs.readdirSync(latestDir);
    latestFiles.forEach(file => {
      const filePath = path.join(latestDir, file);
      if (fs.statSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    fs.mkdirSync(latestDir, { recursive: true });
  }
  
  // 复制所有文件到"最新"文件夹
  fs.writeFileSync(
    path.join(latestDir, '统计数据.json'),
    JSON.stringify(statsForJson, null, 2),
    'utf8'
  );
  fs.writeFileSync(path.join(latestDir, '统计报告.md'), reports.markdown, 'utf8');
  fs.writeFileSync(path.join(latestDir, '项目结构.txt'), reports.structure, 'utf8');
  fs.writeFileSync(path.join(latestDir, '文件列表.txt'), reports.fileList, 'utf8');
  fs.writeFileSync(path.join(latestDir, '可视化报告.html'), reports.html, 'utf8');
  fs.writeFileSync(path.join(latestDir, '完整提取.txt'), reports.fullText, 'utf8');
  
  return {
    currentResultDir,
    folderTimestamp,
    latestDir
  };
}

module.exports = {
  saveAllReports
};