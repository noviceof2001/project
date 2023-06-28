// 用户信息相关的 API 都封装到这里

// 导入 request.js
import request from '@/utils/request.js'

// 向外按需导出

// 用户详情API
export const userinfoAPI = function () {
  // 返回值是一个 Promise 对象
  return request.get('/my/userinfo')
}

// 更新头像
export const updateAvatarAPI = function (avatar) {
  // 返回值是一个 Promise 对象
  return request.post('/my/update/avatar', { avatar: avatar })
}

// 更新用户兴趣爱好信息
export const updateInterestAPI = function (interest) {
  // 返回值是一个 Promise 对象
  return request.post('/my/interest', { interest: interest })
}
