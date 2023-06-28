<template>
  <div class="register-container">
    <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
      <el-form-item prop="username">
        <el-tooltip class="item" effect="dark" placement="left" :hide-after="5000">
          <div slot="content">请输入以字母开头，5-16字节的用户名，<br>允许字母数字下划线</div>
          <el-input v-model="registerForm.username" placeholder="请输入用户名" ref="iptRef"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="password">
        <el-tooltip class="item" effect="dark" placement="left" :hide-after="5000">
          <div slot="content">请输入包含大小写字母和数字的组合，<br>可以使用特殊字符，长度在8-10之间</div>
          <!-- 使用 show-password 属性即可得到一个可切换显示隐藏的密码框 -->
          <el-input v-model="registerForm.password" show-password placeholder="请输入密码"></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item prop="passwordConfirm">
        <el-input v-model="registerForm.passwordConfirm" show-password placeholder="请确认密码"></el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-tooltip class="item" effect="dark" placement="left" :hide-after="5000" content="仅支持QQ邮箱">
          <el-input v-model="registerForm.email" placeholder="请输入QQ邮箱"></el-input>
        </el-tooltip>
      </el-form-item>
      <div class="button-item">
        <el-button type="primary" @click="submitRegisterForm">确认</el-button>
        <el-button type="primary" @click="resetRegisterForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { regUserAPI, haveUserAPI } from '@/api/communal/userAPI.js'

export default {
  name: 'MyRegister',
  data() {
    const checkUserName = async (rule, value, callback) => {
      // 字母开头，允许5-16字节，允许字母数字下划线
      const regUserName = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (regUserName.test(value)) {
        // 判断是否重名
        // 我也不知道为什么会返回一个 promise 对象
        const isHaveUser = await this.searchUser(value)
        if (isHaveUser) {
          callback(new Error('该用户已存在,请更换用户名'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入格式正确的用户名'))
      }
    }
    const checkPassword = (rule, value, callback) => {
      // 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间
      const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
      if (regPassword.test(value)) {
        callback()
      } else {
        callback(new Error('请输入格式正确的密码'))
      }
    }
    const checkPasswordConfirm = (rule, value, callback) => {
      if (value === this.registerForm.password) {
        callback()
      } else {
        callback(new Error('请与密码保持一致'))
      }
    }
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^[1-9]\d{7,10}@qq\.com$/
      if (regEmail.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的QQ邮箱'))
      }
    }

    return {
      // 控制确认按钮 （节流）
      submitbtn: true,
      registerForm: {
        username: '',
        password: '',
        passwordConfirm: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: checkUserName, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: checkPasswordConfirm, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入QQ邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击确认按钮
    submitRegisterForm() {
      // new 一个 Date
      const regtime = this.formatTime(new Date())
      // console.log(regtime)
      // 验证是否所有输入框均校验成功
      this.$refs.registerFormRef.validate(async isPass => {
        if (isPass) {
          // 如果 submitbtn 为 true
          if (this.submitbtn) {
            // 在请求开始改变 submitbtn 状态为 false
            this.submitbtn = false
            // 发起请求
            const { data: res } = await regUserAPI(this.registerForm.username, this.registerForm.password, this.registerForm.email, regtime)
            // console.log(res)
            if (res) {
              // 在请求结束改变 submitbtn 状态为 true
              this.submitbtn = true
              // 注册成功
              if (res.status === 0) {
                this.$message.success('注册成功,请前往登录')
                this.resetRegisterForm()
              }
            }
          }
        } else {
          this.$message.error('请正确输入所有字段')
        }
      })
    },
    // 重置表单
    resetRegisterForm() {
      // element-ui 提供的重置方法
      this.$refs.registerFormRef.resetFields()
      this.$refs.iptRef.focus()
    },
    // 查询是否已有该用户名
    async searchUser(name) {
      // 发起请求
      // 判断是否重名
      // 返回 true/false
      const { data: res } = await haveUserAPI(name)
      // console.log(res)
      if (res.status === 0) {
        return true
      } else {
        return false
      }
    },
    // 格式化时间函数
    formatTime(time) {
      // console.log(time)
      const y = time.getFullYear()
      const m = this.padZero(time.getMonth() + 1)
      const d = this.padZero(time.getDate())
      const hh = this.padZero(time.getHours())
      const mm = this.padZero(time.getMinutes())
      const ss = this.padZero(time.getSeconds())
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
    // 补0函数
    padZero(val) {
      return val > 9 ? val : '0' + val
    }
  },
  mounted() {
    // 使第一个输入框自动获取焦点
    this.$refs.iptRef.focus()
  }
}
</script>

<style lang="less" scoped>
.register-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.el-form-item {
  margin: 5px 0 20px 0;
}
// 输入框背景颜色
:deep(.el-input__inner) {
  background-color: #fff;
}
.button-item {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
