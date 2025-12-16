/**
 * 项目统计工具 - 智能代码统计与分析
 * 智能统计项目的文字数量、代码行数和 tokens 估算
 *
 * 使用方法:
 *   node project-stats.js [选项] [项目路径]
 *
 * 选项:
 *   -h, --help       显示帮助信息
 *   -v, --version    显示版本信息
 *
 * 示例:
 *   node project-stats.js              # 交互式选择项目（推荐）
 *   node project-stats.js ../my-app    # 统计指定项目
 *   node project-stats.js --help       # 显示帮助
 *
 * 详细文档: docs/使用说明.txt
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 导入版本管理
const { getVersion, getVersionInfo } = require('./version');

// 导入配置模块
const { createConfig, loadGitignorePatterns, initStats, loadCustomLanguageConfig } = require('./config');

// 导入核心模块
const { scanProject } = require('./core/project-scanner');
const { calculateComplexity, calculateTokens, detectProjectType } = require('./core/stats-calculator');

// 导入生成器模块
const { generateProjectStructure, buildFileTreeData } = require('./generators/tree-generator');
const { generateMarkdownReport, generateFileList, extractAllText } = require('./generators/text-generator');
const { generateHTMLReport } = require('./generators/html-generator');
const { saveAllReports } = require('./generators/output-manager');

// 导入工具模块
const { formatNumber, formatSize } = require('./utils/formatters');

// 导入历史管理器
const HistoryManager = require('./history-manager.js');

/**
 * 显示帮助信息
 */
function printHelp() {
  const versionInfo = getVersionInfo();
  console.log(`
╔════════════════════════════════════════════════════════╗
║          📊 项目统计工具 ${getVersion()}
║          ${versionInfo.name}
╚════════════════════════════════════════════════════════╝

用法: node project-stats.js [选项] [项目路径]

选项:
  -h, --help       显示此帮助信息
  -v, --version    显示版本信息

参数:
  [项目路径]       要统计的项目目录

示例:
  node project-stats.js
      启动交互式选择模式（列出同一级的所有项目文件夹）

  node project-stats.js ../my-project
      统计指定项目

  node project-stats.js --help
      显示帮助信息

功能特性:
  ✅ 交互式项目选择 (v3.1)
  ✅ 智能统计文字、代码、Token
  ✅ 支持 50+ 种编程语言
  ✅ 自动排除第三方库文件
  ✅ 历史记录对比分析
  ✅ 可视化 HTML 报告
  ✅ 完整文字内容提取
  ✅ 支持拖拽文件夹分析 (v2.4)

详细文档: docs/使用说明.txt
项目主页: https://github.com/NightMin2002/project-stats-tool
  `);
}

/**
 * 显示版本信息
 */
function printVersion() {
  const versionInfo = getVersionInfo();
  console.log(`
📊 项目统计工具
版本: ${getVersion()}
名称: ${versionInfo.name}
发布日期: ${versionInfo.releaseDate}

作者: Ω Code Agent
许可证: MIT
  `);
}

/**
 * 获取父目录下的所有文件夹（候选项目）
 */
async function getSiblingProjects(toolRoot) {
  const parentDir = path.dirname(toolRoot);
  try {
    const items = await fs.promises.readdir(parentDir, { withFileTypes: true });
    return items
      .filter(item => item.isDirectory())
      .map(item => ({
        name: item.name,
        path: path.join(parentDir, item.name)
      }))
      // 排除隐藏文件夹
      .filter(project => !project.name.startsWith('.'));
  } catch (error) {
    console.error('无法读取父目录:', error.message);
    return [];
  }
}

/**
 * 交互式选择项目
 */
async function selectProject(projects, parentDir) {
  if (projects.length === 0) {
    console.log('⚠️  未在父目录中发现任何项目文件夹。');
    return null;
  }

  console.log('\n📋 发现以下项目:\n');
  
  // 选项 1：统计所有（父目录）
  console.log(`  [1] 📂 统计所有项目 (父目录: ${path.basename(parentDir)})`);
  
  // 选项 2+: 各个子项目
  projects.forEach((proj, index) => {
    // 标记当前工具所在的文件夹
    const isCurrent = proj.path === process.cwd();
    const mark = isCurrent ? ' (当前工具)' : '';
    console.log(`  [${index + 2}] ${proj.name}${mark}`);
  });
  console.log(`  [0] 退出`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\n👉 请输入编号选择要统计的项目: ', (answer) => {
      rl.close();
      const choice = parseInt(answer.trim());
      
      if (isNaN(choice) || choice < 0 || choice > projects.length + 1) {
        console.log('❌ 无效的选择');
        resolve(null);
        return;
      }

      if (choice === 0) {
        process.exit(0);
      }
      
      // 选择 1 是父目录
      if (choice === 1) {
          resolve(parentDir);
          return;
      }

      // 其他选择对应数组下标（注意 offset）
      resolve(projects[choice - 2].path);
    });
  });
}

/**
 * 解析命令行参数
 */
async function parseArguments() {
  const args = process.argv.slice(2);
  
  // 检查帮助参数
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  // 检查版本参数
  if (args.includes('--version') || args.includes('-v')) {
    printVersion();
    process.exit(0);
  }
  
  // 情况 1: 用户提供了路径参数 (拖拽或命令行)
  let targetPathRaw = args[0];
  if (targetPathRaw) {
      targetPathRaw = targetPathRaw.replace(/^"|"$/g, '');
      return { targetDir: path.resolve(targetPathRaw) };
  }

  // 情况 2: 未提供参数 -> 启动交互式选择
  // 获取工具根目录（向上两级：src/ -> project-stats-tool/）
  const toolRoot = path.resolve(__dirname, '..');
  const projects = await getSiblingProjects(toolRoot);
  const parentDir = path.dirname(toolRoot);
  
  const selectedPath = await selectProject(projects, parentDir);
  if (!selectedPath) {
    process.exit(0);
  }

  return { targetDir: selectedPath };
}

/**
 * 打印统计结果到控制台
 */
function printResults(stats) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log(`║              📊 项目统计结果 ${getVersion()}                   ║`);
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  console.log('📁 项目信息');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   名称: ${stats.project.name}`);
  console.log(`   路径: ${stats.project.path}`);
  console.log(`   类型: ${stats.project.type}`);
  
  console.log('\n📂 文件统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   统计文件: ${formatNumber(stats.files.total)} 个`);
  if (stats.files.excluded.libraries > 0) {
    console.log(`   排除库文件: ${formatNumber(stats.files.excluded.libraries)} 个 🎯`);
  }
  console.log('   语言分布:');
  Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([lang, count]) => {
      console.log(`     ${lang.padEnd(15)} ${formatNumber(count)} 个`);
    });
  
  console.log('\n📝 文字统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   中文字符: ${formatNumber(stats.text.chineseChars)} 个`);
  console.log(`   英文单词: ${formatNumber(stats.text.englishWords)} 个`);
  console.log(`   总字符数: ${formatNumber(stats.text.totalChars)} 个 (${formatSize(stats.text.totalChars)})`);
  
  console.log('\n💻 代码统计');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   总行数:   ${formatNumber(stats.code.totalLines)} 行`);
  console.log(`   代码行:   ${formatNumber(stats.code.codeLines)} 行 (${((stats.code.codeLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  console.log(`   注释行:   ${formatNumber(stats.code.commentLines)} 行 (${((stats.code.commentLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  console.log(`   空白行:   ${formatNumber(stats.code.blankLines)} 行 (${((stats.code.blankLines/stats.code.totalLines)*100).toFixed(1)}%)`);
  
  console.log('\n📈 复杂度分析');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   平均行长度: ${stats.complexity.avgLineLength} 字符/行`);
  console.log(`   平均文件大小: ${formatSize(stats.complexity.avgFileSize)}`);
  console.log(`   最大文件: ${stats.files.largest.path}`);
  console.log(`              ${formatNumber(stats.files.largest.lines)} 行, ${formatSize(stats.files.largest.size)}`);
  if (stats.complexity.longestLine.length > 0) {
    console.log(`   最长行: ${stats.complexity.longestLine.file}:${stats.complexity.longestLine.lineNum}`);
    console.log(`           ${formatNumber(stats.complexity.longestLine.length)} 字符`);
  }
  
  console.log('\n🎯 Tokens 估算');
  console.log('─────────────────────────────────────────────────────────');
  console.log(`   来自中文: ${formatNumber(stats.tokens.breakdown.fromChinese)} tokens`);
  console.log(`   来自英文: ${formatNumber(stats.tokens.breakdown.fromEnglish)} tokens`);
  console.log(`   来自代码: ${formatNumber(stats.tokens.breakdown.fromCode)} tokens`);
  console.log(`   ─────────────────────────────────────────────────────`);
  console.log(`   总计估算: ${formatNumber(stats.tokens.estimated)} tokens`);
  
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('💡 估算说明:');
  console.log('   • 中文: ~1.5 字符/token');
  console.log('   • 英文: ~1.3 单词/token');
  console.log('   • 代码: ~3.5 字符/token');
  console.log('   • 自动排除 node_modules, .git 等目录');
  console.log('   • 自动读取 .gitignore 规则');
  console.log('   • 智能排除统计工具所在目录');
  console.log('   • 智能识别并排除第三方库文件 🆕');
  console.log('─────────────────────────────────────────────────────────\n');
}

/**
 * 打印对比结果
 */
function printComparison(comparison, historyManager) {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║              📈 对比分析结果                           ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  const prevTime = new Date(comparison.previousTime).toLocaleString('zh-CN');
  console.log(`🕒 对比基准: ${prevTime}`);
  if (comparison.previousTag) {
    console.log(`🏷️  版本标签: ${comparison.previousTag}`);
  }
  console.log('─────────────────────────────────────────────────────────\n');
  
  const c = comparison.comparison;
  
  console.log('📊 核心指标变化:\n');
  printChangeItem('文件数量', c.files);
  printChangeItem('总字符数', c.totalChars);
  printChangeItem('总行数', c.totalLines);
  printChangeItem('代码行数', c.codeLines);
  printChangeItem('注释行数', c.commentLines);
  printChangeItem('估算Tokens', c.tokens);
  
  console.log('\n─────────────────────────────────────────────────────────');
  if (historyManager && historyManager.getRecordCount() >= 2) {
    console.log('💡 提示: 历史趋势图已包含在 HTML 可视化报告中');
    console.log(`   📈 当前历史记录: ${historyManager.getRecordCount()} 条`);
  } else {
    console.log('💡 提示: 再次运行后将生成历史趋势图');
    console.log('   📈 需要至少 2 条历史记录才能显示趋势');
  }
  console.log('─────────────────────────────────────────────────────────\n');
}

/**
 * 打印单个变化项
 */
function printChangeItem(label, change) {
  const icon = change.trend === 'up' ? '📈' : change.trend === 'down' ? '📉' : '➡️';
  const color = change.trend === 'up' ? '\x1b[32m' : change.trend === 'down' ? '\x1b[31m' : '\x1b[33m';
  const reset = '\x1b[0m';
  
  console.log(`   ${icon} ${label.padEnd(12)} ${formatNumber(change.old).padStart(10)} → ${formatNumber(change.new).padStart(10)}   ${color}${change.diffFormatted.padStart(8)} (${change.rateFormatted})${reset}`);
}

/**
 * 主函数
 */
async function main() {
  try {
    // 解析命令行参数（改为异步，支持交互式选择）
    const { targetDir } = await parseArguments();
    
    // 检查目录是否存在
    if (!fs.existsSync(targetDir)) {
      console.error(`❌ 错误: 目录不存在: ${targetDir}`);
      process.exit(1);
    }
    
    console.log(`\n🔍 正在分析项目: ${targetDir}\n`);
    
    // 获取工具根目录（向上两级：src/ -> project-stats-tool/）
    const toolRoot = path.resolve(__dirname, '..');
    
    // 加载自定义语言配置（如果存在）
    loadCustomLanguageConfig(targetDir, toolRoot);
    
    // 初始化配置和数据，传入 toolRoot 以支持智能自身排除
    const config = createConfig(targetDir, toolRoot);
    const gitignorePatterns = loadGitignorePatterns(targetDir);
    const stats = initStats(targetDir);
    
    // 扫描项目 (异步)
    await scanProject(stats, config, gitignorePatterns);
    
    // 计算统计数据
    stats.project.type = detectProjectType(stats, config);
    calculateComplexity(stats);
    calculateTokens(stats, config);
    
    // 初始化历史管理器
    const resultsDir = path.join(__dirname, '../results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // v2.4 更新：传入项目名称，实现多项目历史隔离
    const historyManager = new HistoryManager(resultsDir, stats.project.name);
    
    // 保存本次记录到历史
    const currentRecordForComparison = historyManager.saveRecord(stats);
    
    // 获取上次统计结果进行对比
    const previousRecord = historyManager.getPreviousRecord();
    const comparison = historyManager.compare(stats, previousRecord);
    
    // 打印结果
    printResults(stats);
    
    // 打印对比结果
    if (!comparison.isFirstRun) {
      printComparison(comparison, historyManager);
    }
    
    // 生成所有报告
    const fileTreeData = buildFileTreeData(config.rootDir, config, gitignorePatterns);
    
    const reports = {
      markdown: generateMarkdownReport(stats),
      structure: generateProjectStructure(stats, config, gitignorePatterns),
      fileList: generateFileList(stats),
      fullText: extractAllText(stats),
      html: generateHTMLReport(
        stats,
        fileTreeData,
        historyManager,
        comparison.isFirstRun ? null : comparison
      )
    };
    
    // 保存报告 (OutputManager 会自动处理按项目名分类)
    // v2.5 更新：saveAllReports 现在是异步的，需要 await
    const { folderTimestamp, projectSafeName } = await saveAllReports(reports, stats, resultsDir);
    
    // 打印历史记录信息
    if (currentRecordForComparison) {
      console.log(`\n💾 历史记录已保存 (ID: ${currentRecordForComparison.id})`);
      console.log(`   📊 历史记录总数: ${historyManager.getRecordCount()} 条`);
      console.log(`   📁 历史文件: results/${projectSafeName}/history.json`);
    }
    
    if (historyManager.getRecordCount() >= 2) {
      console.log(`   📈 包含历史趋势图 (${historyManager.getRecordCount()} 条记录)`);
    }
    
    console.log(`\n📌 快速访问:`);
    console.log(`   📂 本次结果: results/${projectSafeName}/${folderTimestamp}/`);
    console.log(`   📂 最新结果: results/${projectSafeName}/最新/`);
    console.log(`   🎨 可视化报告: results/${projectSafeName}/最新/可视化报告.html ⭐ 推荐在浏览器中打开！\n`);
    
    console.log(`✨ 统计完成！所有结果已保存到 results 文件夹\n`);
  } catch (error) {
    console.error('❌ 发生未捕获的错误:', error);
    process.exit(1);
  }
}

// 执行主函数
main();