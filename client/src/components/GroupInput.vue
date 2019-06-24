<template>
  <div class="c-group-input">
    <b-model-list-select
      class="form-control"
      :key="uniqueKey"
      :list="groups"
      :value="input"
      option-value="id"
      :filter-predicate="() => true"
      :custom-text="serialize"
      @searchchange="onSearch"
      @input="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { Component, Model, Prop, Watch, Vue } from 'vue-property-decorator';
import { Group } from '@/models/managers/Group';
import { insertOrUpdate } from '../models/Stuff';

@Component
export default class GroupInput extends Vue {
  private input: Group | null = null;
  private groups: Group[] = [];

  private uniqueKey: number = 0;

  @Model('input', { type: Number })
  private readonly group!: number;

  @Watch('group', {
    immediate: true
  })
  private async onGroupChanged(val: number, oldVal: number) {
    if (val < 0) {
      this.input = null;
      return;
    }

    console.log(val, oldVal);

    if (val !== oldVal) {
      const group = await this.$state.groupManager.fetchOne(val);
      this.groups = [group];
      this.input = group;
    }
  }

  private async onSearch(search: string) {
    this.groups = await this.$state.groupManager.search(search, 5);
  }

  private async onSelect(group: Group | number) {
    if (typeof group === 'number') {
      group = await this.$state.groupManager.fetchOne(group);
    }

    if (Object.entries(group).length === 0) {
      return;
    }

    this.input = group;
    this.$emit('input', group.id);

    this.uniqueKey++;
  }

  private serialize(group: Group) {
    return group.name;
  }
}
</script>
