import axios from '@/api/axios';
import urlAddParams from '@/utils/common';

const BASE_URL = '/fatsapi/fats-expert';

export function getHeadInfo(params) {
  // 获取咨询管理列表数据
  const url = `${BASE_URL}/expert/headInfo`;
  let wanzhengUrl = urlAddParams(url, params);
  return axios.get(wanzhengUrl);
}

export function getIMList(params) {
  // 获取咨询管理列表数据
  const url = `${BASE_URL}/expert/getIMListByCondition`;
  let wanzhengUrl = urlAddParams(url, params);
  return axios.get(wanzhengUrl);
}

export function getAssList(params) {
  // 获取模块信息
  const url = `${BASE_URL}/expert/getEvaluateByCondition`;
  return axios.post(url, params || {});
}
