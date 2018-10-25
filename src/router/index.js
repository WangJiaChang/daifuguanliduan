import Vue from 'vue'
import Router from 'vue-router'
import shanghuliebiao from '@/components/shanghuliebiao'
import login from '@/components/login'
import password from '@/components/password'
import daifuguanli from '@/components/daifuguanli'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',//默认页面
      component: login
    },{
      path: '/login',//登陆页面
      name: 'login',
      component: login
    },{
      path:'/password',//修改密码页面
      name:'password',
      component:password
    },{
      path:'/daifuguanli',//代付管理
      name:'daifuguanli',
      component:daifuguanli
    },{
      path:'/shanghuliebiao',//商户列表
      name:'shanghuliebiao',
      component:shanghuliebiao
    }
  ]
})
