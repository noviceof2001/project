import axios from 'axios'

const request = axios.create({
  // 指定请求根路径
  baseURL: 'http://127.0.0.1'
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果有 token 就带上
    const token = localStorage.getItem('project1_token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
