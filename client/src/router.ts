import Vue from 'vue';
import Router from 'vue-router';

import LogPage from '@/views/Log.vue';
import TimetablePage from './views/Timetable.vue';
import StudentsListPage from './views/StudentsList.vue';

import TestsPage from './views/Tests.vue';
import ClassroomsPage from './views/Classrooms.vue';

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
