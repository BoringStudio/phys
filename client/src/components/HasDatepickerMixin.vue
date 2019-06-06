<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { ru } from 'vuejs-datepicker/dist/locale';

@Component
export default class HasDatepickerMixin extends Vue {
  get locale() {
    return ru;
  }

  get format() {
    return 'dd.MM.yyyy';
  }
}
</script>
