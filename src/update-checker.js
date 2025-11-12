// Ω Code Agent v2.2 - update-checker.js
// 这是一个使用 Node.js 编写的、更健壮的版本检查和更新脚本。

const { execSync, exec } = require('child_process');
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
        // 发生错误时，将错误信息打印到 stderr，并返回空字符串
        // log(colors.red, `命令执行失败: ${command}\n${error.stderr}`);
        return null;
    }
};

/**
 * 启动主项目脚本
 */
const launchProject = () => {
    console.log('\n---------------------------------');
    console.log(' 正在启动项目统计工具...');
    console.log('---------------------------------\n');
    
    // 使用 exec 而不是 execSync，以便主脚本可以与用户的终端进行交互
    const mainProcess = exec('node src/project-stats.js');

    // 将子进程的输出流连接到父进程
    mainProcess.stdout.pipe(process.stdout);
    mainProcess.stderr.pipe(process.stderr);
    
    // 监听子进程的退出事件，在主脚本结束后，暂停并等待用户确认
    mainProcess.on('exit', async (code) => {
        console.log('\n---------------------------------');
        log(colors.green, '项目统计工具已运行完毕。');
        await askToContinue('按任意键退出...');
        process.exit(code);
    });
};

/**
 * 主函数
 */
async function main() {
    console.clear();
    console.log('===============================================');
    console.log('  项目统计工具 - 版本检查程序 (v2.0 Node.js)');
    console.log('===============================================\n');
    log(colors.reset, '正在连接到 GitHub 检查更新，请稍候...');
    
    // 1. 获取远程更新
    if (runCommand('git fetch origin') === null) {
        log(colors.red, '\n错误：无法连接到 GitHub 检查更新。');
        log(colors.yellow, '可能是网络问题或 Git 未正确配置。将直接以当前版本启动项目...\n');
        await askToContinue();
        launchProject();
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
        await askToContinue();
        launchProject();
        return;
    }

    if (localCommit === remoteCommit) {
        log(colors.green, '\n您当前已是最新版本。');
        if (hasLocalChanges) {
            log(colors.yellow, '提示：检测到您有未提交的本地修改。');
        }
        launchProject();
        return;
    }

    log(colors.cyan, '\n---------------------------------');
    log(colors.cyan, ' 发现新版本！');
    log(colors.cyan, '---------------------------------\n');
    
    if (hasLocalChanges) {
        log(colors.red, '警告：无法自动更新！');
        log(colors.reset, '您有未提交的本地修改，此时自动更新极有可能导致代码冲突。\n');
        log(colors.yellow, '建议操作：');
        console.log('  1. 手动使用 "git add ." 和 "git commit" 提交您的修改。');
        console.log('  2. 或使用 "git stash" 临时保存您的修改。');
        console.log('  3. 完成后，再手动运行 "git pull" 命令进行更新。\n');
        await askToContinue('按任意键以【当前版本】继续启动...');
        launchProject();
        return;
    }

    const answer = await askQuestion('是否立即从 GitHub 更新到最新版本? [Y/N]: ');
    if (answer.toLowerCase() === 'y') {
        console.log('\n正在更新，请稍候...');
        const pullResult = runCommand('git pull');
        if (pullResult === null) {
            log(colors.red, '\n更新失败！请检查您的网络或手动运行 "git pull" 查看问题。');
            await askToContinue();
            process.exit(1);
        }
        log(colors.green, '\n更新完成！');
        await askToContinue('按任意键以【最新版本】启动...');
        launchProject();
    } else {
        console.log('\n已选择不更新，将以当前版本启动。');
        launchProject();
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

/**
 * 暂停，等待用户按键继续
 * @param {string} message - 提示信息
 */
function askToContinue(message = '按任意键继续...') {
    console.log(message);
    process.stdin.setRawMode(true);
    return new Promise(resolve => process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        resolve();
    }));
}

main();