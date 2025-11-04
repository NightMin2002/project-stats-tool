/**
 * 版本号管理模块
 * 统一管理项目版本号
 */

const VERSION = '2.12.0';
const VERSION_NAME = '性能与功能增强版';

/**
 * 获取完整版本信息
 * @returns {object} 版本信息对象
 */
function getVersionInfo() {
  return {
    version: VERSION,
    name: VERSION_NAME,
    fullName: `v${VERSION} - ${VERSION_NAME}`,
    releaseDate: '2025-11-04'
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
  getVersionInfo,
  getVersion,
  getDisplayVersion
};