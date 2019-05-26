<template>
  <general-modal title="Семестр">
    <template v-slot="{ data }">
      <b-form-group label="Дата начала">
        <!-- <b-form-input type="date" autocomplete="false" v-model="data.begin"/> -->
        <datepicker
          v-model="data.begin"
          :language="locale"
          :format="format"
          bootstrap-styling
          monday-first
        />
      </b-form-group>

      <b-form-group label="Дата конца">
        <!-- <b-form-input type="date" autocomplete="false" v-model="data.end"/> -->
        <datepicker
          v-model="data.end"
          :language="locale"
          :format="format"
          bootstrap-styling
          monday-first
        />
      </b-form-group>
    </template>
  </general-modal>
</template>


<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';

import { ru } from 'vuejs-datepicker/dist/locale';

@Component({
  components: {
    GeneralModal
  }
})
export default class SemesterModal extends Mixins(ModalMixin) {
  get locale() {
    return ru;
  }

  get format() {
    return 'dd.MM.yyyy';
  }
}
</script>
