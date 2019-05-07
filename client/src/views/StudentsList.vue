<!-- TEMPALTE BEGIN -->
<template>
  <div class="page students-list-page">
    <h3>Список студентов</h3>
    <hr>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class StudentsListPage extends Vue {}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.students-list-page {
  padding: 20px 40px;
}
</style>
<!-- STYLE END -->