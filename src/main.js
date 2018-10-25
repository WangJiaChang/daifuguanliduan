// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import router from './router';
import  VueResource  from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from 'vue-cookies';

Vue.use(VueResource)
Vue.use(ElementUI);
Vue.use(VueCookies);

Vue.http.interceptors.push((request,next) =>{
  let that = this;
  request.credentials = true;
  request.headers.set('ticket', window.document.cookie);
  next((response) => {
    if(response.body.result == 401){
      router.replace({
        path: '/login',
      })
    }else {
      return response;
    }
  }).bind(this);
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App,alert },
  template: '<App/>',
})