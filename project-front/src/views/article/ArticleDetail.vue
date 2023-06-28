<template>
  <div class="articledetail-container">
    <!-- 标题 -->
    <div class="title">
      <h2>{{article.title}}</h2>
    </div>
    <!-- 发表日期 -->
    <div class="pub_date">
      <p>{{article.pub_date | dateFormat}}</p>
    </div>
    <!-- 文章内容 -->
    <div class="content">
      <p v-html="article.content"></p>
    </div>
  </div>
</template>

<script>
import { articleDetailAPI } from '@/api/communal/articleAPI'

export default {
  name: 'MyArticleDetail',
  data() {
    return {
      // 接收文章详情
      article: ''
    }
  },
  methods: {
    // 根据 id 获取文章详情
    async getArticleDetail() {
      const { data: res } = await articleDetailAPI(this.$route.params.id)
      if (res.status === 0) {
        this.article = res.data[0]
      }
    }
  },
  created() {
    this.getArticleDetail()
  }
}
</script>

<style lang="less" scoped>
.articledetail-container {
  width: 100%;
  .title {
    height: 30px;
    text-align: center;
    line-height: 30px;
    margin-top: 10px;
  }
  .pub_date {
    float: right;
  }
  .content {
    text-indent: 2em;
    margin-top: 40px;
  }
}
</style>
