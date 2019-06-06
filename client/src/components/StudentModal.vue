<template>
  <general-modal size="lg" title="Студент">
    <template v-slot="{ data }">
      <b-form-group label="Фамилия">
        <b-form-input type="text" autocomplete="false" v-model="data.surname"/>
      </b-form-group>

      <b-form-group label="Имя">
        <b-form-input type="text" autocomplete="false" v-model="data.name"/>
      </b-form-group>

      <b-form-group label="Отчество">
        <b-form-input type="text" autocomplete="false" v-model="data.middlename"/>
      </b-form-group>

      <b-form-radio-group :options="genderOptions" autocomplete="false" v-model="data.gender"/>
      <hr>

      <b-form-group label="Учебная группа">
        <group-input v-model="data.group"/>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import GroupInput from './GroupInput.vue';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';

@Component({
  components: {
    GroupInput,
    GeneralModal
  }
})
export default class StudentModal extends Mixins(ModalMixin) {
  private get genderOptions() {
    return [
      { value: 'male', text: 'Юноша' },
      { value: 'female', text: 'Девушка' }
    ];
  }
}
</script>
