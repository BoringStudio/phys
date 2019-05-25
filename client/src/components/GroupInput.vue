<template>
  <div class="c-group-input">
    <b-model-list-select
      class="form-control"
      :list="groups"
      option-value="id"
      option-text="name"
      v-model="input"
      @searchchange="onSearch"
      @input="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { Component, Model, Watch, Vue } from 'vue-property-decorator';
import { Group } from '@/models/managers/Group';

import _ from 'underscore';

@Component
export default class GroupInput extends Vue {
  private input: Group | null = null;
  private groups: Group[] = [];

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

    if (val !== oldVal) {
      const group = await this.$state.groupManager.fetchOne(val);
      this.groups.push(group);
      this.input = group;
    }
  }

  private async onSearch(input: string) {
    if (input.length < 2) {
      return;
    }

    this.groups = await this.$state.groupManager.search(input, 5);
  }

  private onSelect(id: number) {
    this.$emit('input', id);
  }

  private serializeGroup(group: Group) {
    return group.name;
  }
}
</script>
