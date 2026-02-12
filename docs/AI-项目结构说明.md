# 📘 项目结构说明

本项目采用模块化架构，职责清晰，便于 AI 辅助开发和维护。

> **版本**: v3.4.0 Ω 数据可视化增强版

---

## 📁 目录结构

```
project-stats-tool/
├── src/                          # 源代码目录
│   ├── project-stats.js          # 🎯 主入口（交互式选择/参数解析）
│   ├── config.js                 # ⚙️ 配置管理（177行）
│   ├── history-manager.js        # 📊 历史记录管理器（含自动备份/恢复）
│   ├── view-history.js           # 📈 历史查看CLI工具
│   ├── html-report-template.js   # 🎨 HTML总模板
│   ├── update-checker.js         # 🆕 更新检查与启动器
│   ├── version.js                # ℹ️ 版本号统一管理
│   │
│   ├── core/                     # 核心业务逻辑
│   │   ├── project-scanner.js    # 项目扫描器（异步并行、readdir优化）
│   │   └── stats-calculator.js   # 统计计算器（复杂度、Tokens、类型检测）
│   │   │
│   ├── analyzers/                # 数据分析模块
│   │   ├── file-analyzer.js      # 文件分析器（异步I/O + 二进制检测）
│   │   ├── code-analyzer.js      # 代码分析器（行类型判断、注释识别）
│   │   └── text-analyzer.js      # 文本分析器（中英文统计）
│   │   │
│   ├── generators/               # 报告生成器
│   │   ├── html-generator.js     # HTML可视化报告生成
│   │   ├── text-generator.js     # Markdown/TXT报告生成
│   │   ├── tree-generator.js     # 目录树和文件树生成
│   │   └── output-manager.js     # 统一文件保存管理（并行写入）
│   │   │
│   ├── templates/                # HTML模板组件（Night Theme V3）
│   │   ├── styles.css.js         # CSS 样式 (Grid布局, Glassmorphism, 动画)
│   │   ├── scripts.js            # JS 逻辑 (Chart.js配置, 交互, 粒子)
│   │   └── components.js         # HTML 组件 (SVG图标集, 结构生成)
│   │   │
│   └── utils/                    # 通用工具
│       ├── file-utils.js         # 文件类型判断、路径处理、排除规则、二进制检测
│       ├── formatters.js         # 数字和文件大小格式化
│       └── progress-bar.js       # 🆕 CLI 进度条模块
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
│   ├── ProjectA/                 # 项目A的统计结果
│   ├── ProjectB/                 # 项目B的统计结果
│   └── ...
│
├── 统计项目.bat                  # Windows启动脚本（交互式/拖拽）
├── 查看历史.bat                  # 历史查看脚本
├── package.json                  # 项目元数据 (CommonJS)
├── README.md                     # 用户文档
├── stats-languages.example.json  # 🆕 自定义语言配置示例
└── LICENSE                       # MIT许可证
```

---

## 🎯 模块职责 (v3.2.0)

### 入口层

#### [`project-stats.js`](../src/project-stats.js:1) - 主入口
**职责 (v3.1.0)**: 
- **交互式选择**: 自动发现同级项目并提供选择菜单（`selectProject`）。
- **参数解析**: 统一处理命令行参数、拖拽路径和交互选择。
- **流程协调**: 调度扫描、分析、生成、保存等全流程。

**核心流程**:
```
解析参数(或交互选择) → 初始化配置 → 异步扫描项目 → 计算统计 → 历史管理 → 生成报告 → 并行保存 → 控制台输出
```

---

### 模板层 (Night Theme V3)

#### [`templates/components.js`](../src/templates/components.js:1) - HTML 组件
**职责 (v3.4.0)**:
- **SVG 图标集**: 内置完整的 SVG 图标定义 (`ICONS` 对象)，取代 Emoji。
- **XSS 防护**: `escapeHtml()` 服务端转义函数，所有用户数据插值点均已转义。
- **组件生成**: 提供 `generateHeader`, `generateCoreStats`, `generateFileTreeSection` 等 12+ 组件函数。
- **Sparkline**: `generateSparkline()` 纯 SVG 迷你折线图（120×32px），嵌入核心统计卡片。
- **Treemap 热力图**: 对数尺度分级 + CSS Grid span 等级（xl/lg/md）。
- **可排序表格**: 表头带 `data-sort`/`data-type` 属性 + 代码率内联进度条。
- **语言图切换**: btn-group 双视图按钮（文件数 / 代码行）。
- **版本导入**: 从 `version.js` 导入，消除硬编码版本号。

#### [`templates/styles.css.js`](../src/templates/styles.css.js:1) - CSS 入口
**职责 (v3.3.0)**:
- **模块合并**: 重导出 `./styles/index.js`，向后兼容旧引用。

#### [`templates/styles/`](../src/templates/styles/) - CSS 模块化目录
**职责 (v3.4.0)**:
> 所有 `:hover` 规则已包裹 `@media (hover: hover)`，防止触屏粘滞。z-index 统一使用 `var(--z-*)` token。

- **[`base.css.js`](../src/templates/styles/base.css.js:1)**: CSS 变量（含 `--heatmap-medium`）、Nuclear Reset、Scrollbar、Selection。
- **[`layout.css.js`](../src/templates/styles/layout.css.js:1)**: Grid 系统、Header、Section、响应式断点。
- **[`components.css.js`](../src/templates/styles/components.css.js:1)**: 语言卡片、**Treemap 热力图**（6 列 Grid + span 等级）、文件树、**可排序表格**（sort 指示器 + 进度条）、Tooltip、**Sparkline**、**图表联动高亮**（`.chart-highlight` / `.row-highlight`）、**语言图切换按钮**。
- **[`animations.css.js`](../src/templates/styles/animations.css.js:1)**: 所有 @keyframes、动画工具类、Stagger 动画。
- **[`forms.css.js`](../src/templates/styles/forms.css.js:1)**: **完整 Anti-Native 表单**：Input、Textarea、Checkbox、Radio、Toggle、Range、Select、Button。
- **[`utilities.css.js`](../src/templates/styles/utilities.css.js:1)**: Flexbox、Spacing、Text、Performance 工具类。

#### [`templates/scripts.js`](../src/templates/scripts.js:1) - 前端交互
**职责 (v3.4.0)**:
- **CSS 变量颜色**: 通过 `getComputedStyle` 读取 CSS 变量构建 `COLORS` 对象，消除硬编码主题色。
- **图表配置**: 配置 Chart.js 的颜色、字体、Tooltip 样式，添加 `layout.padding` 防止裁剪。
- **语言图双视图**: 存储 `langChartInstance`，支持文件数/代码行数据切换。
- **4 维趋势图**: totalLines、codeLines、files、tokens 四个维度。
- **表格排序**: 表头点击排序逻辑，支持数字和文本列。
- **图表联动**: 点击语言分布图扇区 → `highlightLanguageInTree()` + `scrollToLanguageRow()`。
- **XSS 防护**: `_esc()` 客户端 HTML 实体转义，用于文件树动态渲染。
- **文件树交互**: 展开/折叠、搜索高亮、路径复制、SVG 图标切换。
- **粒子背景**: 初始化 `particles.js` 动态背景。

---

### 配置层

#### [`config.js`](../src/config.js:1) - 配置管理
**职责**:
- 集中管理所有配置项和常量
- 定义语言映射
- 智能识别工具自身路径 (`toolRoot`)，用于自我排除

---

### 核心层

#### [`core/project-scanner.js`](../src/core/project-scanner.js:1) - 项目扫描器
**职责**:
- 异步递归遍历项目目录
- **v2.12 优化**: 使用 `readdir({ withFileTypes: true })` 减少 `fs.stat` 调用
- 并发控制与错误处理

---

### 分析层

#### [`analyzers/file-analyzer.js`](../src/analyzers/file-analyzer.js:1) - 文件分析器
**职责**:
- 智能检测二进制文件并跳过 (`isBinaryFile`)
- 整合代码分析和文本分析
- 更新统计数据

---

### 生成层

#### [`generators/output-manager.js`](../src/generators/output-manager.js:1) - 输出管理器
**职责**:
- **v2.12 优化**: 使用 `Promise.all` 并行写入所有报告文件
- 按项目名称自动创建子目录结构
- 维护“最新”快捷文件夹

---

### 历史管理

#### [`history-manager.js`](../src/history-manager.js:1) - 历史记录管理器
**职责**:
- **v2.12 优化**: 支持按项目名隔离历史记录 (`results/<ProjectName>/history.json`)
- 自动备份与恢复机制，防止数据损坏
- 对比分析（计算变化率和趋势）

---

### 工具层

#### [`utils/file-utils.js`](../src/utils/file-utils.js:1) - 文件工具
**职责**:
- **v3.2.0 升级**: `.gitignore` 规则匹配从模糊匹配重构为精确路径段匹配，支持 `*` 和 `**` glob 模式。
- **智能自我排除**: 仅在非目标扫描（即扫描父级）时排除工具自身。
- **二进制检测**: 优化 UTF-16 识别逻辑。

#### [`utils/progress-bar.js`](../src/utils/progress-bar.js:1) - CLI 进度条 🆕
**职责 (v3.2.0)**:
- **ProgressBar**: 带百分比、ETA、动态消息的进度条。
- **Spinner**: 无进度值的加载动画。
- **MultiProgress**: 多阶段进度管理器。
- **ANSI 颜色**: 支持 TTY 检测，非 TTY 环境自动降级。

---

## 🔄 执行流程 (v3.2.0)

```
用户双击/拖拽 → 统计项目.bat (修正CWD)
    ↓
project-stats.js (Main)
    ↓
[0] 参数解析 / 交互式选择 (selectProject)
    - 自动发现同级目录
    - 用户输入选择
    ↓
[1] 加载自定义语言配置 (loadCustomLanguageConfig) 🆕
    - 读取 .stats-languages.json
    ↓
[2] 配置初始化 (含 toolRoot 识别)
    ↓
[3] 极速扫描 (project-scanner.js)
    - 🆕 预扫描文件计数 (countFiles)
    - 🆕 CLI 进度条显示 (progress-bar.js)
    - readdir withFileTypes
    - 并行处理 & 智能排除 (file-utils.js)
    ↓
[4] 统计计算 (stats-calculator.js)
    ↓
[5] 历史管理 (history-manager.js)
    - 识别项目名
    - 自动备份
    - 写入 results/<Project>/history.json
    ↓
[6] 报告生成 & 保存 (output-manager.js)
    - Treemap 热力图、Sparkline、可排序表格、图表联动
    - 并行写入所有报告到 results/<Project>/<Timestamp>/
    ↓
[7] 控制台输出
```

---

## 📚 相关文档

- **架构设计**: [`模块化架构说明.md`](模块化架构说明.md) - 架构设计和重构历程
- **用户文档**: [`README.md`](../README.md) - 用户使用说明
- **更新日志**: [`CHANGELOG.md`](CHANGELOG.md) - 版本更新记录

---

**最后更新**: 2026-02-12
**版本**: v3.4.0 (Ω 数据可视化增强版)
**维护**: Ω Code Agent