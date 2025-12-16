/**
 * 版本号管理模块 v3.2.0
 * 统一管理项目版本号
 * Ω Code Agent - UI Perfectionist Edition
 */

const VERSION = '3.2.0';
const VERSION_NAME = 'Night Theme V3.2 Ω';
const RELEASE_DATE = '2025-12-16';

/**
 * 获取完整版本信息
 * @returns {object} 版本信息对象
 */
function getVersionInfo() {
  return {
    version: VERSION,
    name: VERSION_NAME,
    fullName: `v${VERSION} - ${VERSION_NAME}`,
    releaseDate: RELEASE_DATE
  };
}

/**
 * 获取版本字符串
 * @param {boolean} includeV - 是否包含 'v' 前缀
 * @returns {string} 版本字符串
 */
function getVersion(includeV = true) {
  return includeV ? `v${VERSION}` : VERSION;
}

/**
 * 获取版本号用于显示
 * @returns {string} 格式化的版本字符串
 */
function getDisplayVersion() {
  return `v${VERSION}`;
}

module.exports = {
  VERSION,
  VERSION_NAME,
  RELEASE_DATE,
  getVersionInfo,
  getVersion,
  getDisplayVersion
};