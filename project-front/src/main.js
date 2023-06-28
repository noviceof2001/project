import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 完整导入 element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 声明不需要token就可以跳转的页面
const arr = ['/login', '/findpassword']

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  // to.path 不包含在 arr 里
  if (arr.indexOf(to.path) === -1) {
    // // 判断是否有 token
    // if (localStorage.getItem('project1_token')) {
    //   next()
    //   // false
    // } else {
    //   next('/login')
    // }
    if (to.path === '/admin') {
      if (localStorage.getItem('status') === '1') {
        next()
      } else {
        next(false)
      }
    } else {
      if (localStorage.getItem('project1_token')) {
        next()
      } else {
        next('/login')
      }
    }
  } else {
    next()
  }
})

// 图片转base64格式 挂载在全局
Vue.prototype.$base64Img = (e) => {
  return new Promise(function (resolve, reject) { // 使用Promise进行异步处理
    let fileSize = 0
    const fileMaxSize = 1024 // 设置图片最大为 1M
    fileSize = e.target.files[0].size // 获取图片大小
    const size = fileSize / 1024
    const file = e.target.files[0] // 获取图片文件对象
    const reader = new FileReader() // 实例化一个对象
    if (size > fileMaxSize) {
      e.target.value = '' // 内容清空
      resolve({ err: '图片大小必须小于1M' })
      console.log('图片大小必须小于1M')
    } else if (size <= 0) {
      e.target.value = '' // 内容清空
      resolve({ err: '图片大小大小不能为0M' })
      console.log('图片大小大小不能为0M')
    } else {
      reader.readAsDataURL(file) // 把图片文件对象转换base64
      reader.onload = function (e) {
        resolve(e.target.result) // 回到函数返回base64值
      }
    }
  })
}

// 格式化时间
Vue.filter('dateFormat', value => {
  const time = new Date(value)
  const y = padZero(time.getFullYear())
  const m = padZero(time.getMonth() + 1)
  const d = padZero(time.getDate())

  const hh = padZero(time.getHours())
  const mm = padZero(time.getMinutes())
  const ss = padZero(time.getSeconds())

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 补0函数
const padZero = (val) => {
  return val > 9 ? val : '0' + val
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
