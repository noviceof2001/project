// 导入 express
const express = require("express");
// 创建路由对象
const router = express.Router();

// 导入解析 formdata 格式表单数据的包
const multer = require("multer");
// 导入处理路径的核心模块
const path = require("path");
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// 导入文章的路由处理函数模块
const article_handler = require("../router_handler/article");

// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入文章的验证模块
const {
  add_article_schema,
  get_articleList_schema,
  del_article_schema,
  get_articleById_schema,
  update_articleById_schema,
} = require("../schema/article");

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post(
  "/add",
  upload.single("cover_img"),
  expressJoi(add_article_schema),
  article_handler.addArticle
);
// 获取文章的列表数据的路由
router.get("/list", expressJoi(get_articleList_schema), article_handler.getArticleList);
// 获取未被删除文章总数
router.get("/count", article_handler.getArticleCount)
// 获取 author_id 获取文章的列表数据的路由
router.get("/list/:author_id", article_handler.getArticleByAuthor_id);
// 根据 Id 获取文章详情的路由
router.get("/:id", expressJoi(get_articleById_schema), article_handler.getArticleById);
// // 根据 Id 删除文章数据的路由
// router.get("/delete/:id", expressJoi(del_article_schema), article_handler.delArticleById);
// // 根据 Id 更新文章信息的路由
// router.post(
//   "/edit",
//   upload.single("cover_img"),
//   expressJoi(update_articleById_schema),
//   article_handler.updateArticleById
// );

// 向外共享路由对象
module.exports = router;
