// 导入 express
const express = require("express");
// 创建路由对象
const router = express.Router();

// 导入文章的路由处理函数模块
const search_handler = require("../router_handler/search");

// 根据 作者名 获取文章列表
router.get('/name/:author_name', search_handler.getListBy_authorname)
// 根据 分类名 获取文章列表
router.get('/cate/:cate', search_handler.getListBy_cate)
// 根据 文章内容 获取文章列表
router.get('/content/:content', search_handler.getListBy_content)

// 向外共享路由对象
module.exports = router;