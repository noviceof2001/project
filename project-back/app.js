const express = require('express')
const app = express()
const path = require('path')

const joi = require('joi')

// 托管静态资源
app.use('/uploads', express.static('uploads'))

// 解决跨域问题
const cors = require('cors')
app.use(cors())


// 解析 json 格式数据
app.use(express.json({ limit: '5MB' }))
// 只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ limit: '5MB', extended: false }))

// 注意:使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据

// 响应数据的中间件
app.use(function (req, res, next) {
  // status = 0 为成功; status = 1 为失败;
  // 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status: status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 导入配置文件
const config = require('./config')
// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] })
)

// 注意：除了以 /api 开头的接口，都是有权限的接口，需要进行 Token 身份认证

// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// 导入并使用文章分类路由模块
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

// 导入并使用文章路由模块
const articleRouter = require('./router/article')
// 为文章的路由挂载统一的访问前缀 /my/article
app.use('/my/article', articleRouter)

// 导入并使用搜索路由模块
const searchRouter = require('./router/search')
app.use('/search', searchRouter)

// 定义全局错误级别中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败！')
  }
  // 未知错误
  res.cc(err)
})

app.listen(80, () => {
  console.log('Running at http://127.0.0.1')
})
