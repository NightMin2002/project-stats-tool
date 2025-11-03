# 🌙 项目统计工具 (Project Stats Tool)

[![Version](https://img.shields.io/badge/version-2.6-blue.svg)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Language](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://www.javascript.com)

> 🎯 智能统计项目代码量、文字数和 Token 使用量的专业工具
> 🚀 支持 40+ 种编程语言，自动排除第三方库，真实反映代码质量
> 🌙 全新夜间主题 + 粒子动画 + 交互式可视化 - v2.6 终极版

---

## 🌟 v2.7 全面优化更新 🆕

### 🎨 可视化HTML报告全面升级
- ✅ **修复动画BUG** - 优化header背景动画，移除旋转方块，改为优雅的脉冲效果
- ✅ **文件树交互增强** - 新增完整的折叠/展开功能，支持"全部展开"/"全部折叠"按钮
- ✅ **智能显示策略** - 文件树显示完整项目结构（包括第三方库），便于查看；文字提取和代码统计智能排除第三方库
- ✅ **图表体验优化** - 添加平滑动画、增强工具提示、格式化数字显示、改进配色方案
- ✅ **响应式全面优化** - 改进移动端显示效果，添加专业打印样式
- ✅ **性能大幅提升** - 优化大型项目的文件树渲染性能，支持数千个文件

### 🔧 底层技术改进
- 文件树构建算法优化，确保递归读取所有目录和文件
- Chart.js 全局配置升级，统一视觉风格
- CSS动画和过渡效果精细调优
- 添加粒子背景加载检测，提升兼容性
- 智能区分可视化展示和实际统计的过滤规则

---

## ✨ v2.6 新增功能 🆕

### 🌙 夜间炫酷主题
- 深邃宇宙黑背景，赛博朋克风格
- 霓虹色彩系统（青绿/电蓝/紫罗兰）
- 丝滑过渡动画，精致微交互

### ✨ 粒子动画背景
- 80个动态彩色粒子随机运动
- 鼠标悬停互动，点击生成新粒子
- 粒子间动态连线，科幻感十足

### 🌳 交互式可视化文件树
- 实时渲染项目结构
- 可折叠展开，悬停高亮
- 清晰的文件夹/文件图标区分

### 🎨 视觉特效
- 卡片悬停光晕效果
- 渐变文字与发光边框
- 扫光动画与呼吸动画

---

## ✨ 核心特性

### 🎯 智能过滤
- ✅ 自动识别并排除第三方库文件（lib、vendor、.min.js 等）
- ✅ 自动读取 `.gitignore` 规则
- ✅ 智能排除 `node_modules`、`.git`、`dist` 等依赖目录
- ✅ 真实反映项目代码量（排除率可达 50%+）

### 📊 全面统计
- 📝 文字统计：中文字符、英文单词、总字符数
- 💻 代码统计：代码行、注释行、空白行（含占比）
- 📈 复杂度分析：平均行长度、最大文件、最长行
- 🎯 Tokens 估算：准确估算 AI Token 使用量
- 🌍 语言分布：自动识别 40+ 种编程语言

### 📦 完整输出
- 📄 JSON 数据：结构化统计数据
- 📋 Markdown 报告：美观的可读报告
- 📝 完整提取：所有代码和文档的文字内容
- 🌳 项目结构树：直观的目录树形图
- 📋 文件列表：详细的文件清单
- 🌙 **HTML 可视化报告**：夜间炫酷版，带粒子动画 🆕
- 🕒 历史记录：带时间戳的版本管理
- 📌 快速访问：自动生成"最新"版本文件

### 🚀 即用即看
- 🖱️ 双击运行，无需配置
- 📁 拖放操作，支持任意项目
- 💾 结果自动保存到 `results` 文件夹
- 🔧 完全独立，可在任意位置使用

---

## 📦 安装

### 前置要求
- [Node.js](https://nodejs.org/) >= 12.0.0

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/NightMin2002/project-stats-tool.git

# 2. 进入目录
cd project-stats-tool

# 3. 运行统计（Windows）
统计项目.bat

# 或使用命令行
node project-stats.js [项目路径]
```

---

## 🚀 使用方法

### 方法 1: 双击运行（最简单）

Windows 用户直接双击 `统计项目.bat`，统计当前目录。

### 方法 2: 拖放操作

将任意项目文件夹拖到 `统计项目.bat` 上，即可统计该项目。

### 方法 3: 命令行

```bash
# 统计当前目录
node project-stats.js

# 统计指定目录
node project-stats.js /path/to/project

# 仅提取文字
node extract-text.js /path/to/project
```

### 方法 4: 项目内使用（推荐）

```
your-project/
├── src/
├── css/
└── 统计工具/           ← 复制工具到这里
    ├── project-stats.js
    ├── extract-text.js
    ├── 统计项目.bat
    └── results/        ← 结果自动保存
```

---

## 📊 输出示例

### 控制台输出

```
╔════════════════════════════════════════════════════════╗
║              📊 项目统计结果 v2.3                      ║
╚════════════════════════════════════════════════════════╝

📁 项目信息
─────────────────────────────────────────────────────────
   名称: my-awesome-project
   路径: /Users/night/projects/my-awesome-project
   类型: Web/Frontend

📂 文件统计
─────────────────────────────────────────────────────────
   统计文件: 39 个
   排除库文件: 6 个 🎯
   语言分布:
     JavaScript      18 个
     CSS             17 个
     Markdown        2 个

💻 代码统计
─────────────────────────────────────────────────────────
   总行数:   11,631 行
   代码行:   9,256 行 (79.6%)
   注释行:   835 行 (7.2%)
   空白行:   1,540 行 (13.2%)

🎯 Tokens 估算
─────────────────────────────────────────────────────────
   总计估算: 133,246 tokens
```

### 生成的文件

```
results/
├── my-project_2025-11-03T12-30-45.json            # JSON 数据
├── my-project_2025-11-03T12-30-45.md              # Markdown 报告
├── my-project_完整提取_2025-11-03T12-30-45.txt     # 完整代码
├── my-project_项目结构_2025-11-03T12-30-45.txt     # 结构树
├── my-project_文件列表_2025-11-03T12-30-45.txt     # 文件列表
├── my-project_可视化报告_2025-11-03T12-30-45.html  # 🌙 HTML报告 🆕
├── 最新_统计数据.json                              # 快速访问
├── 最新_统计报告.md                                # 快速访问
├── 最新_完整提取.txt                               # 快速访问
├── 最新_项目结构.txt                               # 快速访问
├── 最新_文件列表.txt                               # 快速访问
└── 最新_可视化报告.html                            # 🌙 推荐！🆕
```

---

## 🎯 智能过滤详解

### 自动排除的第三方库

#### 1. 库目录
- `lib`, `libs`, `library`, `vendor`
- `third-party`, `external`, `plugins`
- `bower_components`, `jspm_packages`

#### 2. 压缩文件
- `.min.js`, `.min.css`
- `.bundle.js`, `.bundle.css`
- `.vendor.js`, `.vendor.css`

#### 3. 知名库文件
- 前端框架: `jquery`, `react`, `vue`, `angular`
- 工具库: `lodash`, `moment`, `axios`, `d3`
- 可视化: `chart`, `echarts`, `three`
- Markdown: `markdown-it`, `katex`, `highlight`

### 实际效果对比

| 指标 | 含第三方库 | 排除第三方库 | 差异 |
|------|-----------|-------------|------|
| 文件数 | 45 | 39 | **-13%** |
| 总字符 | 817 KB | 359 KB | **-56%** |
| Tokens | ~300K | ~133K | **-56%** |

---

## 🔧 支持的语言

### Web 开发
JavaScript, TypeScript, Vue, React, Svelte, CSS, SCSS, Sass, Less, HTML

### 后端开发
Python, Java, Go, Rust, C/C++, PHP, Ruby, C#, Swift, Kotlin

### 数据与配置
JSON, YAML, TOML, SQL, GraphQL, Prisma

### 文档
Markdown, Text, reStructuredText, AsciiDoc

---

## 💡 使用场景

### 🤖 AI 辅助开发
- 向 AI 提供项目上下文时，准确估算 Token 使用量
- 提取的文字内容可直接用于 AI 对话
- 排除第三方库，让 AI 更专注于你的代码

### 📈 项目管理
- 定期统计，跟踪项目增长趋势
- 多项目对比，评估工作量
- 真实反映代码质量，不含第三方库

### 📝 代码审查
- 快速了解项目规模和结构
- 识别复杂度高的文件
- 评估代码注释率

### 📚 文档生成
- 自动生成项目统计报告
- 为 README 提供数据支持
- 创建项目档案

---

## 📁 项目结构

```
project-stats-tool/
├── project-stats.js         # 主统计脚本 v2.6 🆕
├── html-report-template.js  # HTML 模板生成器 🆕
├── extract-text.js          # 独立文字提取工具
├── 统计项目.bat             # Windows 启动器（完整统计）
├── 提取文字.bat             # Windows 启动器（仅提取）
├── 使用说明.txt             # 中文详细文档
├── README.md                # 本文档
└── results/                 # 输出目录（自动创建）
    └── 最新_可视化报告.html # 🌙 夜间炫酷版 🆕
```

---

## ⚙️ 配置说明

工具采用智能默认配置，通常无需修改。如需自定义，可编辑 `project-stats.js`：

```javascript
const CONFIG = {
  // 自定义排除目录
  defaultExclude: ['node_modules', '.git', 'dist'],
  
  // 自定义库目录
  libraryDirs: ['lib', 'vendor', 'third-party'],
  
  // 自定义库文件特征
  libraryFilePatterns: ['.min.js', 'jquery', 'bootstrap']
};
```

---

## 🔒 安全与隐私

- ✅ **只读操作**: 工具只读取文件，不做任何修改
- ✅ **本地运行**: 所有处理在本地完成，不上传任何数据
- ✅ **智能排除**: 自动排除 `.git`、`.env` 等敏感文件
- ✅ **尊重配置**: 遵守 `.gitignore` 规则

---

## 📊 版本历史

### v2.6 (2025-11) - 夜间炫酷版 🌙🆕
- ✨ 全新深色夜间主题设计
- ✨ 粒子背景动画效果（Particles.js）
- ✨ 交互式可视化文件树
- ✨ 霓虹风格视觉特效
- ✨ 悬停光晕与扫光动画
- 🎨 赛博朋克配色方案
- 🎨 渐变文字与发光边框
- 📱 响应式设计优化

### v2.5 (2025-11) - 可视化增强
- ✨ 生成交互式 HTML 可视化报告
- ✨ Chart.js 图表展示
- ✨ 美观的渐变紫色主题
- 🎯 三种图表（语言/代码/Token）

### v2.4 (2025-11) - 功能扩展
- ✨ 项目结构树形图显示
- ✨ 完整文件列表生成
- ✨ 多文件格式输出

### v2.3 (2025-11) - 智能过滤
- ✨ 智能识别并排除第三方库文件
- ✨ 支持多种库文件特征识别
- ✨ 显示排除的库文件数量
- 🎯 更准确反映真实代码量

### v2.2 (2025-11) - 结果管理
- ✨ 自动创建 `results` 文件夹
- ✨ 文件名带时间戳
- ✨ 内置完整文字提取功能
- ✨ 自动生成"最新"版本文件

### v2.1 (2025-11) - 智能排除
- ✨ 智能排除统计工具所在目录
- ✨ 自动生成 Markdown 报告
- ✨ 支持在项目内使用

### v2.0 (2025-11) - 功能增强
- ✨ 通用化设计，支持任意项目
- ✨ 自动读取 `.gitignore`
- ✨ 复杂度分析
- ✨ 语言分布统计

### v1.0 (2025-11) - 初始版本
- ✨ 基础统计功能
- ✨ Tokens 估算
- ✨ JSON 输出

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 建议的改进方向

- 🎨 可视化报告（图表）
- 🌐 多语言界面支持
- 📊 趋势分析功能
- 🔍 代码质量检测
- ⚡ 性能优化

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👨‍💻 作者

**Ω Code Agent**

- GitHub: [@NightMin2002](https://github.com/NightMin2002)
- Email: nightmin200202@gmail.com

---

## 🙏 致谢

- 感谢所有使用和支持这个工具的开发者
- 特别感谢 Node.js 社区
- 灵感来源于对代码质量的追求

---

## 📮 反馈与支持

如有问题、建议或需要帮助，请：

- 📝 [提交 Issue](https://github.com/NightMin2002/project-stats-tool/issues)
- 💬 [发起讨论](https://github.com/NightMin2002/project-stats-tool/discussions)
- ⭐ 如果觉得有用，请给个星标！

---

<div align="center">

**[⬆ 回到顶部](#-项目统计工具-project-stats-tool)**

Made with ❤️ and 🌙 by Ω Code Agent

**[⭐ 立即体验夜间炫酷版可视化报告！](#)**

</div>