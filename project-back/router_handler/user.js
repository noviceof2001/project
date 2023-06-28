/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs
const bcrypt = require('bcryptjs')
// 导入 jsonwebtoken 包
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件 密钥
const config = require('../config')
// 引入nodemailer模块
const nodemailer = require('nodemailer')

var smtpTransport = require('nodemailer-smtp-transport')
var wellknown = require('nodemailer-wellknown')
var emailConfig = wellknown('QQ')

// 注册用户的处理函数
exports.regUser = function (req, res) {
  // 接收表单数据
  const userinfo = req.body
  // console.log(userinfo);
  // 定义查询 SQL 语句
  const sqlStr1 = 'select * from userdetail where username=?'
  // 执行 SQL 语句并根据结果判断用户名是否被占用
  db.query(sqlStr1, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      // return res.cc({ status: 1, message: err.message });
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: "用户名被占用,请更换其他用户名!" });
      return res.cc('用户名被占用,请更换其他用户名!')
    }
    // 调用 bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 定义添加 SQL 语句
    const sqlStr2 = 'insert into userdetail set ?'
    // 执行 SQL 语句并根据结果判断用户是否注册成功
    console.log()
    db.query(
      sqlStr2,
      {
        username: userinfo.username,
        password: userinfo.password,
        email: userinfo.email,
        regtime: userinfo.regtime
      },
      function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
          // return res.send({ status: 1, message: err.message });
          return res.cc(err)
        }
        // SQL 语句执行成功，但影响行数不为 1
        if (results.affectedRows !== 1) {
          // return res.send({ status: 1, message: "注册用户失败,请稍后再试!" });
          return res.cc('注册用户失败,请稍后再试!')
        }
        // 注册成功
        // res.send({ status: 0, message: "注册成功!" });
        res.cc('注册成功!', 0)
      }
    )
  })
}

// 登录的处理函数
exports.login = function (req, res) {
  // 接收表单数据
  const userinfo = req.body
  // console.log(userinfo);
  // 定义查询 SQL 语
  const sql = 'select * from userdetail where username=?'
  // 执行 SQL 语句，查询用户的数据
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) {
      return res.cc('登录失败！')
    }
    // 判断用户输入的登录密码是否和数据库中的密码一致
    // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
    // 返回值是布尔值（true一致、false不一致）
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    )
    // console.log(compareResult)
    // 如果对比的结果等于 false, 则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }
    // 通过 ES6 的高级语法，快速剔除 密码 、 头像 、QQ邮箱、注册时间 的值
    // 剔除完毕之后，user 中只保留了用户的 id, username 这2个属性的值
    const user = { ...results[0], password: '', avatar: '' }
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    })
    res.send({
      status: 0,
      message: '登录成功!',
      // 0不是管理员,1是管理员
      flag: results[0].status,
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr,
    })
  })
}

// 获取验证码

// 3217538338@qq.com
// 3304796420@qq.com

emailConfig.auth = {
  user: '3217538338@qq.com', // 我的QQ邮箱网址
  pass: 'onohucewywhzdggi', // QQ邮箱此处使用授权码
}
var transporter = nodemailer.createTransport(smtpTransport(emailConfig))
exports.code = function (req, res) {
  // 准备4位数的验证码
  let num = ''
  for (let i = 0; i < 4; i++) {
    num += Math.floor(Math.random() * 10)
  }
  let text = `验证码：${num}`
  // 接收表单数据
  const userinfo = req.body
  // 定义查询 SQL 语
  const sql = 'select email from userdetail where username=?'
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    // console.log(results[0].email)
    const qqEmail = results[0].email
    var mailOptions = {
      from: '3217538338@qq.com', // 我的QQ邮箱网址，必须与上面配置一致
      to: qqEmail,
      subject: '验证码',
      text: text,
    }
    transporter.sendMail(mailOptions)
    res.send({
      status: 0,
      data: num,
    })
  })
}

// 重置密码的处理函数
exports.updatePassword = function (req, res) {
  // 接收表单数据
  const userinfo = req.body
  // 定义根据 id 查询用户数据的 SQL 语句
  const sqlStr1 = 'select * from userdetail where username=?'
  // 执行 SQL 语句查询用户是否存在
  db.query(sqlStr1, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err)
    }
    // 检查指定 id 的用户是否存在
    if (results.length !== 1) {
      return res.cc('用户不存在!')
    }
    // 定义更新用户密码的 SQL 语句
    const sqlStr2 = 'update userdetail set password=? where username=?'
    // 对新密码进行 bcrypt 加密处理
    const newPwd = bcrypt.hashSync(userinfo.newPwd, 10)
    // 执行 SQL 语句，根据 id 更新用户的密码
    db.query(sqlStr2, [newPwd, userinfo.username], function (err, results) {
      // SQL 语句执行失败
      if (err) {
        return res.cc(err)
      }
      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) {
        return res.cc('更新密码失败！')
      }
      // 更新密码成功
      res.cc('更新密码成功！', 0)
    })
  })
}

// 查询是否重名的处理函数
exports.searchUser = function (req, res) {
  // 接收表单数据
  const userinfo = req.body
  // 定义查询 SQL 语句
  const sqlStr1 = 'select * from userdetail where username=?'
  // 执行 SQL 语句并根据结果判断用户名是否被占用
  db.query(sqlStr1, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      // return res.cc({ status: 1, message: err.message });
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 0, message: "用户名被占用,请更换其他用户名!" });
      return res.cc('用户名被占用,请更换其他用户名!', 0)
    } else {
      // return res.send({ status: 1, message: "用户名不存在" });
      return res.cc('用户名不存在', 1)
    }
  })
}
