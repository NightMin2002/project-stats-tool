/**
 * Utilities CSS Module - 工具类
 * 包含：性能优化、辅助类、可访问性、调试工具
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.3.0
 */

module.exports = `
  /* ========================================
     PERFORMANCE HINTS - 性能优化提示
     ======================================== */
  
  /* GPU 加速层 */
  .gpu-accelerated {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* 将要变化的属性 */
  .will-change-transform {
    will-change: transform;
  }
  
  .will-change-opacity {
    will-change: opacity;
  }
  
  .will-change-all {
    will-change: transform, opacity, box-shadow;
  }
  
  /* 内容隔离 - 限制重绘范围 */
  .contain-strict {
    contain: strict;
  }
  
  .contain-layout {
    contain: layout;
  }
  
  .contain-paint {
    contain: paint;
  }
  
  .contain-content {
    contain: content;
  }

  /* ========================================
     DISPLAY UTILITIES - 显示工具
     ======================================== */
  .hidden { display: none !important; }
  .block { display: block; }
  .inline { display: inline; }
  .inline-block { display: inline-block; }
  .flex { display: flex; }
  .inline-flex { display: inline-flex; }
  .grid { display: grid; }
  .inline-grid { display: inline-grid; }
  
  .visible { visibility: visible; }
  .invisible { visibility: hidden; }
  
  /* ========================================
     FLEXBOX UTILITIES - Flex 工具
     ======================================== */
  .flex-row { flex-direction: row; }
  .flex-row-reverse { flex-direction: row-reverse; }
  .flex-col { flex-direction: column; }
  .flex-col-reverse { flex-direction: column-reverse; }
  
  .flex-wrap { flex-wrap: wrap; }
  .flex-nowrap { flex-wrap: nowrap; }
  .flex-wrap-reverse { flex-wrap: wrap-reverse; }
  
  .items-start { align-items: flex-start; }
  .items-end { align-items: flex-end; }
  .items-center { align-items: center; }
  .items-baseline { align-items: baseline; }
  .items-stretch { align-items: stretch; }
  
  .justify-start { justify-content: flex-start; }
  .justify-end { justify-content: flex-end; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .justify-around { justify-content: space-around; }
  .justify-evenly { justify-content: space-evenly; }
  
  .flex-1 { flex: 1 1 0%; }
  .flex-auto { flex: 1 1 auto; }
  .flex-initial { flex: 0 1 auto; }
  .flex-none { flex: none; }
  
  .flex-grow { flex-grow: 1; }
  .flex-grow-0 { flex-grow: 0; }
  .flex-shrink { flex-shrink: 1; }
  .flex-shrink-0 { flex-shrink: 0; }

  /* ========================================
     SPACING UTILITIES - 间距工具
     ======================================== */
  /* Margin */
  .m-0 { margin: 0; }
  .m-1 { margin: var(--space-xs); }
  .m-2 { margin: var(--space-sm); }
  .m-3 { margin: var(--space-md); }
  .m-4 { margin: var(--space-lg); }
  .m-5 { margin: var(--space-xl); }
  .m-auto { margin: auto; }
  
  .mx-auto { margin-left: auto; margin-right: auto; }
  .my-auto { margin-top: auto; margin-bottom: auto; }
  
  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: var(--space-xs); }
  .mt-2 { margin-top: var(--space-sm); }
  .mt-3 { margin-top: var(--space-md); }
  .mt-4 { margin-top: var(--space-lg); }
  .mt-5 { margin-top: var(--space-xl); }
  
  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: var(--space-xs); }
  .mb-2 { margin-bottom: var(--space-sm); }
  .mb-3 { margin-bottom: var(--space-md); }
  .mb-4 { margin-bottom: var(--space-lg); }
  .mb-5 { margin-bottom: var(--space-xl); }
  
  .ml-0 { margin-left: 0; }
  .ml-1 { margin-left: var(--space-xs); }
  .ml-2 { margin-left: var(--space-sm); }
  .ml-3 { margin-left: var(--space-md); }
  .ml-4 { margin-left: var(--space-lg); }
  .ml-auto { margin-left: auto; }
  
  .mr-0 { margin-right: 0; }
  .mr-1 { margin-right: var(--space-xs); }
  .mr-2 { margin-right: var(--space-sm); }
  .mr-3 { margin-right: var(--space-md); }
  .mr-4 { margin-right: var(--space-lg); }
  .mr-auto { margin-right: auto; }
  
  /* Padding */
  .p-0 { padding: 0; }
  .p-1 { padding: var(--space-xs); }
  .p-2 { padding: var(--space-sm); }
  .p-3 { padding: var(--space-md); }
  .p-4 { padding: var(--space-lg); }
  .p-5 { padding: var(--space-xl); }
  
  .px-0 { padding-left: 0; padding-right: 0; }
  .px-1 { padding-left: var(--space-xs); padding-right: var(--space-xs); }
  .px-2 { padding-left: var(--space-sm); padding-right: var(--space-sm); }
  .px-3 { padding-left: var(--space-md); padding-right: var(--space-md); }
  .px-4 { padding-left: var(--space-lg); padding-right: var(--space-lg); }
  .px-5 { padding-left: var(--space-xl); padding-right: var(--space-xl); }
  
  .py-0 { padding-top: 0; padding-bottom: 0; }
  .py-1 { padding-top: var(--space-xs); padding-bottom: var(--space-xs); }
  .py-2 { padding-top: var(--space-sm); padding-bottom: var(--space-sm); }
  .py-3 { padding-top: var(--space-md); padding-bottom: var(--space-md); }
  .py-4 { padding-top: var(--space-lg); padding-bottom: var(--space-lg); }
  .py-5 { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
  
  /* Gap */
  .gap-0 { gap: 0; }
  .gap-1 { gap: var(--space-xs); }
  .gap-2 { gap: var(--space-sm); }
  .gap-3 { gap: var(--space-md); }
  .gap-4 { gap: var(--space-lg); }
  .gap-5 { gap: var(--space-xl); }

  /* ========================================
     TEXT UTILITIES - 文本工具
     ======================================== */
  .text-left { text-align: left; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-justify { text-align: justify; }
  
  .text-xs { font-size: 0.75rem; }
  .text-sm { font-size: 0.875rem; }
  .text-base { font-size: 1rem; }
  .text-lg { font-size: 1.125rem; }
  .text-xl { font-size: 1.25rem; }
  .text-2xl { font-size: 1.5rem; }
  .text-3xl { font-size: 2rem; }
  .text-4xl { font-size: 2.5rem; }
  
  .font-light { font-weight: 300; }
  .font-normal { font-weight: 400; }
  .font-medium { font-weight: 500; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .font-extrabold { font-weight: 800; }
  
  .uppercase { text-transform: uppercase; }
  .lowercase { text-transform: lowercase; }
  .capitalize { text-transform: capitalize; }
  .normal-case { text-transform: none; }
  
  .underline { text-decoration: underline; }
  .line-through { text-decoration: line-through; }
  .no-underline { text-decoration: none; }
  
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .text-wrap { white-space: normal; }
  .text-nowrap { white-space: nowrap; }
  .break-words { word-break: break-word; }
  .break-all { word-break: break-all; }
  
  /* Line Height */
  .leading-none { line-height: 1; }
  .leading-tight { line-height: 1.25; }
  .leading-snug { line-height: 1.375; }
  .leading-normal { line-height: 1.5; }
  .leading-relaxed { line-height: 1.625; }
  .leading-loose { line-height: 2; }
  
  /* Letter Spacing */
  .tracking-tighter { letter-spacing: -0.05em; }
  .tracking-tight { letter-spacing: -0.025em; }
  .tracking-normal { letter-spacing: 0; }
  .tracking-wide { letter-spacing: 0.025em; }
  .tracking-wider { letter-spacing: 0.05em; }
  .tracking-widest { letter-spacing: 0.1em; }

  /* ========================================
     COLOR UTILITIES - 颜色工具
     ======================================== */
  /* Text Colors */
  .text-primary { color: var(--text-primary); }
  .text-secondary { color: var(--text-secondary); }
  .text-muted { color: var(--text-muted); }
  .text-accent { color: var(--accent-secondary); }
  .text-success { color: var(--accent-success); }
  .text-warning { color: var(--accent-warning); }
  .text-danger { color: var(--accent-danger); }
  
  /* Background Colors */
  .bg-transparent { background: transparent; }
  .bg-dark { background: var(--bg-dark); }
  .bg-darker { background: var(--bg-darker); }
  .bg-card { background: var(--bg-card); }
  .bg-glass { background: var(--glass-bg); backdrop-filter: var(--glass-blur); }
  
  /* ========================================
     SIZING UTILITIES - 尺寸工具
     ======================================== */
  .w-full { width: 100%; }
  .w-screen { width: 100vw; }
  .w-auto { width: auto; }
  .w-min { width: min-content; }
  .w-max { width: max-content; }
  .w-fit { width: fit-content; }
  
  .h-full { height: 100%; }
  .h-screen { height: 100vh; }
  .h-auto { height: auto; }
  .h-min { height: min-content; }
  .h-max { height: max-content; }
  .h-fit { height: fit-content; }
  
  .min-w-0 { min-width: 0; }
  .min-w-full { min-width: 100%; }
  .min-h-0 { min-height: 0; }
  .min-h-full { min-height: 100%; }
  .min-h-screen { min-height: 100vh; }
  
  .max-w-none { max-width: none; }
  .max-w-full { max-width: 100%; }
  .max-h-none { max-height: none; }
  .max-h-full { max-height: 100%; }
  .max-h-screen { max-height: 100vh; }

  /* ========================================
     POSITION UTILITIES - 定位工具
     ======================================== */
  .relative { position: relative; }
  .absolute { position: absolute; }
  .fixed { position: fixed; }
  .sticky { position: sticky; }
  .static { position: static; }
  
  .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
  .inset-x-0 { left: 0; right: 0; }
  .inset-y-0 { top: 0; bottom: 0; }
  
  .top-0 { top: 0; }
  .right-0 { right: 0; }
  .bottom-0 { bottom: 0; }
  .left-0 { left: 0; }
  
  .z-0 { z-index: 0; }
  .z-10 { z-index: 10; }
  .z-20 { z-index: 20; }
  .z-30 { z-index: 30; }
  .z-40 { z-index: 40; }
  .z-50 { z-index: 50; }
  .z-auto { z-index: auto; }

  /* ========================================
     BORDER UTILITIES - 边框工具
     ======================================== */
  .border { border: 1px solid var(--border-color); }
  .border-0 { border: none; }
  .border-t { border-top: 1px solid var(--border-color); }
  .border-r { border-right: 1px solid var(--border-color); }
  .border-b { border-bottom: 1px solid var(--border-color); }
  .border-l { border-left: 1px solid var(--border-color); }
  
  .rounded-none { border-radius: 0; }
  .rounded-sm { border-radius: var(--border-radius-sm); }
  .rounded { border-radius: var(--border-radius-md); }
  .rounded-lg { border-radius: var(--border-radius-lg); }
  .rounded-xl { border-radius: var(--border-radius-xl); }
  .rounded-full { border-radius: var(--border-radius-full); }

  /* ========================================
     SHADOW UTILITIES - 阴影工具
     ======================================== */
  .shadow-none { box-shadow: none; }
  .shadow-sm { box-shadow: var(--shadow-sm); }
  .shadow { box-shadow: var(--shadow-md); }
  .shadow-lg { box-shadow: var(--shadow-lg); }
  .shadow-xl { box-shadow: var(--shadow-xl); }
  .shadow-glow { box-shadow: var(--shadow-glow); }

  /* ========================================
     OVERFLOW UTILITIES - 溢出工具
     ======================================== */
  .overflow-auto { overflow: auto; }
  .overflow-hidden { overflow: hidden; }
  .overflow-visible { overflow: visible; }
  .overflow-scroll { overflow: scroll; }
  .overflow-x-auto { overflow-x: auto; }
  .overflow-y-auto { overflow-y: auto; }
  .overflow-x-hidden { overflow-x: hidden; }
  .overflow-y-hidden { overflow-y: hidden; }

  /* ========================================
     CURSOR UTILITIES - 光标工具
     ======================================== */
  .cursor-auto { cursor: auto; }
  .cursor-default { cursor: default; }
  .cursor-pointer { cursor: pointer; }
  .cursor-wait { cursor: wait; }
  .cursor-text { cursor: text; }
  .cursor-move { cursor: move; }
  .cursor-not-allowed { cursor: not-allowed; }
  .cursor-grab { cursor: grab; }
  .cursor-grabbing { cursor: grabbing; }

  /* ========================================
     POINTER EVENTS - 指针事件
     ======================================== */
  .pointer-events-none { pointer-events: none; }
  .pointer-events-auto { pointer-events: auto; }
  
  /* ========================================
     USER SELECT - 用户选择
     ======================================== */
  .select-none { user-select: none; -webkit-user-select: none; }
  .select-text { user-select: text; -webkit-user-select: text; }
  .select-all { user-select: all; -webkit-user-select: all; }
  .select-auto { user-select: auto; -webkit-user-select: auto; }

  /* ========================================
     OPACITY UTILITIES - 透明度工具
     ======================================== */
  .opacity-0 { opacity: 0; }
  .opacity-25 { opacity: 0.25; }
  .opacity-50 { opacity: 0.5; }
  .opacity-75 { opacity: 0.75; }
  .opacity-100 { opacity: 1; }

  /* ========================================
     TRANSITION UTILITIES - 过渡工具
     ======================================== */
  .transition-none { transition: none; }
  .transition-all { transition: all var(--transition-normal); }
  .transition-fast { transition: all var(--transition-fast); }
  .transition-slow { transition: all var(--transition-slow); }
  .transition-colors { 
    transition: color var(--transition-normal), 
                background-color var(--transition-normal), 
                border-color var(--transition-normal); 
  }
  .transition-opacity { transition: opacity var(--transition-normal); }
  .transition-transform { transition: transform var(--transition-normal); }
  .transition-shadow { transition: box-shadow var(--transition-normal); }

  /* ========================================
     TRANSFORM UTILITIES - 变换工具
     ======================================== */
  .scale-95 { transform: scale(0.95); }
  .scale-100 { transform: scale(1); }
  .scale-105 { transform: scale(1.05); }
  .scale-110 { transform: scale(1.1); }
  
  .rotate-0 { transform: rotate(0deg); }
  .rotate-45 { transform: rotate(45deg); }
  .rotate-90 { transform: rotate(90deg); }
  .rotate-180 { transform: rotate(180deg); }
  .-rotate-45 { transform: rotate(-45deg); }
  .-rotate-90 { transform: rotate(-90deg); }
  
  .translate-x-0 { transform: translateX(0); }
  .translate-y-0 { transform: translateY(0); }
  .-translate-x-full { transform: translateX(-100%); }
  .-translate-y-full { transform: translateY(-100%); }
  .translate-x-full { transform: translateX(100%); }
  .translate-y-full { transform: translateY(100%); }

  /* ========================================
     SCREEN READER UTILITIES - 屏幕阅读器
     ======================================== */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  .not-sr-only {
    position: static;
    width: auto;
    height: auto;
    padding: 0;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }

  /* ========================================
     DEBUG UTILITIES - 调试工具
     开发环境使用
     ======================================== */
  .debug * {
    outline: 1px solid rgba(255, 0, 0, 0.3);
  }
  
  .debug-blue * {
    outline: 1px solid rgba(0, 0, 255, 0.3);
  }
  
  .debug-green * {
    outline: 1px solid rgba(0, 255, 0, 0.3);
  }
  
  /* Box Outline for Debugging Layout */
  .outline-debug {
    outline: 2px dashed var(--accent-danger);
    outline-offset: 2px;
  }

  /* ========================================
     RESPONSIVE HIDDEN - 响应式隐藏
     ======================================== */
  @media (max-width: 640px) {
    .sm\\:hidden { display: none !important; }
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    .md\\:hidden { display: none !important; }
  }
  
  @media (min-width: 769px) and (max-width: 1024px) {
    .lg\\:hidden { display: none !important; }
  }
  
  @media (min-width: 1025px) {
    .xl\\:hidden { display: none !important; }
  }
  
  /* Show only on specific breakpoints */
  @media (min-width: 641px) {
    .sm\\:only { display: none !important; }
  }
  
  @media (max-width: 640px) {
    .sm\\:show { display: block; }
    .sm\\:flex { display: flex; }
  }
`;