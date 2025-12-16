/**
 * CLI 进度条模块 v3.2.0
 * 提供美观的终端进度显示
 * Ω Code Agent - Zero Dependencies
 */

/**
 * 进度条类
 * 支持动态更新、多种样式、ETA计算
 */
class ProgressBar {
  /**
   * @param {Object} options - 配置选项
   * @param {number} options.total - 总任务数
   * @param {string} options.title - 进度条标题
   * @param {number} options.width - 进度条宽度（字符数）
   * @param {boolean} options.showETA - 是否显示预计剩余时间
   * @param {boolean} options.showPercent - 是否显示百分比
   * @param {boolean} options.showCount - 是否显示计数
   */
  constructor(options = {}) {
    this.total = options.total || 100;
    this.current = 0;
    this.title = options.title || '处理中';
    this.width = options.width || 30;
    this.showETA = options.showETA !== false;
    this.showPercent = options.showPercent !== false;
    this.showCount = options.showCount !== false;
    
    this.startTime = Date.now();
    this.lastRenderTime = 0;
    this.renderInterval = 100; // 最小渲染间隔(ms)，防止闪烁
    
    // 样式配置
    this.chars = {
      complete: '█',
      incomplete: '░',
      head: '▓'
    };
    
    // 颜色代码 (ANSI)
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      cyan: '\x1b[36m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      magenta: '\x1b[35m',
      white: '\x1b[37m'
    };
    
    // 动画帧
    this.spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.spinnerIndex = 0;
    
    this.isComplete = false;
    this.isTTY = process.stdout.isTTY;
  }
  
  /**
   * 更新进度
   * @param {number} current - 当前进度值
   * @param {string} [message] - 可选的状态消息
   */
  update(current, message = '') {
    if (this.isComplete) return;
    
    this.current = Math.min(current, this.total);
    this.message = message;
    
    // 节流渲染
    const now = Date.now();
    if (now - this.lastRenderTime < this.renderInterval && this.current < this.total) {
      return;
    }
    this.lastRenderTime = now;
    
    this.render();
    
    if (this.current >= this.total) {
      this.complete();
    }
  }
  
  /**
   * 增加进度
   * @param {number} [delta=1] - 增加的量
   * @param {string} [message] - 可选的状态消息
   */
  tick(delta = 1, message = '') {
    this.update(this.current + delta, message);
  }
  
  /**
   * 渲染进度条
   */
  render() {
    if (!this.isTTY) {
      // 非TTY环境，使用简单输出
      return;
    }
    
    const { colors, chars } = this;
    const percent = this.total > 0 ? this.current / this.total : 0;
    const filledWidth = Math.round(this.width * percent);
    const emptyWidth = this.width - filledWidth;
    
    // 构建进度条
    let bar = '';
    bar += chars.complete.repeat(Math.max(0, filledWidth - 1));
    if (filledWidth > 0) {
      bar += percent < 1 ? chars.head : chars.complete;
    }
    bar += chars.incomplete.repeat(emptyWidth);
    
    // 构建状态信息
    const spinner = this.spinnerFrames[this.spinnerIndex++ % this.spinnerFrames.length];
    const percentStr = this.showPercent ? ` ${(percent * 100).toFixed(0)}%` : '';
    const countStr = this.showCount ? ` (${this.current}/${this.total})` : '';
    const etaStr = this.showETA ? ` ${this.getETA()}` : '';
    const msgStr = this.message ? ` ${colors.dim}${this.message}${colors.reset}` : '';
    
    // 组合输出
    const output = [
      `\r${colors.cyan}${spinner}${colors.reset}`,
      ` ${colors.bright}${this.title}${colors.reset}`,
      ` ${colors.dim}[${colors.reset}`,
      `${colors.green}${bar}${colors.reset}`,
      `${colors.dim}]${colors.reset}`,
      `${colors.yellow}${percentStr}${colors.reset}`,
      `${colors.dim}${countStr}${colors.reset}`,
      `${colors.magenta}${etaStr}${colors.reset}`,
      msgStr
    ].join('');
    
    // 清除行并输出
    process.stdout.write('\x1b[2K'); // 清除当前行
    process.stdout.write(output);
  }
  
  /**
   * 计算预计剩余时间
   * @returns {string}
   */
  getETA() {
    if (this.current === 0) return '';
    
    const elapsed = Date.now() - this.startTime;
    const rate = this.current / elapsed;
    const remaining = (this.total - this.current) / rate;
    
    if (remaining < 1000) return '<1s';
    if (remaining < 60000) return `~${Math.round(remaining / 1000)}s`;
    if (remaining < 3600000) return `~${Math.round(remaining / 60000)}m`;
    return `~${(remaining / 3600000).toFixed(1)}h`;
  }
  
  /**
   * 完成进度条
   * @param {string} [message] - 完成消息
   */
  complete(message = '') {
    if (this.isComplete) return;
    this.isComplete = true;
    
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
    const { colors } = this;
    
    if (this.isTTY) {
      process.stdout.write('\x1b[2K\r'); // 清除行
      console.log(
        `${colors.green}✓${colors.reset}`,
        `${colors.bright}${this.title}${colors.reset}`,
        `${colors.dim}完成${colors.reset}`,
        `${colors.cyan}(${this.total} 项, ${elapsed}s)${colors.reset}`,
        message ? `${colors.dim}${message}${colors.reset}` : ''
      );
    } else {
      console.log(`✓ ${this.title} 完成 (${this.total} 项, ${elapsed}s)`);
    }
  }
  
  /**
   * 中断进度条（出错时）
   * @param {string} [message] - 错误消息
   */
  abort(message = '已中断') {
    if (this.isComplete) return;
    this.isComplete = true;
    
    const { colors } = this;
    
    if (this.isTTY) {
      process.stdout.write('\x1b[2K\r');
      console.log(
        `${colors.yellow}⚠${colors.reset}`,
        `${colors.bright}${this.title}${colors.reset}`,
        `${colors.yellow}${message}${colors.reset}`,
        `${colors.dim}(${this.current}/${this.total})${colors.reset}`
      );
    } else {
      console.log(`⚠ ${this.title} ${message} (${this.current}/${this.total})`);
    }
  }
}

/**
 * 创建多阶段进度管理器
 * 用于显示多个连续的进度任务
 */
class MultiProgress {
  constructor() {
    this.stages = [];
    this.currentStageIndex = -1;
  }
  
  /**
   * 添加阶段
   * @param {string} title - 阶段标题
   * @param {number} total - 该阶段总任务数
   * @returns {ProgressBar}
   */
  addStage(title, total) {
    const bar = new ProgressBar({ title, total });
    this.stages.push(bar);
    return bar;
  }
  
  /**
   * 开始下一阶段
   * @returns {ProgressBar|null}
   */
  nextStage() {
    this.currentStageIndex++;
    return this.stages[this.currentStageIndex] || null;
  }
  
  /**
   * 获取当前阶段
   * @returns {ProgressBar|null}
   */
  getCurrentStage() {
    return this.stages[this.currentStageIndex] || null;
  }
}

/**
 * 简单的加载动画（无进度值）
 */
class Spinner {
  constructor(message = '加载中') {
    this.message = message;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.frameIndex = 0;
    this.interval = null;
    this.isTTY = process.stdout.isTTY;
    
    this.colors = {
      reset: '\x1b[0m',
      cyan: '\x1b[36m',
      dim: '\x1b[2m'
    };
  }
  
  /**
   * 开始动画
   */
  start() {
    if (!this.isTTY) {
      console.log(`... ${this.message}`);
      return;
    }
    
    this.interval = setInterval(() => {
      const frame = this.frames[this.frameIndex++ % this.frames.length];
      process.stdout.write(`\r${this.colors.cyan}${frame}${this.colors.reset} ${this.message}`);
    }, 80);
  }
  
  /**
   * 更新消息
   * @param {string} message
   */
  update(message) {
    this.message = message;
  }
  
  /**
   * 成功停止
   * @param {string} [message]
   */
  succeed(message = this.message) {
    this.stop();
    if (this.isTTY) {
      console.log(`\r\x1b[32m✓\x1b[0m ${message}`);
    } else {
      console.log(`✓ ${message}`);
    }
  }
  
  /**
   * 失败停止
   * @param {string} [message]
   */
  fail(message = this.message) {
    this.stop();
    if (this.isTTY) {
      console.log(`\r\x1b[31m✗\x1b[0m ${message}`);
    } else {
      console.log(`✗ ${message}`);
    }
  }
  
  /**
   * 警告停止
   * @param {string} [message]
   */
  warn(message = this.message) {
    this.stop();
    if (this.isTTY) {
      console.log(`\r\x1b[33m⚠\x1b[0m ${message}`);
    } else {
      console.log(`⚠ ${message}`);
    }
  }
  
  /**
   * 停止动画
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.isTTY) {
      process.stdout.write('\x1b[2K\r');
    }
  }
}

module.exports = {
  ProgressBar,
  MultiProgress,
  Spinner
};