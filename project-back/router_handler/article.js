// 导入处理路径的 path 核心模块
const path = require("path");
const fs = require('fs')

// 导入数据库操作模块
const db = require("../db/index");

// 发布新文章的处理函数
exports.addArticle = function (req, res) {
  // console.log(req.file)
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== "cover_img") {
    return res.cc("文章封面是必选参数!");
  }
  // 给图片文件重命名
  let oldfile = req.file.path
  let newfile = req.file.path + path.parse(req.file.originalname).ext
  fs.renameSync(oldfile, newfile)
  const articleInfo = {
    // 标题、内容、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: "http://localhost:80/uploads/" + req.file.filename + path.parse(req.file.originalname).ext,
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  };
  const sql = "insert into article set ?";
  db.query(sql, articleInfo, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) {
      return res.cc("发布文章失败!");
    }
    // 发布文章成功
    res.cc("发布文章成功", 0);
  });
};

// 获取文章的列表数据的处理函数
exports.getArticleList = function (req, res) {
  // 先获取用户的兴趣爱好
  const sql = 'select interest from userdetail where username=?'
  db.query(sql, req.user.username, function (err, results) {
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功
    // 解构出用户兴趣,字符串格式
    const { interest } = results[0]
    // console.log(interest)
    // 转换成数组格式
    const interArr = interest.split(',')
    // 中间的字符串
    var emptyStr = ''
    // 最终的字符串
    var str = ''
    for (var i = 0; i < interArr.length; i++) {
      emptyStr = "'" + interArr[i] + "'"
      if (i < interArr.length - 1) {
        emptyStr += ","
      }
      str += emptyStr
    }
    // 需要到 文章分类 表中查询兴趣对应的 id
    // 类似于 select id from article_cate where name in ('科技', '历史')
    const sqlId = 'select id from article_cate where name in (' + str + ')'
    db.query(sqlId, function (err, results) {
      if (err) {
        return res.cc(err);
      }
      // 执行 SQL 语句成功
      var str1 = ''
      var str2 = ''
      for (var i = 0; i < results.length; i++) {
        // console.log(results[i].id)
        str1 = "'" + results[i].id + "'"
        if (i < results.length - 1) {
          str1 += ","
        }
        str2 += str1
      }
      // 查询文章列表
      // const sqlArt = 'select * from article where cate_id in (' + str2 + ') and is_delete=0'
      const sqlArt = 'select article.id,article.title,article.content,article.cover_img,article.pub_date,userdetail.username from userdetail,article where article.author_id=userdetail.id and article.cate_id in (' + str2 + ') and article.is_delete=0 order by article.id desc LIMIT ' + (req.query.page - 1) * req.query.limit + ',' + req.query.limit + ''
      db.query(sqlArt, function (err, results) {
        if (err) {
          return res.cc(err);
        }
        // 执行 SQL 语句成功
        res.send({
          status: 0,
          message: "获取文章列表成功!",
          data: results,
        });
      })
    })
  })
};

//根据 author_id 获取文章列表的处理函数
exports.getArticleByAuthor_id = function (req, res) {
  // console.log(req.params.author_id)
  const sql = "select * from article where author_id=? order by id desc";
  db.query(sql, req.params.author_id, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取文章成功
    res.send({
      status: 0,
      message: "获取文章成功!",
      data: results,
    });
  });
};

//根据 Id 获取文章详情的处理函数
exports.getArticleById = function (req, res) {
  // console.log(req.params.id)
  const sql = "select * from article where Id=?";
  db.query(sql, req.params.id, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取文章成功
    res.send({
      status: 0,
      message: "获取文章成功!",
      data: results,
    });
  });
};

// 获取未被删除文章总数
exports.getArticleCount = function (req, res) {
  // 先获取用户的兴趣爱好
  const sql = 'select interest from userdetail where username=?'
  db.query(sql, req.user.username, function (err, results) {
    if (err) {
      return res.cc(err);
    }
    // 执行 SQL 语句成功
    // 解构出用户兴趣,字符串格式
    const { interest } = results[0]
    // console.log(interest)
    // 转换成数组格式
    const interArr = interest.split(',')
    // 中间的字符串
    var emptyStr = ''
    // 最终的字符串
    var str = ''
    for (var i = 0; i < interArr.length; i++) {
      emptyStr = "'" + interArr[i] + "'"
      if (i < interArr.length - 1) {
        emptyStr += ","
      }
      str += emptyStr
    }
    // 需要到 文章分类 表中查询兴趣对应的 id
    // 类似于 select id from article_cate where name in ('科技', '历史')
    const sqlId = 'select id from article_cate where name in (' + str + ')'
    db.query(sqlId, function (err, results) {
      if (err) {
        return res.cc(err);
      }
      // 执行 SQL 语句成功
      var str1 = ''
      var str2 = ''
      for (var i = 0; i < results.length; i++) {
        // console.log(results[i].id)
        str1 = "'" + results[i].id + "'"
        if (i < results.length - 1) {
          str1 += ","
        }
        str2 += str1
      }
      // 查询文章总数
      const sqlArt = 'SELECT COUNT(id) as count FROM article where cate_id in (' + str2 + ') and is_delete=0'
      db.query(sqlArt, function (err, results) {
        if (err) {
          return res.cc(err);
        }
        // 执行 SQL 语句成功
        res.send({
          status: 0,
          message: "获取文章列表成功!",
          data: results,
        });
      })
    })
  })
}

//根据 author_id 获取文章列表的处理函数
exports.getArticleByName = function (req, res) {
  // console.log(req.params.author_id)
  const sql = "select * from article where author_id=? order by id desc";
  db.query(sql, req.params.author_id, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      return res.cc(err);
    }
    // 获取文章成功
    res.send({
      status: 0,
      message: "获取文章成功!",
      data: results,
    });
  });
};

// // 根据 Id 删除文章数据的处理函数
// exports.delArticleById = function (req, res) {
//   const sql = "update ev_articles set is_delete=1 where Id=?";
//   db.query(sql, req.params.id, function (err, results) {
//     // 执行 SQL 语句失败
//     if (err) {
//       return res.cc(err);
//     }
//     // SQL 语句执行成功，但是影响行数不等于 1
//     if (results.affectedRows !== 1) {
//       return res.cc("删除文章失败!");
//     }
//     // 删除文章分类成功
//     res.cc("删除文章成功!", 0);
//   });
// };

// // 根据 Id 更新文章信息的处理函数
// exports.updateArticleById = function (req, res) {
//   // 手动判断是否上传了文章封面
//   if (!req.file || req.file.fieldname !== "cover_img") {
//     return res.cc("文章封面是必选参数!");
//   }
//   const sql = "update ev_articles set ? where Id=?";
//   const articleInfo = {
//     // 文章标题的Id、标题、内容、状态、所属的分类Id
//     ...req.body,
//     // 文章封面在服务器端的存放路径
//     cover_img: path.join("/uploads", req.file.filename),
//     // 文章发布时间
//     pub_date: new Date(),
//     // 文章作者的Id
//     author_id: req.user.id,
//   };
//   db.query(sql, [articleInfo, req.body.id], function (err, results) {
//     // 执行 SQL 语句失败
//     if (err) {
//       return res.cc(err);
//     }
//     // SQL 语句执行成功，但是影响行数不等于 1
//     if (results.affectedRows !== 1) {
//       return res.cc("更新文章失败!");
//     }
//     // 更新文章分类成功
//     res.cc("更新文章成功!", 0);
//   });
// };
