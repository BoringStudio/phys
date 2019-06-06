<template>
  <general-modal title="Оценка">
    <template v-slot="{ data }">
      <b-form-group label="Название">
        <b-form-input type="text" autocomplete="false" v-model="data.name"/>
      </b-form-group>

      <b-form-group label="Символ">
        <b-form-input type="text" autocomplete="false" v-model="data.symbol"/>
      </b-form-group>

      <b-form-group label="Вес">
        <b-form-input type="number" autocomplete="false" v-model.number="data.weight"/>
      </b-form-group>
    </template>
  </general-modal>
</template>


<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';

@Component({
  components: {
    GeneralModal
  }
})
export default class MarkModal extends Mixins(ModalMixin) {}
</script>
