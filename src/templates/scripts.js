/**
 * Night Theme JavaScript 逻辑模块 v2.11.0
 * 包含：图表初始化、文件树交互、粒子背景
 */

module.exports = function generateScripts(stats, fileTreeData, trendData) {
  const languageData = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count: count }));
  
  const codeDistribution = [
    { type: '代码行', value: stats.code.codeLines, color: '#00ff88' },
    { type: '注释行', value: stats.code.commentLines, color: '#00d4ff' },
    { type: '空白行', value: stats.code.blankLines, color: '#666' }
  ];
  
  const tokenDistribution = [
    { type: '中文', value: stats.tokens.breakdown.fromChinese, color: '#ff6b9d' },
    { type: '英文', value: stats.tokens.breakdown.fromEnglish, color: '#c770f0' },
    { type: '代码', value: stats.tokens.breakdown.fromCode, color: '#00d4ff' }
  ];

  return `
    // ========== 粒子背景初始化 ==========
    if (typeof particlesJS !== 'undefined' && particlesJS !== null) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ['#00ff88', '#00d4ff', '#c770f0'] },
          shape: { type: 'circle' },
          opacity: { 
            value: 0.5, 
            random: true, 
            anim: { enable: true, speed: 1, opacity_min: 0.1 } 
          },
          size: { 
            value: 3, 
            random: true, 
            anim: { enable: true, speed: 2, size_min: 0.5 } 
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#00d4ff',
            opacity: 0.2,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
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
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
    } else {
      console.info('ℹ️ particlesJS 库未加载，跳过粒子背景效果');
    }
    
    // ========== Chart.js 全局配置 ==========
    Chart.defaults.color = '#e0e0e0';
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(10, 14, 39, 0.9)';
    Chart.defaults.plugins.tooltip.titleColor = '#00ff88';
    Chart.defaults.plugins.tooltip.bodyColor = '#e0e0e0';
    Chart.defaults.plugins.tooltip.borderColor = '#00d4ff';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 12;
    
    // 动画配置
    const animationConfig = {
      duration: 1500,
      easing: 'easeInOutQuart'
    };
    
    // ========== 语言分布图 ==========
    new Chart(document.getElementById('languageChart'), {
      type: 'doughnut',
      data: {
        labels: ${JSON.stringify(languageData.map(d => d.language))},
        datasets: [{
          data: ${JSON.stringify(languageData.map(d => d.count))},
          backgroundColor: ['#00ff88', '#00d4ff', '#c770f0', '#ff6b9d', '#ffd700',
                          '#ff4757', '#5f27cd', '#00d2d3', '#ff6348', '#1e90ff']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return \`\${label}: \${value} 个 (\${percentage}%)\`;
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
          backgroundColor: ${JSON.stringify(codeDistribution.map(d => d.color))}
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return \`\${label}: \${value.toLocaleString()} 行\`;
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
          backgroundColor: ${JSON.stringify(tokenDistribution.map(d => d.color))}
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
                const value = context.parsed.y || 0;
                return \`Tokens: \${value.toLocaleString()}\`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          },
          x: { grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
      }
    });
    
    // ========== 语言代码量对比图（堆叠柱状图） ==========
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
            borderColor: '#00ff88',
            borderWidth: 1
          },
          {
            label: '注释行',
            data: languageNames.map(lang => languageStatsData[lang].commentLines),
            backgroundColor: '#00d4ff',
            borderColor: '#00d4ff',
            borderWidth: 1
          },
          {
            label: '空白行',
            data: languageNames.map(lang => languageStatsData[lang].blankLines),
            backgroundColor: '#666',
            borderColor: '#666',
            borderWidth: 1
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
          legend: {
            position: 'top',
            labels: {
              color: '#e0e0e0',
              padding: 15,
              font: { size: 13, weight: '600' },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return \`\${label}: \${value.toLocaleString()} 行\`;
              },
              footer: function(tooltipItems) {
                let total = 0;
                tooltipItems.forEach(item => {
                  total += item.parsed.y;
                });
                return '总计: ' + total.toLocaleString() + ' 行';
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              color: '#e0e0e0',
              font: { size: 11 }
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            ticks: {
              color: '#e0e0e0',
              callback: function(value) {
                return value.toLocaleString();
              }
            }
          }
        }
      }
    });
    ` : ''}
    
    // ========== 趋势图表（如果有历史数据） ==========
    ${trendData && trendData.totalLines && trendData.totalLines.length > 1 ? `
    const trendData = ${JSON.stringify(trendData)};
    
    // 趋势图通用配置
    const trendChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: animationConfig,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: function(context) {
              const item = trendData.totalLines[context[0].dataIndex];
              return item.tag ? \`\${item.label} [\${item.tag}]\` : item.label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    };
    
    // 代码行数趋势图
    new Chart(document.getElementById('trendLinesChart'), {
      type: 'line',
      data: {
        labels: trendData.totalLines.map(d => d.label),
        datasets: [{
          label: '总行数',
          data: trendData.totalLines.map(d => d.value),
          borderColor: '#00ff88',
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#00ff88',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    
    // 文件数量趋势图
    new Chart(document.getElementById('trendFilesChart'), {
      type: 'line',
      data: {
        labels: trendData.files.map(d => d.label),
        datasets: [{
          label: '文件数',
          data: trendData.files.map(d => d.value),
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#00d4ff',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    
    // Token 估算趋势图
    new Chart(document.getElementById('trendTokensChart'), {
      type: 'line',
      data: {
        labels: trendData.tokens.map(d => d.label),
        datasets: [{
          label: 'Tokens',
          data: trendData.tokens.map(d => d.value),
          borderColor: '#c770f0',
          backgroundColor: 'rgba(199, 112, 240, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#c770f0',
          pointBorderColor: '#0a0e27',
          pointBorderWidth: 2
        }]
      },
      options: trendChartOptions
    });
    ` : ''}
    
    // ========== 文件树渲染逻辑 ==========
    let expandedFolders = new Set();
    let fileCount = 0;
    let folderCount = 0;
    
    function renderTree(node, level = 0, parentPath = '') {
      if (!node) return '';
      
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      const indent = '  '.repeat(level);
      let html = '';
      
      if (node.type === 'directory') {
        folderCount++;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedFolders.has(currentPath);
        const expandIcon = hasChildren ? (isExpanded ? '▼' : '▶') : '○';
        const itemClass = hasChildren ? 'tree-folder clickable' : 'tree-folder';
        
        html += \`<div class="tree-item \${itemClass}" data-path="\${currentPath}" onclick="toggleFolder(this, '\${currentPath}')">\`;
        html += \`\${indent}\${expandIcon} 📁 \${node.name}\`;
        if (hasChildren) {
          html += \` <span class="tree-count">(\${node.children.length})</span>\`;
        }
        html += \`</div>\`;
        
        if (hasChildren) {
          const childrenClass = isExpanded ? 'tree-children expanded' : 'tree-children collapsed';
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
        const ext = node.ext || '';
        const sizeLabel = node.size ? formatBytes(node.size) : '';
        html += \`<div class="tree-item tree-file" title="\${currentPath}">\`;
        html += \`\${indent}📄 \${node.name}\`;
        if (sizeLabel) {
          html += \` <span class="tree-size">\${sizeLabel}</span>\`;
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
      document.getElementById('fileTree').innerHTML = renderTree(fileTreeData);
      updateTreeStats();
    }
    
    function updateTreeStats() {
      const statsHtml = \`<div class="tree-stats">📊 \${folderCount} 个文件夹, \${fileCount} 个文件</div>\`;
      const existingStats = document.querySelector('.tree-stats');
      if (existingStats) {
        existingStats.innerHTML = statsHtml;
      } else {
        document.getElementById('fileTree').insertAdjacentHTML('beforebegin', statsHtml);
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
    
    // ========== 初始化文件树 ==========
    const fileTreeData = ${JSON.stringify(fileTreeData)};
    
    // 默认展开根目录
    expandedFolders.add(fileTreeData.name);
    
    // 渲染树
    refreshTree();
    
    // 添加控制按钮
    const treeControls = \`
      <div class="tree-controls">
        <button onclick="expandAll()" class="tree-btn">全部展开</button>
        <button onclick="collapseAll()" class="tree-btn">全部折叠</button>
      </div>
    \`;
    document.getElementById('fileTree').insertAdjacentHTML('beforebegin', treeControls);
  `;
};