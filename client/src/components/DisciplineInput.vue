<template>
  <div class="c-dicipline-input">
    <b-model-list-select
      class="form-control"
      :list="disciplines"
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
import { Discipline } from '@/models/managers/Discipline';

@Component
export default class DisciplineInput extends Vue {
  private input: Discipline | null = null;
  private disciplines: Discipline[] = [];

  @Model('input', { type: Number })
  private readonly discipline!: number;

  @Watch('discipline', {
    immediate: true
  })
  private async onDisciplineChanged(val: number, oldVal: number) {
    if (val < 0) {
      this.input = null;
      return;
    }

    if (val !== oldVal) {
      const discipline = await this.$state.disciplineManager.fetchOne(val);
      this.disciplines.push(discipline);
      this.input = discipline;
    }
  }

  private async onSearch(input: string) {
    if (input.length < 2) {
      return;
    }

    this.disciplines = await this.$state.disciplineManager.search(input, 5);
  }

  private onSelect(id: number) {
    this.$emit('input', id);
  }

  private serialize(discipline: Discipline) {
    return discipline.name;
  }
}
</script>

