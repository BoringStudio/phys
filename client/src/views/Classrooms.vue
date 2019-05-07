<!-- TEMPALTE BEGIN -->
<template>
  <div class="page classrooms-page">
    <h3>Аудитории</h3>
    <hr>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ClassroomsPage extends Vue {}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.classrooms-page {
  padding: 20px 40px;
}
</style>
<!-- STYLE END -->
