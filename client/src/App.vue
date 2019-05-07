<template>
  <div id="app">
    <div class="layout" :class="{ nosidebar: $route.meta.noSidebar }">
      <div class="sidebar">
        <div class="title pb-3 mb-3">
          <div>
            <h3>{{ formatDate(now) }}</h3>
          </div>
          <div class="noselect">
            <h4>{{ formatTime(now) }}</h4>
          </div>
          <div>Иванов Иван Иванович</div>
        </div>
        <div class="button noselect active">Расписание</div>
        <div class="button noselect">Список студентов</div>
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

  private onExit() {
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
  }
}
</style>
