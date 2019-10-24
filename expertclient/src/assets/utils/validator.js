function validByPhone(phone) {
  // 校验手机号
  const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(phone)) {
    return false;
  }
  return true;
}
function validByTel(value) {
  // 校验手机固定电话
  let isPhone = /^(0[0-9]{2,3}[-|\s]?)?[0-9]{7,8}$/;
  // let isPhone = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  let isMob = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (isMob.test(value) || isPhone.test(value)) {
    return true;
  }

  return false;
}

function validByBankNo(value) {
  // 校验银行卡号
  let isBankNo = /^\d{13,19}$/;
  if (isBankNo.test(value)) {
    return true;
  }

  console.log(isBankNo.test(value));

  return false;
}


function validByEmail(email) {
  // 判断用户输入的电子邮箱格式是否正确
  const myreg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-]+\.)+(com|cn|net|org)$/;
  if (!myreg.test(email)) {
    return false;
  }
  return true;
}

function validByName(name) {
  // 校验手机号
  const myreg = /^[1][1,2,3,4,5,6,7,8,9,0][0-9]{9}$/;
  if (!myreg.test(name)) {
    return false;
  }
  return true;
}

function validByPersonNo(name) {
  // 纳税人识别号
  /*eslint-disable*/ 
  const myreg =  /^([0-9A-Za-z]{15}|[0-9A-Za-z]{17}|[0-9A-Za-z]{18}|[0-9A-Za-z]{20})$/
  /* eslint-enable */
  if (!myreg.test(name)) {
    return false;
  }
  return true;
}

export {
  validByPhone,
  validByName,
  validByEmail,
  validByTel,
  validByBankNo,
  validByPersonNo,
};
