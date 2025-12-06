# 🤖 AI 开发者指南 (AI Developer Guide)

> **写在前面**：如果你是接手此项目的 AI 助手，请仔细阅读本文档。它定义了本项目的核心原则、架构规范和开发流程。

---

## 🆔 项目身份卡

- **项目名称**: Project Stats Tool (项目统计工具)
- **核心功能**: 智能统计代码行数、文字数、Token 估算，生成可视化 HTML 报告。
- **技术栈**: Node.js (Vanilla/Native), 无任何第三方 `npm` 依赖。
- **核心理念**: 高性能、零依赖、模块化、可视化。

---

## ⚡ 核心原则 (Critical Rules)

1. **🚫 严禁引入 npm 依赖**
   - 项目必须保持“开箱即用”，用户不需要运行 `npm install`。
   - 所有外部库（Chart.js, Particles.js）必须内置在 `lib/` 目录中。

2. **⚡ 保持异步并行**
   - 核心扫描和写入逻辑必须是 `async/await` 且并行的 (`Promise.all`)。
   - **严禁**将核心逻辑回退到同步阻塞模式 (`fs.readFileSync` 仅限配置文件)。

3. **🔄 版本号必更**
   - 只要修改了代码，**必须**更新 `src/version.js`。
   - 只要有新功能或修复，**必须**更新 `docs/CHANGELOG.md`。

4. **📂 目录结构神圣不可侵犯**
   - 不要随意在根目录创建新文件，保持根目录整洁。
   - 新功能模块必须放入 `src/` 下的对应子目录 (`analyzers`, `generators`, `utils`)。

---

## 🏗️ 架构速览

- **入口**: `src/project-stats.js` (负责协调)
- **核心**: `src/core/project-scanner.js` (极速扫描)
- **分析**: `src/analyzers/` (代码/文本/文件分析)
- **生成**: `src/generators/` (HTML/Markdown/JSON 生成)
- **历史**: `src/history-manager.js` (多项目隔离与备份)
- **启动**: `统计项目.bat` -> `node src/project-stats.js` (极速启动)

---

## ✅ 开发工作流 (Workflow Checklist)

当你接到修改任务时，请严格遵循以下步骤：

1. **理解需求**
   - 确认是修改核心逻辑、UI 还是文档。

2. **编写代码**
   - 修改 `src/` 下的源文件。
   - 确保遵循**异步并行**原则。

3. **更新版本 (IMPORTANT)**
   - 修改 `src/version.js`:
     ```javascript
     const VERSION = '2.13.0'; // 递增版本号
     const VERSION_NAME = '你的版本代号';
     const RELEASE_DATE = 'YYYY-MM-DD';
     ```

4. **更新日志**
   - 在 `docs/CHANGELOG.md` 顶部添加新版本条目。

5. **更新文档**
   - 如果功能有变，更新 `README.md` 和 `docs/使用说明.txt`。
   - 如果架构有变，更新 `docs/AI-项目结构说明.md`。

---

## 📋 快速提示词 (Prompt Snippet)

用户可以将以下内容复制给新的 AI，以便快速同步上下文：

```text
你现在是【项目统计工具】的维护者。
项目路径: e:/Ω/project-stats-tool
核心原则：
1. 零依赖 (Node.js Native)
2. 异步并行架构 (Promise.all)
3. 多项目历史隔离 (results/<ProjectName>)
4. 每次修改代码后，必须更新 src/version.js 和 docs/CHANGELOG.md

请先阅读 docs/AI_DEV_GUIDE.md 和 docs/AI-项目结构说明.md 了解详情。