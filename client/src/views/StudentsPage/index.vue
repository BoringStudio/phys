<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Student } from '@/model/Student';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import StudentModal from '@/components/StudentModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    StudentModal
  }
})
export default class StudentsPage extends Vue {
  private studentsModal!: StudentModal;

  private students: Student[] = [];

  private created() {
    this.$bus.on('students_changed', () => {
      this.students = this.$state.studentManager.students;
    });
  }

  private async mounted() {
    this.studentsModal = this.$refs['student-modal'] as StudentModal;
    this.studentsModal.$on('submit', async (student: Student) => {
      this.studentsModal.setInProcess(true);

      const create: boolean = student.id < 0;

      try {
        if (create) {
          await this.$state.studentManager.create(student);
        } else {
          await this.$state.studentManager.update(student);
        }

        this.studentsModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} студента`,
          type: 'error'
        });
        this.studentsModal.setInProcess(false);
      }
    });

    this.$state.studentManager.fetchAll();
  }

  private addStudent() {
    this.studentsModal.show(new Student());
  }

  private editStudent(student: Student) {
    this.studentsModal.show(student);
  }

  private async removeStudent(student: Student) {
    if (!confirm('Вы действительно хотите удалить студента?')) {
      return;
    }

    try {
      await this.$state.studentManager.remove(student.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить студента',
        type: 'error'
      });
    }
  }
}
</script>
