<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Discipline } from '@/models/managers/Discipline';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import DisciplineModal from '@/components/DisciplineModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    DisciplineModal
  }
})
export default class DisciplinesPage extends Vue {
  private disciplineModal!: DisciplineModal;

  private disciplines: Discipline[] = [];

  private created() {
    this.$bus.on('discipline_updated', (discipline: Discipline) => {
      updateIfExists(this.disciplines, discipline);
    });
    this.$bus.on(['discipline_created', 'discipline_removed'], async () => {
      this.disciplines = await this.$state.disciplineManager.fetchAll();
    });
  }

  private async mounted() {
    this.disciplineModal = this.$refs['discipline-modal'] as DisciplineModal;
    this.disciplineModal.$on('submit', async (discipline: Discipline) => {
      this.disciplineModal.setInProcess(true);

      const create: boolean = discipline.id < 0;

      try {
        if (create) {
          await this.$state.disciplineManager.create(discipline);
        } else {
          await this.$state.disciplineManager.update(discipline);
        }

        this.disciplineModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} дисциплину`,
          type: 'error'
        });
        this.disciplineModal.setInProcess(false);
      }
    });

    this.disciplines = await this.$state.disciplineManager.fetchAll();
  }

  public addDiscipline() {
    this.disciplineModal.show(new Discipline());
  }

  public editDiscipline(discipline: Discipline) {
    this.disciplineModal.show(discipline);
  }

  public async removeDiscipline(discipline: Discipline) {
    if (!confirm('Вы действительно хотите удалить дисциплину?')) {
      return;
    }

    try {
      await this.$state.disciplineManager.remove(discipline.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить дисциплину',
        type: 'error'
      });
    }
  }
}
</script>