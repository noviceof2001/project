<template>
  <div>123</div>
</template>

<script>
export default {
  name: 'MyAdmin',
  created() {
    if (localStorage.getItem('status') && localStorage.getItem('status') === 0) {
      console.log('您不是管理员')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
