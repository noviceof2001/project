<template>
  <div class="find-container">
    <!-- 头部区域 -->
    <div class="find-header">
      <!-- 图片区域 -->
      <div class="img-item"></div>
      <!-- 剩余区域 -->
      <div class="other-item">
        <h1>重置密码</h1>
        <div class="router-item">
          <router-link to="/login">登录</router-link> |
          <a href="#" @click.prevent="goback">返回</a>
        </div>
      </div>
    </div>
    <!-- 表单区域 -->
    <div class="find-main">
      <el-form :model="resetPasswordForm" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-tooltip class="item" effect="dark" placement="right" :hide-after="5000">
            <div slot="content">请输入以字母开头，5-16字节的用户名，<br>允许字母数字下划线</div>
            <el-input v-model="resetPasswordForm.username" placeholder="请输入用户名" ref="iptRef"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="newPwd">
          <el-tooltip class="item" effect="dark" placement="right" :hide-after="5000">
            <div slot="content">请输入包含大小写字母和数字的组合，<br>可以使用特殊字符，长度在8-10之间</div>
            <!-- 使用 show-password 属性即可得到一个可切换显示隐藏的密码框 -->
            <el-input v-model="resetPasswordForm.newPwd" show-password placeholder="请输入新密码"></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="newPwdConfirm">
          <el-input v-model="resetPasswordForm.newPwdConfirm" show-password placeholder="请确认新密码"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input class="code-item" v-model="resetPasswordForm.code" placeholder="请输入验证码"></el-input>
          <el-button type="primary" plain @click="getCode" :disabled="disable" ref="codeRef">{{codeText}}</el-button>
        </el-form-item>
        <div class="button-item">
          <el-button type="primary" @click="submitForm">确认</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { resetPasswordAPI, haveUserAPI, codeAPI } from '@/api/communal/userAPI.js'
import bus from '@/utils/evevtBus.js'

export default {
  name: 'MyFindPassword',
  data() {
    const checkUserName = (rule, value, callback) => {
      // 字母开头，允许5-16字节，允许字母数字下划线
      const regUserName = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (regUserName.test(value)) {
        callback()
      } else {
        callback(new Error('请输入格式正确的用户名'))
      }
    }
    const checkNewPwd = (rule, value, callback) => {
      // 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间
      const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
      if (regPassword.test(value)) {
        callback()
      } else {
        callback(new Error('请输入格式正确的密码'))
      }
    }
    const checkNewPwdConfirm = (rule, value, callback) => {
      if (value === this.resetPasswordForm.newPwd) {
        callback()
      } else {
        callback(new Error('请与密码保持一致'))
      }
    }
    // 验证验证码
    const checkCode = (rule, value, callback) => {
      // 验证码与后台发送的相同即可
      if (value === this.setCode) {
        callback()
      } else {
        callback(new Error('请输入正确的验证码'))
      }
    }
    return {
      // 控制确认按钮 （节流）
      submitbtn: true,
      // 控制获取验证码按钮的文字
      codeText: '获取验证码',
      // 接收验证码
      setCode: '',
      // 控制获取验证码按钮是否禁用
      disable: false,
      // 表单
      resetPasswordForm: {
        username: '',
        newPwd: '',
        newPwdConfirm: '',
        code: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: checkNewPwd, trigger: 'blur' }
        ],
        newPwdConfirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: checkNewPwdConfirm, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 返回上一页
    goback() {
      this.$router.go(-1)
    },
    // 点击确认按钮
    submitForm() {
      // 验证是否所有输入框均校验成功
      this.$refs.formRef.validate(async isPass => {
        if (isPass) {
          // 如果 submitbtn 为 true
          if (this.submitbtn) {
            // 在请求开始改变 submitbtn 状态为 false
            this.submitbtn = false
            // 发起请求
            const { data: res } = await resetPasswordAPI(this.resetPasswordForm.username, this.resetPasswordForm.newPwd)
            // console.log(res)
            if (res) {
              // 在请求结束改变 submitbtn 状态为 true
              this.submitbtn = true
              // 更改密码成功
              if (res.status === 0) {
                this.$message.success('更改密码成功')
                this.$router.push('/login')
              }
            }
          }
        } else {
          this.$message.error('请正确输入所有字段')
        }
      })
    },
    // 点击重置按钮
    resetForm() {
      this.$refs.formRef.resetFields()
      this.$refs.iptRef.focus()
    },
    // 点击获取验证码
    async getCode() {
      // 判断表单用户名是否输入
      if (this.resetPasswordForm.username) {
        // 判断用户是否存在
        // 我也不知道为什么会返回一个 promise 对象
        const isHaveUser = await this.searchUser()
        if (isHaveUser) {
          // 禁用获取验证码按钮
          this.disable = true
          // 改变按钮文字
          let time = 60
          this.codeText = time + 's后重新发送'
          const clock = setInterval(() => {
            time--
            this.codeText = time + 's后重新发送'
            if (time < 0) {
              clearInterval(clock)
              this.codeText = '重新发送验证码'
              time = 60
              this.disable = false
            }
          }, 1000)
          // 发起请求
          const { data: res } = await codeAPI(this.resetPasswordForm.username)
          this.setCode = res.data
        } else {
          this.$message.error('该用户不存在')
        }
      } else {
        this.$message.error('输入用户名后，点击获取验证码')
      }
    },
    // 查询该用户名是否存在
    async searchUser() {
      // 发起请求
      // 判断是否重名
      // 返回 true/false
      const { data: res } = await haveUserAPI(this.resetPasswordForm.username)
      // console.log(res)
      if (res.status === 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.$refs.iptRef.focus()
  },
  destroyed() {
    // 跳转页面时,把用户名传递给登录页面
    // 自定义事件
    bus.$emit('shareUsername', this.resetPasswordForm.username)
  }
}
</script>

<style lang="less" scoped>
.find-container {
  width: 100%;
  height: 100%;
  .find-header {
    height: 150px;
    background-color: #f0f0f0;
    .img-item {
      float: left;
      width: 200px;
      height: 150px;
      background: url(../../assets/img/logo.png) no-repeat;
      background-size: 100% 100%;
      background-size: cover;
    }
    .other-item {
      position: relative;
      width: 800px;
      height: 150px;
      margin: 0 auto;
      h1 {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-weight: 400;
      }
      .router-item {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        a {
          color: #333;
          text-decoration: none;
        }
      }
    }
  }
  .find-main {
    position: relative;
    width: 400px;
    height: 300px;
    margin: 100px auto;
    :deep(.el-input__inner) {
      border: 1px solid #dcdfe6;
    }
    .code-item {
      width: 250px;
      padding-right: 10px;
    }
    .button-item {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
