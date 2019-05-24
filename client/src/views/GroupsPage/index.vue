<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Group } from '@/models/managers/Group';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList, { PaginationProperties } from '@/components/CardsList.vue';
import GroupModal from '@/components/GroupModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    GroupModal
  }
})
export default class GroupsPage extends Vue {
  private groupModal!: GroupModal;
  private groupsList!: CardsList;

  private groups: Group[] = [];
  private groupsPagination: PaginationProperties = new PaginationProperties(2);

  private async created() {
    this.$bus.on('group_updated', (group: Group) => {
      updateIfExists(this.groups, group);
    });
    this.$bus.on('groups_total_changed', (total: number) => {
      this.groupsPagination.total = total;
    });
    this.$bus.on(['group_created', 'group_removed'], async () => {
      await this.$state.groupManager.fetchTotalCount();
      await this.groupsList.selectPage(this.groupsPagination.page);
    });
  }

  private async mounted() {
    this.groupModal = this.$refs['group-modal'] as GroupModal;
    this.groupModal.$on('submit', async (group: Group) => {
      this.groupModal.setInProcess(true);

      const create: boolean = group.id < 0;

      try {
        if (create) {
          await this.$state.groupManager.create(group);
        } else {
          await this.$state.groupManager.update(group);
        }

        this.groupModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} группу`,
          type: 'error'
        });
        this.groupModal.setInProcess(false);
      }
    });

    this.groupsList = this.$refs['groups-list'] as CardsList;
    this.groupsList.setLoader(async (perPage: number, page: number) => {
      this.groups = await this.$state.groupManager.fetchPage(
        this.groupsPagination.perPage,
        page
      );
    });

    await this.$state.groupManager.fetchTotalCount();
    this.groupsList.selectPage(1);
  }

  private addGroup() {
    this.groupModal.show(new Group());
  }

  private editGroup(group: Group) {
    this.groupModal.show(group);
  }

  private async removeGroup(item: Group) {
    if (!confirm('Вы действительно хотите удалить группу?')) {
      return;
    }

    try {
      await this.$state.groupManager.remove(item.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить группу',
        type: 'error'
      });
    }
  }
}
</script>
