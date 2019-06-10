<template>
  <general-modal title="Пара">
    <template v-slot="{ data }">
      <b-form-group label="День">
        <b-form-select v-model="data.day" :options="dayOptions"/>
      </b-form-group>

      <b-form-group label="Номер">
        <b-form-select v-model="data.number" :options="numberOptions"/>
      </b-form-group>

      <b-form-group label="Аудитория">
        <classroom-input v-model="data.classroom"/>
      </b-form-group>

      <b-form-group label="Дисциплина" v-if="data.id < 0">
        <discipline-input v-model="data.discipline"/>
      </b-form-group>

      <b-form-group label="Преподаватель" v-if="fullAccess">
        <user-input v-model="data.teacher"/>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import ClassroomInput from './ClassroomInput.vue';
import DisciplineInput from './DisciplineInput.vue';
import UserInput from './UserInput.vue';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import { getDayName, DayNumber } from '../models/Stuff';

@Component({
  components: {
    GeneralModal,
    ClassroomInput,
    DisciplineInput,
    UserInput
  }
})
export default class LessonModal extends Mixins(ModalMixin) {
  private fullAccess: boolean = false;

  public mounted() {
    this.fullAccess =
      this.$state.userManager.authorized &&
      this.$state.userManager.currentUser!.fullAccess;
  }

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
