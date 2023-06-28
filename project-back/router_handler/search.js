// 导入数据库操作模块
const { request } = require("express");
const db = require("../db/index");

// 根据 作者名 获取文章列表
exports.getListBy_authorname = function (req, res) {
  // 先判断 作者名 存不存在
  const sql = 'select username from userdetail'
  db.query(sql, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取 作者名列表 成功
    let flag = 0
    for (let i = 0; i < results.length; i++) {
      if (results[i].username === req.params.author_name) {
        flag = 1
      }
    }
    if (flag === 1) {
      // console.log(req.params.author_name)
      const sql1 = 'select id from userdetail where username=?'
      db.query(sql1, req.params.author_name, function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
          return res.cc(err);
        }
        // console.log(results[0].id)
        // 获取 id 成功
        const sql2 = 'select * from article where author_id=? and is_delete=0 order by id desc'
        db.query(sql2, results[0].id, function (err, results) {
          // 执行 SQL 语句失败
          if (err) {
            return res.cc(err);
          }
          // 获取 文章列表 成功
          res.send({
            status: 0,
            message: "获取文章成功!",
            data: results,
          });
        })
      })
    } else {
      res.send({
        status: 1,
        message: "该作者不存在"
      });
    }
  })
}

// 根据 分类名 获取文章列表
exports.getListBy_cate = function (req, res) {
  // 先判断 分类名 存不存在
  const sql = 'select name from article_cate'
  db.query(sql, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取 分类名列表 成功
    let flag = 0
    for (let i = 0; i < results.length; i++) {
      if (results[i].name === req.params.cate) {
        flag = 1
      }
    }
    if (flag === 1) {
      // 根据 分类名 获取 分类id
      const sql1 = 'select id from article_cate where name=?'
      db.query(sql1, req.params.cate, function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
          return res.cc(err);
        }
        // 获取 分类id 成功
        const sql2 = 'select * from article where cate_id=? and is_delete=0 order by id desc'
        db.query(sql2, results[0].id, function (err, results) {
          // 执行 SQL 语句失败
          if (err) {
            return res.cc(err);
          }
          // 获取 文章列表 成功
          res.send({
            status: 0,
            message: "获取文章成功!",
            data: results,
          });
        })
      })
    } else {
      res.send({
        status: 1,
        message: "该分类不存在!"
      });
    }
  })
}

// 根据 文章内容 获取文章列表
exports.getListBy_content = function (req, res) {
  // COUNT(id) as count 
  const sql = "select * from article where content like '%" + req.params.content + "%' and is_delete=0 order by id desc"
  db.query(sql, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取 文章列表 成功
    // 判断 results 长度
    if (results.length > 0) {
      res.send({
        status: 0,
        message: "获取文章成功!",
        data: results,
      });
    } else {
      res.send({
        status: 1,
        message: "未匹配到相应文章",
      });
    }
  })
}