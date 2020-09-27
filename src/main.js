import Vue from 'vue'
import './behavior';
import './customEdge';
import './customNode';
import App from './App.vue'
import ElementUI from 'element-ui';
import store from '@/store/index';

Vue.use(ElementUI);

Vue.config.productionTip = false
// public/js/request.js 里配置
Vue.prototype.$baseImagePath = window.baseImagePath;
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
