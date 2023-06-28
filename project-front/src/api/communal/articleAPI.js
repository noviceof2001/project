// 文章列表相关的 API 都封装到这里

// 导入 request.js
import request from '@/utils/request.js'

// 向外按需导出

// 添加文章API
// 传入一个 formData 对象
export const AddArticleAPI = function (fd) {
  // 返回值是一个 Promise 对象
  return request.post('/my/article/add', fd)
}

// 所有文章列表API
export const articleListAPI = function (page, limit) {
  // 返回值是一个 Promise 对象
  return request.get('/my/article/list', {
    params: {
      page: page,
      limit: limit
    }
  })
}

// 文章详情API
export const articleDetailAPI = function (id) {
  // 返回值是一个 Promise 对象
  return request.get('/my/article/' + id)
}

// 我的文章列表API
export const myArticleListAPI = function (authorId) {
  // 返回值是一个 Promise 对象
  return request.get('/my/article/list/' + authorId)
}

// 获取包含用户兴趣的文章总数
export const articleCountAPI = function () {
  // 返回值是一个 Promise 对象
  return request.get('/my/article/count')
}
