import Vue from 'vue'
import App from './App.vue'
import router from 'router'
import store from 'store'
import { Toast, Dialog } from 'vant'
Toast.setDefaultOptions({
  forbidClick: true,
  duration: 1500
})
Vue.use(Toast).use(Dialog)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
