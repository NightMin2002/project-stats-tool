/**
 * Night Theme JavaScript 逻辑模块 v3.3.0
 * 全面升级：SVG 图标支持、增强文件树、搜索过滤、热力图着色、复制路径
 * Ω Code Agent - UI Perfectionist Edition
 */

module.exports = function generateScripts(stats, fileTreeData, trendData) {
  const languageData = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count: count }));
  
  const codeDistribution = [
    { type: '代码行', value: stats.code.codeLines, color: '#00ff88' },
    { type: '注释行', value: stats.code.commentLines, color: '#00d4ff' },
    { type: '空白行', value: stats.code.blankLines, color: '#666666' }
  ];
  
  const tokenDistribution = [
    { type: '中文', value: stats.tokens.breakdown.fromChinese, color: '#ff6b9d' },
    { type: '英文', value: stats.tokens.breakdown.fromEnglish, color: '#c770f0' },
    { type: '代码', value: stats.tokens.breakdown.fromCode, color: '#00d4ff' }
  ];

  return `
    /**
     * V3.0.0 Scripts
     */

    // ========== 粒子背景初始化 ==========
    if (typeof particlesJS !== 'undefined' && particlesJS !== null) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: ['#00ff88', '#00d4ff', '#c770f0'] },
          shape: { type: 'circle' },
          opacity: { 
            value: 0.3, 
            random: true, 
            anim: { enable: true, speed: 0.5, opacity_min: 0.1 } 
          },
          size: { 
            value: 2, 
            random: true, 
            anim: { enable: true, speed: 2, size_min: 0.5 } 
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#00d4ff',
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.3 } },
            push: { particles_nb: 3 }
          }
        },
        retina_detect: true
      });
    }

    // ========== Chart.js 全局配置 ==========
    Chart.defaults.color = '#94a3b8'; // text-secondary
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.font.family = "'Inter', sans-serif";
    
    // Tooltip theme
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 24, 48, 0.95)'; // bg-card
    Chart.defaults.plugins.tooltip.titleColor = '#e0e0e0';
    Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 212, 255, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: '600' };

    // Legend theme
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
    Chart.defaults.plugins.legend.labels.padding = 20;

    const animationConfig = {
      duration: 1200,
      easing: 'easeOutQuart'
    };
    
    // ========== 语言分布图 ==========
    new Chart(document.getElementById('languageChart'), {
      type: 'doughnut',
      data: {
        labels: ${JSON.stringify(languageData.map(d => d.language))},
        datasets: [{
          data: ${JSON.stringify(languageData.map(d => d.count))},
          backgroundColor: ['#00ff88', '#00d4ff', '#c770f0', '#ff6b9d', '#ffd700',
                          '#ff4757', '#5f27cd', '#00d2d3', '#ff6348', '#1e90ff'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        layout: {
          padding: 20
        },
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#e0e0e0' }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return \` \${context.label}: \${value} 个 (\${percentage}%)\`;
              }
            }
          }
        }
      }
    });
    
    // ========== 代码组成图 ==========
    new Chart(document.getElementById('codeChart'), {
      type: 'pie',
      data: {
        labels: ${JSON.stringify(codeDistribution.map(d => d.type))},
        datasets: [{
          data: ${JSON.stringify(codeDistribution.map(d => d.value))},
          backgroundColor: ${JSON.stringify(codeDistribution.map(d => d.color))},
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        animation: animationConfig,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: function(context) {
                return \` \${context.label}: \${context.parsed.toLocaleString()} 行\`;
              }
            }
          }
        }
      }
    });
    
    // ========== Token 分布图 ==========
    new Chart(document.getElementById('tokenChart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(tokenDistribution.map(d => d.type))},
        datasets: [{
          label: 'Tokens',
          data: ${JSON.stringify(tokenDistribution.map(d => d.value))},
          backgroundColor: ${JSON.stringify(tokenDistribution.map(d => d.color))},
          borderRadius: 6,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationConfig,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return \` Tokens: \${context.parsed.y.toLocaleString()}\`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { display: true, color: 'rgba(255,255,255,0.05)' },
            border: { display: false }
          },
          x: {
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
    
    // ========== 语言代码量对比图 ==========
    ${Object.keys(stats.languageStats || {}).length > 0 ? `
    const languageStatsData = ${JSON.stringify(stats.languageStats)};
    const languageNames = Object.keys(languageStatsData).sort((a, b) =>
      languageStatsData[b].totalLines - languageStatsData[a].totalLines
    );
    
    new Chart(document.getElementById('languageCodeChart'), {
      type: 'bar',
      data: {
        labels: languageNames,
        datasets: [
          {
            label: '代码行',
            data: languageNames.map(lang => languageStatsData[lang].codeLines),
            backgroundColor: '#00ff88',
            stack: 'Stack 0',
            borderRadius: 4
          },
          {
            label: '注释行',
            data: languageNames.map(lang => languageStatsData[lang].commentLines),
            backgroundColor: '#00d4ff',
            stack: 'Stack 0',
            borderRadius: 4
          },
          {
            label: '空白行',
            data: languageNames.map(lang => languageStatsData[lang].blankLines),
            backgroundColor: '#666',
            stack: 'Stack 0',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationConfig,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              footer: function(tooltipItems) {
                const total = tooltipItems.reduce((a, b) => a + b.parsed.y, 0);
                return '总计: ' + total.toLocaleString() + ' 行';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            border: { display: false }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            border: { display: false }
          }
        }
      }
    });
    ` : ''}

    // ========== 趋势图表 ==========
    ${trendData && trendData.totalLines && trendData.totalLines.length > 1 ? `
    const trendData = ${JSON.stringify(trendData)};
    
    const trendChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: animationConfig,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: ctx => {
              const item = trendData.totalLines[ctx[0].dataIndex];
              return item.tag ? \`\${item.label} #\${item.tag}\` : item.label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          border: { display: false }
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { maxRotation: 45, minRotation: 45 }
        }
      }
    };

    ['trendLinesChart', 'trendFilesChart', 'trendTokensChart'].forEach((id, idx) => {
      const dataKey = ['totalLines', 'files', 'tokens'][idx];
      const color = ['#00ff88', '#00d4ff', '#c770f0'][idx];
      
      new Chart(document.getElementById(id), {
        type: 'line',
        data: {
          labels: trendData[dataKey].map(d => d.label),
          datasets: [{
            data: trendData[dataKey].map(d => d.value),
            borderColor: color,
            backgroundColor: color + '20', // 20% opacity
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#0a0e27',
            pointBorderColor: color,
            pointBorderWidth: 2
          }]
        },
        options: trendChartOptions
      });
    });
    ` : ''}

    // ========== 文件树逻辑 (V3.3 增强版) ==========
    
    // SVG Icons Definition - 按文件类型着色
    const TREE_ICONS = {
      folder: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/></svg>\`,
      folderOpen: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/></svg>\`,
      file: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>\`,
      arrowRight: \`<svg class="icon icon-sm tree-arrow" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/></svg>\`,
      arrowDown: \`<svg class="icon icon-sm tree-arrow" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17 16.59 8.59 18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>\`,
      dot: \`<svg class="icon icon-sm" viewBox="0 0 24 24" style="opacity: 0.3;"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>\`,
      copy: \`<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/></svg>\`,
      search: \`<svg class="icon" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>\`,
      clear: \`<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></svg>\`
    };

    // 文件类型颜色映射 - 按语言/类型着色
    const FILE_COLORS = {
      // JavaScript 生态
      '.js': '#f7df1e',
      '.mjs': '#f7df1e',
      '.cjs': '#f7df1e',
      '.jsx': '#61dafb',
      '.ts': '#3178c6',
      '.tsx': '#3178c6',
      
      // Web 前端
      '.html': '#e34c26',
      '.htm': '#e34c26',
      '.css': '#264de4',
      '.scss': '#cc6699',
      '.sass': '#cc6699',
      '.less': '#1d365d',
      '.vue': '#42b883',
      '.svelte': '#ff3e00',
      
      // 后端 / 系统
      '.py': '#3776ab',
      '.rb': '#cc342d',
      '.php': '#777bb4',
      '.java': '#b07219',
      '.go': '#00add8',
      '.rs': '#dea584',
      '.c': '#555555',
      '.cpp': '#f34b7d',
      '.h': '#555555',
      '.cs': '#178600',
      
      // 数据 / 配置
      '.json': '#cbcb41',
      '.yaml': '#cb171e',
      '.yml': '#cb171e',
      '.xml': '#0060ac',
      '.toml': '#9c4121',
      '.ini': '#d1dbe0',
      '.env': '#ecd53f',
      
      // 文档
      '.md': '#083fa1',
      '.mdx': '#fcb32c',
      '.txt': '#89e051',
      '.rst': '#141414',
      
      // Shell / 脚本
      '.sh': '#89e051',
      '.bash': '#89e051',
      '.zsh': '#89e051',
      '.bat': '#c1f12e',
      '.ps1': '#012456',
      
      // 图片 / 资源
      '.svg': '#ffb13b',
      '.png': '#a074c4',
      '.jpg': '#a074c4',
      '.jpeg': '#a074c4',
      '.gif': '#a074c4',
      '.ico': '#a074c4',
      '.webp': '#a074c4',
      
      // 其他
      '.sql': '#e38c00',
      '.graphql': '#e10098',
      '.dockerfile': '#384d54',
      '.lock': '#89e051',
      
      // 默认
      'default': '#94a3b8'
    };
    
    // 获取文件颜色
    function getFileColor(ext) {
      return FILE_COLORS[ext.toLowerCase()] || FILE_COLORS['default'];
    }
    
    // 获取文件大小热力图颜色
    function getSizeHeatColor(size, maxSize) {
      if (!maxSize || maxSize === 0) return '';
      const ratio = size / maxSize;
      if (ratio > 0.8) return 'size-huge';
      if (ratio > 0.6) return 'size-large';
      if (ratio > 0.4) return 'size-medium';
      if (ratio > 0.2) return 'size-small';
      return 'size-tiny';
    }

    let expandedFolders = new Set();
    let fileCount = 0;
    let folderCount = 0;
    let searchQuery = '';
    let maxFileSize = 0;
    let allFilePaths = []; // 用于搜索
    
    // 计算最大文件大小（用于热力图）
    function calculateMaxFileSize(node) {
      if (!node) return 0;
      if (node.type === 'file') return node.size || 0;
      if (node.children) {
        return Math.max(...node.children.map(calculateMaxFileSize), 0);
      }
      return 0;
    }
    
    // 收集所有文件路径（用于搜索）
    function collectAllPaths(node, parentPath = '') {
      if (!node) return;
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      allFilePaths.push({ path: currentPath, type: node.type, name: node.name });
      if (node.children) {
        node.children.forEach(child => collectAllPaths(child, currentPath));
      }
    }
    
    // 检查节点是否匹配搜索
    function matchesSearch(name, path) {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return name.toLowerCase().includes(query) || path.toLowerCase().includes(query);
    }
    
    // 检查节点或其子节点是否匹配搜索
    function nodeOrChildrenMatch(node, parentPath = '') {
      if (!searchQuery) return true;
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      if (matchesSearch(node.name, currentPath)) return true;
      if (node.children) {
        return node.children.some(child => nodeOrChildrenMatch(child, currentPath));
      }
      return false;
    }
    
    function renderTree(node, level = 0, parentPath = '') {
      if (!node) return '';
      
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      const escapedPath = currentPath.replace(/'/g, "\\\\'");
      const indent = \`<span style="display:inline-block; width:\${level * 1.5}rem"></span>\`;
      let html = '';
      
      // 搜索过滤
      if (searchQuery && !nodeOrChildrenMatch(node, parentPath.replace(node.name, '').replace(/\\/$/, ''))) {
        return '';
      }
      
      if (node.type === 'directory') {
        folderCount++;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedFolders.has(currentPath) || (searchQuery && hasChildren);
        
        // 计算目录统计
        let totalFiles = 0;
        let totalSize = 0;
        function countChildren(n) {
          if (n.type === 'file') {
            totalFiles++;
            totalSize += n.size || 0;
          }
          if (n.children) n.children.forEach(countChildren);
        }
        if (node.children) node.children.forEach(countChildren);
        
        // Icon selection - 展开时使用打开的文件夹图标
        const expandIcon = hasChildren
          ? (isExpanded ? TREE_ICONS.arrowDown : TREE_ICONS.arrowRight)
          : TREE_ICONS.dot;
        const folderIcon = isExpanded ? TREE_ICONS.folderOpen : TREE_ICONS.folder;
          
        const itemClass = hasChildren ? 'tree-folder tree-item' : 'tree-folder tree-item disabled';
        const clickAttr = hasChildren ? \`onclick="toggleFolder(event, '\${escapedPath}')"\` : '';
        const dataAttr = hasChildren ? \`data-path="\${escapedPath}" data-expanded="\${isExpanded}"\` : '';
        
        // 高亮匹配的搜索词
        const displayName = searchQuery
          ? highlightMatch(node.name, searchQuery)
          : node.name;
        
        html += \`<div class="\${itemClass}" \${clickAttr} \${dataAttr}>\`;
        html += \`\${indent}<span class="tree-expand-icon">\${expandIcon}</span> \${folderIcon} <span class="tree-name">\${displayName}</span>\`;
        if (hasChildren) {
          html += \` <span class="tree-meta">\${node.children.length} 项 · \${formatBytes(totalSize)}</span>\`;
        }
        html += \`</div>\`;
        
        if (hasChildren) {
          const childrenClass = isExpanded ? 'tree-children open' : 'tree-children';
          html += \`<div class="\${childrenClass}" data-parent="\${escapedPath}">\`;
          node.children
            .filter(child => !searchQuery || nodeOrChildrenMatch(child, currentPath))
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === 'directory' ? -1 : 1;
            })
            .forEach(child => {
              html += renderTree(child, level + 1, currentPath);
            });
          html += '</div>';
        }
      } else {
        fileCount++;
        const ext = node.ext || '';
        const fileColor = getFileColor(ext);
        const sizeLabel = node.size ? formatBytes(node.size) : '';
        const sizeClass = getSizeHeatColor(node.size || 0, maxFileSize);
        
        // 高亮匹配的搜索词
        const displayName = searchQuery
          ? highlightMatch(node.name, searchQuery)
          : node.name;
        
        html += \`<div class="tree-item tree-file" data-path="\${escapedPath}" data-tooltip="\${currentPath}" ondblclick="copyPath(event, '\${escapedPath}')">\`;
        html += \`\${indent}<span style="width:1rem;display:inline-block"></span>\`;
        html += \`<span style="color: \${fileColor}">\${TREE_ICONS.file}</span>\`;
        html += \` <span class="tree-name">\${displayName}</span>\`;
        if (sizeLabel) {
          html += \` <span class="tree-meta \${sizeClass}">\${sizeLabel}</span>\`;
        }
        html += \`</div>\`;
      }
      
      return html;
    }
    
    // 优化：直接操作DOM，不重新渲染整个树
    function toggleFolder(event, path) {
      event.stopPropagation();
      
      const folderEl = event.currentTarget;
      const childrenEl = folderEl.nextElementSibling;
      const iconEl = folderEl.querySelector('.tree-expand-icon');
      
      if (!childrenEl || !childrenEl.classList.contains('tree-children')) return;
      
      const isExpanded = expandedFolders.has(path);
      
      if (isExpanded) {
        // 折叠
        expandedFolders.delete(path);
        childrenEl.classList.remove('open');
        folderEl.setAttribute('data-expanded', 'false');
        if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowRight;
      } else {
        // 展开
        expandedFolders.add(path);
        childrenEl.classList.add('open');
        folderEl.setAttribute('data-expanded', 'true');
        if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowDown;
      }
    }
    
    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + 'B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
      return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    }
    
    // 高亮搜索匹配
    function highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(\`(\${query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')})\`, 'gi');
      return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    // 复制路径到剪贴板
    function copyPath(event, path) {
      event.stopPropagation();
      navigator.clipboard.writeText(path).then(() => {
        showToast('已复制路径: ' + path);
      }).catch(err => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = path;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制路径: ' + path);
      });
    }
    
    // Toast 通知
    function showToast(message) {
      // 移除现有的 toast
      const existingToast = document.querySelector('.tree-toast');
      if (existingToast) existingToast.remove();
      
      const toast = document.createElement('div');
      toast.className = 'tree-toast animate-fade-in-up';
      toast.innerHTML = \`
        <span class="toast-icon">\${TREE_ICONS.copy}</span>
        <span class="toast-message">\${message}</span>
      \`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    }
    
    function refreshTree() {
      fileCount = 0;
      folderCount = 0;
      document.getElementById('fileTree').innerHTML = renderTree(fileTreeData);
      updateTreeStats();
    }
    
    // 搜索处理
    function handleSearch(query) {
      searchQuery = query.trim();
      
      // 如果有搜索词，展开所有匹配的路径
      if (searchQuery) {
        expandedFolders.clear();
        // 展开包含匹配项的所有父目录
        function expandMatchingPaths(node, parentPath = '') {
          const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
          if (node.children && nodeOrChildrenMatch(node, parentPath)) {
            expandedFolders.add(currentPath);
            node.children.forEach(child => expandMatchingPaths(child, currentPath));
          }
        }
        expandMatchingPaths(fileTreeData);
      }
      
      refreshTree();
      
      // 更新搜索结果计数
      const statsEl = document.querySelector('.tree-stats');
      if (statsEl && searchQuery) {
        statsEl.innerHTML = \`搜索 "\${searchQuery}": \${folderCount} 文件夹, \${fileCount} 文件匹配\`;
      }
    }
    
    // 清除搜索
    function clearSearch() {
      searchQuery = '';
      const searchInput = document.getElementById('treeSearchInput');
      if (searchInput) searchInput.value = '';
      refreshTree();
    }
    
    function updateTreeStats() {
      const statsEl = document.querySelector('.tree-stats');
      if (statsEl) {
        statsEl.innerHTML = \`\${folderCount} 文件夹, \${fileCount} 文件\`;
      }
    }
    
    function expandAll() {
      // 收集所有路径
      function collectAllPaths(node, parentPath = '') {
        const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
        if (node.type === 'directory' && node.children && node.children.length > 0) {
          expandedFolders.add(currentPath);
          node.children.forEach(child => collectAllPaths(child, currentPath));
        }
      }
      collectAllPaths(fileTreeData);
      
      // 直接操作DOM展开所有
      document.querySelectorAll('.tree-children').forEach(el => {
        el.classList.add('open');
      });
      document.querySelectorAll('.tree-folder[data-expanded]').forEach(el => {
        el.setAttribute('data-expanded', 'true');
        const iconEl = el.querySelector('.tree-expand-icon');
        if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowDown;
      });
    }
    
    function collapseAll() {
      expandedFolders.clear();
      expandedFolders.add(fileTreeData.name); // 保留根目录展开
      
      // 直接操作DOM折叠所有（除了根目录）
      document.querySelectorAll('.tree-children').forEach((el, index) => {
        if (index === 0) {
          el.classList.add('open'); // 保留根目录
        } else {
          el.classList.remove('open');
        }
      });
      document.querySelectorAll('.tree-folder[data-expanded]').forEach((el, index) => {
        if (index === 0) {
          el.setAttribute('data-expanded', 'true');
          const iconEl = el.querySelector('.tree-expand-icon');
          if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowDown;
        } else {
          el.setAttribute('data-expanded', 'false');
          const iconEl = el.querySelector('.tree-expand-icon');
          if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowRight;
        }
      });
    }

    // ========== Init Tree ==========
    const fileTreeData = ${JSON.stringify(fileTreeData)};
    maxFileSize = calculateMaxFileSize(fileTreeData);
    collectAllPaths(fileTreeData);
    expandedFolders.add(fileTreeData.name); // Default expand root
    refreshTree();
    
    // 初始化搜索框事件
    const searchInput = document.getElementById('treeSearchInput');
    const searchClearBtn = document.getElementById('treeSearchClear');
    
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          handleSearch(e.target.value);
        }, 200);
        
        // 显示/隐藏清除按钮
        if (searchClearBtn) {
          searchClearBtn.style.display = e.target.value ? 'flex' : 'none';
        }
      });
      
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          clearSearch();
        }
      });
    }
    
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', clearSearch);
    }

    // ========== Comparison Logic ==========
    const comparisonToggleBtn = document.getElementById('toggleComparisonBtn');
    const comparisonContent = document.getElementById('comparisonContent');
    if (comparisonToggleBtn && comparisonContent) {
      let comparisonVisible = true;
      comparisonToggleBtn.addEventListener('click', () => {
        comparisonVisible = !comparisonVisible;
        comparisonContent.style.display = comparisonVisible ? 'block' : 'none';
        comparisonToggleBtn.textContent = comparisonVisible ? '隐藏对比' : '显示对比';
        // Add minimal active state styling if needed
        comparisonToggleBtn.style.opacity = comparisonVisible ? '1' : '0.7';
      });
    }
  `;
};