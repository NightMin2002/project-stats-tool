# 🌙 项目统计工具 (Project Stats Tool)

[![Version](https://img.shields.io/badge/version-2.12.0-blue.svg)](https://github.com)
[![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> 🎯 智能统计项目代码量、文字数和 Token 使用量的专业工具
> 📈 支持历史对比分析、趋势可视化、50+ 种编程语言
> 🌙 Night Theme 暗黑主题 + 粒子动画 + 交互式文件树
> ✨ **Unreleased 增强**：新增 HTML “历史对比分析”卡片区块（可折叠）
> ✨ **v2.12.0 新增**：性能优化 + 50+ 语言支持 + 命令行增强

---

## 🔄 最新增强（Unreleased）
新增 HTML 报告“历史对比分析”区块：
- 自动对比上一轮统计：文件数 / 总字符 / 总行 / 代码行 / 注释行 / Tokens
- 卡片展示增量与百分比变化（📈 上升 / 📉 下降 / ➡️ 持平）
- 一键“隐藏对比 / 显示对比”按钮，长报告浏览更清爽
- 与历史趋势图并行展示，需 ≥2 条历史记录
- 数据统一来源：`results/history.json`
在第二次运行后打开：`results/最新/可视化报告.html` 即可查看。

---

## 🚀 快速开始

### 方法 1：双击运行（推荐）
```
双击 统计项目.bat → 自动统计当前目录
```

### 方法 2：拖放操作
```
拖动项目文件夹到 统计项目.bat → 统计该项目
```

### 方法 3：命令行
```bash
node src/project-stats.js              # 统计当前目录
node src/project-stats.js ../my-app    # 统计指定项目
node src/project-stats.js --help       # 显示帮助信息
node src/project-stats.js --version    # 显示版本信息
```

---

## ✨ 核心特性

### 📊 全面统计
- **文字统计** - 中文字符、英文单词、总字符数
- **代码统计** - 代码行、注释行、空白行（含占比）
- **复杂度分析** - 平均行长度、最大文件、最长行
- **Token 估算** - 准确估算 AI Token 使用量
- **语言分布** - 自动识别 50+ 种编程语言
- **按语言统计** - 每种编程语言的详细代码量和文件数

### 🆕 v2.12.0 新增特性
- **性能优化** - Set查找优化，大幅提升扫描速度
- **50+ 语言支持** - 新增 Dart、Lua、R、Scala 等语言
- **命令行增强** - 支持 --help 和 --version 参数
- **统一版本管理** - 集中管理版本号，便于维护
- **错误处理增强** - 更智能的错误提示和恢复机制
- **数据安全** - 自动备份历史记录，防止数据丢失

### 📈 历史与对比
- **自动记录**：每次统计自动保存到 `history.json`
- **实时对比**：控制台输出与上一轮差异
- **趋势图表**：总行数 / 文件数 / Tokens / 代码行趋势
- **可视化对比**：HTML 报告中卡片化展示差异（可折叠）
- **版本管理**：CLI 支持任意历史版本对比

### 🎯 智能过滤
- ✅ 自动识别并排除第三方库（lib、vendor、.min.js 等）
- ✅ 自动读取 `.gitignore` 规则
- ✅ 智能排除 `node_modules`、`.git`、`dist` 等
- ✅ 真实反映项目代码量（排除率可达 50%+）

### 🌙 可视化报告
- **Night Theme** - 赛博朋克风格暗黑主题
- **粒子动画** - 交互式动态背景
- **趋势图表** - Chart.js 驱动的历史数据可视化
- **文件树** - 可折叠/展开的项目结构视图
- **语言级图表** - 按语言的代码量对比图 🆕

---

## 📂 输出结果

运行后会在 `results/` 目录生成：

```
results/
├── 最新/                          ← 快捷访问（始终是最新结果）
│   ├── 可视化报告.html            ← ⭐ 推荐在浏览器中打开
│   ├── 统计数据.json
│   ├── 统计报告.md
│   ├── 项目结构.txt
│   ├── 文件列表.txt
│   └── 完整提取.txt
│
├── 2025-11-04_10-30-11/           ← 第1次统计（时间戳文件夹）
│   ├── 统计数据.json
│   └── ...
│
├── 2025-11-04_14-45-22/           ← 第2次统计
│   └── ...
│
└── history.json                    ← 历史记录索引
```

**文件组织优势**：
- ✅ 按时间自动排序
- ✅ 文件名简洁易读
- ✅ 快速访问最新结果
- ✅ 历史版本一目了然

---

## 🔧 历史对比功能

### 查看历史记录

```bash
# 双击运行（Windows）
查看历史.bat

# 或使用 Node.js
node src/view-history.js                # 列表
node src/view-history.js detail 3       # 查看第3条详情
node src/view-history.js compare 1 5    # 对比第1和第5条
```

### HTML 趋势图

当有 ≥2 条历史记录时，打开 `results/最新/可视化报告.html` 可看到：
- 📈 代码行数趋势曲线
- 📊 文件数量变化
- 💰 Token 估算趋势
- 🔄 历史对比分析卡片（可“隐藏对比 / 显示对比”）

---

## 💡 使用场景

### 🤖 AI 辅助开发
- 准确估算 Token 使用量
- 提取的文字内容可直接提供给 AI
- 排除第三方库，让 AI 专注于你的代码

### 📈 项目管理
- 定期统计，跟踪项目增长
- 多次统计自动生成趋势图
- 对比不同时间点的代码状态

### 📝 代码审查
- 快速了解项目规模
- 识别复杂度高的文件
- 评估代码注释率

---

## 🔧 技术规格

### 支持的语言（50+）
### comparisonData 数据结构（HTML报告中）
```ts
interface ChangeMetric {
	old: number;
	new: number;
	diff: number;
	rate: number;
	diffFormatted: string;
	rateFormatted: string;
	trend: 'up' | 'down' | 'stable';
}

interface ComparisonData {
	isFirstRun: boolean;
	previousTime?: string;
	previousTag?: string | null;
	comparison?: {
		files: ChangeMetric;
		totalChars: ChangeMetric;
		totalLines: ChangeMetric;
		codeLines: ChangeMetric;
		commentLines: ChangeMetric;
		tokens: ChangeMetric;
	};
}
```

- **Web前端**: JavaScript, TypeScript, HTML, CSS, Vue, React, Svelte
- **后端**: Python, Java, Go, Rust, PHP, Ruby, C#, C++, C, Swift, Kotlin
- **函数式**: Elixir, Erlang, Elm, Haskell, Clojure, F#
- **其他**: Dart, Lua, R, Scala, Perl
- **配置**: JSON, YAML, TOML, XML, INI, ENV
- **脚本**: Shell, Bash, PowerShell, Batch
- **数据库**: SQL, GraphQL, Prisma
- **标记**: Markdown, reStructuredText, LaTeX

### Token 估算规则

- 中文: ~1.5 字符/token
- 英文: ~1.3 单词/token
- 代码: ~3.5 字符/token

> ⚠️ **注意**: 此为粗略估算，实际值可能有 ±20% 的偏差

### 独立性保证

- ✅ **零外部依赖** - 仅使用 Node.js 内置模块（`fs`, `path`）
- ✅ **本地化库文件** - Chart.js 和 Particles.js 已内置
- ✅ **开箱即用** - 无需 `npm install`

---

## 🧪 推荐工作流
1. 第一次运行：生成基础统计与可视化（无对比卡片）
2. 第二次运行：出现趋势图 + 历史对比卡片
3. 浏览报告时若需精简视图 → 点击“隐藏对比”按钮折叠
4. 使用 CLI：`node src/view-history.js compare 2 5` 做跨版本对比
5. 将 `完整提取.txt` 提供给 AI 做语义检索 / 审查 / 重构建议

---

## 🔒 安全与隐私

- ✅ **只读操作** - 只读取文件，不做任何修改
- ✅ **本地运行** - 所有处理在本地完成
- ✅ **智能排除** - 自动排除敏感文件
- ✅ **尊重配置** - 遵守 `.gitignore` 规则

---

## 📖 文档

- **[项目结构说明](docs/AI-项目结构说明.md)** - 🤖 模块职责和项目结构（AI/开发者）
- **[模块化架构说明](docs/模块化架构说明.md)** - 架构设计和重构历程
- **[更新日志](docs/CHANGELOG.md)** - 完整版本历史和新功能介绍
- **[使用说明](docs/使用说明.txt)** - 快速参考指南

---

## 🤝 贡献

欢迎贡献！请 Fork 本仓库并提交 Pull Request，或提交改进“历史对比”与“趋势分析”的想法。

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 👨‍💻 作者

**Ω Code Agent**
- GitHub: [@NightMin2002](https://github.com/NightMin2002)
- Email: nightmin200202@gmail.com

---

## 📮 支持

- 📝 [提交 Issue](https://github.com/NightMin2002/project-stats-tool/issues)
- ⭐ 如果觉得有用，请给个星标！

---

<div align="center">

**Made with ❤️ and 🌙 by Ω Code Agent**

⭐ **[立即体验 v2.12.0 性能增强版！](https://github.com/NightMin2002/project-stats-tool)** ⭐

</div>
