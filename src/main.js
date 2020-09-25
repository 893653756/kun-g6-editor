import Vue from 'vue'
import './behavior';
import './customEdge';
import './customNode';
import App from './App.vue'
import ElementUI from 'element-ui';
import store from '@/store/index';
import 'element-ui/lib/theme-chalk/index.css';
import '@kun/ued-components/packages/theme-kf/index.scss';

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
