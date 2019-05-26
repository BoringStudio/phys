<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Semester, SemesterWithModules } from '@/models/managers/Semester';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import SemesterModal from '@/components/SemesterModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    SemesterModal
  }
})
export default class SemestersPage extends Vue {
  private semesterModal!: SemesterModal;

  private semesters: Semester[] = [];

  private created() {
    this.$bus.on('semester_updated', (semester: Semester) => {
      updateIfExists(this.semesters, semester);
    });
    this.$bus.on(['semester_created', 'semester_removed'], async () => {
      this.semesters = await this.$state.semesterManager.fetchAll();
    });
  }

  private async mounted() {
    this.semesterModal = this.$refs['semester-modal'] as SemesterModal;
    this.semesterModal.$on('submit', async (semester: SemesterWithModules) => {
      this.semesterModal.setInProcess(true);

      const create: boolean = semester.id < 0;

      try {
        if (create) {
          await this.$state.semesterManager.create(semester);
        } else {
          await this.$state.semesterManager.update(semester);
        }

        this.semesterModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} семестр`,
          type: 'error'
        });
        this.semesterModal.setInProcess(false);
      }
    });

    this.semesters = await this.$state.semesterManager.fetchAll();
  }

  private addSemester() {
    this.semesterModal.show(new SemesterWithModules());
  }

  private async editSemester(semester: Semester) {
    const modules = await this.$state.semesterManager.fetchModules(semester.id);
    this.semesterModal.show(
      new SemesterWithModules({
        ...semester,
        modules
      })
    );
  }

  private async removeSemester(item: Semester) {
    if (!confirm('Вы действительно хотите удалить семестр?')) {
      return;
    }

    try {
      await this.$state.semesterManager.remove(item.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить семестр',
        type: 'error'
      });
    }
  }
}
</script>