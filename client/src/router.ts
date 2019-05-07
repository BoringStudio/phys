import Vue from 'vue';
import Router from 'vue-router';

import TimetablePage from './views/Timetable.vue';
import LogPage from '@/views/Log.vue';

const loginPage = () => import('@/views/Login.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: TimetablePage
    },
    {
      path: '/log',
      name: 'log',
      component: LogPage
    },
    {
      path: '/login',
      name: 'login',
      component: loginPage,
      meta: {
        noSidebar: true
      }
    }
  ]
});
