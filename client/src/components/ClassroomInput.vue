<template>
  <div class="c-classroom-input">
    <b-model-list-select
      class="form-control"
      :list="classrooms"
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
import { Classroom } from '@/models/managers/Classroom';

@Component
export default class ClassroomInput extends Vue {
  private input: Classroom | null = null;
  private classrooms: Classroom[] = [];

  @Model('input', { type: Number })
  private readonly classroom!: number;

  @Watch('classroom', {
    immediate: true
  })
  private async onClassroomChanged(val: number, oldVal: number) {
    if (val < 0) {
      this.input = null;
      return;
    }

    if (val !== oldVal) {
      const classroom = await this.$state.classroomManager.fetchOne(val);
      this.classrooms.push(classroom);
      this.input = classroom;
    }
  }

  private async onSearch(input: string) {
    if (input.length < 2) {
      return;
    }

    this.classrooms = await this.$state.classroomManager.search(input, 5);
  }

  private onSelect(id: number) {
    this.$emit('input', id);
  }
}
</script>

