<template>
  <div class="case-container">
    <el-tag color="#f5f5f5" v-for="item in artcates" :key="item.index">{{item}}</el-tag>
    <span color="#f5f5f5" @click="changeFlag">更多...</span>
    <RightDrawer :flag="rightFlag" :artcases="artcases" :interests="interests" @close="changeFlag">
    </RightDrawer>
  </div>
</template>

<script>
import RightDrawer from '@/components/Drawer/RightDrawer.vue'

export default {
  name: 'MyArtcase',
  components: { RightDrawer },
  props: {
    // 用户的兴趣
    interests: {
      type: String,
      required: true
    },
    // 所有文章的分类
    artcases: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      // 接收文章分类列表数据
      artcates: this.interests.split(','),
      // 控制右侧抽屉的显示与隐藏
      rightFlag: false
    }
  },
  methods: {
    changeFlag() {
      this.rightFlag = !this.rightFlag
    }
  },
  watch: {
    // 如果 interests 值发生变化,则把最新值传给 artcates
    interests() {
      this.artcates = this.interests.split(',')
    }
  }
}
</script>

<style lang="less" scoped>
.case-container {
  height: 40px;
  line-height: 40px;
  // transition: height 0.3s ease;
  overflow: hidden;
  background-color: #f5f5f5;
  .el-tag {
    cursor: default;
    border: 0;
    margin: 0 10px;
  }
  span {
    cursor: pointer;
    display: inline-block;
    font-size: 12px;
    margin: 0 10px;
  }
}
// .case-container:hover {
//   height: 120px;
// }
</style>
