import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';

import LogPage from '@/views/Log.vue';
import TimetablePage from './views/Timetable.vue';
import StudentsListPage from './views/StudentsList.vue';

import TestsPage from './views/Tests.vue';
import ClassroomsPage from './views/Classrooms.vue';

import state from '@/model/State';

const loginPage = () => import('@/views/Login.vue');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: TimetablePage
    },
    {
      path: '/students',
      name: 'students',
      component: StudentsListPage
    },
    {
      path: '/log',
      name: 'log',
      component: LogPage
    },
    {
      path: '/tests',
      name: 'tests',
      component: TestsPage
    },
    {
      path: '/classrooms',
      name: 'classrooms',
      component: ClassroomsPage
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

router.beforeEach((to, from, next) => {
  if (
    (to.name && ['login'].includes(to.name)) ||
    state.userManager.currentUser
  ) {
    next();
    return;
  }

  router.replace({
    name: 'login',
    params: to.name
      ? {
          to: to.name
        }
      : undefined
  });
});

export default router;

axios.interceptors.response.use(
  (res) => {
    if (res.data.err != null) {
      return Promise.reject(res.data.err);
    }

    return Promise.resolve(res);
  },
  (err) => {
    const res = err.response;

    switch (res.status) {
      case 200:
        return res;

      case 401:
      case 403:
        router.push({ name: 'login' });
        return Promise.reject();

      default:
        return Promise.reject();
    }
  }
);
