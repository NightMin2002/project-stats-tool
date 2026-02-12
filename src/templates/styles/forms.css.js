/**
 * Forms CSS Module - 表单元素样式
 * 完整的 Anti-Native 表单系统
 * 包含：Input、Textarea、Checkbox、Radio、Range、Select、Button
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.4.0
 */

module.exports = `
  /* ========================================
     BUTTONS - 按钮系统
     ======================================== */
  .btn {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--border-color);
    background: var(--glass-bg-light);
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-normal);
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    font-family: inherit;
    font-weight: 500;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* Ripple Effect Container */
  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }

  @media (hover: hover) {
    .btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--text-secondary);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    .btn:hover::before {
      width: 300px;
      height: 300px;
    }
    .btn:disabled:hover {
      background: var(--glass-bg-light);
      border-color: var(--border-color);
      box-shadow: none;
      transform: none;
    }
  }

  .btn:active {
    transform: translateY(0) scale(0.98);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  /* Button Variants */
  .btn-primary {
    background: var(--accent-secondary);
    color: var(--bg-dark);
    border: none;
    font-weight: 600;
  }

  .btn-primary:active {
    background: #00b8db;
  }

  .btn-success {
    background: var(--accent-primary);
    color: var(--bg-dark);
    border: none;
    font-weight: 600;
  }

  .btn-danger {
    background: var(--accent-danger);
    color: #fff;
    border: none;
    font-weight: 600;
  }

  .btn-ghost {
    background: transparent;
    border-color: transparent;
  }

  .btn-outline {
    background: transparent;
    border-color: var(--accent-secondary);
    color: var(--accent-secondary);
  }

  @media (hover: hover) {
    .btn-primary:hover {
      background: #33ddff;
      box-shadow: 0 0 20px rgba(0, 212, 255, 0.4);
    }
    .btn-success:hover {
      background: #33ff9f;
      box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
    }
    .btn-danger:hover {
      background: #ff6b7a;
      box-shadow: 0 0 20px rgba(255, 71, 87, 0.4);
    }
    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: transparent;
    }
    .btn-outline:hover {
      background: rgba(0, 212, 255, 0.1);
      border-color: var(--accent-secondary);
    }
  }

  /* Button Sizes */
  .btn-xs {
    padding: var(--space-xs) var(--space-sm);
    font-size: 0.75rem;
    border-radius: 4px;
  }

  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }

  .btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }

  .btn-xl {
    padding: 1rem 2rem;
    font-size: 1.125rem;
  }

  /* Icon Button */
  .btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--border-radius-sm);
  }

  .btn-icon.btn-sm {
    width: 32px;
    height: 32px;
  }

  .btn-icon.btn-lg {
    width: 48px;
    height: 48px;
  }

  /* Button Group */
  .btn-group {
    display: inline-flex;
  }

  .btn-group .btn {
    border-radius: 0;
  }

  .btn-group .btn:first-child {
    border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
  }

  .btn-group .btn:last-child {
    border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  }

  .btn-group .btn:not(:last-child) {
    border-right: none;
  }

  /* ========================================
     TEXT INPUT - 文本输入框
     ======================================== */
  .input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
  }

  .input::placeholder {
    color: var(--text-muted);
    opacity: 1;
  }

  @media (hover: hover) {
    .input:hover {
      border-color: var(--border-hover);
    }
  }

  .input:focus {
    border-color: var(--accent-secondary);
    box-shadow:
      0 0 0 3px rgba(0, 212, 255, 0.1),
      0 0 20px rgba(0, 212, 255, 0.1);
  }

  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(255, 255, 255, 0.02);
  }

  /* Input with Icon */
  .input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-group .input {
    padding-left: 2.75rem;
  }

  .input-group .input-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-muted);
    pointer-events: none;
    transition: color var(--transition-fast);
  }

  .input-group:focus-within .input-icon {
    color: var(--accent-secondary);
  }

  /* Input Variants */
  .input-error {
    border-color: var(--accent-danger);
  }

  .input-error:focus {
    border-color: var(--accent-danger);
    box-shadow:
      0 0 0 3px rgba(255, 71, 87, 0.1),
      0 0 20px rgba(255, 71, 87, 0.1);
  }

  .input-success {
    border-color: var(--accent-success);
  }

  .input-success:focus {
    border-color: var(--accent-success);
    box-shadow:
      0 0 0 3px rgba(0, 255, 136, 0.1),
      0 0 20px rgba(0, 255, 136, 0.1);
  }

  /* Input Sizes */
  .input-sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .input-lg {
    padding: 1rem 1.25rem;
    font-size: 1rem;
  }

  /* ========================================
     TEXTAREA - 文本域
     ======================================== */
  .textarea {
    width: 100%;
    min-height: 120px;
    padding: 0.75rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    line-height: 1.6;
    resize: vertical;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
  }

  .textarea::placeholder {
    color: var(--text-muted);
    opacity: 1;
  }

  @media (hover: hover) {
    .textarea:hover {
      border-color: var(--border-hover);
    }
  }

  .textarea:focus {
    border-color: var(--accent-secondary);
    box-shadow:
      0 0 0 3px rgba(0, 212, 255, 0.1),
      0 0 20px rgba(0, 212, 255, 0.1);
  }

  .textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
  }

  .textarea-auto {
    resize: none;
    overflow: hidden;
  }

  /* ========================================
     CHECKBOX - 复选框
     ======================================== */
  .checkbox {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .checkbox input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .checkbox-box {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .checkbox-box svg {
    width: 12px;
    height: 12px;
    stroke: var(--bg-dark);
    stroke-width: 3;
    fill: none;
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .checkbox:hover .checkbox-box {
      border-color: var(--accent-secondary);
    }
  }

  .checkbox input:checked + .checkbox-box {
    background: var(--accent-secondary);
    border-color: var(--accent-secondary);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  }

  .checkbox input:checked + .checkbox-box svg {
    opacity: 1;
    transform: scale(1);
  }

  .checkbox input:focus-visible + .checkbox-box {
    box-shadow:
      0 0 0 2px var(--bg-dark),
      0 0 0 4px var(--accent-secondary);
  }

  .checkbox input:disabled + .checkbox-box {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox-label {
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  /* ========================================
     RADIO - 单选按钮
     ======================================== */
  .radio {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .radio input[type="radio"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .radio-circle {
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color);
    border-radius: 50%;
    background: var(--bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .radio-circle::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--bg-dark);
    opacity: 0;
    transform: scale(0);
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .radio:hover .radio-circle {
      border-color: var(--accent-secondary);
    }
  }

  .radio input:checked + .radio-circle {
    background: var(--accent-secondary);
    border-color: var(--accent-secondary);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  }

  .radio input:checked + .radio-circle::after {
    opacity: 1;
    transform: scale(1);
  }

  .radio input:focus-visible + .radio-circle {
    box-shadow:
      0 0 0 2px var(--bg-dark),
      0 0 0 4px var(--accent-secondary);
  }

  .radio input:disabled + .radio-circle {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .radio-label {
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  /* Radio Group */
  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .radio-group-inline {
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--space-lg);
  }

  /* ========================================
     TOGGLE / SWITCH - 开关
     ======================================== */
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .toggle input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .toggle-track {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    position: relative;
    transition: all var(--transition-normal);
    flex-shrink: 0;
  }

  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--text-secondary);
    transition: all var(--transition-spring);
    box-shadow: var(--shadow-sm);
  }

  @media (hover: hover) {
    .toggle:hover .toggle-track {
      border-color: var(--border-hover);
    }
  }

  .toggle input:checked + .toggle-track {
    background: var(--accent-secondary);
    border-color: var(--accent-secondary);
  }

  .toggle input:checked + .toggle-track .toggle-thumb {
    left: 22px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .toggle input:focus-visible + .toggle-track {
    box-shadow:
      0 0 0 2px var(--bg-dark),
      0 0 0 4px var(--accent-secondary);
  }

  .toggle input:disabled + .toggle-track {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .toggle-label {
    color: var(--text-primary);
    font-size: 0.9375rem;
  }

  /* ========================================
     RANGE SLIDER - 滑块
     ======================================== */
  .range {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: var(--bg-card);
    border-radius: 3px;
    cursor: pointer;
    border: 1px solid var(--border-color);
  }

  /* Webkit (Chrome, Safari, Edge) */
  .range::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    background: linear-gradient(
      to right,
      var(--accent-secondary) var(--range-progress, 0%),
      var(--bg-darker) var(--range-progress, 0%)
    );
    border-radius: 3px;
  }

  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-secondary);
    cursor: grab;
    margin-top: -6px;
    box-shadow:
      0 0 0 3px var(--bg-dark),
      0 0 10px rgba(0, 212, 255, 0.3);
    transition: all var(--transition-fast);
  }

  @media (hover: hover) {
    .range::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow:
        0 0 0 3px var(--bg-dark),
        0 0 15px rgba(0, 212, 255, 0.5);
    }
  }

  .range::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(0.95);
  }

  /* Firefox */
  .range::-moz-range-track {
    width: 100%;
    height: 6px;
    background: var(--bg-darker);
    border-radius: 3px;
    border: none;
  }

  .range::-moz-range-progress {
    background: var(--accent-secondary);
    height: 6px;
    border-radius: 3px;
  }

  .range::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-secondary);
    cursor: grab;
    border: 3px solid var(--bg-dark);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
  }

  @media (hover: hover) {
    .range::-moz-range-thumb:hover {
      transform: scale(1.1);
    }
  }

  .range::-moz-range-thumb:active {
    cursor: grabbing;
  }

  .range:focus-visible::-webkit-slider-thumb {
    box-shadow:
      0 0 0 3px var(--bg-dark),
      0 0 0 6px var(--accent-secondary),
      0 0 15px rgba(0, 212, 255, 0.5);
  }

  .range:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .range:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
  }

  /* Range with Label */
  .range-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .range-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .range-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .range-value {
    color: var(--accent-secondary);
    font-weight: 600;
    font-size: 0.875rem;
  }

  /* ========================================
     SELECT - 下拉选择
     ======================================== */
  .select-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .select {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-sm);
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    cursor: pointer;
    transition: all var(--transition-normal);
    backdrop-filter: blur(10px);
  }

  @media (hover: hover) {
    .select:hover {
      border-color: var(--border-hover);
    }
  }

  .select:focus {
    border-color: var(--accent-secondary);
    box-shadow:
      0 0 0 3px rgba(0, 212, 255, 0.1),
      0 0 20px rgba(0, 212, 255, 0.1);
  }

  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Custom Chevron Icon */
  .select-wrapper::after {
    content: '';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid var(--text-secondary);
    pointer-events: none;
    transition: transform var(--transition-fast);
  }

  .select-wrapper:focus-within::after {
    border-top-color: var(--accent-secondary);
  }

  .select option {
    background: var(--bg-card);
    color: var(--text-primary);
    padding: 0.5rem;
  }

  /* ========================================
     FORM LAYOUT - 表单布局
     ======================================== */
  .form-group {
    margin-bottom: var(--space-lg);
  }

  .form-label {
    display: block;
    margin-bottom: var(--space-sm);
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .form-label.required::after {
    content: '*';
    color: var(--accent-danger);
    margin-left: 0.25rem;
  }

  .form-hint {
    margin-top: var(--space-xs);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .form-error {
    margin-top: var(--space-xs);
    font-size: 0.75rem;
    color: var(--accent-danger);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
  }

  .form-actions {
    display: flex;
    gap: var(--space-md);
    margin-top: var(--space-xl);
    flex-wrap: wrap;
  }

  .form-divider {
    height: 1px;
    background: var(--border-color);
    margin: var(--space-xl) 0;
  }

  /* ========================================
     SEARCH INPUT - 搜索框
     ======================================== */
  .search-input {
    position: relative;
  }

  .search-input .input {
    padding-left: 2.75rem;
    padding-right: 2.75rem;
  }

  .search-input .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
    transition: color var(--transition-fast);
  }

  .search-input:focus-within .search-icon {
    color: var(--accent-secondary);
  }

  .search-input .search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 50%;
    transition: all var(--transition-fast);
    opacity: 0;
  }

  .search-input .input:not(:placeholder-shown) ~ .search-clear {
    opacity: 1;
  }

  @media (hover: hover) {
    .search-input .search-clear:hover {
      color: var(--accent-danger);
      background: rgba(255, 71, 87, 0.1);
    }
  }

  /* ========================================
     FILE INPUT - 文件上传
     ======================================== */
  .file-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl);
    border: 2px dashed var(--border-color);
    border-radius: var(--border-radius-lg);
    background: rgba(255, 255, 255, 0.02);
    cursor: pointer;
    transition: all var(--transition-normal);
    text-align: center;
  }

  @media (hover: hover) {
    .file-input:hover {
      border-color: var(--accent-secondary);
      background: rgba(0, 212, 255, 0.05);
    }
    .file-input:hover .file-input-icon {
      color: var(--accent-secondary);
    }
  }

  .file-input.dragover {
    border-color: var(--accent-primary);
    background: rgba(0, 255, 136, 0.05);
  }

  .file-input input[type="file"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .file-input-icon {
    color: var(--text-muted);
    margin-bottom: var(--space-md);
    transition: color var(--transition-fast);
  }

  .file-input-text {
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .file-input-hint {
    color: var(--text-muted);
    font-size: 0.75rem;
    margin-top: var(--space-xs);
  }

  /* ========================================
     RESPONSIVE FORMS
     ======================================== */
  @media (max-width: 480px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions .btn {
      width: 100%;
    }

    .btn-group {
      flex-direction: column;
    }

    .btn-group .btn {
      border-radius: 0;
      border-right: 1px solid var(--border-color);
      border-bottom: none;
    }

    .btn-group .btn:first-child {
      border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
    }

    .btn-group .btn:last-child {
      border-radius: 0 0 var(--border-radius-sm) var(--border-radius-sm);
      border-bottom: 1px solid var(--border-color);
    }
  }
`;
