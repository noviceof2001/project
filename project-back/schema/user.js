const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
// 字母开头，允许5-16字节，允许字母数字下划线
const username = joi
  .string()
  .pattern(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/)
  .required()

// 密码的验证规则
// 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间
const password = joi
  .string()
  .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/)
  .required()

// 邮箱的验证规则
// 仅支持QQ邮箱
const email = joi
  .string()
  .pattern(/^[1-9]\d{7,10}@qq\.com$/)
  .required()

// 注册时间
const time = joi.string().required()

// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();

// 兴趣
const interest = joi.string().required()

// 验证规则对象 - 注册表单
exports.reg_schema = {
  // 表示需要对 req.body 中的相应数据进行验证
  body: {
    username: username,
    password: password,
    email: email,
    regtime: time
  },
}

// 验证规则对象 - 登录表单
exports.login_schema = {
  // 表示需要对 req.body 中的相应数据进行验证
  body: {
    username: username,
    password: password,
  },
}

// 验证规则对象 - 请求验证码
exports.getCode_schema = {
  body: {
    username: username,
  },
}

// 验证规则对象 - 重置密码
exports.update_password_schema = {
  body: {
    username: username,
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    newPwd: password,
  },
}

// 验证规则对象 - 是否重名
exports.search_user_schema = {
  body: {
    username: username,
  },
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
  body: {
    avatar: avatar,
  },
};

// 验证规则对象 - 更新用户兴趣爱好信息
exports.update_interest_schema = {
  body: {
    interest: interest,
  },
};