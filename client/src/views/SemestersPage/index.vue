<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Semester, SemesterWithModules } from '@/models/managers/Semester';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import SemesterModal from '@/components/SemesterModal.vue';
import CurrentSemesterModal from '@/components/CurrentSemesterModal.vue';
import { ParameterType } from '../../models/managers/Parameters';

@Component({
  components: {
    Page,
    CardsList,
    SemesterModal,
    CurrentSemesterModal
  }
})
export default class SemestersPage extends Vue {
  private semesterModal!: SemesterModal;
  private currentSemesterModal!: CurrentSemesterModal;

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

    this.currentSemesterModal = this.$refs[
      'current-semester-modal'
    ] as CurrentSemesterModal;
    this.currentSemesterModal.$on(
      'submit',
      async ({ currentSemesterId }: { currentSemesterId: number }) => {
        this.currentSemesterModal.setInProcess(true);

        try {
          await this.$state.parameterManager.update({
            parameter: ParameterType.CURRENT_SEMESTER,
            value: currentSemesterId
          });
          this.currentSemesterModal.setVisible(false);
        } catch (e) {
          this.$notify({
            title: 'Невозможно изменить текущий семестр',
            type: 'error'
          });
          this.currentSemesterModal.setInProcess(false);
        }
      }
    );

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

  private async changeCurrentSemester() {
    const [semesters, currentSemesterId] = await Promise.all([
      this.$state.semesterManager.fetchAll(),
      this.$state.parameterManager.get(ParameterType.CURRENT_SEMESTER)
    ]);

    this.currentSemesterModal.show({
      currentSemesterId: currentSemesterId || -1,
      semesterOptions: semesters.map((semester) => ({
        value: semester.id,
        text: semester.rangeName
      }))
    });
  }
}
</script>