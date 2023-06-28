// 导入定义验证规则的模块
const joi = require("joi");

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required();
const cate_id = joi.number().integer().min(1).required();
const content = joi.string().required().allow("");
// 定义文章 Id 的验证规则
const id = joi.number().integer().min(1).required();

// 获取文章的限制
const page = joi.number().integer().min(1).required();
const limit = joi.number().integer().min(1).required();

// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title: title,
    cate_id: cate_id,
    content: content,
  },
};

// 验证规则对象 - 获取文章列表
exports.get_articleList_schema = {
  // query 接收 get 参数
  // params 接收 get 用 ？传递的参数
  query: {
    page: page,
    limit: limit
  },
};

// // 验证规则对象 - 删除文章
// exports.del_article_schema = {
//   params: {
//     id: id,
//   },
// };

// 验证规则对象 - 根据 Id 获取文章详情
exports.get_articleById_schema = {
  params: {
    id: id,
  },
};

// // 验证规则对象 - 根据 Id 更新文章内容
// exports.update_articleById_schema = {
//   body: {
//     id: id,
//     title: title,
//     cate_id: cate_id,
//     content: content,
//   },
// };
