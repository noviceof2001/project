<template>
  <div class="login-container">
    <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" ref="iptRef"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <!-- 使用 show-password 属性即可得到一个可切换显示隐藏的密码框 -->
        <el-input v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input class="code-item" v-model="loginForm.code" placeholder="请输入验证码"></el-input>
        <el-button type="primary" plain @click="getCode" :disabled="disable" ref="codeRef">{{codeText}}</el-button>
      </el-form-item>
      <div class="button-item">
        <el-button type="primary" @click="submitLoginForm">确认</el-button>
        <el-button type="primary" @click="resetLoginForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { loginAPI, codeAPI, haveUserAPI } from '@/api/communal/userAPI.js'
import bus from '@/utils/evevtBus.js'

export default {
  name: 'MyLogin',
  data() {
    // 验证用户名
    const checkUserName = (rule, value, callback) => {
      // 字母开头，允许5-16字节，允许字母数字下划线
      const regUserName = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
      if (regUserName.test(value)) {
        callback()
      } else {
        callback(new Error('请输入格式正确的用户名'))
      }
    }
    // 验证密码
    const checkPassword = (rule, value, callback) => {
      // 必须包含大小写字母和数字的组合，可以使用特殊字符，长度在8-10之间
      const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
      if (regPassword.test(value)) {
        callback()
      } else {
        callback(new Error('请输入格式正确的密码'))
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
      // 控制获取验证码按钮是否禁用
      disable: false,
      // 控制获取验证码按钮的文字
      codeText: '获取验证码',
      // 接收验证码
      setCode: '',
      // 控制确认按钮 （节流）
      submitbtn: true,
      // 登录表单对象
      loginForm: {
        username: '',
        password: '',
        code: ''
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
        code: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击确认按钮
    submitLoginForm() {
      // 验证是否所有输入框均校验成功
      this.$refs.loginFormRef.validate(async isPass => {
        if (isPass) {
          // 如果 submitbtn 为 true
          if (this.submitbtn) {
            // 在请求开始改变 submitbtn 状态为 false
            this.submitbtn = false
            // 发起请求
            const { data: res } = await loginAPI(this.loginForm.username, this.loginForm.password)
            console.log(res)
            if (res) {
              // 在请求结束改变 submitbtn 状态为 true
              this.submitbtn = true
              // 登录成功
              if (res.status === 0) {
                localStorage.setItem('project1_token', res.token)
                localStorage.setItem('status', res.flag)
                // 判断是否是管理员
                // 不是就跳到普通用户主页
                if (res.flag === 0) {
                  this.$router.push('/')
                } else {
                  // 管理员
                  this.$router.push('/admin')
                }
              }
            }
          }
        } else {
          this.$message.error('请正确输入所有字段')
        }
      })
    },
    // 重置输入框
    resetLoginForm() {
      // element-ui 提供的重置方法
      this.$refs.loginFormRef.resetFields()
      this.$refs.iptRef.focus()
    },
    // 点击获取验证码按钮
    async getCode() {
      // 用户名表单内容不为空
      if (this.loginForm.username) {
        // 先判断是否存在用户
        const isHaveUser = await this.searchUser()
        // 我也不知道为什么会返回一个 promise 对象
        // console.log(isHaveUser)
        // 用户名在数据库中存在
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
          const { data: res } = await codeAPI(this.loginForm.username)
          // console.log(res)
          this.setCode = res.data
          // console.log(res)
        } else {
          this.$message.error('用户名不存在')
        }
      } else {
        this.$message.error('输入用户名后，点击获取验证码')
      }
    },
    // 查询是否已有该用户名
    async searchUser() {
      // 发起请求
      // 返回 true/false
      const { data: res } = await haveUserAPI(this.loginForm.username)
      // console.log(res)
      if (res.status === 0) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    bus.$on('shareUsername', val => {
      this.loginForm.username = val
    })
  },
  mounted() {
    // 使第一个输入框自动获取焦点
    this.$refs.iptRef.focus()
  },
  beforeDestroy() {
    // 移除事件监听
    bus.$off('shareUsername')
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.el-form-item {
  margin: 5px 0 40px 0;
}
// 输入框背景颜色
:deep(.el-input__inner) {
  background-color: #fff;
}
.code-item {
  width: 200px;
  padding-right: 10px;
}
.codeDiv {
  position: absolute;
  top: 50%;
  left: 210px;
  width: 60px;
  height: 35px;
  transform: translateY(-50%);
  text-align: center;
  line-height: 35px;
  border: 1px solid #6fa1bc;
  background-color: #fff;
  color: #666;
}
.button-item {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
