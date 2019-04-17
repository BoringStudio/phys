import Vue from 'vue';
import App from './App.vue';
import router from './router';

import bus from '@/model/Bus';

import BootstrapVue from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

Vue.config.productionTip = false;

Vue.prototype.$bus = bus;

Vue.use(BootstrapVue);

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
