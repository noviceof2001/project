<template>
  <div class="userlogin-container">
    <!-- 登录注册框 -->
    <div class="container-item">
      <!-- 头部 组件切换按钮 -->
      <div class="item-header">
        <!-- 组件切换按钮 -->
        <div class="button-item">
          <span :class="spanActive===1 ? 'sapn-active' : 'sapn-no-active'" @click=" toLogin">登录</span>
          <span :class="spanActive===2 ? 'sapn-active' : 'sapn-no-active'" @click=" toRegister">注册</span>
        </div>
      </div>
      <div class="item-main">
        <!-- 登录注册组件 -->
        <component :is="compIs"></component>
      </div>
      <!-- 底部 忘记密码 -->
      <div class="item-footer">
        <router-link to="/findpassword">忘记密码?</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Login from '@/components/Login/Login.vue'
import Register from '@/components/Login/Register.vue'

export default {
  name: 'MyUserLogin',
  components: {
    Login,
    Register
  },
  data() {
    return {
      // 控制组件切换
      compIs: 'Login',
      // 控制登录注册按钮的选中样式
      spanActive: 1
    }
  },
  methods: {
    // 使登录按钮被选中
    toLogin() {
      this.compIs = 'Login'
      this.spanActive = 1
    },
    // 使注册按钮被选中
    toRegister() {
      this.compIs = 'Register'
      this.spanActive = 2
    }
  }
}
</script>

<style lang="less" scoped>
@color: #2775b6;
.userlogin-container {
  width: 100%;
  height: 100%;
  background: url(../../assets/img/bg.png) no-repeat;
  background-size: 100% 100%;
  background-size: cover;
  .container-item {
    position: absolute;
    top: 50%;
    right: 200px;
    width: 400px;
    height: 500px;
    transform: translateY(-50%);
    // background-color: pink;
    .item-header {
      height: 100px;
      background-color: @color;
      .button-item {
        position: relative;
        padding-left: 300px;
        .sapn-active {
          position: absolute;
          top: 0;
          left: 25%;
          width: 200px;
          height: 100px;
          text-align: center;
          padding-top: 30px;
          font-size: 30px;
          color: #fff;
          cursor: pointer;
        }
        .sapn-no-active {
          float: left;
          padding-top: 40px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
    .item-main {
      height: 350px;
      padding: 30px 20px 0 20px;
      background-color: #f5f5f5;
    }
    .item-footer {
      height: 50px;
      background-color: @color;
      a {
        float: right;
        padding-right: 10px;
        line-height: 50px;
        text-decoration: none;
        color: #fff;
      }
    }
  }
}
</style>
