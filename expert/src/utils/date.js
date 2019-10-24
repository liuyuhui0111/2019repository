/* eslint-disable */
function padLeftZero(str) {
  return str < 10 ? `0${str}` : str;
}
export default function formatDate(date, fmt) {
  if (/^[\d\-]+T[\d\:]+(\.\d{1,3})?\+0000$/.test(date)) {
    date = date.replace('+0000', 'Z'); // +0000和Z都代表0时区，+0000在IE不识别，替换为Z
    date = +new Date(date);
  }
  let formatDate = isNaN(date) ? date : '';
  if (!isNaN(date)) {
    date = new Date(date);
    formatDate = fmt;
    let o = {
      'y+': date.getFullYear(),
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    };
    for (let k in o) {
      if ((new RegExp(`(${k})`)).test(formatDate)) {
        formatDate = formatDate.replace(RegExp.$1,
          (RegExp.$1.length === 1) ? o[k] : padLeftZero(o[k]));
      }
    }
  }
  return formatDate;
}
