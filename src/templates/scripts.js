/**
 * Night Theme JavaScript 逻辑模块
 * CSS 变量颜色、图表联动、表格排序、Treemap、双视图切换
 * Ω Code Agent - UI Perfectionist Edition
 */

// 构建语言 → 扩展名映射（用于图表联动）
let langExtMap = {};
try {
  const { LANGUAGE_MAP } = require('../config');
  for (const [ext, lang] of Object.entries(LANGUAGE_MAP)) {
    if (!langExtMap[lang]) langExtMap[lang] = [];
    langExtMap[lang].push(ext);
  }
} catch (e) { /* fallback: 联动时不高亮文件树 */ }

module.exports = function generateScripts(stats, fileTreeData, trendData) {
  const languageData = Object.entries(stats.files.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]) => ({ language: lang, count: count }));

  // 预构建代码行数据（用于语言图切换）
  const langStatsObj = stats.languageStats || {};
  const codeLinesData = Object.entries(langStatsObj)
    .sort((a, b) => b[1].codeLines - a[1].codeLines)
    .map(([lang, data]) => ({ language: lang, count: data.codeLines }));

  return `
    // ========== CSS Variable Colors ==========
    const _cs = getComputedStyle(document.documentElement);
    const _cv = (n) => _cs.getPropertyValue(n).trim();
    const COLORS = {
      primary: _cv('--accent-primary') || '#00ff88',
      secondary: _cv('--accent-secondary') || '#00d4ff',
      tertiary: _cv('--accent-tertiary') || '#c770f0',
      quaternary: _cv('--accent-quaternary') || '#ff6b9d',
      warning: _cv('--accent-warning') || '#ffd700',
      danger: _cv('--accent-danger') || '#ff4757',
      muted: _cv('--text-secondary') || '#94a3b8',
      text: _cv('--text-primary') || '#e0e0e0',
      bgDark: _cv('--bg-dark') || '#0a0e27',
      bgCard: _cv('--bg-card') || '#121830'
    };
    const CHART_PALETTE = [
      COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary, COLORS.warning,
      COLORS.danger, '#5f27cd', '#00d2d3', '#ff6348', '#1e90ff'
    ];

    // ========== Utility ==========
    function _esc(s) {
      return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ========== 粒子背景初始化 ==========
    if (typeof particlesJS !== 'undefined' && particlesJS !== null) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 60, density: { enable: true, value_area: 800 } },
          color: { value: [COLORS.primary, COLORS.secondary, COLORS.tertiary] },
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
            color: COLORS.secondary,
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
    Chart.defaults.color = COLORS.muted;
    Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
    Chart.defaults.font.family = "'Inter', sans-serif";

    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 24, 48, 0.95)';
    Chart.defaults.plugins.tooltip.titleColor = COLORS.text;
    Chart.defaults.plugins.tooltip.bodyColor = COLORS.muted;
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(0, 212, 255, 0.2)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleFont = { size: 14, weight: '600' };

    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
    Chart.defaults.plugins.legend.labels.padding = 20;

    const animationConfig = {
      duration: 1200,
      easing: 'easeOutQuart'
    };

    // ========== 语言分布图（双视图） ==========
    const fileCountData = ${JSON.stringify(languageData)};
    const codeLinesViewData = ${JSON.stringify(codeLinesData)};

    const langChartInstance = new Chart(document.getElementById('languageChart'), {
      type: 'doughnut',
      data: {
        labels: fileCountData.map(d => d.language),
        datasets: [{
          data: fileCountData.map(d => d.count),
          backgroundColor: CHART_PALETTE,
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        layout: { padding: 20 },
        animation: animationConfig,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: COLORS.text }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return \` \${context.label}: \${value.toLocaleString()} 个 (\${percentage}%)\`;
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length === 0) {
            clearChartHighlights();
            return;
          }
          const index = elements[0].index;
          const selectedLang = langChartInstance.data.labels[index];
          highlightLanguageInTree(selectedLang);
          scrollToLanguageRow(selectedLang);
        }
      }
    });

    // ========== 语言图切换逻辑 ==========
    const langToggle = document.getElementById('langChartToggle');
    let currentLangMode = 'files';
    if (langToggle) {
      langToggle.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-mode]');
        if (!btn) return;
        const mode = btn.dataset.mode;
        if (mode === currentLangMode) return;
        currentLangMode = mode;

        langToggle.querySelectorAll('.btn').forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');

        const data = mode === 'codeLines' ? codeLinesViewData : fileCountData;
        langChartInstance.data.labels = data.map(d => d.language);
        langChartInstance.data.datasets[0].data = data.map(d => d.count);

        langChartInstance.options.plugins.tooltip.callbacks.label = function(context) {
          const value = context.parsed || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          const unit = mode === 'codeLines' ? '行' : '个';
          return \` \${context.label}: \${value.toLocaleString()} \${unit} (\${percentage}%)\`;
        };

        langChartInstance.update('active');
      });
    }

    // ========== 代码组成图 ==========
    new Chart(document.getElementById('codeChart'), {
      type: 'pie',
      data: {
        labels: ${JSON.stringify(['代码行', '注释行', '空白行'])},
        datasets: [{
          data: ${JSON.stringify([stats.code.codeLines, stats.code.commentLines, stats.code.blankLines])},
          backgroundColor: [COLORS.primary, COLORS.secondary, 'rgba(255,255,255,0.3)'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 20 },
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
        labels: ${JSON.stringify(['中文', '英文', '代码'])},
        datasets: [{
          label: 'Tokens',
          data: ${JSON.stringify([stats.tokens.breakdown.fromChinese, stats.tokens.breakdown.fromEnglish, stats.tokens.breakdown.fromCode])},
          backgroundColor: [COLORS.quaternary, COLORS.tertiary, COLORS.secondary],
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
            backgroundColor: COLORS.primary,
            stack: 'Stack 0',
            borderRadius: 4
          },
          {
            label: '注释行',
            data: languageNames.map(lang => languageStatsData[lang].commentLines),
            backgroundColor: COLORS.secondary,
            stack: 'Stack 0',
            borderRadius: 4
          },
          {
            label: '空白行',
            data: languageNames.map(lang => languageStatsData[lang].blankLines),
            backgroundColor: 'rgba(255,255,255,0.3)',
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

    // ========== 趋势图表（4 维度） ==========
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
              return item && item.tag ? \`\${item.label} #\${item.tag}\` : (item ? item.label : '');
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

    ['trendLinesChart', 'trendCodeLinesChart', 'trendFilesChart', 'trendTokensChart'].forEach((id, idx) => {
      const dataKey = ['totalLines', 'codeLines', 'files', 'tokens'][idx];
      const color = [COLORS.primary, COLORS.quaternary, COLORS.secondary, COLORS.tertiary][idx];

      if (!trendData[dataKey] || trendData[dataKey].length < 2) return;
      const el = document.getElementById(id);
      if (!el) return;

      new Chart(el, {
        type: 'line',
        data: {
          labels: trendData[dataKey].map(d => d.label),
          datasets: [{
            data: trendData[dataKey].map(d => d.value),
            borderColor: color,
            backgroundColor: color + '20',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: COLORS.bgDark,
            pointBorderColor: color,
            pointBorderWidth: 2
          }]
        },
        options: trendChartOptions
      });
    });
    ` : ''}

    // ========== 图表联动 ==========
    const langExtMap = ${JSON.stringify(langExtMap)};

    function highlightLanguageInTree(lang) {
      const exts = langExtMap[lang] || [];
      clearChartHighlights();
      if (exts.length === 0) return;

      // 先展开所有目录使文件可见
      expandAll();

      document.querySelectorAll('.tree-file').forEach(el => {
        const path = (el.dataset.path || '').toLowerCase();
        const dotIdx = path.lastIndexOf('.');
        if (dotIdx === -1) return;
        const ext = path.substring(dotIdx);
        if (exts.includes(ext)) {
          el.classList.add('chart-highlight');
        }
      });
    }

    function scrollToLanguageRow(lang) {
      const row = document.querySelector('tr[data-lang="' + _esc(lang) + '"]');
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('row-highlight');
        setTimeout(() => row.classList.remove('row-highlight'), 2000);
      }
    }

    function clearChartHighlights() {
      document.querySelectorAll('.chart-highlight').forEach(el => el.classList.remove('chart-highlight'));
    }

    // ========== 表格排序 ==========
    const langTable = document.getElementById('langStatsTable');
    if (langTable) {
      let currentSort = { col: null, asc: true };

      langTable.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
          const col = th.dataset.sort;
          const isNum = th.dataset.type === 'number';

          if (currentSort.col === col) {
            currentSort.asc = !currentSort.asc;
          } else {
            currentSort.col = col;
            currentSort.asc = isNum ? false : true;
          }

          langTable.querySelectorAll('th.sortable').forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
          th.classList.add(currentSort.asc ? 'sort-asc' : 'sort-desc');

          const tbody = langTable.querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));

          rows.sort((a, b) => {
            if (col === 'lang') {
              const va = a.dataset.lang || '';
              const vb = b.dataset.lang || '';
              return currentSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
            }
            const va = parseFloat(a.dataset[col] || 0);
            const vb = parseFloat(b.dataset[col] || 0);
            return currentSort.asc ? va - vb : vb - va;
          });

          rows.forEach(row => tbody.appendChild(row));
        });
      });
    }

    // ========== 文件树逻辑 (V3.4 增强版) ==========

    const TREE_ICONS = {
      folder: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor"/></svg>\`,
      folderOpen: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" fill="currentColor"/></svg>\`,
      file: \`<svg class="tree-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor"/></svg>\`,
      arrowRight: \`<svg class="icon icon-sm tree-arrow" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/></svg>\`,
      arrowDown: \`<svg class="icon icon-sm tree-arrow" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17 16.59 8.59 18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/></svg>\`,
      dot: \`<svg class="icon icon-sm" viewBox="0 0 24 24" style="opacity: 0.3;"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>\`,
      copy: \`<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"/></svg>\`
    };

    const FILE_COLORS = {
      '.js': '#f7df1e', '.mjs': '#f7df1e', '.cjs': '#f7df1e', '.jsx': '#61dafb',
      '.ts': '#3178c6', '.tsx': '#3178c6',
      '.html': '#e34c26', '.htm': '#e34c26', '.css': '#264de4',
      '.scss': '#cc6699', '.sass': '#cc6699', '.less': '#1d365d',
      '.vue': '#42b883', '.svelte': '#ff3e00',
      '.py': '#3776ab', '.rb': '#cc342d', '.php': '#777bb4',
      '.java': '#b07219', '.go': '#00add8', '.rs': '#dea584',
      '.c': '#555555', '.cpp': '#f34b7d', '.h': '#555555', '.cs': '#178600',
      '.json': '#cbcb41', '.yaml': '#cb171e', '.yml': '#cb171e',
      '.xml': '#0060ac', '.toml': '#9c4121', '.ini': '#d1dbe0', '.env': '#ecd53f',
      '.md': '#083fa1', '.mdx': '#fcb32c', '.txt': '#89e051', '.rst': '#141414',
      '.sh': '#89e051', '.bash': '#89e051', '.zsh': '#89e051',
      '.bat': '#c1f12e', '.ps1': '#012456',
      '.svg': '#ffb13b', '.png': '#a074c4', '.jpg': '#a074c4',
      '.jpeg': '#a074c4', '.gif': '#a074c4', '.ico': '#a074c4', '.webp': '#a074c4',
      '.sql': '#e38c00', '.graphql': '#e10098', '.dockerfile': '#384d54', '.lock': '#89e051',
      'default': '#94a3b8'
    };

    function getFileColor(ext) {
      return FILE_COLORS[ext.toLowerCase()] || FILE_COLORS['default'];
    }

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
    let allFilePaths = [];

    function calculateMaxFileSize(node) {
      if (!node) return 0;
      if (node.type === 'file') return node.size || 0;
      if (node.children) {
        return Math.max(...node.children.map(calculateMaxFileSize), 0);
      }
      return 0;
    }

    function collectAllPaths(node, parentPath = '') {
      if (!node) return;
      const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
      allFilePaths.push({ path: currentPath, type: node.type, name: node.name });
      if (node.children) {
        node.children.forEach(child => collectAllPaths(child, currentPath));
      }
    }

    function matchesSearch(name, path) {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return name.toLowerCase().includes(query) || path.toLowerCase().includes(query);
    }

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
      const indent = \`<span style="display:inline-block; width:\${level * 1.5}rem"></span>\`;
      let html = '';

      if (searchQuery && !nodeOrChildrenMatch(node, parentPath.replace(node.name, '').replace(/\\/$/, ''))) {
        return '';
      }

      if (node.type === 'directory') {
        folderCount++;
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedFolders.has(currentPath) || (searchQuery && hasChildren);

        let totalFiles = 0;
        let totalSize = 0;
        function countChildren(n) {
          if (n.type === 'file') { totalFiles++; totalSize += n.size || 0; }
          if (n.children) n.children.forEach(countChildren);
        }
        if (node.children) node.children.forEach(countChildren);

        const expandIcon = hasChildren
          ? (isExpanded ? TREE_ICONS.arrowDown : TREE_ICONS.arrowRight)
          : TREE_ICONS.dot;
        const folderIcon = isExpanded ? TREE_ICONS.folderOpen : TREE_ICONS.folder;

        const itemClass = hasChildren ? 'tree-folder tree-item' : 'tree-folder tree-item disabled';
        const clickAttr = hasChildren ? 'onclick="toggleFolder(event, this.dataset.path)"' : '';

        const displayName = searchQuery
          ? highlightMatch(node.name, searchQuery)
          : _esc(node.name);

        html += \`<div class="\${itemClass}" \${clickAttr} data-path="\${_esc(currentPath)}" data-expanded="\${isExpanded}">\`;
        html += \`\${indent}<span class="tree-expand-icon">\${expandIcon}</span> \${folderIcon} <span class="tree-name">\${displayName}</span>\`;
        if (hasChildren) {
          html += \` <span class="tree-meta">\${node.children.length} 项 · \${formatBytes(totalSize)}</span>\`;
        }
        html += '</div>';

        if (hasChildren) {
          const childrenClass = isExpanded ? 'tree-children open' : 'tree-children';
          html += \`<div class="\${childrenClass}" data-parent="\${_esc(currentPath)}">\`;
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

        const displayName = searchQuery
          ? highlightMatch(node.name, searchQuery)
          : _esc(node.name);

        html += \`<div class="tree-item tree-file" data-path="\${_esc(currentPath)}" data-tooltip="\${_esc(currentPath)}" ondblclick="copyPath(event, this.dataset.path)">\`;
        html += \`\${indent}<span style="width:1rem;display:inline-block"></span>\`;
        html += \`<span style="color: \${fileColor}">\${TREE_ICONS.file}</span>\`;
        html += \` <span class="tree-name">\${displayName}</span>\`;
        if (sizeLabel) {
          html += \` <span class="tree-meta \${sizeClass}">\${sizeLabel}</span>\`;
        }
        html += '</div>';
      }

      return html;
    }

    function toggleFolder(event, path) {
      event.stopPropagation();

      const folderEl = event.currentTarget;
      const childrenEl = folderEl.nextElementSibling;
      const iconEl = folderEl.querySelector('.tree-expand-icon');

      if (!childrenEl || !childrenEl.classList.contains('tree-children')) return;

      const isExpanded = expandedFolders.has(path);

      if (isExpanded) {
        expandedFolders.delete(path);
        childrenEl.classList.remove('open');
        folderEl.setAttribute('data-expanded', 'false');
        if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowRight;
      } else {
        expandedFolders.add(path);
        childrenEl.classList.add('open');
        folderEl.setAttribute('data-expanded', 'true');
        if (iconEl) iconEl.innerHTML = TREE_ICONS.arrowDown;
      }
    }

    function formatBytes(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function highlightMatch(text, query) {
      const safe = _esc(text);
      if (!query) return safe;
      const regex = new RegExp(\`(\${query.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&')})\`, 'gi');
      return safe.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    function copyPath(event, path) {
      event.stopPropagation();
      navigator.clipboard.writeText(path).then(() => {
        showToast('已复制路径: ' + path);
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = path;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('已复制路径: ' + path);
      });
    }

    function showToast(message) {
      const existingToast = document.querySelector('.tree-toast');
      if (existingToast) existingToast.remove();

      const toast = document.createElement('div');
      toast.className = 'tree-toast animate-fade-in-up';
      toast.innerHTML = \`
        <span class="toast-icon">\${TREE_ICONS.copy}</span>
        <span class="toast-message">\${_esc(message)}</span>
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

    function handleSearch(query) {
      searchQuery = query.trim();

      if (searchQuery) {
        expandedFolders.clear();
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

      const statsEl = document.querySelector('.tree-stats');
      if (statsEl && searchQuery) {
        statsEl.innerHTML = \`搜索 "\${_esc(searchQuery)}": \${folderCount} 文件夹, \${fileCount} 文件匹配\`;
      }
    }

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
      function collectAllPaths(node, parentPath = '') {
        const currentPath = parentPath ? \`\${parentPath}/\${node.name}\` : node.name;
        if (node.type === 'directory' && node.children && node.children.length > 0) {
          expandedFolders.add(currentPath);
          node.children.forEach(child => collectAllPaths(child, currentPath));
        }
      }
      collectAllPaths(fileTreeData);

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
      expandedFolders.add(fileTreeData.name);

      document.querySelectorAll('.tree-children').forEach((el, index) => {
        if (index === 0) {
          el.classList.add('open');
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
    expandedFolders.add(fileTreeData.name);
    refreshTree();

    const searchInput = document.getElementById('treeSearchInput');
    const searchClearBtn = document.getElementById('treeSearchClear');

    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          handleSearch(e.target.value);
        }, 200);

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
        comparisonToggleBtn.style.opacity = comparisonVisible ? '1' : '0.7';
      });
    }
  `;
};
