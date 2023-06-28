<template>
  <div class="home-container">
    <!-- 文章分类区域 -->
    <div class="article-cate">
      <!-- 使用 v-if 防止数据还没有请求到, Artcase 组件就渲染完成了 -->
      <!-- 导致 Artcase 组件接收不到想要的数据 -->
      <Artcase :interests="userinfo.interest" :artcases="artcases" v-if="userinfo&&artcases"></Artcase>
    </div>
    <!-- 文章区域 -->
    <div class="article-item">
      <Article v-for="item in showlist" :key="item.id" :article="item"></Article>
    </div>
    <!-- 分页区域  v-if="showlist.length>0" -->
    <div class="pagination-item">
      <Pagination v-if="count>0" :page="page" :total="count" @pageChange="reload"></Pagination>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { getArticleCateAPI } from '@/api/communal/articlecateAPI.js'
import { userinfoAPI } from '@/api/communal/userinfoAPI.js'
import { articleListAPI, articleCountAPI } from '@/api/communal/articleAPI.js'

import Artcase from '@/components/Artcase/Artcase.vue'
import Article from '@/components/Article/Article.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

export default {
  name: 'MyHome',
  components: { Artcase, Article, Pagination },
  data() {
    return {
      // 接收用户详细信息
      userinfo: '',
      // 接收文章分类列表数据
      artcases: [],
      // 接收文章列表数据
      artlist: [],
      // 要显示的文章列表
      showlist: [],
      // 第几页
      page: 1,
      // 每次获取 10 条数据
      limit: 10,
      // 传给 Pagination 组件的值
      count: 0
    }
  },
  methods: {
    // 获取用户详细信息
    async getUserInfo() {
      const { data: res } = await userinfoAPI()
      if (res.status === 0) {
        this.userinfo = res.data
      }
    },
    // 获取文章分类列表数据
    async getArtCates() {
      const { data: res } = await getArticleCateAPI()
      if (res.status === 0) {
        this.artcases = res.data
        // console.log(res.data)
      }
    },
    // 获取文章列表数据
    async getArticleList() {
      const { data: res } = await articleListAPI(this.page, this.limit)
      if (res.status === 0) {
        this.artlist = res.data
        this.showlist = [...this.artlist]
        // console.log(res)
        // this.page++
      }
    },
    // 获取包含用户兴趣的文章总数
    async getCount() {
      const { data: res } = await articleCountAPI()
      if (res.status === 0) {
        this.count = res.data[0].count
      }
    },
    async reload(val) {
      this.page = val
      const { data: res } = await articleListAPI(this.page, this.limit)
      if (res.status === 0) {
        this.artlist = [...this.artlist, ...res.data]
        this.showlist = res.data
      }
    }
  },
  created() {
    this.getUserInfo()
    this.getArtCates()
    this.getArticleList()
    this.getCount()
    // 重新获取用户兴趣爱好
    // 如果重新获取用户兴趣，代表需要将 artlist 数据清空
    bus.$on('artcaseUpload', () => {
      this.getUserInfo()
      this.getCount()
      this.artlist = []
      this.page = 1
      this.reload(this.page)
    })
  }
}
</script>

<style lang="less" scoped>
.home-container {
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
