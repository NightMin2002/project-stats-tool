# 📘 项目结构说明

本项目采用模块化架构，职责清晰，便于 AI 辅助开发和维护。

---

## 📁 目录结构

```
project-stats-tool/
├── src/                          # 源代码目录
│   ├── project-stats.js          # 🎯 主入口（267行）
│   ├── config.js                 # ⚙️ 配置管理（177行）
│   ├── history-manager.js        # 📊 历史记录管理器
│   ├── view-history.js           # 📈 历史查看CLI工具
│   ├── html-report-template.js   # 🎨 HTML总模板
│   │
│   ├── core/                     # 核心业务逻辑
│   │   ├── project-scanner.js    # 项目扫描器（递归遍历目录）
│   │   └── stats-calculator.js   # 统计计算器（复杂度、Tokens、类型检测）
│   │
│   ├── analyzers/                # 数据分析模块
│   │   ├── file-analyzer.js      # 文件分析器（整合代码+文本分析）
│   │   ├── code-analyzer.js      # 代码分析器（行类型判断、注释识别）
│   │   └── text-analyzer.js      # 文本分析器（中英文统计）
│   │
│   ├── generators/               # 报告生成器
│   │   ├── html-generator.js     # HTML可视化报告生成
│   │   ├── text-generator.js     # Markdown/TXT报告生成
│   │   ├── tree-generator.js     # 目录树和文件树生成
│   │   └── output-manager.js     # 统一文件保存管理
│   │
│   ├── templates/                # HTML模板组件（模块化v2.11.0）
│   │   ├── styles.css.js         # Night Theme CSS样式
│   │   ├── scripts.js            # 前端JavaScript逻辑
│   │   └── components.js         # HTML组件生成器
│   │
│   └── utils/                    # 通用工具
│       ├── file-utils.js         # 文件类型判断、路径处理、排除规则
│       └── formatters.js         # 数字和文件大小格式化
│
├── lib/                          # 第三方库（本地化）
│   ├── chart.min.js              # Chart.js v3.9.1（趋势图表）
│   └── particles.min.js          # Particles.js（粒子动画）
│
├── docs/                         # 文档目录
│   ├── AI-项目结构说明.md        # 📘 本文档：模块职责说明
│   ├── 模块化架构说明.md         # 架构设计和重构历程
│   ├── CHANGELOG.md              # 版本更新日志
│   └── 使用说明.txt              # 快速参考
│
├── results/                      # 输出目录（自动生成）
│   ├── 最新/                     # 快捷访问（符号链接）
│   ├── YYYY-MM-DD_HH-MM-SS/      # 时间戳文件夹
│   └── history.json              # 历史记录索引
│
├── 统计项目.bat                  # Windows启动脚本
├── 查看历史.bat                  # 历史查看脚本
├── README.md                     # 用户文档
└── LICENSE                       # MIT许可证
```

---

## 🎯 模块职责

### 入口层

#### [`project-stats.js`](../src/project-stats.js:1) - 主入口（267行）
**职责**: 
- 协调所有模块的执行流程
- 控制台输出（`printResults()`, `printComparison()`）
- 历史记录管理（初始化、保存、对比）
- 报告生成和保存

**核心流程**:
```
初始化配置 → 扫描项目 → 计算统计 → 历史管理 → 生成报告 → 保存输出 → 控制台输出
```

**关键函数**:
- `main()` - 主函数
- `printResults(stats)` - 打印统计结果
- `printComparison(comparison, historyManager)` - 打印对比分析

---

### 配置层

#### [`config.js`](../src/config.js:1) - 配置管理（177行）
**职责**:
- 集中管理所有配置项和常量
- 定义语言映射（40+种编程语言）
- 加载 `.gitignore` 规则
- 初始化统计数据结构

**核心导出**:
```javascript
module.exports = {
  LANGUAGE_MAP,              // 扩展名 → 语言名映射
  createConfig,              // 创建配置对象
  loadGitignorePatterns,     // 加载.gitignore规则
  initStats                  // 初始化stats对象
};
```

**关键配置**:
- `extensions.code` - 支持的代码文件扩展名（40+种）
- `defaultExclude` - 默认排除目录（node_modules、.git等）
- `libraryDirs` - 第三方库目录名（lib、vendor等）
- `libraryFilePatterns` - 库文件特征（.min.js、jquery等）
- `tokenEstimate` - Token估算规则（中文÷1.5、英文÷1.3、代码÷3.5）

---

### 核心层

#### [`core/project-scanner.js`](../src/core/project-scanner.js:1) - 项目扫描器（67行）
**职责**:
- 递归遍历项目目录
- 应用排除规则过滤文件
- 调用文件分析器处理有效文件

**核心函数**:
- `scanProject(stats, config, gitignorePatterns)` - 扫描入口
- `walkDirectory(dir, stats, config, gitignorePatterns)` - 递归遍历

**工作流程**:
```
遍历目录 → shouldExclude()判断 → isLibraryFile()判断 → analyzeFile()分析
```

#### [`core/stats-calculator.js`](../src/core/stats-calculator.js:1) - 统计计算器（85行）
**职责**:
- 计算复杂度指标（平均行长、平均文件大小、最长行）
- 估算 Token 数量
- 检测项目类型（Web Frontend、Backend等）

**核心函数**:
- `calculateComplexity(stats)` - 计算复杂度
- `calculateTokens(stats, config)` - 估算Tokens
- `detectProjectType(stats, config)` - 检测项目类型

**Token估算公式**:
```javascript
tokens = (中文字符 / 1.5) + (英文单词 / 1.3) + (代码字符 / 3.5)
```

---

### 分析层

#### [`analyzers/file-analyzer.js`](../src/analyzers/file-analyzer.js:1) - 文件分析器（127行）
**职责**:
- 读取文件内容
- 整合代码分析和文本分析
- 更新统计数据（stats对象）
- 维护文件列表和语言统计

**核心函数**:
- `analyzeFile(filePath, stats, config)` - 主分析函数

**工作流程**:
```
读取文件 → analyzeCode()分析代码 → analyzeText()分析文本 → 更新stats
```

#### [`analyzers/code-analyzer.js`](../src/analyzers/code-analyzer.js:1) - 代码分析器（46行）
**职责**:
- 逐行分析代码类型（代码行、注释行、空白行）
- 支持多种注释格式（`//`, `/* */`, `#`, `<!--`, 等）
- 统计代码字符数

**核心函数**:
- `analyzeCode(content, ext)` - 返回 `{ totalLines, codeLines, commentLines, blankLines, codeChars }`
- `isCommentLine(line, ext)` - 判断是否为注释行

**支持的注释格式**:
- JavaScript/Java/C++: `//` 和 `/* */`
- Python/Shell: `#`
- HTML/XML: `<!-- -->`

#### [`analyzers/text-analyzer.js`](../src/analyzers/text-analyzer.js:1) - 文本分析器（32行）
**职责**:
- 统计中文字符数
- 统计英文单词数
- 统计总字符数

**核心函数**:
- `analyzeText(content)` - 返回 `{ chineseChars, englishWords, totalChars }`

**使用的正则表达式**:
- 中文字符: `/[\u4e00-\u9fa5]/g`
- 英文单词: `/\b[a-zA-Z]+\b/g`

---

### 生成层

#### [`generators/html-generator.js`](../src/generators/html-generator.js:1) - HTML生成器
**职责**:
- 生成 HTML 可视化报告
- 读取本地库文件（Chart.js、Particles.js）
- 生成历史趋势数据（≥2 条记录）
- 传入与上次统计的对比数据（用于可视化对比卡片）
- 调用模板系统（以 options 传参）

**核心函数**:
- `generateHTMLReport(stats, fileTreeData, historyManager, comparisonData?)` - 返回完整HTML字符串

**依赖**:
- `html-report-template.js` - 总模板
- `lib/chart.min.js` - 图表库
- `lib/particles.min.js` - 粒子动画

#### [`generators/text-generator.js`](../src/generators/text-generator.js:1) - 文本生成器（269行）
**职责**:
- 生成 Markdown 统计报告
- 生成文件列表（TXT）
- 提取所有文字内容（用于 AI）

**核心函数**:
- `generateMarkdownReport(stats)` - 生成统计报告.md
- `generateFileList(stats)` - 生成文件列表.txt
- `extractAllText(stats)` - 生成完整提取.txt

#### [`generators/tree-generator.js`](../src/generators/tree-generator.js:1) - 树生成器（182行）
**职责**:
- 生成 ASCII 格式的目录树（TXT）
- 生成 JSON 格式的文件树（用于 HTML 交互）

**核心函数**:
- `generateProjectStructure(stats, config, gitignorePatterns)` - 生成目录树（TXT）
- `buildFileTreeData(rootDir, config, gitignorePatterns)` - 生成文件树（JSON）

**JSON树结构**:
```javascript
{
  name: "文件/目录名",
  path: "相对路径",
  type: "file" | "directory",
  children: [/* 子节点 */]
}
```

#### [`generators/output-manager.js`](../src/generators/output-manager.js:1) - 输出管理器（125行）
**职责**:
- 统一管理所有文件的保存逻辑
- 创建时间戳文件夹
- 创建/更新"最新"快捷方式
- 保存 6 个报告文件

**核心函数**:
- `saveAllReports(reports, stats, resultsDir)` - 保存所有报告

**生成的文件**:
```
results/YYYY-MM-DD_HH-MM-SS/
├── 统计数据.json
├── 统计报告.md
├── 项目结构.txt
├── 文件列表.txt
├── 完整提取.txt
└── 可视化报告.html
```

---

### 模板层（v2.11.0 模块化）

#### [`html-report-template.js`](../src/html-report-template.js:1) - HTML总模板（模块化）
**职责**:
- 整合所有模板组件
- 生成最终的完整 HTML

**核心函数**:
- `generateEnhancedHTML(stats, timestamp, fileTreeData, formatNumber, formatSize, options)`

`options` 结构:
```ts
{
  libs?: { chartJs?: string; particlesJs?: string },
  trendData?: {
    totalLines: { label: string; value: number; tag?: string }[],
    files: { label: string; value: number }[],
    tokens: { label: string; value: number }[],
    codeLines: { label: string; value: number }[]
  } | null,
  comparisonData?: {
    isFirstRun: boolean,
    previousTime?: string,
    previousTag?: string | null,
    comparison?: {
      files: Change,
      totalChars: Change,
      totalLines: Change,
      codeLines: Change,
      commentLines: Change,
      tokens: Change
    }
  } | null
}

type Change = {
  old: number; new: number; diff: number; rate: number;
  diffFormatted: string; rateFormatted: string; trend: 'up'|'down'|'stable'
}
```

**依赖模块**:
- `templates/styles.css.js` 导出完整 CSS 字符串
- `templates/scripts.js` 导出 `generateScripts(stats, fileTreeData, trendData)`
- `templates/components.js` 导出各组件生成器

#### [`templates/styles.css.js`](../src/templates/styles.css.js:1) - CSS样式模块（588行）
**职责**:
- 提供完整的 Night Theme CSS 样式
- 粒子背景、卡片、图表、文件树等所有样式
- 响应式布局和打印样式

**核心导出**:
- `getCSSStyles()` - 返回完整CSS字符串

**关键特性**:
- 全局禁止文字选中（`user-select: none`）
- 代码区域保留选中（`code, pre { user-select: text }`）
- 暗黑主题配色（Night Theme）
- 粒子动画背景

#### [`templates/scripts.js`](../src/templates/scripts.js:1) - JavaScript模块
**职责**:
- 前端交互逻辑
- 粒子动画初始化
- Chart.js 图表渲染
- 文件树交互（折叠/展开）
 - 历史对比区块的显示/隐藏开关（按钮）

**核心导出**:
- `generateScripts(stats, fileTreeData, trendData)` - 返回完整JS字符串

**主要功能**:
- `initParticles()` - 初始化粒子背景
- `renderTrendCharts()` - 渲染历史趋势图
- `initFileTree()` - 初始化文件树交互
- `switchTab()` - Tab 切换

#### [`templates/components.js`](../src/templates/components.js:1) - HTML组件模块
**职责**:
- 生成可复用的 HTML 组件

**核心导出**:
```javascript
module.exports = {
  generateHead,              // HTML头部
  generateHeader,            // 页面顶部
  generateMetaCards,         // Meta信息卡片
  generateCoreStats,         // 核心统计卡片
  generateChartSection,      // 图表区域
  generateLanguageCodeChart, // 语言对比图
  generateTrendSection,      // 历史趋势
  generateFileTreeSection,   // 文件树
  generateLanguageStatsTable,// 语言统计表
  generateComplexitySection, // 复杂度分析
  generateComparisonSection, // 🆕 历史对比区块（带隐藏开关）
  generateFooter            // 页脚
};
```

---

## 🔄 可视化历史对比（新增）

在 HTML 报告中新增“历史对比分析”区块：

- 自动对比“当前统计”与“上一次统计”的关键指标：文件数、总字符、总行、代码行、注释行、Tokens
- 以卡片形式展示变化值和变化率，并以颜色区分趋势（上升/下降/持平）
- 提供“隐藏对比/显示对比”切换按钮（默认展开）
- 对比基准会展示上次统计的时间与可选标签

相关实现：
- 生成端：`generators/html-generator.js` 收集 `trendData` 与 `comparisonData`
- 模板端：`html-report-template.js` 注入对比区块
- 组件端：`templates/components.js` 的 `generateComparisonSection`
- 脚本端：`templates/scripts.js` 绑定显示/隐藏按钮逻辑
- 样式端：`templates/styles.css.js` 定义对比卡片与按钮样式

---

### 工具层

#### [`utils/file-utils.js`](../src/utils/file-utils.js:1) - 文件工具（113行）
**职责**:
- 文件类型判断
- 路径处理
- 排除规则应用（多层过滤机制）

**核心函数**:
- `shouldExclude(fullPath, config, gitignorePatterns)` - 判断是否应排除
- `isCodeFile(fullPath, config)` - 是否为代码文件
- `isDocFile(fullPath, config)` - 是否为文档文件
- `isLibraryFile(fullPath, config, strictMode)` - 是否为第三方库文件

**排除机制（3层过滤）**:
```
第1层: 目录排除（node_modules、.git等）
第2层: 库目录排除（lib/、vendor/等）
第3层: 库文件特征（.min.js、jquery等）
```

#### [`utils/formatters.js`](../src/utils/formatters.js:1) - 格式化工具（31行）
**职责**:
- 数字格式化（千分位）
- 文件大小格式化（B/KB/MB）

**核心函数**:
- `formatNumber(num)` - 格式化数字（如 `1,234,567`）
- `formatSize(bytes)` - 格式化大小（如 `1.2 MB`）

---

### 历史管理

#### [`history-manager.js`](../src/history-manager.js:1) - 历史记录管理器
**职责**:
- 保存统计记录到 `results/history.json`
- 加载历史记录
- 对比分析（计算变化率和趋势）
- 生成趋势数据（用于图表）

**核心方法**:
- `saveRecord(stats, tag, note)` - 保存当前统计
- `loadHistory()` - 加载历史记录
- `getPreviousRecord()` - 获取上一次记录
- `compare(currentStats, previousRecord)` - 对比分析
- `generateTrendData(metric, limit)` - 生成趋势数据

**历史文件结构**:
```json
{
  "version": "1.1",
  "records": [
    {
      "id": "时间戳",
      "timestamp": "ISO时间",
      "tag": "版本标签（可选）",
      "summary": {
        "files": {...},
        "text": {...},
        "code": {...},
        "tokens": {...}
      }
    }
  ]
}
```

---

## 📊 核心数据结构

### stats 对象（全局统计数据）

```javascript
{
  project: {
    path: "项目路径",
    name: "项目名称",
    type: "项目类型"        // Web Frontend, Backend等
  },
  
  files: {
    total: 0,               // 统计文件总数
    byType: {},             // 按扩展名分类
    byLanguage: {},         // 按语言分类
    largest: {              // 最大文件信息
      path: "",
      size: 0,
      lines: 0
    },
    list: [],               // 文件列表
    excluded: {
      libraries: 0,         // 排除的库文件数
      total: 0
    }
  },
  
  text: {
    chineseChars: 0,        // 中文字符数
    englishWords: 0,        // 英文单词数
    totalChars: 0,          // 总字符数
    codeChars: 0            // 代码字符数
  },
  
  code: {
    totalLines: 0,          // 总行数
    codeLines: 0,           // 代码行
    commentLines: 0,        // 注释行
    blankLines: 0           // 空白行
  },
  
  tokens: {
    estimated: 0,           // 估算总Token数
    breakdown: {
      fromChinese: 0,       // 来自中文
      fromEnglish: 0,       // 来自英文
      fromCode: 0           // 来自代码
    }
  },
  
  complexity: {
    avgLineLength: 0,       // 平均行长度
    avgFileSize: 0,         // 平均文件大小
    longestLine: {
      file: "",
      lineNum: 0,
      length: 0
    }
  },
  
  languageStats: {}         // 按语言详细统计
}
```

---

## 🔄 执行流程

```
用户执行 → main()
    ↓
[1] 配置初始化
    - createConfig()
    - loadGitignorePatterns()
    - initStats()
    ↓
[2] 项目扫描
    - scanProject()
      └─ walkDirectory() 递归遍历
         └─ analyzeFile() 分析每个文件
    ↓
[3] 统计计算
    - detectProjectType()
    - calculateComplexity()
    - calculateTokens()
    ↓
[4] 历史管理
    - saveRecord()
    - getPreviousRecord()
    - compare()
    ↓
[5] 报告生成
    - generateMarkdownReport()
    - generateProjectStructure()
    - generateFileList()
    - extractAllText()
    - generateHTMLReport()
    ↓
[6] 保存输出
    - saveAllReports()
    ↓
[7] 控制台输出
    - printResults()
    - printComparison()
```

---

## 🛠️ 编辑指南

### 修改功能时：
1. **定位模块**: 根据职责找到对应的文件
2. **查看依赖**: 确认模块间的调用关系
3. **保持一致**: 遵循现有的代码风格
4. **更新文档**: 修改后更新本文档

### 添加新功能时：
1. **选择位置**:
   - 配置项 → `config.js`
   - 分析逻辑 → `analyzers/`
   - 报告生成 → `generators/`
   - 工具函数 → `utils/`
2. **创建模块**: 按职责创建新文件
3. **导出函数**: 使用 `module.exports`
4. **集成到主流程**: 在 `project-stats.js` 中调用

### 快速修改参考：

| 需求 | 文件 | 位置 |
|------|------|------|
| 添加新语言 | `config.js` | `LANGUAGE_MAP` + `extensions.code` |
| 修改Token规则 | `config.js` | `tokenEstimate` |
| 调整排除规则 | `config.js` | `defaultExclude` |
| 修改注释识别 | `analyzers/code-analyzer.js` | `isCommentLine()` |
| 调整HTML样式 | `templates/styles.css.js` | `getCSSStyles()` |
| 修改图表配置 | `templates/scripts.js` | `renderTrendCharts()` |

---

## ⚠️ 注意事项

1. **stats 对象是引用传递**: 所有分析器都直接修改 stats，不返回新对象
2. **模块导入顺序**: 配置层必须最先导入，避免循环依赖
3. **保持独立性**: 每个模块应尽可能独立，减少跨模块依赖
4. **错误处理**: 文件读取失败时静默忽略，不中断整体流程
5. **浏览器兼容**: HTML 报告支持现代浏览器（Chrome、Firefox、Edge）

---

## 📚 相关文档

- **架构设计**: [`模块化架构说明.md`](模块化架构说明.md) - 架构设计和重构历程
- **用户文档**: [`README.md`](../README.md) - 用户使用说明
- **更新日志**: [`CHANGELOG.md`](CHANGELOG.md) - 版本更新记录

---

> **💡 文档更新说明**
>
> - **本文档职责**: 记录项目结构、模块职责、文件功能
> - **更新时机**: 当项目架构变化时（新增模块、修改职责、调整结构）
> - **版本历史**: 请查看 [`CHANGELOG.md`](CHANGELOG.md)
>
> **简单理解**: 本文档是"给 AI 和开发者看的结构说明书"，帮助快速理解项目组织方式。

---

**最后更新**: 2025-11-04  
**版本**: v2.11.0  
**维护**: Ω Code Agent