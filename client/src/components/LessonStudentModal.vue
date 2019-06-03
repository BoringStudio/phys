<template>
  <general-modal title="Добавление студента">
    <template v-slot="{ data }">
      <b-form-group label="Студент">
        <student-input v-model="data.student"/>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import StudentInput from './StudentInput.vue';

@Component({
  components: {
    GeneralModal,
    StudentInput
  }
})
export default class LessonStudentModal extends Mixins(ModalMixin) {}
</script>
