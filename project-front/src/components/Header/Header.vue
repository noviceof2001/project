<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <div class="header-item">
      <!-- logo区域 -->
      <div class="logo"></div>
      <!-- 导航区域 -->
      <div class="nav">
        <!-- this.$route.path.split('/') // ['', 'main', 'articlepublish'] -->
        <!-- default-active 的值与 index 对应 -->
        <el-menu :default-active="this.$route.path.split('/')[2]" class="el-menu-demo" mode="horizontal"
                 background-color="#f5f5f5" text-color="#333" active-text-color="#ff7a00">
          <router-link to="/main/home">
            <el-menu-item index="home">首页</el-menu-item>
          </router-link>
          <router-link to="/main/articlelist">
            <el-menu-item index="articlelist">我的文章</el-menu-item>
          </router-link>
          <router-link to="/main/articlepublish">
            <el-menu-item index="articlepublish">发表文章</el-menu-item>
          </router-link>
        </el-menu>
      </div>
      <!-- 搜索区域 -->
      <div class="search">
        <el-input placeholder="请输入内容" v-model.trim="input" @keyup.enter.native="goSearch" class="input-with-select">
          <el-select v-model="select" slot="prepend">
            <el-option label="作者" value="1"></el-option>
            <el-option label="文章标题" value="2"></el-option>
            <el-option label="文章内容" value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
        </el-input>
      </div>
      <!-- 用户区域 -->
      <div class="user">
        <!-- 用户头像 -->
        <div class="avatar">
          <router-link to="/main/userinfo">
            <img :src="userinfo.avatar" alt="">
          </router-link>
          <div class="dropdown">
            <router-link to="/main/userinfo">个人资料</router-link>
            <hr>
            <a href="#" @click.prevent="signOut">退出登录</a>
          </div>
        </div>
        <!-- 欢迎登录描述 -->
        <div class="welcome">
          <p>{{userinfo.username}}</p>
          <p>欢迎登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/evevtBus.js'

import { userinfoAPI } from '@/api/communal/userinfoAPI.js'
// import { getListByAuthorName, getListByCate, getListByContent } from '@/api/communal/searchAPI.js'

export default {
  name: 'MyHeader',
  data() {
    return {
      articleList: [],
      // 控制默认的菜单选项
      activeIndex: 'home',
      // 输入框内容
      input: '',
      // 控制选择器的内容,默认为 作者
      select: '1',
      // 接收用户信息详情表
      userinfo: ''
    }
  },
  methods: {
    // 点击搜索图标按钮
    async search() {
      // 选项 1、2、3
      // console.log(this.select)
      if (this.input) {
        sessionStorage.setItem('select', this.select)
        sessionStorage.setItem('input', this.input)
        bus.$emit('shareValue', {
          select: this.select,
          input: this.input
        })
        if (this.$route.path.split('/')[2] !== 'search') {
          this.$router.push('/main/search')
        }
      } else {
        this.$message({
          showClose: true,
          message: '请输入',
          type: 'warning'
        })
      }
    },
    // 获取用户详细信息
    async getUserInfo() {
      const { data: res } = await userinfoAPI()
      this.userinfo = res.data
    },
    // 退出登录按钮
    signOut() {
      // 清除状态保持
      window.localStorage.clear()
      this.$router.push('/login')
    },
    // 按回车键搜索
    goSearch() {
      this.search()
    }
  },
  created() {
    // 调用函数，获取用户详细信息
    this.getUserInfo()
    // 如果更换头像成功,重新获取头像
    bus.$on('userUpload', () => {
      this.getUserInfo()
    })
  }
}
</script>

<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  background-color: #f5f5f5;
  .header-item {
    position: relative;
    height: 60px;
    background-color: #f5f5f5;
    .logo {
      width: 120px;
      height: 100%;
      background: url(../../assets/img/logo2.png) no-repeat;
      background-size: 100% 100%;
      background-size: cover;
    }
    .nav {
      position: absolute;
      top: 0;
      left: 150px;
      width: 400px;
      height: 60px;
      a {
        float: left;
        width: 25%;
        height: 100%;
        text-align: center;
        text-decoration: none;
        color: #333;
      }
    }
    .search {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      transform: translate(-50%, -50%);
      :deep(.el-input__inner) {
        border: 1px solid #dcdfe6;
      }
      .el-button {
        background-color: #409eff;
        color: #fff;
      }
      .el-select {
        width: 110px;
      }
    }
    .user {
      position: absolute;
      top: 0;
      right: 40px;
      height: 60px;
      width: 220px;
      .avatar {
        float: left;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        cursor: pointer;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
        .dropdown {
          display: none;
          position: absolute;
          width: 100px;
          height: 60px;
          // border: 1px solid #333;
          z-index: 999999999;
          background-color: #b4b4b4;
          a {
            display: block;
            height: 30px;
            text-align: center;
            line-height: 30px;
            text-decoration: none;
            font-size: 14px;
            color: #333;
          }
        }
      }
      .avatar:hover :last-child {
        display: block;
      }
      .welcome {
        position: absolute;
        top: 50%;
        left: 65px;
        transform: translateY(-50%);
        font-size: 16px;
      }
    }
  }
}
</style>
