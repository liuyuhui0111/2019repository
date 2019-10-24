import axios from '@/api/axios';
// 模块内接口  接口命名规范 API+From+模块名称
const BASE_URL = '/fatsapi/tax';
export function showFoucusPicFromDemo(params) {
  // 获取模块信息
  const url = '/fatscourse/offlineUnLogin/showFoucusPic';
  return axios.post(url, params || {});
}

export function getSourceDataFromDemo(params) {
  // 获取模块信息
  const url = `${BASE_URL}/fatscourse/source-web/getSourceData`;
  return axios.post(url, params || {});
}
