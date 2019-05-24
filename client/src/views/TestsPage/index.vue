<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Test } from '@/models/managers/Test';
import { updateIfExists } from '@/models/Stuff';

import CardsList from '@/components/CardsList.vue';
import TestModal from '@/components/TestModal.vue';

@Component({
  components: {
    CardsList,
    TestModal
  }
})
export default class TestsPage extends Vue {
  private testModal!: TestModal;

  private tests: Test[] = [];

  private created() {
    this.$bus.on('test_updated', (test: Test) => {
      updateIfExists(this.tests, test);
    });
    this.$bus.on(['test_created', 'test_removed'], async () => {
      this.tests = await this.$state.testManager.fetchAll();
    });
  }

  private async mounted() {
    this.testModal = this.$refs['test-modal'] as TestModal;
    this.testModal.$on('submit', async (test: Test) => {
      this.testModal.setInProcess(true);

      const create: boolean = test.id < 0;

      try {
        if (create) {
          await this.$state.testManager.create(test);
        } else {
          await this.$state.testManager.update(test);
        }

        this.testModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} норматив`,
          type: 'error'
        });
        this.testModal.setInProcess(false);
      }
    });

    this.tests = await this.$state.testManager.fetchAll();
  }

  private addTest() {
    this.testModal.show(new Test());
  }

  private editTest(test: Test) {
    this.testModal.show(test);
  }

  private async removeTest(item: Test) {
    if (!confirm('Вы действительно хотите удалить норматив?')) {
      return;
    }

    try {
      await this.$state.testManager.remove(item.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить норматив',
        type: 'error'
      });
    }
  }
}
</script>
