# 📘 项目结构说明

本项目采用模块化架构，职责清晰，便于 AI 辅助开发和维护。

---

## 📁 目录结构

```
project-stats-tool/
├── src/                          # 源代码目录
│   ├── project-stats.js          # 🎯 主入口（异步执行流程）
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
│   ├── ProjectA/                 # 项目A的统计结果
│   ├── ProjectB/                 # 项目B的统计结果
│   └── ...
│
├── 统计项目.bat                  # Windows启动脚本（支持拖拽）
├── 查看历史.bat                  # 历史查看脚本
├── README.md                     # 用户文档
└── LICENSE                       # MIT许可证
```

---

## 🎯 模块职责 (v2.12.0 + V3 UI)

### 入口层

#### [`project-stats.js`](../src/project-stats.js:1) - 主入口
**职责**: 
- 协调所有模块的执行流程（异步）
- 控制台输出
- 历史记录管理
- 报告生成和保存（`await saveAllReports`）

**核心流程**:
```
初始化配置 → 异步扫描项目 → 计算统计 → 历史管理(含备份) → 生成报告 → 并行保存输出 → 控制台输出
```

---

### 模板层 (Night Theme V3)

#### [`templates/components.js`](../src/templates/components.js:1) - HTML 组件
**职责 (v3.0.0)**:
- **SVG 图标集**: 内置完整的 SVG 图标定义 (`ICONS` 对象)，取代 Emoji。
- **组件生成**: 提供 `generateHeader`, `generateCoreStats`, `generateFileTreeSection` 等函数。
- **结构定义**: 定义基于 Grid 的现代页面结构。

#### [`templates/styles.css.js`](../src/templates/styles.css.js:1) - CSS 样式
**职责 (v3.0.0)**:
- **视觉风格**: 定义 Glassmorphism（玻璃拟态）样式、CSS 变量主题色。
- **动画效果**: 实现 `moonFloat` 月亮悬浮动画、卡片悬停效果。
- **布局系统**: 使用 CSS Grid 实现响应式布局，适配移动端。

#### [`templates/scripts.js`](../src/templates/scripts.js:1) - 前端交互
**职责 (v3.0.0)**:
- **图表配置**: 配置 Chart.js 的颜色、字体、Tooltip 样式，添加 `layout.padding` 防止裁剪。
- **文件树交互**: 实现文件树的展开/折叠逻辑，支持 SVG 图标切换。
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
- **v2.12 新增**: `shouldExclude` 增加对工具自身路径的智能检测
- 二进制文件检测 (`isBinaryFile`，读取文件头判断)

---

## 🔄 执行流程 (v2.12.0)

```
用户拖拽/点击 → 统计项目.bat (修正CWD) → update-checker.js
    ↓
project-stats.js (Main)
    ↓
[1] 配置初始化 (含 toolRoot 识别)
    ↓
[2] 极速扫描 (project-scanner.js)
    - readdir withFileTypes
    - 并行处理 & 智能排除
    ↓
[3] 统计计算 (stats-calculator.js)
    ↓
[4] 历史管理 (history-manager.js)
    - 识别项目名
    - 自动备份
    - 写入 results/<Project>/history.json
    ↓
[5] 报告生成 & 保存 (output-manager.js)
    - 并行写入所有报告到 results/<Project>/<Timestamp>/
    ↓
[6] 控制台输出
```

---

## 📚 相关文档

- **架构设计**: [`模块化架构说明.md`](模块化架构说明.md) - 架构设计和重构历程
- **用户文档**: [`README.md`](../README.md) - 用户使用说明
- **更新日志**: [`CHANGELOG.md`](CHANGELOG.md) - 版本更新记录

---

**最后更新**: 2025-12-06  
**版本**: v3.0.0 (UI) / v2.12.1 (Core)  
**维护**: Ω Code Agent