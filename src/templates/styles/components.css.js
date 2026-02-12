/**
 * Components CSS Module - 组件样式
 * 包含：语言卡片、热力图(Treemap)、文件树、表格(可排序)、标签、徽章、图表联动
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.4.0
 */

module.exports = `
  /* ========================================
     LANGUAGE DETAIL CARDS - 语言详情卡片
     ======================================== */
  .lang-detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-lg);
  }

  .lang-card {
    background: rgba(15, 23, 41, 0.6);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: var(--space-lg);
    transition: all var(--transition-normal);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
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

  @media (hover: hover) {
    .lang-card:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent-tertiary);
      transform: translateY(-2px);
    }
    .lang-card:hover::before {
      transform: scaleX(1);
    }
  }

  .lang-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-md);
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
    gap: var(--space-md);
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

  /* ========================================
     HEATMAP - 热力图 (Treemap 布局)
     ======================================== */
  .heatmap-container {
    background: rgba(10, 14, 39, 0.5);
    border-radius: var(--border-radius-lg);
    padding: var(--space-lg);
    border: 1px solid var(--border-color);
  }

  .heatmap-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-flow: dense;
    gap: var(--space-sm);
    max-height: 600px;
    overflow-y: auto;
    padding-right: var(--space-sm);
  }

  /* Treemap span classes */
  .treemap-xl { grid-column: span 3; grid-row: span 2; }
  .treemap-lg { grid-column: span 2; grid-row: span 2; }
  .treemap-md { grid-column: span 2; }

  .heatmap-item {
    background: var(--bg-card);
    border-radius: var(--border-radius-sm);
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--space-xs);
    border: 1px solid transparent;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
    min-height: 60px;
  }

  .heatmap-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    height: 100%;
  }

  /* Heatmap Color Levels - block tints */
  .heat-level-0 { background: rgba(30, 58, 95, 0.4); }
  .heat-level-1 { background: rgba(37, 99, 235, 0.3); }
  .heat-level-2 { background: rgba(139, 92, 246, 0.25); }
  .heat-level-3 { background: rgba(245, 158, 11, 0.25); }
  .heat-level-4 { background: rgba(239, 68, 68, 0.25); }
  .heat-level-5 { background: rgba(220, 38, 38, 0.3); }

  /* Heatmap bar colors */
  .heat-level-0 .heatmap-bar { background: var(--heatmap-cold); }
  .heat-level-1 .heatmap-bar { background: var(--heatmap-cool); }
  .heat-level-2 .heatmap-bar { background: var(--heatmap-medium); }
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

  @media (hover: hover) {
    .heatmap-item:hover {
      transform: translateY(-2px);
      border-color: var(--border-hover);
      box-shadow: var(--shadow-md);
    }
    .heatmap-item:hover .heatmap-bar {
      width: 100%;
      opacity: 0.15;
      border-radius: var(--border-radius-sm);
    }
  }

  .heatmap-name {
    font-size: 0.8125rem;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    position: relative;
    z-index: 1;
    font-weight: 500;
  }

  .heatmap-size {
    font-size: 0.6875rem;
    color: var(--text-secondary);
    font-weight: 600;
    padding: 2px var(--space-sm);
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    white-space: nowrap;
    position: relative;
    z-index: 1;
  }

  .heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    padding-top: var(--space-md);
    border-top: 1px solid var(--border-color);
    flex-wrap: wrap;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  /* ========================================
     FILE TREE - 文件树组件
     ======================================== */
  .file-tree-container {
    background: #0d1117;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    padding: var(--space-md);
    max-height: 600px;
    overflow-y: auto;
    font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  }

  .tree-item {
    display: flex;
    align-items: center;
    padding: 0.375rem var(--space-sm);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    white-space: nowrap;
    position: relative;
    z-index: 1;
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
    border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
  }

  @media (hover: hover) {
    .tree-item:hover {
      background: rgba(255, 255, 255, 0.05);
      z-index: 100;
    }
    .tree-item:hover::before {
      width: 3px;
      opacity: 1;
    }
    .tree-item:hover .tree-name {
      color: var(--accent-secondary);
    }
    .tree-item:hover .tree-copy-btn {
      opacity: 1;
      visibility: visible;
    }
  }

  .tree-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: var(--space-sm);
    flex-shrink: 0;
  }

  /* File Tree Icons Colors */
  .tree-folder > .tree-icon,
  .tree-folder .tree-icon path {
    color: #54aeff;
    fill: currentColor;
  }

  .tree-file > .tree-icon,
  .tree-file .tree-icon path {
    color: var(--text-muted);
    fill: currentColor;
  }

  .tree-item svg.tree-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: var(--space-sm);
    flex-shrink: 0;
  }

  .tree-name {
    margin-right: auto;
    transition: color var(--transition-fast);
  }

  .tree-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: var(--space-md);
    padding: 0.125rem var(--space-sm);
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  .tree-children {
    padding-left: var(--space-lg);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 0.625rem;
    display: none;
  }

  .tree-children.open {
    display: block;
    animation: treeExpand 0.3s ease-out;
  }

  /* Tree Size Badge with Heatmap Color */
  .tree-meta.size-tiny { background: rgba(30, 58, 95, 0.3); }
  .tree-meta.size-small { background: rgba(37, 99, 235, 0.2); }
  .tree-meta.size-medium { background: rgba(139, 92, 246, 0.2); }
  .tree-meta.size-large { background: rgba(245, 158, 11, 0.2); color: var(--heatmap-warm); }
  .tree-meta.size-huge { background: rgba(239, 68, 68, 0.2); color: var(--heatmap-hot); }

  /* ========================================
     TABLES - 表格组件 (可排序)
     ======================================== */
  .table-container {
    overflow-x: auto;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--border-color);
    max-width: 100%;
  }

  .table-container::-webkit-scrollbar { height: 4px; }
  .table-container::-webkit-scrollbar-track { background: transparent; }
  .table-container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
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
    padding: 0.75rem var(--space-sm);
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

  /* Sortable Table Headers */
  th.sortable {
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    transition: background var(--transition-fast);
  }

  @media (hover: hover) {
    th.sortable:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  th.sortable .sort-icon {
    display: inline-block;
    margin-left: var(--space-xs);
    opacity: 0.3;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
    vertical-align: middle;
  }

  th.sortable.sort-asc .sort-icon {
    opacity: 1;
    transform: rotate(0deg);
  }

  th.sortable.sort-desc .sort-icon {
    opacity: 1;
    transform: rotate(180deg);
  }

  /* Table inline progress bar (code rate column) */
  td .progress-container {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    width: 100%;
  }

  td .progress-bar-track {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    overflow: hidden;
    min-width: 40px;
  }

  td .progress-bar-fill {
    height: 100%;
    border-radius: 3px;
    background: var(--gradient-primary);
    transition: width var(--transition-normal);
  }

  td {
    padding: 0.75rem var(--space-sm);
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

  @media (hover: hover) {
    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    tr:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  }

  /* ========================================
     BADGES & TAGS - 徽章和标签
     ======================================== */
  .rate-badge {
    padding: var(--space-xs) 0.75rem;
    border-radius: var(--border-radius-full);
    font-size: 0.875rem;
    font-weight: 600;
    display: inline-block;
    transition: all var(--transition-fast);
  }

  .rate-high {
    background: rgba(0, 255, 136, 0.15);
    color: var(--accent-success);
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
  }
  .rate-mid {
    background: rgba(255, 215, 0, 0.15);
    color: var(--accent-warning);
  }
  .rate-low {
    background: rgba(255, 107, 157, 0.15);
    color: var(--accent-quaternary);
  }

  .tag {
    display: inline-flex;
    align-items: center;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 4px;
    background: rgba(199, 112, 240, 0.15);
    color: var(--accent-tertiary);
    font-size: 0.75rem;
    font-weight: 500;
    margin-left: var(--space-sm);
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .tag:hover {
      background: rgba(199, 112, 240, 0.25);
    }
  }

  .tag-primary { background: rgba(0, 255, 136, 0.15); color: var(--accent-primary); }
  .tag-secondary { background: rgba(0, 212, 255, 0.15); color: var(--accent-secondary); }
  .tag-warning { background: rgba(255, 215, 0, 0.15); color: var(--accent-warning); }
  .tag-danger { background: rgba(255, 71, 87, 0.15); color: var(--accent-danger); }

  /* ========================================
     PROGRESS BAR - 进度条
     ======================================== */
  .progress-container {
    background: var(--bg-darker);
    border-radius: var(--border-radius-sm);
    padding: var(--space-xs);
    border: 1px solid var(--border-color);
    overflow: hidden;
  }

  .progress-bar {
    height: 8px;
    border-radius: var(--border-radius-sm);
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
    background: var(--gradient-shine);
    animation: progressShine 1.5s infinite;
  }

  /* ========================================
     SKELETON LOADING - 骨架屏
     ======================================== */
  .skeleton {
    background: linear-gradient(
      90deg,
      var(--bg-card) 25%,
      var(--bg-card-hover) 50%,
      var(--bg-card) 75%
    );
    background-size: 200% 100%;
    animation: skeletonLoading 1.5s infinite;
    border-radius: var(--border-radius-sm);
  }

  .skeleton-text { height: 1em; margin-bottom: var(--space-sm); }
  .skeleton-title { height: 1.5em; width: 60%; margin-bottom: var(--space-md); }
  .skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; }
  .skeleton-card { height: 200px; border-radius: var(--border-radius-lg); }

  /* ========================================
     TOOLTIPS - 自定义提示 (data-tooltip)
     ======================================== */
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
    padding: var(--space-sm) 0.75rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-fast);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
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
    z-index: var(--z-tooltip);
  }

  @media (hover: hover) {
    [data-tooltip]:hover::after,
    [data-tooltip]:hover::before {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) scale(1);
    }
  }

  /* Tooltip Positions */
  [data-tooltip-pos="bottom"]::after {
    bottom: auto;
    top: calc(100% + 8px);
  }
  [data-tooltip-pos="bottom"]::before {
    bottom: auto;
    top: calc(100% + 4px);
    border-top-color: transparent;
    border-bottom-color: var(--bg-card);
  }

  [data-tooltip-pos="left"]::after {
    bottom: auto;
    left: auto;
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.8);
  }
  @media (hover: hover) {
    [data-tooltip-pos="left"]:hover::after {
      transform: translateY(-50%) scale(1);
    }
  }

  [data-tooltip-pos="right"]::after {
    bottom: auto;
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.8);
  }
  @media (hover: hover) {
    [data-tooltip-pos="right"]:hover::after {
      transform: translateY(-50%) scale(1);
    }
  }

  /* 文件树项目专用 tooltip */
  .tree-file[data-tooltip]::after {
    left: 50%;
    right: auto;
    bottom: calc(100% + 8px);
    top: auto;
    transform: translateX(-50%) scale(0.8);
    transform-origin: bottom center;
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    z-index: var(--z-max);
  }
  @media (hover: hover) {
    .tree-file[data-tooltip]:hover::after {
      transform: translateX(-50%) scale(1);
    }
  }

  .tree-file[data-tooltip]::before {
    left: 50%;
    right: auto;
    bottom: calc(100% + 4px);
    top: auto;
    transform: translateX(-50%);
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-top-color: var(--bg-card);
    z-index: var(--z-max);
  }

  /* ========================================
     FILE TREE ENHANCEMENTS - 文件树增强
     ======================================== */
  .tree-search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 220px;
    flex-shrink: 0;
  }

  .tree-search-icon {
    position: absolute;
    left: 0.75rem;
    color: var(--text-muted);
    pointer-events: none;
    transition: color var(--transition-fast);
    z-index: 1;
  }

  .tree-search-wrapper:focus-within .tree-search-icon {
    color: var(--accent-secondary);
  }

  .tree-search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2.25rem;
    font-size: 0.875rem;
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    transition: all var(--transition-normal);
  }

  @media (hover: hover) {
    .tree-search-input:hover {
      border-color: var(--border-hover);
    }
  }

  .tree-search-input:focus {
    border-color: var(--accent-secondary);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  .tree-search-input::placeholder {
    color: var(--text-muted);
  }

  .tree-search-clear {
    position: absolute;
    right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    border-radius: 50%;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .tree-search-clear:hover {
      background: rgba(255, 71, 87, 0.2);
      color: var(--accent-danger);
    }
  }

  .search-highlight {
    background: rgba(0, 212, 255, 0.3);
    color: #fff;
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 600;
  }

  /* 复制路径按钮 */
  .tree-copy-btn {
    opacity: 0;
    visibility: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    margin-left: 0.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: none;
    border-radius: 4px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
    position: relative;
    z-index: 5;
  }

  @media (hover: hover) {
    .tree-copy-btn:hover {
      background: rgba(0, 212, 255, 0.2);
      color: var(--accent-secondary);
    }
  }

  .tree-copy-btn:active {
    transform: scale(0.9);
  }

  /* Toast 通知 */
  .tree-toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--bg-card);
    border: 1px solid var(--accent-secondary);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    font-size: 0.875rem;
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(0, 212, 255, 0.15);
    z-index: var(--z-tooltip);
    animation: toastSlideIn 0.3s ease-out forwards;
  }

  .tree-toast .toast-icon {
    color: var(--accent-secondary);
  }

  .tree-toast.toast-fade-out {
    animation: toastSlideOut 0.3s ease-in forwards;
  }

  @keyframes toastSlideIn {
    from { opacity: 0; transform: translateX(-50%) translateY(20px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  @keyframes toastSlideOut {
    from { opacity: 1; transform: translateX(-50%) translateY(0); }
    to { opacity: 0; transform: translateX(-50%) translateY(20px); }
  }

  /* 展开图标容器 */
  .tree-expand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    transition: transform var(--transition-fast);
  }

  .tree-folder[data-expanded="true"] .tree-expand-icon .tree-arrow {
    transform: rotate(0deg);
  }
  .tree-folder[data-expanded="false"] .tree-expand-icon .tree-arrow {
    transform: rotate(-90deg);
  }

  /* 禁用的目录 */
  .tree-folder.disabled {
    opacity: 0.7;
    cursor: default;
  }
  .tree-folder.disabled::before {
    display: none;
  }
  @media (hover: hover) {
    .tree-folder.disabled:hover {
      background: transparent;
    }
  }

  /* ========================================
     CHART LINKING - 图表联动高亮
     ======================================== */
  .chart-highlight {
    background: rgba(0, 212, 255, 0.15) !important;
    border-color: var(--accent-secondary) !important;
    box-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
  }

  .row-highlight {
    animation: rowFlash 1.5s ease-out;
  }

  @keyframes rowFlash {
    0% { background: rgba(0, 212, 255, 0.3); }
    100% { background: transparent; }
  }

  /* ========================================
     SPARKLINE - 迷你折线图
     ======================================== */
  .sparkline-container {
    margin-top: var(--space-sm);
    opacity: 0.8;
    transition: opacity var(--transition-fast);
  }

  @media (hover: hover) {
    .stat-card:hover .sparkline-container {
      opacity: 1;
    }
  }

  /* ========================================
     LANGUAGE CHART TOGGLE - 语言图表切换
     ======================================== */
  .chart-title .btn-group {
    margin-left: auto;
  }
  .chart-title .btn-group .btn {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.75rem;
  }
  .chart-title .btn-group .btn.active {
    background: var(--accent-secondary);
    color: var(--bg-dark);
    border-color: var(--accent-secondary);
    font-weight: 600;
  }

  /* ========================================
     RESPONSIVE - 组件响应式
     ======================================== */
  @media (max-width: 768px) {
    .heatmap-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    .treemap-xl { grid-column: span 2; grid-row: span 1; }
    .treemap-lg { grid-column: span 2; grid-row: span 1; }
    .treemap-md { grid-column: span 1; }

    .lang-detail-grid {
      grid-template-columns: 1fr;
    }

    .file-tree-container {
      max-height: 400px;
    }

    .tree-search-wrapper {
      max-width: 100%;
      flex: none;
      width: 100%;
      order: 1;
      margin-top: 0.5rem;
    }

    .tree-controls {
      flex-wrap: wrap;
    }

    .tree-copy-btn {
      opacity: 1;
      visibility: visible;
    }
  }

  @media (max-width: 480px) {
    .heatmap-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .treemap-xl,
    .treemap-lg,
    .treemap-md {
      grid-column: span 1;
      grid-row: span 1;
    }
  }
`;
