<template>
  <div class="pagination-container">
    <el-pagination :page-size="10" :pager-count="11" layout="prev, pager, next" :total="total"
                   :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'MyPagination',
  props: {
    total: {
      type: Number,
      required: true,
      default: 1000
    },
    page: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data() {
    return {
      // 当前页码数
      currentPage: this.page
    }
  },
  methods: {
    handleCurrentChange() {
      this.$emit('pageChange', this.currentPage)
    }
  },
  watch: {
    page(newval) {
      this.currentPage = newval
    }
  }
}
</script>

<style lang="less" scoped>
.pagination-container {
  width: 100%;
}
</style>
