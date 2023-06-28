<template>
  <div>
    <Article v-for="item in showlist" :key="item.id" :article="item"></Article>
    <div class="pagination-item">
      <Pagination :total="list.length" :page="page" @pageChange="reload"></Pagination>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { getListByAuthorName, getListByCate, getListByContent } from '@/api/communal/searchAPI.js'

import Article from '@/components/Article/Article.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

export default {
  name: 'MySearch',
  components: { Article, Pagination },
  data() {
    return {
      // 接收数据
      list: [],
      // 展示数据
      showlist: [],
      // 当前页数
      page: 1,
      // 接收搜索按钮的选择
      select: '',
      input: ''
    }
  },
  methods: {
    async getListBy_AuthorName(val) {
      const { data: res } = await getListByAuthorName(val)
      if (res.status === 0) {
        const arr = [...res.data]
        this.list = res.data
        this.showlist = this.list.splice((this.page - 1) * 10, 10)
        this.list = arr
      }
    },
    async getListBy_Cate(val) {
      const { data: res } = await getListByCate(val)
      if (res.status === 0) {
        const arr = [...res.data]
        this.list = res.data
        this.showlist = this.list.splice((this.page - 1) * 10, 10)
        this.list = arr
      }
    },
    async getListBy_Content(val) {
      const { data: res } = await getListByContent(val)
      if (res.status === 0) {
        const arr = [...res.data]
        this.list = res.data
        this.showlist = this.list.splice((this.page - 1) * 10, 10)
        this.list = arr
      }
    },
    // 判断使用哪个接口
    use_API() {
      this.select = sessionStorage.getItem('select')
      this.input = sessionStorage.getItem('input')
      if (this.select === '1') {
        this.getListBy_AuthorName(this.input)
      } else if (this.select === '2') {
        this.getListBy_Cate(this.input)
      } else {
        this.getListBy_Content(this.input)
      }
    },
    // 页数改变
    reload(val) {
      this.page = val
      const arr = [...this.list]
      this.showlist = this.list.splice((this.page - 1) * 10, 10)
      this.list = arr
    }
  },
  created() {
    this.use_API()
    bus.$on('shareValue', val => {
      this.select = val.select
      this.input = val.input
      this.use_API()
    })
  }
}
</script>

<style lang="less" scoped>
.pagination-item {
  position: fixed;
  bottom: 20px;
  left: 50%;
  width: 1000px;
  height: 40px;
  transform: translateX(-50%);
  text-align: center;
}
</style>
