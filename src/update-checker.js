// Ω Code Agent v2.5 - update-checker.js
// 这是一个使用 Node.js 编写的、更健壮的版本检查和更新脚本。
// v2.5: 移除启动逻辑，仅保留更新检查功能

const { execSync } = require('child_process');
const readline = require('readline');

// 定义带颜色的控制台输出
const colors = {
    reset: "\x1b[0m",
    red: "\x1b[91m",
    green: "\x1b[92m",
    yellow: "\x1b[93m",
    cyan: "\x1b[96m",
};

const log = (color, message) => console.log(color + message + colors.reset);

/**
 * 执行一个 shell 命令并返回其输出
 * @param {string} command - 要执行的命令
 * @returns {string} 命令的标准输出
 */
const runCommand = (command) => {
    try {
        return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
        return null;
    }
};

/**
 * 主函数
 */
async function main() {
    console.clear();
    console.log('===============================================');
    console.log('  项目统计工具 - 版本检查程序 (v2.5 Node.js)');
    console.log('===============================================\n');
    log(colors.reset, '正在连接到 GitHub 检查更新，请稍候...');
    
    // 1. 获取远程更新
    if (runCommand('git fetch origin') === null) {
        log(colors.red, '\n错误：无法连接到 GitHub 检查更新。');
        log(colors.yellow, '可能是网络问题或 Git 未正确配置。\n');
        return;
    }

    // 2. 获取版本信息
    const localCommit = runCommand('git rev-parse HEAD');
    const remoteCommit = runCommand('git rev-parse @{u}');
    const hasLocalChanges = runCommand('git status --porcelain') !== '';
    
    // 3. 逻辑判断
    if (!remoteCommit || !localCommit) {
        log(colors.red, '\n错误：无法获取本地或远程版本信息。');
        log(colors.yellow, '请确保您在一个有效的 Git 仓库中，并且已设置上游分支。\n');
        return;
    }

    if (localCommit === remoteCommit) {
        log(colors.green, '\n✅ 您当前已是最新版本。');
        if (hasLocalChanges) {
            log(colors.yellow, '提示：检测到您有未提交的本地修改。');
        }
        return;
    }

    log(colors.cyan, '\n---------------------------------');
    log(colors.cyan, ' 🚀 发现新版本！');
    log(colors.cyan, '---------------------------------\n');
    
    if (hasLocalChanges) {
        log(colors.red, '警告：无法自动更新！');
        log(colors.reset, '您有未提交的本地修改，此时自动更新极有可能导致代码冲突。\n');
        log(colors.yellow, '建议操作：');
        console.log('  1. 手动使用 "git add ." 和 "git commit" 提交您的修改。');
        console.log('  2. 或使用 "git stash" 临时保存您的修改。');
        console.log('  3. 完成后，再运行此脚本进行更新。\n');
        return;
    }

    const answer = await askQuestion('是否立即从 GitHub 更新到最新版本? [Y/N]: ');
    if (answer.toLowerCase() === 'y') {
        console.log('\n正在更新，请稍候...');
        const pullResult = runCommand('git pull');
        if (pullResult === null) {
            log(colors.red, '\n更新失败！请检查您的网络或手动运行 "git pull" 查看问题。');
            process.exit(1);
        }
        log(colors.green, '\n✅ 更新完成！请重新运行统计脚本。');
    } else {
        console.log('\n已取消更新。');
    }
}

/**
 * 提问并获取用户输入
 * @param {string} query - 显示给用户的问题
 * @returns {Promise<string>} 用户的回答
 */
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

main();