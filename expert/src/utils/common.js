export default function urlAddParams(url, params) {
  /* eslint-disable */
  let tmp = '';
  if (params) {
    for (let i in params) {
      tmp += i + '=' + params[i] + '&';
    }
    tmp = url + '?' + tmp.substr(0, tmp.length - 1);
  } else {
    tmp = url;
  }
  return tmp;
  /* eslint-enable */
}
