import Vue from 'vue';
import axios from 'axios';
import Router from 'vue-router';

import LogPage from '@/views/LogPage/index.vue';
import TimetablePage from '@/views/TimetablePage/index.vue';
import StudentsPage from '@/views/StudentsPage/index.vue';
import GroupsPage from '@/views/GroupsPage/index.vue';
import TestsPage from '@/views/TestsPage/index.vue';
import ClassroomsPage from '@/views/ClassroomsPage/index.vue';
import DisciplinesPage from '@/views/DisciplinesPage/index.vue';
import MarksPage from '@/views/MarksPage/index.vue';
import SemestersPage from '@/views/SemestersPage/index.vue';

import state from '@/models/State';

const loginPage = () => import('@/views/LoginPage/index.vue');

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
      component: StudentsPage
    },
    {
      path: '/groups',
      name: 'groups',
      component: GroupsPage
    },
    {
      path: '/log/:id',
      name: 'log',
      component: LogPage
    },
    {
      path: '/tests',
      name: 'tests',
      component: TestsPage
    },
    {
      path: '/disciplines',
      name: 'disciplines',
      component: DisciplinesPage
    },
    {
      path: '/makrs',
      name: 'marks',
      component: MarksPage
    },
    {
      path: '/classrooms',
      name: 'classrooms',
      component: ClassroomsPage
    },
    {
      path: '/semesters',
      name: 'semesters',
      component: SemestersPage
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
    state.userManager.authorized
  ) {
    next();
    return;
  }

  next(false);

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
