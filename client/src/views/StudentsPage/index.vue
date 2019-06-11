<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Student } from '@/models/managers/Student';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList, { PaginationProperties } from '@/components/CardsList.vue';
import StudentModal from '@/components/StudentModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    StudentModal
  }
})
export default class StudentsPage extends Vue {
  private studentModal!: StudentModal;
  private studentsList!: CardsList;

  private students: Student[] = [];
  private studentsPagination: PaginationProperties = new PaginationProperties(
    15
  );

  private created() {
    this.$bus.on('student_updated', (student: Student) => {
      updateIfExists(this.students, student);
    });
    this.$bus.on('students_total_changed', (total: number) => {
      this.studentsPagination.total = total;
    });
    this.$bus.on(['student_created', 'student_removed'], async () => {
      await this.$state.studentManager.fetchTotalCount();
      await this.studentsList.selectPage(this.studentsPagination.page);
    });
  }

  private async mounted() {
    this.studentModal = this.$refs['student-modal'] as StudentModal;
    this.studentModal.$on('submit', async (student: Student) => {
      this.studentModal.setInProcess(true);

      const create: boolean = student.id < 0;

      try {
        if (create) {
          await this.$state.studentManager.create(student);
        } else {
          await this.$state.studentManager.update(student);
        }

        this.studentModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} студента`,
          type: 'error'
        });
        this.studentModal.setInProcess(false);
      }
    });

    this.studentsList = this.$refs['students-list'] as CardsList;
    this.studentsList.setLoader(async (perPage: number, page: number) => {
      this.students = await this.$state.studentManager.fetchPage(
        this.studentsPagination.perPage,
        page
      );
    });

    await this.$state.studentManager.fetchTotalCount();
    this.studentsList.selectPage(1);
  }

  private addStudent() {
    this.studentModal.show(new Student());
  }

  private editStudent(student: Student) {
    this.studentModal.show(student);
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
