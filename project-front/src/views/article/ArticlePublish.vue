<template>
  <div class="container">
    <h3>添加新文章</h3>
    <el-form label-width="80px" :model="pubForm">
      <el-form-item label="文章标题">
        <el-input v-model="pubForm.title"></el-input>
      </el-form-item>
      <el-form-item label="文章类别">
        <el-select v-model="pubForm.cate_id" placeholder="请选择文章类型">
          <el-option v-for="item in artcases" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章内容">
        <Richtext @shareVal="getContent"></Richtext>
      </el-form-item>
      <el-form-item label="文章封面">
        <!-- 只接受 png/jpg格式图片 -->
        <div class="imgbox">
          <input type="file" style="display:none;" accept="image/png,image/jpg" ref="imgInput" @change="getImg">
          <el-button type="primary" round @click="selectImg">选择封面</el-button>
          <img :src="img_url" v-if="img_url">
          <div class="null" v-else>
            <i class="el-icon-picture-outline"></i>
          </div>
        </div>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="subForm" :disabled="disable">发表文章</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Richtext from '@/components/Richtext/Richtext.vue'

import { getArticleCateAPI } from '@/api/communal/articlecateAPI.js'
import { AddArticleAPI } from '@/api/communal/articleAPI.js'

export default {
  name: 'MyArticlePublish',
  components: { Richtext },
  data() {
    return {
      // 添加文章的表单
      pubForm: {
        // 文章标题
        title: '',
        // 分类 id
        cate_id: '',
        // 文章内容
        content: '',
        // 文章封面
        cover_img: ''
      },
      // 预览图片的 url 地址
      img_url: '',
      artcases: [],
      // 控制发表按钮（节流）
      disable: false
    }
  },
  methods: {
    // 获取文章分类列表数据
    async getArtCases() {
      const { data: res } = await getArticleCateAPI()
      this.artcases = res.data
      // console.log(res.data)
    },
    getContent(val) {
      this.pubForm.content = val
    },
    // 获取文章封面图片
    getImg(e) {
      const img = e.target.files[0]
      console.log(img)
      const arr = ['image/png', 'image/jpeg']
      const res = arr.some(item => item === img.type)
      // console.log(img)
      if (!res) {
        // this.$alert('仅支持 png 或 jpg 格式图片', '提示', { confirmButtonText: '确定' })
        this.$confirm('仅支持 png 或 jpg 格式图片', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确认'
        })
          .then(() => {})
          .catch(action => {})
        e.target.value = ''
      } else {
        // 预览展示
        const URL = window.URL || window.webkitURL
        // 通过 file 生成目标 url
        const imgURL = URL.createObjectURL(img)
        this.img_url = imgURL
        // 传给 this.pubForm.cover_img
        this.pubForm.cover_img = img
      }
    },
    // 点击选择文件按钮,触发选择图片类型 input:file 输入框
    selectImg() {
      this.$refs.imgInput.click()
    },
    // 提交表单
    async subForm() {
      if (this.pubForm.title && this.pubForm.cate_id && this.pubForm.content && this.pubForm.cover_img) {
        // 让发表按钮禁用
        this.disable = true
        const fd = new FormData()
        fd.append('title', this.pubForm.title)
        fd.append('cate_id', this.pubForm.cate_id)
        fd.append('content', this.pubForm.content)
        fd.append('cover_img', this.pubForm.cover_img)
        const { data: res } = await AddArticleAPI(fd)
        if (res.status === 0) {
          this.$message.success('发表文章成功')
          // 解除发表按钮禁用
          this.disable = false
        }
      } else {
        this.$message.error('请确认已全部填写')
      }
    }
  },
  created() {
    this.getArtCases()
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  h3 {
    text-align: center;
    height: 60px;
    line-height: 60px;
  }
  .el-form {
    margin-right: 5px;
    textarea {
      width: 100%;
      height: 400px;
      outline: none;
      resize: none;
      font-size: 20px;
      color: black;
    }
    .imgbox {
      position: relative;
      width: 100%;
      img {
        position: absolute;
        top: 50px;
        left: 5px;
        width: 300px;
        height: 200px;
      }
      .null {
        position: absolute;
        top: 50px;
        left: 5px;
        width: 300px;
        height: 200px;
        text-align: center;
        line-height: 200px;
        font-size: 30px;
        background-color: #f5f5f5;
      }
    }
    .btn {
      width: 100%;
      height: 50px;
      margin-top: 250px;
      text-align: center;
    }
  }
}
</style>
