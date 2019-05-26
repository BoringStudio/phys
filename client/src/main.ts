import Vue from 'vue';
import App from './App.vue';
import router from './router';

import bus from '@/models/Bus';
import state from '@/models/State';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';

import { ModelSelect, ModelListSelect, MultiSelect } from 'vue-search-select';
Vue.component('b-model-select', ModelSelect);
Vue.component('b-model-list-select', ModelListSelect);
Vue.component('b-multi-select', MultiSelect);

import Notifications from 'vue-notification';
Vue.use(Notifications);

import Datepicker from 'vuejs-datepicker';
Vue.component('datepicker', Datepicker);

import VueMoment from 'vue-moment';
import 'moment/locale/ru';
import moment from 'moment-timezone';
moment.tz.setDefault();

import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faEdit, faPlus, faTimes);
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
