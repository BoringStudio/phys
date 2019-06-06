<template>
  <general-modal title="Дисциплина" size="lg">
    <template v-slot="{ data }">
      <b-form-group label="Название">
        <b-form-input type="text" autocomplete="false" v-model="data.name"/>
      </b-form-group>

      <b-form-group label="Нормативы">
        <discipline-tests-input v-model="data.testIds"/>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Model, Mixins } from 'vue-property-decorator';

import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import DisciplineTestsInput from './DisciplineTestsInput.vue';

@Component({
  components: {
    GeneralModal,
    DisciplineTestsInput
  }
})
export default class DisciplineModal extends Mixins(ModalMixin) {}
</script>
