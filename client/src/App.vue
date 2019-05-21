<template>
  <div id="app">
    <notifications/>
    <div class="layout" :class="{ nosidebar: $route.meta.noSidebar }">
      <div class="sidebar">
        <div class="title pb-3 mb-3">
          <div>
            <h3>{{ formatDate(now) }}</h3>
          </div>
          <div class="noselect">
            <h4>{{ formatTime(now) }}</h4>
          </div>
          <div>{{ fullName }}</div>
        </div>
        <div
          class="button noselect"
          :class="isButtonActive('main')"
          @click="open('main')"
        >Расписание</div>
        <div
          class="button noselect"
          :class="isButtonActive('students')"
          @click="open('students')"
        >Список студентов</div>
        <div
          class="button noselect"
          :class="isButtonActive('tests')"
          @click="open('tests')"
        >Нормативы</div>
        <div
          class="button noselect"
          :class="isButtonActive('classrooms')"
          @click="open('classrooms')"
        >Аудитории</div>

        <div class="button exit-button noselect" @click="onExit">Выход</div>
      </div>

      <router-view/>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

@Component
export default class App extends Vue {
  private now: Date = new Date();

  private mounted() {
    this.updateDate();
  }

  private updateDate() {
    this.now = new Date();

    setTimeout(this.updateDate, 1000);
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

  private open(route: string) {
    this.$router.push({ name: route });
  }

  private onExit() {
    this.$state.userManager.unauth();

    this.$router.push({
      name: 'login'
    });
  }

  private get fullName() {
    if (!this.$state.userManager.authorized) {
      return '';
    }

    return this.$state.userManager.currentUser!.fullName;
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
  height: 100%;
  display: flex;
  flex-direction: row;

  .sidebar {
    width: $sidebar-width;
    height: 100%;

    flex: none;
    display: flex;
    flex-direction: column;

    box-shadow: 2px 0 0 #d6d6d6;
    padding-top: $padding-vertical;

    & > div {
      padding-left: $padding-horizontal;
      padding-right: $padding-horizontal;
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
    padding: 20px 40px
  }
}
</style>
