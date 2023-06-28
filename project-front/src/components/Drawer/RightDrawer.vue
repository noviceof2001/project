<template>
  <div class="drawer-container">
    <el-drawer title="文章分类" :visible.sync="drawer" direction="rtl" :before-close="onClose">
      <!-- 操作区域 -->
      <div class="operate">
        <el-button type="primary" icon="el-icon-edit" circle :disabled="disable" @click="onEdit"></el-button>
        <el-button type="primary" plain v-if="successbtn" @click="finish">完成</el-button>
        <el-button type="primary" plain v-if="successbtn" @click="cancel">取消</el-button>
      </div>
      <!-- 用户选中的文章分类 -->
      <div class="checked">
        <h5>我的兴趣：</h5>
        <el-tag color="#f5f5f5" :closable="tag" v-for="(item,index) in userinter" :key="index"
                @close="handleClose(index)">
          {{item}}
        </el-tag>
      </div>
      <!-- 分割线 -->
      <el-divider><span v-if="successbtn">点击下面的标签来添加兴趣</span></el-divider>
      <!-- 所有的文章分类 -->
      <div class="unchecked">
        <h5>文章分类：</h5>
        <el-tag color="#f5f5f5" v-for="item in artcases" :key="item.id" @click="addInterest(item.name)">{{item.name}}
        </el-tag>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { updateInterestAPI } from '@/api/communal/userinfoAPI.js'

export default {
  name: 'MyRightDrawer',
  props: {
    // 接收控制抽屉的显示与隐藏的标志
    flag: {
      type: Boolean,
      required: true,
      default: false
    },
    // 所有文章的分类
    artcases: {
      type: Array,
      required: true
    },
    // 用户的兴趣
    interests: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 控制抽屉的显示与隐藏
      drawer: this.flag,
      // 接收文章分类列表数据
      userinter: this.interests.split(','),
      // 接收 userinter 的最初值
      arr: [],
      // 控制编辑图标是否禁用
      disable: false,
      // 控制完成按钮的显示与隐藏
      successbtn: false,
      // 控制标签是否隐藏
      tag: false
    }
  },
  methods: {
    // 抽屉隐藏时
    onClose(done) {
      // 隐藏前,先判断是否关闭 编辑图标
      // 如果未关闭,则表示操作未完成
      // 应询问是否取消操作
      // 来判断是自动触发 成功 还是 取消 按钮
      if (this.disable) {
        this.$confirm('确认关闭？')
          .then(_ => {
            // 触发 成功 按钮
            this.finish()
            this.$emit('close')
            // done() 表示关闭抽屉
            done()
          })
          .catch(_ => {
            // 取消关闭抽屉操作
          })
      } else {
        this.$emit('close')
        this.disable = false
        this.successbtn = false
        this.tag = false
      }
    },
    // 点击编辑图标时
    onEdit() {
      this.disable = !this.disable
      this.successbtn = !this.successbtn
      this.tag = !this.tag
    },
    handleClose(index) {
      this.userinter.splice(index, 1)
      // console.log(index)
      // console.log(this.userinter)
    },
    // 点击完成按钮
    async finish() {
      // 接收 最新的值,当作参数传递到后端
      const newArr = [...this.userinter]
      // 判断最新的值是否与最初的值相同
      // 如果相同则不发起请求
      // 如果不同则发起请求
      if (newArr.sort().toString() !== this.arr.sort().toString()) {
        // 如果 newArr 不为空
        if (newArr.length !== 0) {
          const { data: res } = await updateInterestAPI(newArr.toString())
          // console.log(res)
          // res.status===0表示成功,让 Home组件 重新获取用户兴趣爱好
          if (res.status === 0) {
            bus.$emit('artcaseUpload')
          }
          this.userinter = newArr
        } else {
          // 如果为空,则默认兴趣为 科技和历史
          const newArr2 = ['科技', '历史']
          const { data: res } = await updateInterestAPI(newArr2.toString())
          if (res.status === 0) {
            bus.$emit('artcaseUpload')
          }
          this.userinter = newArr2
        }
      }
      this.onEdit()
    },
    // 点击取消按钮
    cancel() {
      this.userinter = [...this.arr]
      this.onEdit()
    },
    // 添加兴趣
    addInterest(name) {
      // 点击 编辑 图标后才能添加兴趣
      if (this.disable) {
        // console.log(name)
        // 判断是否已有该标签
        const res = this.userinter.some(item => item === name)
        if (this.userinter.length >= 9) {
          this.$alert('最多存在9个兴趣', '提示', { confirmButtonText: '确定' })
        }
        // 不包含且最多包含 9 个标签
        if (!res && this.userinter.length < 9) {
          this.userinter.push(name)
        }
      }
    }
  },
  created() {
    // 把 userinter 的最初值交给 arr
    // 点击 取消 时能够得到最初的数据
    this.arr = [...this.userinter]
  },
  watch: {
    // 动态监听 flag 的值,如果改变则传递给 drawer
    flag() {
      this.drawer = this.flag
    },
    interests(newval) {
      this.arr = [...newval]
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-container {
  :deep(.el-drawer.rtl) {
    padding-left: 10px;
  }
  .el-tag {
    margin: 0 10px;
    cursor: pointer;
  }
  .checked {
    height: 120px;
  }
  .unchecked {
    :deep(.el-tag) {
      color: #333;
    }
  }
}
</style>
