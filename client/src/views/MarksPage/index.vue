<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Mark } from '@/models/managers/Mark';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import MarkModal from '@/components/MarkModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    MarkModal
  }
})
export default class MarksPage extends Vue {
  private markModal!: MarkModal;

  private marks: Mark[] = [];

  private created() {
    this.$bus.on('mark_updated', (mark: Mark) => {
      updateIfExists(this.marks, mark);
    });
    this.$bus.on(['mark_created', 'mark_removed'], async () => {
      this.marks = await this.$state.markManager.fetchAll();
    });
  }

  private async mounted() {
    this.markModal = this.$refs['mark-modal'] as MarkModal;
    this.markModal.$on('submit', async (mark: Mark) => {
      this.markModal.setInProcess(true);

      const create: boolean = mark.id < 0;

      try {
        if (create) {
          await this.$state.markManager.create(mark);
        } else {
          await this.$state.markManager.update(mark);
        }

        this.markModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} оценку`,
          type: 'error'
        });
        this.markModal.setInProcess(false);
      }
    });

    this.marks = await this.$state.markManager.fetchAll();
  }

  private addMark() {
    this.markModal.show(new Mark());
  }

  private editMark(mark: Mark) {
    this.markModal.show(mark);
  }

  private async removeMark(item: Mark) {
    if (!confirm('Вы действительно хотите удалить оценку?')) {
      return;
    }

    try {
      await this.$state.markManager.remove(item.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить оценку',
        type: 'error'
      });
    }
  }
}
</script>
