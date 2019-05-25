<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Discipline } from '@/models/managers/Discipline';
import { updateIfExists } from '@/models/Stuff';
import state from '@/models/State';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import DisciplineModal from '@/components/DisciplineModal.vue';

class DisciplineModalData extends Discipline {
  public testIds: number[] = [];

  constructor(discipline?: Discipline) {
    super(discipline);
  }

  public async fillIds() {
    if (this.id < 0) {
      return;
    }

    this.testIds = await state.disciplineManager.fetchTests(this.id);
  }
}

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
    this.disciplineModal.$on(
      'submit',
      async (discipline: DisciplineModalData) => {
        this.disciplineModal.setInProcess(true);

        const create: boolean = discipline.id < 0;

        try {
          const action = create
            ? this.$state.disciplineManager.create
            : this.$state.disciplineManager.update;

          const res = await action(discipline);
          await this.$state.disciplineManager.updateTests(
            res.id,
            discipline.testIds
          );

          this.disciplineModal.setVisible(false);
        } catch (e) {
          this.$notify({
            title: `Невозможно ${create ? 'создать' : 'изменить'} дисциплину`,
            type: 'error'
          });
          this.disciplineModal.setInProcess(false);
        }
      }
    );

    this.disciplines = await this.$state.disciplineManager.fetchAll();
  }

  public addDiscipline() {
    this.disciplineModal.show(new DisciplineModalData());
  }

  public async editDiscipline(discipline: Discipline) {
    const modalData = new DisciplineModalData(discipline);
    await modalData.fillIds();
    this.disciplineModal.show(modalData);
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