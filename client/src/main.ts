import Vue from 'vue';
import App from './App.vue';
import router from './router';

import bus from '@/model/Bus';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import VueMoment from 'vue-moment';
import 'moment/locale/ru';

Vue.config.productionTip = false;

Vue.prototype.$bus = bus;

Vue.use(BootstrapVue);
Vue.use(VueMoment);

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
