<template>
  <general-modal title="Добавление студента">
    <template v-slot="{ data }">
      <b-form-row>
        <b-col cols="12">
          <b-row>
            <b-col class="d-flex align-items-center">Студент</b-col>
            <b-col cols="auto" class="ml-auto">
              <b-button size="sm" class="m-2" @click="createStudent">Создать нового студента</b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12">
          <student-input v-model="data.student"/>
        </b-col>
      </b-form-row>
    </template>

    <template v-slot:utility>
      <student-modal ref="student-modal" @submit="onSubmitStudent"/>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import StudentInput from './StudentInput.vue';
import StudentModal from './StudentModal.vue';
import { Student } from '../models/managers/Student';

@Component({
  components: {
    GeneralModal,
    StudentInput,
    StudentModal
  }
})
export default class LessonStudentModal extends Mixins(ModalMixin) {
  private studentModal!: StudentModal;

  public mounted() {
    this.studentModal = this.$refs['student-modal'] as StudentModal;
  }

  private createStudent() {
    this.studentModal.show(new Student());
  }

  private async onSubmitStudent(student: Student) {
    this.studentModal.setInProcess(true);

    try {
      await this.$state.studentManager.create(student);
      this.studentModal.setVisible(false);
    } catch (e) {
      this.$notify({
        title: `Невозможно создать студента`,
        type: 'error'
      });
      this.studentModal.setInProcess(false);
    }
  }
}
</script>
