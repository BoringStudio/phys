<template>
  <general-modal title="Текущий семестр">
    <template v-slot="{ data }">
      <b-form-group label="Текущий семестр">
        <b-form-select v-model="data.currentSemesterId" :options="data.semesterOptions"></b-form-select>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Model, Mixins } from 'vue-property-decorator';

import GeneralModal, { ModalMixin } from './GeneralModal.vue';

@Component({
  components: {
    GeneralModal
  }
})
export default class CurrentSemesterModal extends Mixins(ModalMixin) {}
</script>
