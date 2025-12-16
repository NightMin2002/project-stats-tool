/**
 * Base CSS Module - 基础样式
 * 包含：CSS 变量、Nuclear Reset、基础排版
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.3.0
 */

module.exports = `
  /* ========================================
     CSS VARIABLES - 设计令牌系统
     ======================================== */
  :root {
    /* === Core Colors === */
    --bg-dark: #0a0e27;
    --bg-darker: #060914;
    --bg-card: #121830;
    --bg-card-hover: #1a2342;
    --bg-card-active: #222b4a;
    
    /* === Text Hierarchy === */
    --text-primary: #e0e0e0;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --text-inverse: #0a0e27;
    
    /* === Accent Palette === */
    --accent-primary: #00ff88;
    --accent-secondary: #00d4ff;
    --accent-tertiary: #c770f0;
    --accent-quaternary: #ff6b9d;
    --accent-warning: #ffd700;
    --accent-danger: #ff4757;
    --accent-success: #00ff88;
    --accent-info: #00d4ff;
    
    /* === Gradient Presets === */
    --gradient-primary: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    --gradient-secondary: linear-gradient(135deg, var(--accent-tertiary), var(--accent-quaternary));
    --gradient-bg: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-darker) 100%);
    --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    --gradient-shine: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    
    /* === Border & Shadow System === */
    --border-color: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(0, 212, 255, 0.3);
    --border-active: rgba(0, 255, 136, 0.5);
    --border-focus: rgba(0, 212, 255, 0.6);
    --border-radius-sm: 6px;
    --border-radius-md: 12px;
    --border-radius-lg: 16px;
    --border-radius-xl: 20px;
    --border-radius-full: 9999px;
    
    /* === Shadow Elevation === */
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.1);
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.3);
    --shadow-glow: 0 0 20px rgba(0, 212, 255, 0.15);
    --shadow-glow-primary: 0 0 30px rgba(0, 255, 136, 0.2);
    --shadow-glow-tertiary: 0 0 25px rgba(199, 112, 240, 0.15);
    --shadow-glow-danger: 0 0 20px rgba(255, 71, 87, 0.2);
    
    /* === Glassmorphism Presets === */
    --glass-bg: rgba(18, 24, 48, 0.8);
    --glass-bg-light: rgba(255, 255, 255, 0.03);
    --glass-blur: blur(20px);
    --glass-blur-strong: blur(40px);
    
    /* === Heatmap Colors === */
    --heatmap-cold: #1e3a5f;
    --heatmap-cool: #2563eb;
    --heatmap-warm: #f59e0b;
    --heatmap-hot: #ef4444;
    --heatmap-fire: #dc2626;
    
    /* === Transition Timing === */
    --transition-instant: 0.1s ease;
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    --transition-spring: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --transition-bounce: 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    /* === Z-Index Scale === */
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-max: 9999;
    
    /* === Spacing Scale === */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;
  }

  /* ========================================
     NUCLEAR RESET - 完全重置浏览器默认样式
     ======================================== */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  /* 移除所有默认外观 */
  button, input, textarea, select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    font: inherit;
    color: inherit;
    background: transparent;
    border: none;
    outline: none;
  }
  
  /* 移除列表默认样式 */
  ul, ol {
    list-style: none;
  }
  
  /* 链接重置 */
  a {
    text-decoration: none;
    color: inherit;
  }
  
  /* 图片自适应 */
  img, svg, video {
    display: block;
    max-width: 100%;
    height: auto;
  }
  
  /* 表格重置 */
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  
  /* ========================================
     ANTI-NATIVE: Selection Highlight
     ======================================== */
  ::selection {
    background: rgba(0, 212, 255, 0.35);
    color: #fff;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  }
  
  ::-moz-selection {
    background: rgba(0, 212, 255, 0.35);
    color: #fff;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  }
  
  /* ========================================
     ANTI-NATIVE: Focus States
     禁用默认 outline，使用自定义 ring
     ======================================== */
  :focus {
    outline: none;
  }
  
  :focus-visible {
    outline: none;
    box-shadow: 
      0 0 0 2px var(--bg-dark), 
      0 0 0 4px var(--accent-secondary),
      0 0 20px rgba(0, 212, 255, 0.2);
  }
  
  /* ========================================
     ANTI-NATIVE: Mobile Optimization
     ======================================== */
  * {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  /* 防止 iOS 缩放 */
  input, textarea, select {
    font-size: 16px; /* 防止 iOS 自动缩放 */
  }
  
  /* ========================================
     ANTI-NATIVE: Custom Scrollbar
     ======================================== */
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
    border: 2px solid var(--bg-darker);
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
  
  /* ========================================
     BASE TYPOGRAPHY & BODY
     ======================================== */
  html {
    scroll-behavior: smooth;
    font-size: 16px;
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
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
    text-rendering: optimizeLegibility;
  }
  
  /* 默认禁用用户选择，特定区域开放 */
  body {
    user-select: none;
    -webkit-user-select: none;
  }
  
  /* 允许选择的内容区域 */
  code, pre, .file-tree, table, .tree-item, .value, .selectable,
  .stat-value, .meta-value, .lang-stat-val, td, 
  .heatmap-name, .heatmap-size {
    user-select: text;
    -webkit-user-select: text;
  }
  
  /* ========================================
     SVG ICON SYSTEM
     ======================================== */
  .icon {
    width: 1.2em;
    height: 1.2em;
    fill: currentColor;
    vertical-align: middle;
    display: inline-block;
    flex-shrink: 0;
    transition: transform var(--transition-fast), opacity var(--transition-fast);
  }
  
  .icon-xs { width: 0.875em; height: 0.875em; }
  .icon-sm { width: 1em; height: 1em; }
  .icon-md { width: 1.5em; height: 1.5em; }
  .icon-lg { width: 2em; height: 2em; }
  .icon-xl { width: 2.5em; height: 2.5em; }
  .icon-2xl { width: 3em; height: 3em; }
  
  /* Icon Colors */
  .icon-primary { color: var(--accent-primary); }
  .icon-secondary { color: var(--accent-secondary); }
  .icon-tertiary { color: var(--accent-tertiary); }
  .icon-muted { color: var(--text-muted); }
  .icon-danger { color: var(--accent-danger); }
  .icon-success { color: var(--accent-success); }
  
  /* ========================================
     PARTICLES BACKGROUND
     ======================================== */
  #particles-js {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: var(--z-base);
    pointer-events: none;
    contain: strict;
  }
`;