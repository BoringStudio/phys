<template>
  <general-modal title="Аудитория">
    <template v-slot="{ data }">
      <b-form-group label="Название">
        <b-form-input type="text" autocomplete="false" v-model="data.name"></b-form-input>
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
export default class ClassroomModal extends Mixins(ModalMixin) {}
</script>
