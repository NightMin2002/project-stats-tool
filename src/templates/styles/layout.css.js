/**
 * Layout CSS Module - 布局系统
 * 包含：容器、Grid 系统、Header、Section、响应式
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.3.0
 */

module.exports = `
  /* ========================================
     CONTAINER SYSTEM
     ======================================== */
  .container {
    position: relative;
    z-index: 1;
    max-width: 1440px;
    margin: 0 auto;
    padding: var(--space-xl);
    width: 100%;
  }
  
  .container-sm { max-width: 640px; }
  .container-md { max-width: 960px; }
  .container-lg { max-width: 1280px; }
  .container-xl { max-width: 1440px; }
  .container-full { max-width: 100%; }

  /* ========================================
     HEADER - 页面头部
     ======================================== */
  .header {
    background: linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(45, 27, 105, 0.9) 100%);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-radius: var(--border-radius-xl);
    padding: var(--space-3xl) var(--space-xl);
    text-align: center;
    margin-bottom: var(--space-xl);
    border: 1px solid var(--border-color);
    box-shadow: 
      var(--shadow-xl),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
    will-change: transform;
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
  
  .header-content {
    position: relative;
    z-index: 2;
  }
  
  .header h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: var(--space-md);
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-md);
    animation: titleGlow 3s ease-in-out infinite alternate;
  }
  
  .header .subtitle {
    font-size: 1.25rem;
    color: var(--text-secondary);
    font-weight: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
  }
  
  /* Moon Decoration */
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

  /* ========================================
     META GRID - 元信息卡片网格
     ======================================== */
  .meta-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
  }
  
  .meta-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--space-lg);
    display: flex;
    align-items: center;
    gap: var(--space-md);
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
    border-radius: var(--border-radius-md);
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
  .meta-label { 
    font-size: 0.875rem; 
    color: var(--text-secondary); 
    margin-bottom: var(--space-xs); 
  }
  .meta-value { 
    font-size: 1.125rem; 
    font-weight: 600; 
    color: var(--text-primary); 
  }

  /* ========================================
     SECTIONS - 内容区块
     ======================================== */
  .section {
    background: var(--bg-card);
    border-radius: var(--border-radius-xl);
    padding: var(--space-xl);
    margin-bottom: var(--space-xl);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-md);
    position: relative;
    overflow: hidden;
    animation: sectionFadeIn 0.6s ease-out;
    will-change: transform, opacity;
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
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: var(--space-md);
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

  /* ========================================
     STATS GRID - 统计卡片网格
     ======================================== */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-lg);
  }
  
  .stat-card {
    background: var(--gradient-glass);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--space-xl);
    position: relative;
    overflow: hidden;
    transition: all var(--transition-normal);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    will-change: transform;
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
    margin-bottom: var(--space-md);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--border-radius-md);
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
    margin-bottom: var(--space-sm);
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
    gap: var(--space-sm);
  }

  /* ========================================
     CHART GRID - 图表布局
     ======================================== */
  .chart-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-xl);
  }
  
  .chart-container {
    background: rgba(10, 14, 39, 0.5);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--space-lg);
    height: 100%;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
  }
  
  .chart-container:hover {
    border-color: var(--border-hover);
    box-shadow: var(--shadow-glow);
  }
  
  .chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--space-lg);
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }
  
  .chart-wrapper {
    position: relative;
    height: 350px;
    width: 100%;
  }

  /* ========================================
     COMPARISON GRID - 对比布局
     ======================================== */
  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-md);
  }
  
  .comp-card {
    background: var(--glass-bg-light);
    border-radius: var(--border-radius-md);
    padding: 1.25rem;
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
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
    gap: var(--space-sm);
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
  
  .comp-diff {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
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

  /* ========================================
     FOOTER
     ======================================== */
  .footer {
    text-align: center;
    padding: var(--space-2xl) 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
    border-top: 1px solid var(--border-color);
    margin-top: var(--space-3xl);
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

  /* ========================================
     RESPONSIVE BREAKPOINTS
     ======================================== */
  @media (max-width: 1024px) {
    .container {
      padding: var(--space-lg);
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
      padding: var(--space-xl) var(--space-md);
    }
    
    .section {
      padding: var(--space-lg);
      border-radius: var(--border-radius-lg);
    }
    
    .stat-card {
      padding: var(--space-lg);
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
    
    .moon-container {
      display: none;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: var(--space-md);
    }
    
    .header h1 {
      font-size: 1.5rem;
      flex-direction: column;
      gap: var(--space-sm);
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
    
    .chart-grid {
      gap: var(--space-md);
    }
  }
  
  /* ========================================
     PRINT STYLES
     ======================================== */
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
    
    .header {
      background: none;
      border: 1px solid #ddd;
    }
    
    .stat-value {
      -webkit-text-fill-color: initial;
      color: #333;
    }
  }
`;