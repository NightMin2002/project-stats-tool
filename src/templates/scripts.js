/**
 * Night Theme JavaScript 逻辑模块 v3.0.0
 * 全面升级：SVG 图标支持、Chart.js 适配新 UI、现代化交互
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

    // ========== 文件树逻辑 (SVG版) ==========
    
    // SVG Icons Definition
    const TREE_ICONS = {
      folder: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/></svg>\`,
      file: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>\`,
      arrowRight: \`<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/></svg>\`,
      arrowDown: \`<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17 16.59 8.59 18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>\`,
      dot: \`<svg class="icon icon-sm" viewBox="0 0 24 24" style="opacity: 0.3;"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>\`
    };

    let expandedFolders = new Set();
    let fileCount = 0;
    let folderCount = 0;
    
    function renderTree(node, level = 0, parentPath = '') {
      if (!node) return '';
      
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      const indent = \`<span style="display:inline-block; width:\${level * 1.5}rem"></span>\`;
      let html = '';
      
      if (node.type === 'directory') {
        folderCount++;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedFolders.has(currentPath);
        
        // Icon selection
        const expandIcon = hasChildren 
          ? (isExpanded ? TREE_ICONS.arrowDown : TREE_ICONS.arrowRight) 
          : TREE_ICONS.dot;
          
        const itemClass = hasChildren ? 'tree-folder tree-item' : 'tree-folder tree-item disabled';
        const clickAttr = hasChildren ? \`onclick="toggleFolder(this, '\${currentPath}')"\` : '';
        
        html += \`<div class="\${itemClass}" \${clickAttr}>\`;
        html += \`\${indent}\${expandIcon} \${TREE_ICONS.folder} <span class="tree-name">\${node.name}</span>\`;
        if (hasChildren) {
          html += \` <span class="tree-meta">\${node.children.length} items</span>\`;
        }
        html += \`</div>\`;
        
        if (hasChildren) {
          const childrenClass = isExpanded ? 'tree-children open' : 'tree-children';
          html += \`<div class="\${childrenClass}">\`;
          node.children
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
        const sizeLabel = node.size ? formatBytes(node.size) : '';
        html += \`<div class="tree-item tree-file" title="\${currentPath}">\`;
        html += \`\${indent}<span style="width:1rem;display:inline-block"></span>\${TREE_ICONS.file} <span class="tree-name">\${node.name}</span>\`;
        if (sizeLabel) {
          html += \` <span class="tree-meta">\${sizeLabel}</span>\`;
        }
        html += \`</div>\`;
      }
      
      return html;
    }
    
    function toggleFolder(element, path) {
      if (expandedFolders.has(path)) {
        expandedFolders.delete(path);
      } else {
        expandedFolders.add(path);
      }
      refreshTree();
    }
    
    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + 'B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
      return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
    }
    
    function refreshTree() {
      fileCount = 0;
      folderCount = 0;
      // Use renderTree to generate content
      document.getElementById('fileTree').innerHTML = renderTree(fileTreeData);
      updateTreeStats();
    }
    
    function updateTreeStats() {
      const statsEl = document.querySelector('.tree-stats');
      if (statsEl) {
        statsEl.innerHTML = \`\${folderCount} 文件夹, \${fileCount} 文件\`;
      }
    }
    
    function expandAll() {
      function collectAllPaths(node, parentPath = '') {
        const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
        if (node.type === 'directory' && node.children && node.children.length > 0) {
          expandedFolders.add(currentPath);
          node.children.forEach(child => collectAllPaths(child, currentPath));
        }
      }
      collectAllPaths(fileTreeData);
      refreshTree();
    }
    
    function collapseAll() {
      expandedFolders.clear();
      refreshTree();
    }

    // ========== Init Tree ==========
    const fileTreeData = ${JSON.stringify(fileTreeData)};
    expandedFolders.add(fileTreeData.name); // Default expand root
    refreshTree();

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