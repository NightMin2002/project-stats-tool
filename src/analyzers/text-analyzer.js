/**
 * 文本分析模块
 * 提供中文字符、英文单词统计功能
 */

/**
 * 统计中文字符数
 * @param {string} text - 文本内容
 * @returns {number} 中文字符数量
 */
function countChineseChars(text) {
  const chineseRegex = /[\u4e00-\u9fa5]/g;
  const matches = text.match(chineseRegex);
  return matches ? matches.length : 0;
}

/**
 * 统计英文单词数
 * @param {string} text - 文本内容
 * @returns {number} 英文单词数量
 */
function countEnglishWords(text) {
  const textWithoutChinese = text.replace(/[\u4e00-\u9fa5]/g, ' ');
  const words = textWithoutChinese.match(/\b[a-zA-Z]+\b/g);
  return words ? words.length : 0;
}

module.exports = {
  countChineseChars,
  countEnglishWords
};