<template>
  <div class="c-student-input">
    <b-model-list-select
      class="form-control"
      :list="students"
      option-value="id"
      :custom-text="serialize"
      v-model="input"
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
      this.students.push(student);
      this.input = student;
    }
  }

  private async onSearch(input: string) {
    if (input.length < 2) {
      return;
    }

    this.students = await this.$state.studentManager.search(input, 5);
  }

  private onSelect(id: number) {
    this.$emit('input', id);
  }

  private serialize(student: Student) {
    return student.fullName;
  }
}
</script>
