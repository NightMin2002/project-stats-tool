/**
 * Night Theme CSS 样式模块 v2.11.0
 * 完整的暗黑主题样式 + 禁止文字选中优化
 */

module.exports = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* 🆕 全局禁止选中文字 - 提升视觉体验 */
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  /* 🎯 允许选中的特定元素（保留实用性） */
  code,
  pre,
  .file-tree,
  table,
  .tree-item {
    user-select: text;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
  }
  
  body {
    font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
    background: #0a0e27;
    color: #e0e0e0;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  /* 粒子背景容器 */
  #particles-js {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none; /* 🆕 防止粒子阻止鼠标事件 */
  }
  
  .container {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* ========== 头部样式 ========== */
  .header {
    background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
    border-radius: 20px;
    padding: 60px 40px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 255, 136, 0.1);
    margin-bottom: 30px;
    border: 1px solid rgba(0, 255, 136, 0.2);
    position: relative;
    overflow: hidden;
  }
  
  .header::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    animation: pulse 4s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.6;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
  
  .header h1 {
    font-size: 3em;
    margin-bottom: 15px;
    background: linear-gradient(90deg, #00ff88, #00d4ff, #c770f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    z-index: 1;
    text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
    letter-spacing: 2px; /* 🆕 增加字间距 */
  }
  
  .header .subtitle {
    font-size: 1.2em;
    color: #00d4ff;
    position: relative;
    z-index: 1;
    font-weight: 300; /* 🆕 细字重 */
    opacity: 0.95; /* 🆕 微调透明度 */
  }
  
  /* ========== Meta 信息卡片 ========== */
  .meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .meta-item {
    background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    border: 1px solid rgba(0, 212, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 🆕 平滑缓动 */
    cursor: default; /* 🆕 明确非点击元素 */
  }
  
  .meta-item:hover {
    transform: translateY(-5px) scale(1.02); /* 🆕 增加缩放效果 */
    box-shadow: 0 15px 40px rgba(0, 212, 255, 0.4); /* 🆕 增强阴影 */
    border-color: #00d4ff;
  }
  
  .meta-item .label {
    color: #888;
    font-size: 0.9em;
    margin-bottom: 10px;
    text-transform: uppercase; /* 🆕 大写字母 */
    letter-spacing: 1px; /* 🆕 字间距 */
  }
  
  .meta-item .value {
    font-size: 1.5em;
    font-weight: bold;
    color: #00ff88;
  }
  
  /* ========== Section 容器 ========== */
  .section {
    background: linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%);
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    border: 1px solid rgba(199, 112, 240, 0.2);
    transition: border-color 0.3s ease; /* 🆕 边框过渡 */
  }
  
  .section:hover {
    border-color: rgba(199, 112, 240, 0.4); /* 🆕 悬停效果 */
  }
  
  .section-title {
    font-size: 2em;
    margin-bottom: 25px;
    color: #00ff88;
    display: flex;
    align-items: center;
    gap: 15px;
    padding-bottom: 15px;
    border-bottom: 2px solid rgba(0, 255, 136, 0.3);
    font-weight: 600; /* 🆕 加粗 */
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 25px;
    border-bottom: 2px solid rgba(0, 255, 136, 0.3);
    padding-bottom: 15px;
  }
  
  .section-header .section-title {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .toggle-btn {
    background: rgba(0, 212, 255, 0.15);
    color: #00d4ff;
    border: 1px solid rgba(0, 212, 255, 0.4);
    padding: 8px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95em;
    transition: all 0.3s ease;
    user-select: none;
  }
  
  .toggle-btn:hover {
    background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
    color: #0a0e27;
    box-shadow: 0 10px 24px rgba(0, 212, 255, 0.35);
  }
  
  .toggle-btn.is-collapsed {
    opacity: 0.8;
  }
  
  .comparison-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 20px;
    color: #888;
    font-size: 0.95em;
  }
  
  .comparison-meta span {
    color: #00d4ff;
    font-weight: 600;
  }
  
  .comparison-meta .tag {
    display: inline-block;
    padding: 0 8px;
    margin-left: 6px;
    background: rgba(199, 112, 240, 0.2);
    border-radius: 6px;
    color: #c770f0;
    font-size: 0.85em;
    font-weight: 600;
  }
  
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }
  
  .comparison-card {
    background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 15px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }
  
  .comparison-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0, 212, 255, 0.25);
    border-color: rgba(0, 255, 136, 0.4);
  }
  
  .comparison-card .comparison-icon {
    font-size: 1.5em;
  }
  
  .comparison-title {
    font-size: 1.2em;
    font-weight: 600;
    color: #00ff88;
  }
  
  .comparison-values {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-size: 0.95em;
  }
  
  .comparison-values .label {
    display: block;
    color: #888;
    font-size: 0.8em;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .comparison-values .value {
    color: #e0e0e0;
    font-size: 1.1em;
    font-weight: 600;
  }
  
  .comparison-diff {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 1.05em;
  }
  
  .comparison-diff .trend-icon {
    font-size: 1.2em;
  }
  
  .comparison-card.trend-up .comparison-diff {
    color: #00ff88;
  }
  
  .comparison-card.trend-down .comparison-diff {
    color: #ff6b9d;
  }
  
  .comparison-card.trend-stable .comparison-diff {
    color: #ffd700;
  }
  
  /* ========== 统计卡片网格 ========== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
    padding: 30px;
    border-radius: 15px;
    border: 1px solid rgba(0, 212, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 🆕 平滑缓动 */
    position: relative;
    overflow: hidden;
    cursor: default;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.1), transparent);
    transition: left 0.5s ease;
  }
  
  .stat-card:hover::before {
    left: 100%;
  }
  
  .stat-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 15px 40px rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
  }
  
  .stat-card .label {
    color: #888;
    font-size: 0.95em;
    margin-bottom: 12px;
    text-transform: uppercase; /* 🆕 */
    letter-spacing: 0.5px; /* 🆕 */
  }
  
  .stat-card .value {
    font-size: 2.5em;
    font-weight: bold;
    background: linear-gradient(90deg, #00ff88, #00d4ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* ========== 图表区域 ========== */
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 25px;
  }
  
  .chart-container {
    background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
    padding: 25px;
    border-radius: 15px;
    border: 1px solid rgba(199, 112, 240, 0.3);
    transition: all 0.3s ease; /* 🆕 */
  }
  
  .chart-container:hover {
    border-color: rgba(199, 112, 240, 0.5); /* 🆕 */
    box-shadow: 0 10px 30px rgba(199, 112, 240, 0.2); /* 🆕 */
  }
  
  .chart-container h3 {
    color: #c770f0;
    margin-bottom: 20px;
    font-size: 1.3em;
    font-weight: 600; /* 🆕 */
  }
  
  .chart-wrapper {
    position: relative;
    height: 300px;
  }
  
  /* ========== 文件树样式 ========== */
  .file-tree {
    background: linear-gradient(135deg, #0f1729 0%, #1a0f3a 100%);
    padding: 20px;
    border-radius: 10px;
    border: 1px solid rgba(0, 212, 255, 0.2);
    max-height: 600px;
    overflow-y: auto;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    position: relative;
  }
  
  .file-tree::-webkit-scrollbar {
    width: 8px;
  }
  
  .file-tree::-webkit-scrollbar-track {
    background: #0a0e27;
    border-radius: 4px;
  }
  
  .file-tree::-webkit-scrollbar-thumb {
    background: #00d4ff;
    border-radius: 4px;
    transition: background 0.3s ease; /* 🆕 */
  }
  
  .file-tree::-webkit-scrollbar-thumb:hover {
    background: #00ff88; /* 🆕 悬停变色 */
  }
  
  .tree-item {
    padding: 5px 0;
    transition: all 0.2s ease;
    cursor: default; /* 🆕 默认光标 */
  }
  
  .tree-item.clickable {
    cursor: pointer;
  }
  
  .tree-item:hover {
    color: #00ff88;
    padding-left: 5px;
    background: rgba(0, 255, 136, 0.05); /* 🆕 背景高亮 */
    border-radius: 4px; /* 🆕 */
  }
  
  .tree-folder {
    color: #00d4ff;
    font-weight: bold;
  }
  
  .tree-file {
    color: #c770f0;
  }
  
  .tree-children {
    margin-left: 20px;
    border-left: 1px dashed rgba(0, 212, 255, 0.3);
    padding-left: 10px;
    overflow: hidden;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }
  
  .tree-children.collapsed {
    max-height: 0;
    opacity: 0;
    display: none;
  }
  
  .tree-children.expanded {
    max-height: none;
    opacity: 1;
  }
  
  .tree-count {
    color: #888;
    font-size: 0.85em;
    font-weight: normal;
  }
  
  .tree-size {
    color: #666;
    font-size: 0.8em;
    font-weight: normal;
    margin-left: 8px;
  }
  
  /* ========== 文件树控制按钮 ========== */
  .tree-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px;
    background: rgba(0, 212, 255, 0.05);
    border-radius: 8px;
  }
  
  .tree-btn {
    background: linear-gradient(135deg, #00d4ff 0%, #00ff88 100%);
    color: #0a0e27;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9em;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* 🆕 平滑缓动 */
    box-shadow: 0 2px 8px rgba(0, 212, 255, 0.3);
    user-select: none; /* 🆕 按钮文字不可选 */
  }
  
  .tree-btn:hover {
    transform: translateY(-2px) scale(1.05); /* 🆕 增加缩放 */
    box-shadow: 0 6px 16px rgba(0, 212, 255, 0.5); /* 🆕 增强阴影 */
  }
  
  .tree-btn:active {
    transform: translateY(0) scale(0.98); /* 🆕 点击反馈 */
  }
  
  .tree-stats {
    padding: 10px;
    margin-bottom: 10px;
    background: rgba(199, 112, 240, 0.1);
    border-radius: 8px;
    color: #c770f0;
    font-weight: 600;
    text-align: center;
  }
  
  /* ========== 表格样式 ========== */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 8px;
  }
  
  th {
    background: linear-gradient(90deg, #00ff88, #00d4ff);
    color: #0a0e27;
    padding: 15px;
    text-align: left;
    font-weight: 700;
    border-radius: 8px;
    text-transform: uppercase; /* 🆕 */
    letter-spacing: 0.5px; /* 🆕 */
  }
  
  td {
    padding: 15px;
    background: rgba(0, 212, 255, 0.05);
    border-radius: 8px;
    transition: all 0.2s ease; /* 🆕 */
  }
  
  tr:hover td {
    background: rgba(0, 255, 136, 0.1);
  }
  
  /* 🆕 隐藏表格容器的滚动条（保留滚动功能） */
  .section > div[style*="overflow-x: auto"] {
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }
  
  .section > div[style*="overflow-x: auto"]::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  
  /* ========== 页脚 ========== */
  .footer {
    text-align: center;
    padding: 30px;
    color: #666;
    font-size: 0.95em;
    border-top: 1px solid rgba(255, 255, 255, 0.1); /* 🆕 */
  }
  
  /* ========== 平滑滚动 ========== */
  html {
    scroll-behavior: smooth;
  }
  
  /* ========== 加载动画 ========== */
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  .section {
    animation: fadeIn 0.6s ease-out;
  }
  
  /* ========== 响应式优化 ========== */
  @media (max-width: 1200px) {
    .chart-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .header h1 {
      font-size: 2em;
    }
    
    .header {
      padding: 40px 20px;
    }
    
    .container {
      padding: 10px;
    }
    
    .section {
      padding: 20px;
    }
    
    .chart-grid, .stats-grid {
      grid-template-columns: 1fr;
    }
    
    .meta {
      grid-template-columns: 1fr;
    }
    
    .file-tree {
      font-size: 0.8em;
      max-height: 400px;
    }
  }
  
  /* ========== 打印样式 ========== */
  @media print {
    #particles-js {
      display: none;
    }
    
    .section {
      page-break-inside: avoid;
    }
    
    .tree-controls {
      display: none;
    }
    
    * {
      user-select: text !important;
    }
  }
`;