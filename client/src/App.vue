<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<style lang="scss">
@import '@/styles/general.scss';

html, body {
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

.page {
  min-height: 100%;
}
</style>
