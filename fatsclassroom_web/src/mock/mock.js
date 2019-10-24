import getCodeData from './apis/getcode';

const Mock = require('mockjs');

Mock.mock('/apis/getcode', 'post', getCodeData);
