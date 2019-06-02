<template>
  <general-modal title="Пара">
    <template v-slot="{ data }">
      <b-form-group label="День">
        <b-form-select v-model="data.day" :options="dayOptions"/>
      </b-form-group>

      <b-form-group label="Номер">
        <b-form-select v-model="data.number" :options="numberOptions"/>
      </b-form-group>

      <b-form-group label="Дисциплина">
        <discipline-input v-model="data.discipline"/>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import DisciplineInput from './DisciplineInput.vue';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import { getDayName, DayNumber } from '../models/Stuff';

@Component({
  components: {
    GeneralModal,
    DisciplineInput
  }
})
export default class LessonModal extends Mixins(ModalMixin) {
  private get dayOptions() {
    return Array(6)
      .fill({})
      .map((v, i) => ({
        value: i,
        text: getDayName(i as DayNumber)
      }));
  }

  private get numberOptions() {
    return Array(5)
      .fill({})
      .map((v, i) => ({
        value: i,
        text: i + 1
      }));
  }
}
</script>
