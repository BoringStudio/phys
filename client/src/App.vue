<template>
  <div id="app">
    <notifications/>
    <div class="layout" :class="{ nosidebar: $route.meta.noSidebar }">
      <div class="toggle-sidebar-wrapper" v-if="!$route.meta.noSidebar">
        <div
          class="toggle-sidebar"
          :class="{offset: sidebarVisible}"
          @click="sidebarVisible = !sidebarVisible"
        >
          <a-icon icon="bars"/>
        </div>
      </div>

      <div class="sidebar" v-if="sidebarVisible">
        <div class="title pb-3 mb-3">
          <div>
            <h3>{{ formatDate(now) }}</h3>
          </div>
          <div class="noselect">
            <h4>{{ formatTime(now) }}</h4>
          </div>
          <div>{{ fullName }}</div>
        </div>
        <router-link
          v-for="(item, index) in pages"
          :key="`page-${index}`"
          :to="{ name: item.page }"
          class="button noselect"
          :class="isButtonActive(item.page)"
        >
          <a>{{ item.title }}</a>
        </router-link>

        <div class="button exit-button noselect" @click="onExit">Выход</div>
      </div>

      <router-view/>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';
import { User } from './models/managers/User';

interface IPage {
  page: string;
  title: string;
  teacherVisible?: boolean;
}

@Component
export default class App extends Vue {
  private now: Date = new Date();

  private fullName: string = '';
  private pages: IPage[] = [];

  private sidebarVisible: boolean = true;

  private created() {
    this.$bus.on('user_authorized', (user: User) => {
      this.updateInfo();
    });
  }

  private mounted() {
    this.updateDate();

    this.updateInfo();
  }

  private updateDate() {
    this.now = new Date();

    setTimeout(this.updateDate, 1000);
  }

  private updateInfo() {
    const authorized = this.$state.userManager.authorized;

    this.fullName =
      (authorized && this.$state.userManager.currentUser!.fullName) || '';

    this.pages = [
      {
        page: 'main',
        title: 'Расписание',
        teacherVisible: true
      },
      {
        page: 'students',
        title: 'Список студентов',
        teacherVisible: true
      },
      {
        page: 'groups',
        title: 'Группы',
        teacherVisible: true
      },
      {
        page: 'tests',
        title: 'Нормативы'
      },
      {
        page: 'disciplines',
        title: 'Дисциплины'
      },
      {
        page: 'marks',
        title: 'Оценки'
      },
      {
        page: 'classrooms',
        title: 'Аудитории'
      },
      {
        page: 'semesters',
        title: 'Семестры'
      },
      {
        page: 'users',
        title: 'Пользователи'
      }
    ].filter(
      (page) =>
        this.$state.userManager.currentUser!.fullAccess ||
        page.teacherVisible === true
    );
  }

  private formatTime(date: Date) {
    return moment(date).format('dd, HH:mm:ss');
  }

  private formatDate(date: Date) {
    return moment(date).format('DD.MM.YYYY');
  }

  private isButtonActive(route: string) {
    return {
      active: this.$route.name === route
    };
  }

  private onExit() {
    this.$state.userManager.unauth();

    this.$router.push({
      name: 'login'
    });
  }
}
</script>


<style lang="scss">
@import '@/styles/general.scss';

$padding-vertical: 20px;
$padding-horizontal: 15px;

html,
body {
  height: 100%;
}

#app {
  height: 100%;
  overflow-x: hidden;

  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $font-color;
}

.layout {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: row;

  .toggle-sidebar-wrapper {
    position: relative;

    @extend .noselect;

    .toggle-sidebar {
      position: absolute;
      width: 40px;
      height: 40px;
      line-height: 40px;
      font-size: 30px;
      text-align: center;

      top: 16px;

      &.offset {
        left: $sidebar-width - 40px;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        cursor: pointer;
      }
    }
  }

  .sidebar {
    width: $sidebar-width;

    flex: none;
    display: flex;
    flex-direction: column;

    box-shadow: 2px 0 0 #d6d6d6;
    padding-top: $padding-vertical;

    & > div,
    & > a {
      padding-left: $padding-horizontal;
      padding-right: $padding-horizontal;
    }

    & > a {
      color: $font-color;
      text-decoration: none;
    }

    .title {
      border-bottom: 2px solid #d6d6d6;
    }

    .button {
      height: $row-height;

      line-height: $row-height;

      font-weight: bold;

      &:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.active {
        box-shadow: inset 4px 0 0 var(--primary);
        background-color: rgba(0, 0, 0, 0.075);
      }
    }

    .exit-button {
      border-top: 2px solid #d6d6d6;
      margin-top: auto;
    }
  }

  &.nosidebar {
    .sidebar {
      display: none;
    }
  }

  .page {
    width: 100%;
    overflow-y: scroll;
    padding: 20px 40px;

    display: flex;
    flex-direction: column;
  }
}
</style>
