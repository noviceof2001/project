<template>
  <div class="article-container">
    <!-- 文章封面 -->
    <div class="img">
      <img :src="article.cover_img" alt="">
    </div>
    <!-- 其他部分 -->
    <div class="main">
      <a href="#" @click.prevent="goToDetail">
        <h5>{{article.title}}</h5>
      </a>
      <p v-html="article.content" @click="goToDetail"></p>
      <span class="name">{{article.username}}</span>
      <span class="date">{{article.pub_date | dateFormat}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyArticle',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 跳转到文章详情
    goToDetail() {
      this.$router.push('/main/articledetail/' + this.article.id)
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  position: relative;
  width: 100%;
  height: 80px;
  margin-top: 10px;
  border-bottom: 1px solid #f0f0f2;
  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 150px;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main {
    position: absolute;
    top: 0;
    left: 170px;
    width: 1030px;
    height: 100%;
    // background-color: pink;
    a {
      text-decoration: none;
      color: black;
    }
    a:hover {
      text-decoration: underline;
    }
    h5 {
      height: 24px;
      line-height: 24px;
      font-size: 18px;
      cursor: pointer;
    }
    p {
      width: 1030px;
      // height: 104px;
      font-size: 14px;
      text-indent: 2em;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      cursor: pointer;
    }
    .name,
    .date {
      position: absolute;
      bottom: 0;
      height: 15px;
      line-height: 15px;
      font-size: 14px;
    }
    .name {
      right: 0;
    }
    .date {
      left: 0;
    }
  }
}
.article-container:hover {
  background-color: #f5f5f5;
}
</style>
