<template>
  <div class="userInfo-container">
    <!-- 头像 -->
    <div class="avatar">
      <img :src="userinfo.avatar" alt=""><input type="file" @change="handleFile">
    </div>
    <h1>用户名：{{userinfo.username}}</h1>
    <h1>QQ邮箱：{{userinfo.email}}</h1>
    <h1>注册时间：{{userinfo.regtime}}</h1>
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { updateAvatarAPI, userinfoAPI } from '@/api/communal/userinfoAPI.js'

export default {
  name: 'MyUserInfo',
  data() {
    return {
      // 接收用户详细信息
      userinfo: ''
    }
  },
  methods: {
    // 获取用户详细信息
    async getUserInfo() {
      const { data: res } = await userinfoAPI()
      this.userinfo = res.data
    },
    async handleFile(e) {
      // 调用全局方法将图片转换成base64格式
      const base64URL = await this.$base64Img(e)
      // console.log(base64URL)
      const { data: res } = await updateAvatarAPI(base64URL)
      // console.log(res)
      if (res.status === 0) {
        // 更新成功后,重新获取用户信息
        bus.$emit('userUpload')
      }
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.userInfo-container {
  width: 100%;
  height: 100%;
  .avatar {
    float: left;
    width: 200px;
    height: 200px;
    // border: 1px solid #333;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  h1 {
    font-weight: 400;
    height: 70px;
  }
}
</style>
