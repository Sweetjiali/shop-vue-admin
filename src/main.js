import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式
import './assets/css/global.css'

import './plugins/element.js'

import './assets/icons/iconfont.css'


import TreeTable from 'vue-table-with-tree-grid'


//axios配置
import axios from 'axios' //导入axios
axios.defaults.baseURL = '/api/' //设置axios请求的根路径
// axios.defaults.baseURL = ' https://lianghj.top:8888/api/private/v1/'
//axios请求拦截器(添加token，保证拥有获取数据的权限)
axios.interceptors.request.use(config =>{
  // console.log(config);
  //为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 最后必须return config
  return config
})
Vue.prototype.$http = axios //挂载到vue原型对象上,这样每个vue组件都可以使用this访问到$http，从而发起axios请求


Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
