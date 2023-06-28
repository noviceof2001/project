// 搜索相关的 API 都封装到这里

// 导入 request.js
import request from '@/utils/request.js'

// 向外按需导出

// 通过 作者名 获取文章列表
export const getListByAuthorName = function (authorName) {
  // 返回值是一个 Promise 对象
  return request.get('/search/name/' + authorName)
}

// 通过 分类名 获取文章列表
export const getListByCate = function (cate) {
  // 返回值是一个 Promise 对象
  return request.get('/search/cate/' + cate)
}

// 通过 内容 模糊获取文章列表
export const getListByContent = function (content) {
  // 返回值是一个 Promise 对象
  return request.get('/search/content/' + content)
}
