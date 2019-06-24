<template>
  <div class="c-student-input">
    <b-model-list-select
      class="form-control"
      :key="uniqueKey"
      :list="students"
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
import { Component, Model, Watch, Vue } from 'vue-property-decorator';
import { Student } from '@/models/managers/Student';

@Component
export default class StudentInput extends Vue {
  private input: Student | null = null;
  private students: Student[] = [];

  private uniqueKey: number = 0;

  @Model('input', { type: Number })
  private readonly student!: number;

  @Watch('student', {
    immediate: true
  })
  private async onStudentChanged(val: number, oldVal: number) {
    if (val < 0) {
      this.input = null;
      return;
    }

    if (val !== oldVal) {
      const student = await this.$state.studentManager.fetchOne(val);
      this.students = [student];
      this.input = student;
    }
  }

  private async onSearch(search: string) {
    this.students = await this.$state.studentManager.search(search, 5);
  }

  private async onSelect(student: Student | number) {
    if (typeof student === 'number') {
      student = await this.$state.studentManager.fetchOne(student);
    }

    const empty = Object.entries(student).length === 0;

    this.input = empty ? null : student;
    this.$emit('input', student.id);

    this.uniqueKey++;
  }

  private serialize(student: Student) {
    return (
      ((student.groupName && `${student.groupName} `) || '') + student.fullName
    );
  }
}
</script>
