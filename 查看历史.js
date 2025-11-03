/**
 * 历史记录查看器 v1.0
 * 用于查看、管理和导出历史统计数据
 */

const fs = require('fs');
const path = require('path');

const historyFile = path.join(__dirname, 'results', 'history.json');

// 加载历史数据
function loadHistory() {
  if (!fs.existsSync(historyFile)) {
    console.log('❌ 未找到历史记录文件');
    console.log(`   请先运行 "node project-stats.js" 生成统计数据`);
    return null;
  }
  
  try {
    const data = fs.readFileSync(historyFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ 读取历史文件失败:', error.message);
    return null;
  }
}

// 格式化数字
function formatNumber(num) {
  return num.toLocaleString('zh-CN');
}

// 格式化时间
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 显示历史记录列表
function showHistory() {
  const history = loadHistory();
  if (!history) return;
  
  const records = history.records || [];
  
  if (records.length === 0) {
    console.log('📭 暂无历史记录');
    return;
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                    📊 历史统计记录查看器                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📁 项目: ${history.project || '未知'}`);
  console.log(`📈 记录总数: ${records.length} 条`);
  console.log(`📅 创建时间: ${formatTime(history.created)}\n`);
  
  console.log('─'.repeat(100));
  console.log(`${'序号'.padEnd(6)} ${'时间'.padEnd(22)} ${'文件数'.padStart(8)} ${'代码行'.padStart(10)} ${'Tokens'.padStart(10)} ${'标签'.padEnd(15)}`);
  console.log('─'.repeat(100));
  
  records.forEach((record, index) => {
    const num = (index + 1).toString().padEnd(6);
    const time = formatTime(record.timestamp).padEnd(22);
    const files = formatNumber(record.summary.files.total).padStart(8);
    const lines = formatNumber(record.summary.code.totalLines).padStart(10);
    const tokens = formatNumber(record.summary.tokens.estimated).padStart(10);
    const tag = (record.tag || '-').padEnd(15);
    
    console.log(`${num} ${time} ${files} ${lines} ${tokens} ${tag}`);
  });
  
  console.log('─'.repeat(100));
  console.log(`\n💡 提示: 趋势图可在 HTML 可视化报告中查看\n`);
}

// 显示详细信息
function showDetail(index) {
  const history = loadHistory();
  if (!history) return;
  
  const records = history.records || [];
  const record = records[index - 1];
  
  if (!record) {
    console.log(`❌ 未找到第 ${index} 条记录`);
    return;
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                      📋 详细统计信息                              ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`🔖 ID: ${record.id}`);
  console.log(`📅 时间: ${formatTime(record.timestamp)}`);
  if (record.tag) console.log(`🏷️  标签: ${record.tag}`);
  if (record.note) console.log(`📝 备注: ${record.note}`);
  
  const s = record.summary;
  
  console.log('\n📊 统计数据:');
  console.log('─'.repeat(70));
  console.log(`  文件统计:`);
  console.log(`    • 总文件数: ${formatNumber(s.files.total)}`);
  console.log(`    • 排除文件: ${formatNumber(s.files.excluded)}`);
  
  console.log(`\n  代码统计:`);
  console.log(`    • 总行数: ${formatNumber(s.code.totalLines)}`);
  console.log(`    • 代码行: ${formatNumber(s.code.codeLines)}`);
  console.log(`    • 注释行: ${formatNumber(s.code.commentLines)}`);
  console.log(`    • 空白行: ${formatNumber(s.code.blankLines)}`);
  
  console.log(`\n  字符统计:`);
  console.log(`    • 总字符: ${formatNumber(s.text.totalChars)}`);
  console.log(`    • 中文字符: ${formatNumber(s.text.chineseChars)}`);
  console.log(`    • 英文单词: ${formatNumber(s.text.englishWords)}`);
  
  console.log(`\n  Tokens:`);
  console.log(`    • 总估算: ${formatNumber(s.tokens.estimated)}`);
  console.log(`    • 来自中文: ${formatNumber(s.tokens.breakdown.fromChinese)}`);
  console.log(`    • 来自英文: ${formatNumber(s.tokens.breakdown.fromEnglish)}`);
  console.log(`    • 来自代码: ${formatNumber(s.tokens.breakdown.fromCode)}`);
  
  console.log(`\n  语言分布:`);
  const languages = Object.entries(s.languages).sort((a, b) => b[1] - a[1]).slice(0, 10);
  languages.forEach(([lang, count]) => {
    console.log(`    • ${lang.padEnd(15)} ${formatNumber(count)} 个文件`);
  });
  
  console.log('\n' + '─'.repeat(70) + '\n');
}

// 对比两个记录
function compareRecords(index1, index2) {
  const history = loadHistory();
  if (!history) return;
  
  const records = history.records || [];
  const r1 = records[index1 - 1];
  const r2 = records[index2 - 1];
  
  if (!r1 || !r2) {
    console.log(`❌ 记录不存在`);
    return;
  }
  
  console.log('\n╔════════════════════════════════════════════════════════════════════╗');
  console.log('║                      🔄 版本对比分析                              ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📅 基准版本 (#${index1}): ${formatTime(r1.timestamp)}`);
  if (r1.tag) console.log(`   🏷️  ${r1.tag}`);
  
  console.log(`📅 对比版本 (#${index2}): ${formatTime(r2.timestamp)}`);
  if (r2.tag) console.log(`   🏷️  ${r2.tag}`);
  
  console.log('\n' + '─'.repeat(100));
  console.log(`${'指标'.padEnd(15)} ${'基准值'.padStart(12)} ${'对比值'.padStart(12)} ${'变化'.padStart(12)} ${'变化率'.padStart(12)}`);
  console.log('─'.repeat(100));
  
  function showChange(label, val1, val2) {
    const diff = val2 - val1;
    const rate = val1 === 0 ? 0 : ((diff / val1) * 100);
    const diffStr = (diff >= 0 ? '+' : '') + formatNumber(diff);
    const rateStr = (rate >= 0 ? '+' : '') + rate.toFixed(1) + '%';
    const icon = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
    
    console.log(`${icon} ${label.padEnd(13)} ${formatNumber(val1).padStart(12)} ${formatNumber(val2).padStart(12)} ${diffStr.padStart(12)} ${rateStr.padStart(12)}`);
  }
  
  showChange('文件数', r1.summary.files.total, r2.summary.files.total);
  showChange('总字符数', r1.summary.text.totalChars, r2.summary.text.totalChars);
  showChange('总行数', r1.summary.code.totalLines, r2.summary.code.totalLines);
  showChange('代码行', r1.summary.code.codeLines, r2.summary.code.codeLines);
  showChange('注释行', r1.summary.code.commentLines, r2.summary.code.commentLines);
  showChange('Tokens', r1.summary.tokens.estimated, r2.summary.tokens.estimated);
  
  console.log('─'.repeat(100) + '\n');
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command || command === 'list') {
    showHistory();
  } else if (command === 'detail' && args[1]) {
    showDetail(parseInt(args[1]));
  } else if (command === 'compare' && args[1] && args[2]) {
    compareRecords(parseInt(args[1]), parseInt(args[2]));
  } else {
    console.log('\n📖 历史记录查看器使用说明:\n');
    console.log('  node 查看历史.js              # 查看历史记录列表');
    console.log('  node 查看历史.js list         # 同上');
    console.log('  node 查看历史.js detail 3     # 查看第3条记录的详细信息');
    console.log('  node 查看历史.js compare 2 5  # 对比第2条和第5条记录\n');
  }
}

main();