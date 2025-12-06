/**
 * Night Theme CSS 样式模块 v3.0.0
 * 全面升级：SVG 图标系统、现代化 Grid 布局、玻璃拟态效果
 */

module.exports = `
  :root {
    --bg-dark: #0a0e27;
    --bg-card: #121830;
    --bg-card-hover: #1a2342;
    --text-primary: #e0e0e0;
    --text-secondary: #94a3b8;
    --accent-primary: #00ff88;
    --accent-secondary: #00d4ff;
    --accent-tertiary: #c770f0;
    --accent-quaternary: #ff6b9d;
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(0, 212, 255, 0.3);
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.15);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* 允许选中的元素 */
  code, pre, .file-tree, table, .tree-item, .value, .selectable {
    user-select: text;
    -webkit-user-select: text;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
  }
  
  /* SVG 图标通用样式 */
  .icon {
    width: 1.2em;
    height: 1.2em;
    fill: currentColor;
    vertical-align: middle;
    display: inline-block;
  }
  
  .icon-lg {
    width: 2.5em;
    height: 2.5em;
  }
  
  .icon-md {
    width: 1.5em;
    height: 1.5em;
  }
  
  .icon-sm {
    width: 1em;
    height: 1em;
  }

  /* 粒子背景 */
  #particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  
  .container {
    position: relative;
    z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* ========== Header ========== */
  .header {
    background: linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(45, 27, 105, 0.8) 100%);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    padding: 4rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary), var(--accent-tertiary));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  
  .header .subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  /* Moon Animation */
  .moon-container {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 200px;
    height: 200px;
    z-index: 1;
    opacity: 0.8;
    pointer-events: none;
  }

  .moon {
    width: 120px;
    height: 120px;
    background: radial-gradient(circle at 30% 30%, #ffffff, #e0e0e0 20%, #d1d1d1 60%, #b0b0b0);
    border-radius: 50%;
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 60px rgba(255, 255, 255, 0.2),
      inset -20px -20px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    animation: moonFloat 8s infinite ease-in-out;
  }

  .crater {
    position: absolute;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .crater-1 {
    width: 20px;
    height: 20px;
    top: 30%;
    left: 25%;
  }

  .crater-2 {
    width: 15px;
    height: 15px;
    top: 60%;
    left: 50%;
  }

  .crater-3 {
    width: 10px;
    height: 10px;
    top: 45%;
    left: 70%;
  }

  @keyframes moonFloat {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(0, -15px) rotate(2deg); }
  }
  
  /* ========== Meta Cards ========== */
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .meta-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
  }
  
  .meta-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-secondary);
    box-shadow: var(--shadow-glow);
  }
  
  .meta-icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(0, 212, 255, 0.1);
    color: var(--accent-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .meta-content {
    flex: 1;
  }
  
  .meta-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
  
  .meta-value {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  /* ========== Sections ========== */
  .section {
    background: var(--bg-card);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-card);
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .section-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent-primary);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .section-title .icon {
    color: var(--accent-primary);
  }
  
  /* ========== Stats Grid ========== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  
  .stat-card {
    background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .stat-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-secondary);
    box-shadow: 0 10px 30px -10px rgba(0, 212, 255, 0.3);
  }
  
  .stat-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle at top right, rgba(0, 255, 136, 0.1), transparent 70%);
    pointer-events: none;
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    color: var(--accent-primary);
  }
  
  .stat-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .stat-sub {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  /* ========== Language Detail Cards ========== */
  .lang-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
  
  .lang-card {
    background: rgba(15, 23, 41, 0.6);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .lang-card:hover {
    background: var(--bg-card-hover);
    border-color: var(--accent-tertiary);
  }
  
  .lang-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  .lang-name {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--accent-tertiary);
  }
  
  .lang-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .lang-stat-item {
    display: flex;
    flex-direction: column;
  }
  
  .lang-stat-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .lang-stat-val {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  /* ========== Charts ========== */
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }
  
  .chart-container {
    background: rgba(10, 14, 39, 0.5);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 1.5rem;
    height: 100%;
  }
  
  .chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .chart-wrapper {
    position: relative;
    height: 350px;
    width: 100%;
  }
  
  /* ========== File Tree ========== */
  .file-tree-container {
    background: #0d1117;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    max-height: 600px;
    overflow-y: auto;
    font-family: 'Fira Code', 'Consolas', monospace;
  }
  
  .tree-item {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  
  .tree-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .tree-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  
  /* File Tree Icons */
  .tree-folder > .tree-icon,
  .tree-folder .tree-icon path {
    color: #54aeff;
    fill: currentColor;
  }
  
  .tree-file > .tree-icon,
  .tree-file .tree-icon path {
    color: #94a3b8;
    fill: currentColor;
  }

  /* Specific fix for SVG icons in tree */
  .tree-item svg.tree-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  
  .tree-name {
    margin-right: auto;
  }
  
  .tree-meta {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-left: 1rem;
  }
  
  .tree-children {
    padding-left: 1.5rem;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 0.625rem;
    display: none;
  }
  
  .tree-children.open {
    display: block;
  }
  
  /* ========== Tables ========== */
  .table-container {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background: rgba(10, 14, 39, 0.4);
  }
  
  th {
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--accent-secondary);
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
  }
  
  td {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
  
  /* Code Rate Badge */
  .rate-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
  }
  
  .rate-high { background: rgba(0, 255, 136, 0.15); color: #00ff88; }
  .rate-mid { background: rgba(255, 215, 0, 0.15); color: #ffd700; }
  .rate-low { background: rgba(255, 107, 157, 0.15); color: #ff6b9d; }
  
  /* ========== Footer ========== */
  .footer {
    text-align: center;
    padding: 3rem 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    border-top: 1px solid var(--border-color);
    margin-top: 4rem;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg-dark);
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Comparison Section */
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .comp-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .comp-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .comp-diff {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
  }
  
  .diff-up { color: var(--accent-primary); }
  .diff-down { color: var(--accent-quaternary); }
  .diff-flat { color: var(--text-secondary); }

  /* Buttons */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--text-secondary);
  }
  
  .btn-primary {
    background: var(--accent-secondary);
    color: #0a0e27;
    border: none;
    font-weight: 600;
  }
  
  .btn-primary:hover {
    background: #33ddff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
  }

  @media (max-width: 768px) {
    .header h1 { font-size: 2rem; }
    .stat-card { padding: 1.5rem; }
    .chart-grid { grid-template-columns: 1fr; }
  }
`;