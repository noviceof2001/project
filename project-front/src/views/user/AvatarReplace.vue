<template>
  <div class="avaterreplace-container">
    <input type="file" @change="handleFile">
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { updateAvatarAPI } from '@/api/communal/userinfoAPI.js'

export default {
  name: 'MyAvatarReplace',
  methods: {
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
  }
}
</script>

<style lang="less" scoped>
.avaterreplace-container {
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
