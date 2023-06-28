// 文章分类相关的 API 都封装到这里

// 导入 request.js
import request from '@/utils/request.js'

// 向外按需导出

// 文章分类API
export const getArticleCateAPI = function () {
  // 返回值是一个 Promise 对象
  return request.get('/my/article/cates')
}
