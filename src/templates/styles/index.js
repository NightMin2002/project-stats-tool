/**
 * Styles Entry Point - 样式模块合并入口
 * 将所有拆分的 CSS 模块合并为一个完整的样式字符串
 * Ω Code Agent - UI Perfectionist Edition
 * @version 3.3.0
 */

const baseStyles = require('./base.css.js');
const layoutStyles = require('./layout.css.js');
const componentsStyles = require('./components.css.js');
const animationsStyles = require('./animations.css.js');
const formsStyles = require('./forms.css.js');
const utilitiesStyles = require('./utilities.css.js');

/**
 * 合并所有样式模块
 * 顺序很重要：Base → Layout → Components → Animations → Forms → Utilities
 * 后面的样式可以覆盖前面的
 */
const styles = [
  baseStyles,      // CSS 变量、Reset、基础排版
  animationsStyles, // 动画定义（需要在组件之前加载）
  layoutStyles,    // 布局系统、Grid、容器
  componentsStyles, // UI 组件样式
  formsStyles,     // 表单元素样式
  utilitiesStyles  // 工具类（最后加载，可覆盖其他）
].join('\n');

module.exports = styles;