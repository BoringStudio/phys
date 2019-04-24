<template>
  <div id="app">
    <router-view/>
  </div>
</template>


<style lang="scss">
html, body {
  height: 100%;
}

#app {
  height: 100%;
  overflow-x: hidden;
  
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.page {
  min-height: 100%;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
