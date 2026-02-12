/**
 * Animations CSS Module - 动画系统
 * 包含：所有 @keyframes、过渡效果、微交互动画
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.3.0
 */

module.exports = `
  /* ========================================
     KEYFRAMES - 核心动画定义
     ======================================== */
  
  /* Header Pulse - 头部背景脉冲 */
  @keyframes headerPulse {
    0%, 100% { 
      transform: scale(1); 
      opacity: 0.5; 
    }
    50% { 
      transform: scale(1.1); 
      opacity: 0.8; 
    }
  }
  
  /* Title Glow - 标题发光效果 */
  @keyframes titleGlow {
    0% { 
      filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3)); 
    }
    100% { 
      filter: drop-shadow(0 0 40px rgba(0, 212, 255, 0.5)); 
    }
  }
  
  /* Moon Float - 月亮悬浮 */
  @keyframes moonFloat {
    0%, 100% { 
      transform: translate(0, 0) rotate(0deg); 
    }
    50% { 
      transform: translate(0, -15px) rotate(2deg); 
    }
  }
  
  /* Icon Pulse - 图标脉冲 */
  @keyframes iconPulse {
    0%, 100% { 
      opacity: 1; 
    }
    50% { 
      opacity: 0.7; 
    }
  }
  
  /* Section Fade In - 区块淡入 */
  @keyframes sectionFadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* Tree Expand - 树形展开 */
  @keyframes treeExpand {
    from { 
      opacity: 0; 
      transform: translateY(-10px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* Bounce Up - 向上弹跳 */
  @keyframes bounceUp {
    0%, 100% { 
      transform: translateY(0); 
    }
    50% { 
      transform: translateY(-3px); 
    }
  }
  
  /* Bounce Down - 向下弹跳 */
  @keyframes bounceDown {
    0%, 100% { 
      transform: translateY(0); 
    }
    50% { 
      transform: translateY(3px); 
    }
  }
  
  /* Progress Shine - 进度条光泽 */
  @keyframes progressShine {
    0% { 
      transform: translateX(-100%); 
    }
    100% { 
      transform: translateX(100%); 
    }
  }
  
  /* Skeleton Loading - 骨架屏加载 */
  @keyframes skeletonLoading {
    0% { 
      background-position: 200% 0; 
    }
    100% { 
      background-position: -200% 0; 
    }
  }
  
  /* ========================================
     NEW ANIMATIONS - 新增动画效果
     ======================================== */
  
  /* Fade In - 通用淡入 */
  @keyframes fadeIn {
    from { 
      opacity: 0; 
    }
    to { 
      opacity: 1; 
    }
  }
  
  /* Fade In Up - 向上淡入 */
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* Fade In Down - 向下淡入 */
  @keyframes fadeInDown {
    from { 
      opacity: 0; 
      transform: translateY(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  /* Fade In Left - 从左淡入 */
  @keyframes fadeInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  /* Fade In Right - 从右淡入 */
  @keyframes fadeInRight {
    from { 
      opacity: 0; 
      transform: translateX(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  /* Scale In - 缩放淡入 */
  @keyframes scaleIn {
    from { 
      opacity: 0; 
      transform: scale(0.9); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  /* Scale Out - 缩放淡出 */
  @keyframes scaleOut {
    from { 
      opacity: 1; 
      transform: scale(1); 
    }
    to { 
      opacity: 0; 
      transform: scale(0.9); 
    }
  }
  
  /* Spin - 旋转 */
  @keyframes spin {
    from { 
      transform: rotate(0deg); 
    }
    to { 
      transform: rotate(360deg); 
    }
  }
  
  /* Ping - 脉冲扩散 */
  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  /* Pulse - 心跳效果 */
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  /* Bounce - 弹跳效果 */
  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  
  /* Shake - 抖动效果 */
  @keyframes shake {
    0%, 100% { 
      transform: translateX(0); 
    }
    10%, 30%, 50%, 70%, 90% { 
      transform: translateX(-4px); 
    }
    20%, 40%, 60%, 80% { 
      transform: translateX(4px); 
    }
  }
  
  /* Wiggle - 摆动效果 */
  @keyframes wiggle {
    0%, 100% { 
      transform: rotate(-3deg); 
    }
    50% { 
      transform: rotate(3deg); 
    }
  }
  
  /* Glow - 发光脉冲 */
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(0, 212, 255, 0.2);
    }
    50% {
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2);
    }
  }
  
  /* Shimmer - 闪烁效果 */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  /* Float - 悬浮效果 */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  /* Ripple - 涟漪效果 */
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  /* Slide In Up - 从下滑入 */
  @keyframes slideInUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Slide In Down - 从上滑入 */
  @keyframes slideInDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Slide Out Up - 向上滑出 */
  @keyframes slideOutUp {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(-100%);
      opacity: 0;
    }
  }
  
  /* Slide Out Down - 向下滑出 */
  @keyframes slideOutDown {
    from {
      transform: translateY(0);
      opacity: 1;
    }
    to {
      transform: translateY(100%);
      opacity: 0;
    }
  }
  
  /* Number Count Up - 数字跳动 */
  @keyframes countUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* Gradient Flow - 渐变流动 */
  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  /* Border Glow - 边框发光 */
  @keyframes borderGlow {
    0%, 100% {
      border-color: var(--accent-secondary);
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    }
    50% {
      border-color: var(--accent-primary);
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
    }
  }

  /* ========================================
     ANIMATION UTILITY CLASSES - 动画工具类
     ======================================== */
  
  /* Duration */
  .animate-duration-75 { animation-duration: 75ms; }
  .animate-duration-100 { animation-duration: 100ms; }
  .animate-duration-150 { animation-duration: 150ms; }
  .animate-duration-200 { animation-duration: 200ms; }
  .animate-duration-300 { animation-duration: 300ms; }
  .animate-duration-500 { animation-duration: 500ms; }
  .animate-duration-700 { animation-duration: 700ms; }
  .animate-duration-1000 { animation-duration: 1000ms; }
  
  /* Delay */
  .animate-delay-75 { animation-delay: 75ms; }
  .animate-delay-100 { animation-delay: 100ms; }
  .animate-delay-150 { animation-delay: 150ms; }
  .animate-delay-200 { animation-delay: 200ms; }
  .animate-delay-300 { animation-delay: 300ms; }
  .animate-delay-500 { animation-delay: 500ms; }
  .animate-delay-700 { animation-delay: 700ms; }
  .animate-delay-1000 { animation-delay: 1000ms; }
  
  /* Animation Classes */
  .animate-fade-in { animation: fadeIn var(--transition-normal) ease-out; }
  .animate-fade-in-up { animation: fadeInUp var(--transition-normal) ease-out; }
  .animate-fade-in-down { animation: fadeInDown var(--transition-normal) ease-out; }
  .animate-fade-in-left { animation: fadeInLeft var(--transition-normal) ease-out; }
  .animate-fade-in-right { animation: fadeInRight var(--transition-normal) ease-out; }
  .animate-scale-in { animation: scaleIn var(--transition-normal) ease-out; }
  .animate-spin { animation: spin 1s linear infinite; }
  .animate-ping { animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; }
  .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-bounce { animation: bounce 1s infinite; }
  .animate-shake { animation: shake 0.5s ease-in-out; }
  .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
  .animate-glow { animation: glow 2s ease-in-out infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  
  /* Fill Mode */
  .animate-fill-forwards { animation-fill-mode: forwards; }
  .animate-fill-backwards { animation-fill-mode: backwards; }
  .animate-fill-both { animation-fill-mode: both; }
  
  /* Iteration */
  .animate-once { animation-iteration-count: 1; }
  .animate-infinite { animation-iteration-count: infinite; }
  
  /* Direction */
  .animate-reverse { animation-direction: reverse; }
  .animate-alternate { animation-direction: alternate; }
  
  /* Play State */
  .animate-paused { animation-play-state: paused; }
  .animate-running { animation-play-state: running; }

  /* ========================================
     HOVER ANIMATIONS - 悬停动画
     ======================================== */
  
  .hover-lift {
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }

  .hover-scale {
    transition: transform var(--transition-normal);
  }

  .hover-glow {
    transition: box-shadow var(--transition-normal);
  }

  .hover-shine {
    position: relative;
    overflow: hidden;
  }

  .hover-shine::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left var(--transition-slow);
  }

  .hover-border-glow {
    transition: border-color var(--transition-normal), box-shadow var(--transition-normal);
  }

  @media (hover: hover) {
    .hover-lift:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    .hover-scale:hover {
      transform: scale(1.05);
    }
    .hover-glow:hover {
      box-shadow: var(--shadow-glow);
    }
    .hover-shine:hover::before {
      left: 100%;
    }
    .hover-border-glow:hover {
      border-color: var(--accent-secondary);
      box-shadow: 0 0 15px rgba(0, 212, 255, 0.2);
    }
  }

  /* ========================================
     STAGGER ANIMATIONS - 交错动画
     用于列表项依次出现
     ======================================== */
  
  .stagger-item {
    opacity: 0;
    animation: fadeInUp 0.4s ease-out forwards;
  }
  
  .stagger-item:nth-child(1) { animation-delay: 0.05s; }
  .stagger-item:nth-child(2) { animation-delay: 0.1s; }
  .stagger-item:nth-child(3) { animation-delay: 0.15s; }
  .stagger-item:nth-child(4) { animation-delay: 0.2s; }
  .stagger-item:nth-child(5) { animation-delay: 0.25s; }
  .stagger-item:nth-child(6) { animation-delay: 0.3s; }
  .stagger-item:nth-child(7) { animation-delay: 0.35s; }
  .stagger-item:nth-child(8) { animation-delay: 0.4s; }
  .stagger-item:nth-child(9) { animation-delay: 0.45s; }
  .stagger-item:nth-child(10) { animation-delay: 0.5s; }

  /* ========================================
     REDUCED MOTION - 减弱动画
     尊重用户系统设置
     ======================================== */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;