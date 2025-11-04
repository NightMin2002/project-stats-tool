/**
 * 历史记录管理器 v1.1
 * 负责统计数据的历史记录存储和对比分析
 */

const fs = require('fs');
const path = require('path');

class HistoryManager {
  constructor(resultsDir, maxRecords = 100) {
    this.resultsDir = resultsDir;
    this.historyFile = path.join(resultsDir, 'history.json');
    this.maxRecords = maxRecords; // 最多保存的历史记录条数（可配置）
  }

  /**
   * 初始化历史文件
   */
  initHistory() {
    if (!fs.existsSync(this.historyFile)) {
      const initialData = {
        version: '1.0',
        project: path.basename(process.cwd()),
        created: new Date().toISOString(),
        records: []
      };
      fs.writeFileSync(this.historyFile, JSON.stringify(initialData, null, 2), 'utf8');
    }
  }

  /**
   * 加载历史记录
   */
  loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf8');
        const parsed = JSON.parse(data);
        
        // 验证数据结构
        if (!parsed.records || !Array.isArray(parsed.records)) {
          throw new Error('历史数据格式无效：缺少 records 数组');
        }
        
        return parsed;
      }
      return { version: '1.1', records: [] };
    } catch (error) {
      console.warn('⚠️  加载历史记录失败:', error.message);
      
      // 尝试从备份恢复
      const backupFile = this.historyFile + '.backup';
      if (fs.existsSync(backupFile)) {
        try {
          console.log('🔄 尝试从备份恢复历史记录...');
          const backupData = fs.readFileSync(backupFile, 'utf8');
          const parsed = JSON.parse(backupData);
          
          if (parsed.records && Array.isArray(parsed.records)) {
            console.log('✅ 成功从备份恢复历史记录');
            return parsed;
          }
        } catch (backupError) {
          console.error('❌ 备份文件也已损坏:', backupError.message);
        }
      }
      
      // 返回空历史结构以保证程序继续运行
      return { version: '1.1', records: [] };
    }
  }

  /**
   * 保存当前统计到历史记录
   */
  saveRecord(stats, tag = null, note = null) {
    try {
      this.initHistory();
      const history = this.loadHistory();
      
      // 保存前先创建备份（如果历史文件存在）
      if (fs.existsSync(this.historyFile)) {
        try {
          fs.copyFileSync(this.historyFile, this.historyFile + '.backup');
        } catch (backupError) {
          console.warn('⚠️  创建备份失败:', backupError.message);
          // 继续执行，不因备份失败而中断
        }
      }
      
      const record = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        tag: tag,
        note: note,
        summary: {
          files: {
            total: stats.files.total,
            excluded: stats.files.excluded.libraries
          },
          text: {
            totalChars: stats.text.totalChars,
            chineseChars: stats.text.chineseChars,
            englishWords: stats.text.englishWords
          },
          code: {
            totalLines: stats.code.totalLines,
            codeLines: stats.code.codeLines,
            commentLines: stats.code.commentLines,
            blankLines: stats.code.blankLines
          },
          tokens: {
            estimated: stats.tokens.estimated,
            breakdown: stats.tokens.breakdown
          },
          complexity: stats.complexity,
          languages: stats.files.byLanguage
        }
      };

      history.records.push(record);

      // 保持最新的 maxRecords 条记录
      if (history.records.length > this.maxRecords) {
        history.records = history.records.slice(-this.maxRecords);
      }

      // 写入历史文件
      try {
        fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2), 'utf8');
      } catch (writeError) {
        // 如果写入失败，尝试恢复备份
        console.error('❌ 写入历史记录失败:', writeError.message);
        
        const backupFile = this.historyFile + '.backup';
        if (fs.existsSync(backupFile)) {
          try {
            console.log('🔄 恢复备份文件...');
            fs.copyFileSync(backupFile, this.historyFile);
            console.log('✅ 已恢复备份');
          } catch (restoreError) {
            console.error('❌ 恢复备份失败:', restoreError.message);
          }
        }
        
        throw writeError;
      }
      
      return record;
    } catch (error) {
      console.error('❌ 保存历史记录失败:', error.message);
      return null;
    }
  }

  /**
   * 获取最近的记录
   */
  getLatestRecord() {
    const history = this.loadHistory();
    if (history.records.length === 0) return null;
    return history.records[history.records.length - 1];
  }

  /**
   * 获取上一次记录（用于对比）
   */
  getPreviousRecord() {
    const history = this.loadHistory();
    if (history.records.length < 2) return null;
    // 返回倒数第二条记录（用于与当前结果对比）
    return history.records[history.records.length - 2];
  }

  /**
   * 对比两个统计记录
   */
  compare(currentStats, previousRecord) {
    if (!previousRecord) {
      return {
        isFirstRun: true,
        message: '这是首次统计，暂无对比数据'
      };
    }

    const prev = previousRecord.summary;
    const curr = {
      files: { total: currentStats.files.total },
      text: { totalChars: currentStats.text.totalChars },
      code: {
        totalLines: currentStats.code.totalLines,
        codeLines: currentStats.code.codeLines,
        commentLines: currentStats.code.commentLines
      },
      tokens: { estimated: currentStats.tokens.estimated }
    };

    return {
      isFirstRun: false,
      previousTime: previousRecord.timestamp,
      previousTag: previousRecord.tag,
      comparison: {
        files: this._calculateChange(prev.files.total, curr.files.total),
        totalChars: this._calculateChange(prev.text.totalChars, curr.text.totalChars),
        totalLines: this._calculateChange(prev.code.totalLines, curr.code.totalLines),
        codeLines: this._calculateChange(prev.code.codeLines, curr.code.codeLines),
        commentLines: this._calculateChange(prev.code.commentLines, curr.code.commentLines),
        tokens: this._calculateChange(prev.tokens.estimated, curr.tokens.estimated)
      }
    };
  }

  /**
   * 计算变化值和变化率
   */
  _calculateChange(oldValue, newValue) {
    const diff = newValue - oldValue;
    const rate = oldValue === 0 ? 0 : ((diff / oldValue) * 100);
    
    return {
      old: oldValue,
      new: newValue,
      diff: diff,
      rate: rate,
      rateFormatted: rate >= 0 ? `+${rate.toFixed(1)}%` : `${rate.toFixed(1)}%`,
      diffFormatted: diff >= 0 ? `+${this._formatNumber(diff)}` : `${this._formatNumber(diff)}`,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable'
    };
  }

  /**
   * 格式化数字
   */
  _formatNumber(num) {
    return num.toLocaleString('zh-CN');
  }

  /**
   * 生成趋势数据（用于图表）
   */
  generateTrendData(metric = 'totalLines', limit = 10) {
    const history = this.loadHistory();
    const records = history.records.slice(-limit);

    return records.map(record => {
      let value;
      switch (metric) {
        case 'totalLines':
          value = record.summary.code.totalLines;
          break;
        case 'files':
          value = record.summary.files.total;
          break;
        case 'tokens':
          value = record.summary.tokens.estimated;
          break;
        case 'codeLines':
          value = record.summary.code.codeLines;
          break;
        default:
          value = 0;
      }

      return {
        timestamp: record.timestamp,
        label: new Date(record.timestamp).toLocaleDateString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        value: value,
        tag: record.tag
      };
    });
  }

  /**
   * 获取历史记录总数
   */
  getRecordCount() {
    const history = this.loadHistory();
    return history.records.length;
  }
}

module.exports = HistoryManager;