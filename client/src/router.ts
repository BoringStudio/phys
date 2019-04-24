import Vue from 'vue';
import Router from 'vue-router';

import MainPage from './views/Main.vue';
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
      component: MainPage
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
      props: {
        layout: 'simple-window'
      }
    }
  ]
});
