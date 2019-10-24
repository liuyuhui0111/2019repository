import axios from '@/api/axios';
import urlAddParams from '@/utils/common';

const BASE_URL = '/fatsapi/fats-expert';

export function getEvaluate(params) {
  // 获取咨询管理列表数据
  const url = `${BASE_URL}/expert/getEvaluateByCondition`;
  let wanzhengUrl = urlAddParams(url, params);
  return axios.get(wanzhengUrl);
}
export function getEvaluat(params) {
  // 获取咨询管理列表数据
  const url = `${BASE_URL}/expert/getEvaluateByQuestionId`;
  let wanzhengUrl = urlAddParams(url, params);
  return axios.get(wanzhengUrl);
}
