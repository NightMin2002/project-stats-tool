/**
 * Night Theme CSS 样式模块 v3.2.0
 * 全面升级：热力图、增强动画、选择高亮、极致细节
 * Ω Code Agent - UI Perfectionist Edition
 */

module.exports = `
  :root {
    /* Core Colors */
    --bg-dark: #0a0e27;
    --bg-darker: #060914;
    --bg-card: #121830;
    --bg-card-hover: #1a2342;
    --bg-card-active: #222b4a;
    
    /* Text Colors */
    --text-primary: #e0e0e0;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    
    /* Accent Colors */
    --accent-primary: #00ff88;
    --accent-secondary: #00d4ff;
    --accent-tertiary: #c770f0;
    --accent-quaternary: #ff6b9d;
    --accent-warning: #ffd700;
    --accent-danger: #ff4757;
    
    /* Gradient Presets */
    --gradient-primary: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    --gradient-secondary: linear-gradient(135deg, var(--accent-tertiary), var(--accent-quaternary));
    --gradient-bg: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-darker) 100%);
    
    /* Border & Shadow */
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(0, 212, 255, 0.3);
    --border-active: rgba(0, 255, 136, 0.5);
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.15);
    --shadow-glow-primary: 0 0 30px rgba(0, 255, 136, 0.2);
    --shadow-glow-tertiary: 0 0 25px rgba(199, 112, 240, 0.15);
    
    /* Heatmap Colors */
    --heatmap-cold: #1e3a5f;
    --heatmap-cool: #2563eb;
    --heatmap-warm: #f59e0b;
    --heatmap-hot: #ef4444;
    --heatmap-fire: #dc2626;
    
    /* Transition */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    --transition-spring: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  /* ========== Nuclear Reset ========== */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* Selection Highlight - Brand Colored */
  ::selection {
    background: rgba(0, 212, 255, 0.3);
    color: #fff;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  }
  
  ::-moz-selection {
    background: rgba(0, 212, 255, 0.3);
    color: #fff;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  }
  
  /* Focus States - Custom Ring */
  :focus {
    outline: none;
  }
  
  :focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--bg-dark), 0 0 0 4px var(--accent-secondary);
  }
  
  /* Remove Tap Highlight on Mobile */
  * {
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Default Selection Behavior */
  body {
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* Allow selection on content areas */
  code, pre, .file-tree, table, .tree-item, .value, .selectable,
  .stat-value, .meta-value, .lang-stat-val, td {
    user-select: text;
    -webkit-user-select: text;
  }
  
  /* ========== Base Styles ========== */
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background: var(--gradient-bg);
    background-attachment: fixed;
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* ========== SVG Icons ========== */
  .icon {
    width: 1.2em;
    height: 1.2em;
    fill: currentColor;
    vertical-align: middle;
    display: inline-block;
    flex-shrink: 0;
  }
  
  .icon-lg { width: 2.5em; height: 2.5em; }
  .icon-md { width: 1.5em; height: 1.5em; }
  .icon-sm { width: 1em; height: 1em; }

  /* ========== Particles Background ========== */
  #particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  
  /* ========== Container ========== */
  .container {
    position: relative;
    z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  /* ========== Header ========== */
  .header {
    background: linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(45, 27, 105, 0.9) 100%);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 4rem 2rem;
    text-align: center;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%);
    animation: headerPulse 8s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes headerPulse {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
  }
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    animation: titleGlow 3s ease-in-out infinite alternate;
  }
  
  @keyframes titleGlow {
    0% { filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3)); }
    100% { filter: drop-shadow(0 0 40px rgba(0, 212, 255, 0.5)); }
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

  .crater-1 { width: 20px; height: 20px; top: 30%; left: 25%; }
  .crater-2 { width: 15px; height: 15px; top: 60%; left: 50%; }
  .crater-3 { width: 10px; height: 10px; top: 45%; left: 70%; }

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
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }
  
  .meta-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  .meta-card:hover {
    transform: translateY(-4px);
    border-color: var(--accent-secondary);
    box-shadow: var(--shadow-glow);
  }
  
  .meta-card:hover::before {
    opacity: 1;
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
    transition: all var(--transition-normal);
  }
  
  .meta-card:hover .meta-icon-wrapper {
    background: rgba(0, 212, 255, 0.2);
    transform: scale(1.1);
  }
  
  .meta-content { flex: 1; }
  .meta-label { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.25rem; }
  .meta-value { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }
  
  /* ========== Sections ========== */
  .section {
    background: var(--bg-card);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-card);
    position: relative;
    overflow: hidden;
    animation: sectionFadeIn 0.6s ease-out;
  }
  
  @keyframes sectionFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-secondary), transparent);
    opacity: 0.3;
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
    animation: iconPulse 2s ease-in-out infinite;
  }
  
  @keyframes iconPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
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
    transition: all var(--transition-normal);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform var(--transition-normal);
    transform-origin: left;
  }
  
  .stat-card:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--accent-secondary);
    box-shadow: var(--shadow-glow);
  }
  
  .stat-card:hover::before {
    transform: scaleX(1);
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
    transition: all var(--transition-normal);
  }
  
  .stat-card:hover .stat-icon {
    background: rgba(0, 255, 136, 0.15);
    transform: rotate(5deg) scale(1.1);
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
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
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
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }
  
  .lang-card::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-secondary);
    transform: scaleX(0);
    transition: transform var(--transition-normal);
  }
  
  .lang-card:hover {
    background: var(--bg-card-hover);
    border-color: var(--accent-tertiary);
    transform: translateY(-2px);
  }
  
  .lang-card:hover::before {
    transform: scaleX(1);
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
  
  /* ========== Heatmap Styles ========== */
  .heatmap-container {
    background: rgba(10, 14, 39, 0.5);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
  }
  
  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
    max-height: 500px;
    overflow-y: auto;
    padding-right: 0.5rem;
  }
  
  .heatmap-item {
    background: var(--bg-card);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    border: 1px solid transparent;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
  }
  
  /* Heatmap Color Levels - 直接定义背景色 */
  .heat-level-0 .heatmap-bar { background: var(--heatmap-cold); }
  .heat-level-1 .heatmap-bar { background: var(--heatmap-cool); }
  .heat-level-2 .heatmap-bar { background: #8b5cf6; }
  .heat-level-3 .heatmap-bar { background: var(--heatmap-warm); }
  .heat-level-4 .heatmap-bar { background: var(--heatmap-hot); }
  .heat-level-5 .heatmap-bar { background: var(--heatmap-fire); }
  
  .heatmap-bar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 2px 0 0 2px;
    transition: width var(--transition-normal), opacity var(--transition-normal);
  }
  
  .heatmap-item:hover {
    transform: translateX(4px);
    border-color: var(--border-hover);
  }
  
  .heatmap-item:hover .heatmap-bar {
    width: 100%;
    opacity: 0.15;
    border-radius: 8px;
  }
  
  .heatmap-name {
    font-size: 0.875rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  
  .heatmap-size {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    white-space: nowrap;
  }
  
  .heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
    flex-wrap: wrap;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
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
    transition: all var(--transition-normal);
  }
  
  .chart-container:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-glow);
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
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  }
  
  .tree-item {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
    position: relative;
  }
  
  .tree-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: var(--accent-secondary);
    opacity: 0;
    transition: all var(--transition-fast);
    border-radius: 6px 0 0 6px;
  }
  
  .tree-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  .tree-item:hover::before {
    width: 3px;
    opacity: 1;
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

  .tree-item svg.tree-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
  
  .tree-name {
    margin-right: auto;
    transition: color var(--transition-fast);
  }
  
  .tree-item:hover .tree-name {
    color: var(--accent-secondary);
  }
  
  .tree-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 1rem;
    padding: 0.125rem 0.5rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }
  
  .tree-children {
    padding-left: 1.5rem;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 0.625rem;
    display: none;
  }
  
  .tree-children.open {
    display: block;
    animation: treeExpand 0.3s ease-out;
  }
  
  @keyframes treeExpand {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Tree Size Badge with Heatmap Color */
  .tree-meta.size-tiny { background: rgba(30, 58, 95, 0.3); }
  .tree-meta.size-small { background: rgba(37, 99, 235, 0.2); }
  .tree-meta.size-medium { background: rgba(139, 92, 246, 0.2); }
  .tree-meta.size-large { background: rgba(245, 158, 11, 0.2); color: var(--heatmap-warm); }
  .tree-meta.size-huge { background: rgba(239, 68, 68, 0.2); color: var(--heatmap-hot); }
  
  /* ========== Tables ========== */
  .table-container {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    max-width: 100%;
  }
  
  table {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    background: rgba(10, 14, 39, 0.4);
    table-layout: auto;
  }
  
  th {
    background: rgba(255, 255, 255, 0.03);
    padding: 0.75rem 0.5rem;
    text-align: left;
    font-weight: 600;
    color: var(--accent-secondary);
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 10;
    font-size: 0.8rem;
  }
  
  /* 隐藏表格滚动条但保持可滚动 */
  .table-container::-webkit-scrollbar {
    height: 4px;
  }
  
  .table-container::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .table-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
  }
  
  td {
    padding: 0.75rem 0.5rem;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-primary);
    transition: all var(--transition-fast);
    font-size: 0.875rem;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr {
    transition: all var(--transition-fast);
  }
  
  tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }
  
  tr:hover {
    transform: translateX(4px);
  }
  
  /* Code Rate Badge */
  .rate-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    transition: all var(--transition-fast);
  }
  
  .rate-high {
    background: rgba(0, 255, 136, 0.15);
    color: #00ff88;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  }
  .rate-mid {
    background: rgba(255, 215, 0, 0.15);
    color: #ffd700;
  }
  .rate-low {
    background: rgba(255, 107, 157, 0.15);
    color: #ff6b9d;
  }
  
  /* ========== Comparison Section ========== */
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
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
  }
  
  .comp-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--gradient-primary);
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
  
  .comp-card:hover {
    transform: translateY(-2px);
    border-color: var(--border-hover);
  }
  
  .comp-card:hover::before {
    opacity: 1;
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
    font-size: 1.25rem;
  }
  
  .diff-up {
    color: var(--accent-primary);
    text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }
  .diff-down {
    color: var(--accent-quaternary);
    text-shadow: 0 0 10px rgba(255, 107, 157, 0.3);
  }
  .diff-flat {
    color: var(--text-secondary);
  }
  
  .diff-up .icon { animation: bounceUp 1s ease infinite; }
  .diff-down .icon { animation: bounceDown 1s ease infinite; }
  
  @keyframes bounceUp {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  
  @keyframes bounceDown {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
  }

  /* ========== Footer ========== */
  .footer {
    text-align: center;
    padding: 3rem 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    border-top: 1px solid var(--border-color);
    margin-top: 4rem;
    position: relative;
  }
  
  .footer::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 1px;
    background: var(--gradient-primary);
  }
  
  /* ========== Buttons ========== */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: inherit;
    font-weight: 500;
    position: relative;
    overflow: hidden;
  }
  
  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--text-secondary);
    transform: translateY(-2px);
  }
  
  .btn:hover::before {
    width: 300px;
    height: 300px;
  }
  
  .btn:active {
    transform: translateY(0) scale(0.98);
  }
  
  .btn-primary {
    background: var(--accent-secondary);
    color: var(--bg-dark);
    border: none;
    font-weight: 600;
  }
  
  .btn-primary:hover {
    background: #33ddff;
    box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
  }
  
  .btn-primary:active {
    background: #00b8db;
  }
  
  /* ========== Custom Scrollbar ========== */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg-darker);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, var(--accent-secondary), var(--accent-tertiary));
    border-radius: 4px;
    transition: all var(--transition-normal);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #33ddff, #d88bf5);
  }
  
  ::-webkit-scrollbar-corner {
    background: var(--bg-darker);
  }
  
  /* Firefox Scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--accent-secondary) var(--bg-darker);
  }
  
  /* ========== Tooltips (Custom) ========== */
  [data-tooltip] {
    position: relative;
    cursor: help;
  }
  
  [data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.8);
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    pointer-events: none;
  }
  
  [data-tooltip]::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--bg-card);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-fast);
    z-index: 1001;
  }
  
  [data-tooltip]:hover::after,
  [data-tooltip]:hover::before {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) scale(1);
  }
  
  /* ========== Progress Bar (for CLI visualization) ========== */
  .progress-container {
    background: var(--bg-darker);
    border-radius: 8px;
    padding: 0.25rem;
    border: 1px solid var(--border-color);
    overflow: hidden;
  }
  
  .progress-bar {
    height: 8px;
    border-radius: 6px;
    background: var(--gradient-primary);
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .progress-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: progressShine 1.5s infinite;
  }
  
  @keyframes progressShine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  /* ========== Tag ========== */
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background: rgba(199, 112, 240, 0.15);
    color: var(--accent-tertiary);
    font-size: 0.75rem;
    font-weight: 500;
    margin-left: 0.5rem;
  }
  
  /* ========== Loading Skeleton ========== */
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--bg-card) 25%,
      var(--bg-card-hover) 50%,
      var(--bg-card) 75%
    );
    background-size: 200% 100%;
    animation: skeletonLoading 1.5s infinite;
    border-radius: 8px;
  }
  
  @keyframes skeletonLoading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* ========== Responsive ========== */
  @media (max-width: 1024px) {
    .container {
      padding: 1.5rem;
    }
    
    .chart-grid {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .header h1 {
      font-size: 2rem;
    }
    
    .header {
      padding: 2rem 1rem;
    }
    
    .section {
      padding: 1.5rem;
      border-radius: 16px;
    }
    
    .stat-card {
      padding: 1.5rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .meta-grid {
      grid-template-columns: 1fr;
    }
    
    .comparison-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .chart-wrapper {
      height: 280px;
    }
    
    .heatmap-grid {
      grid-template-columns: 1fr;
    }
    
    .moon-container {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 1rem;
    }
    
    .header h1 {
      font-size: 1.5rem;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .comparison-grid {
      grid-template-columns: 1fr;
    }
    
    .stat-value {
      font-size: 2rem;
    }
    
    .section-title {
      font-size: 1.25rem;
    }
  }
  
  /* ========== Print Styles ========== */
  @media print {
    body {
      background: white;
      color: black;
    }
    
    #particles-js {
      display: none;
    }
    
    .section {
      break-inside: avoid;
      box-shadow: none;
      border: 1px solid #ddd;
    }
    
    .btn {
      display: none;
    }
  }
`;