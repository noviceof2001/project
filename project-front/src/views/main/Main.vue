<template>
  <div class="main-container">
    <!-- 头部区域 -->
    <Header></Header>
    <!-- 路由跳转展示区 -->
    <div class="router">
      <router-view></router-view>
    </div>
    <!-- 底部区域 -->
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Header from '@/components/Header/Header.vue'
// import Footer from '@/components/Footer/Footer.vue'

export default {
  name: 'MyMain',
  components: { Header }
}
</script>

<style lang="less" scoped>
.router {
  width: 1200px;
  margin: 0 auto;
  // padding-bottom: 120px;
  padding-bottom: 120px;
}
</style>
