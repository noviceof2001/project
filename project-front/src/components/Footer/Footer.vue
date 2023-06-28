<template>
  <div class="footer-container">
    <h3>李保佳</h3>
  </div>
</template>

<script>
export default {
  name: 'MyFooter'
}
</script>

<style lang="less" scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  margin-top: 20px;
  background-color: #f5f5f5;
  h3 {
    font-size: 40px;
    text-align: center;
    line-height: 100px;
  }
}
</style>
