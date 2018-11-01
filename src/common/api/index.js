import axios from 'axios'
import qs from 'qs'
const BASE_URL = '/WebServer/FaceInterface.aspx'
const MOCK_URL = 'https://www.easy-mock.com/mock/5bc99756a53e086f8af484c2/faceid'
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
axios.interceptors.response.use(undefined, function axiosRetryInterceptor (err) {
  let config = err.config
  if (!config || !config.retry) return Promise.reject(err)
  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    return Promise.reject(err)
  }
  config.__retryCount += 1
  let backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, config.retryDelay || 1)
  })
  return backoff.then(() => {
    return axios(config)
  })
})
let api = {
  // 模拟数据
  mock (opt) {
    return axios.post(
      MOCK_URL + opt,
      qs.stringify(opt)
    )
  },
  // 授权
  getAuth () {
    return axios.post('/Admin-GetAuthorize', {
      redirectUrl: location.href
    })
  },
  // 全局查询方法
  fetch (opt) {
    // Object.assign(opt, { openid })
    return axios.post(
      BASE_URL,
      qs.stringify(opt)
    )
  },
  // 公用请求
  // 获取微信昵称头像等
  getWeixinInfo () {
    let opt = {
      Act: 'MemberCenterData'
    }
    return this.globalQuery(opt)
  }
}
export default api
