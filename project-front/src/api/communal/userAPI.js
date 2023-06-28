// 用户登录注册相关的 API 都封装到这里

// 导入 request.js
import request from '@/utils/request.js'

// 向外按需导出

// 注册API
export const regUserAPI = function (username, password, email, time) {
  // 返回值是一个 Promise 对象
  return request.post('/api/reguser', {
    username: username,
    password: password,
    email: email,
    regtime: time
  })
}

// 登录API
export const loginAPI = function (username, password) {
  // 返回值是一个 Promise 对象
  return request.post('/api/login', {
    username: username,
    password: password
  })
}

// 获取验证码
export const codeAPI = function (username) {
  // 返回值是一个 Promise 对象
  return request.post('/api/code', {
    username: username
  })
}

// 重置密码
export const resetPasswordAPI = function (username, password) {
  // 返回值是一个 Promise 对象
  return request.post('/api/updatepwd', {
    username: username,
    newPwd: password
  })
}

// 是否重名
export const haveUserAPI = function (username) {
  // 返回值是一个 Promise 对象
  return request.post('/api/haveuser', {
    username: username
  })
}
