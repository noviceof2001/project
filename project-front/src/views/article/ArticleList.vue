<template>
  <div class="myarticlelist-container">
    <Article v-for="item in showlist" :key="item.id" :article="item"></Article>
    <div class="pagination-item">
      <Pagination :page="page" :total="myList.length" @pageChange="reload"></Pagination>
    </div>
  </div>
</template>

<script>
import { userinfoAPI } from '@/api/communal/userinfoAPI.js'
import { myArticleListAPI } from '@/api/communal/articleAPI.js'

import Article from '@/components/Article/Article.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

export default {
  name: 'MyArticleList',
  components: { Article, Pagination },
  data() {
    return {
      // 接收数据
      myList: [],
      // 要显示的文章列表
      showlist: [],
      // 接收 header 组件传递的 用户名
      author_id: '',
      page: 1
    }
  },
  methods: {
    // 获取用户详细信息
    async getUserInfo() {
      const { data: res } = await userinfoAPI()
      if (res.status === 0) {
        this.author_id = res.data.id
        this.getArticleList()
      }
    },
    // 获取用户发表的文章列表
    async getArticleList() {
      const { data: res } = await myArticleListAPI(this.author_id)
      if (res.status === 0) {
        this.myList = res.data
        const arr = [...this.myList]
        this.showlist = this.myList.splice(0, 10)
        this.myList = [...arr]
      }
    },
    reload(val) {
      this.page = val
      const arr = [...this.myList]
      this.showlist = this.myList.splice((this.page - 1) * 10, 10)
      this.myList = [...arr]
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.myarticlelist-container {
  width: 100%;
  height: 100%;
  .pagination-item {
    position: fixed;
    bottom: 20px;
    left: 50%;
    width: 1000px;
    height: 40px;
    transform: translateX(-50%);
    text-align: center;
  }
}
</style>
