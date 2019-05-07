<!-- TEMPALTE BEGIN -->
<template>
  <div class="page tests-page">
    <h3>Нормативы</h3>
    <hr>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TestsPage extends Vue {}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.tests-page {
  padding: 20px 40px;
}
</style>
<!-- STYLE END -->
