import Vue from 'vue';
import App from './App.vue';
import router from './router';

import bus from '@/model/Bus';
import state from '@/model/State';

import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import Notifications from 'vue-notification';
Vue.use(Notifications);

import VueMoment from 'vue-moment';
import 'moment/locale/ru';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEdit, faPlus);
Vue.component('a-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$bus = bus;
Vue.prototype.$state = state;

Vue.use(BootstrapVue);
Vue.use(VueMoment);

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
