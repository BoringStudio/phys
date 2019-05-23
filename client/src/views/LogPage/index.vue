<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

import Page from '@/components/Page.vue';
import StudentModal from '@/components/StudentModal.vue';

import { Module, MarkType } from '@/model/Module';
import { Student, HealthGroup } from '@/model/Student';
import { Test } from '@/model/Test';

type State = 'schedule' | 'tests' | 'info';
type StudentState = 'add' | 'edit';

@Component({
  components: {
    Page,
    StudentModal
  }
})
export default class LogPage extends Vue {
  private studentModal!: StudentModal;

  private filterString: string = '';

  private moduleWeeks: Array<{ dates: Date[] }> = [];

  private tests: Test[] = [];
  private modules: Module[] = [];
  private students: Student[] = [];

  private markOptions = [
    { value: null, text: '' },
    { value: MarkType.Schedule, text: 'V' },
    { value: MarkType.OutOfSchedule, text: 'W' },
    { value: MarkType.Skip, text: 'Н' },
    { value: MarkType.TrustedSkip, text: 'У' },
    { value: MarkType.Ill, text: 'Б' },
    { value: MarkType.Retrieval, text: 'О' }
  ];

  private state: State = 'schedule';
  private studentState: StudentState = 'edit';

  private mounted() {
    this.studentModal = this.$refs['student-modal'] as StudentModal;
    this.studentModal.$on('submit', (student: Student) => {
      if (this.studentState === 'add') {
        this.students.push(student);
        this.fillStudent(student);
      }

      this.studentModal.setVisible(false);
    });

    const septemberBegin = moment('11.02.2019', 'DD.MM.YYYY');

    let week = 0;
    for (let i = 0; i < 3; ++i) {
      const dates: Date[] = [];

      let j = week;
      for (; j < week + 6 && j < 15; ++j) {
        dates.push(
          new Date(
            septemberBegin
              .clone()
              .add(j, 'weeks')
              .toDate()
          )
        );
      }

      const newModule = new Module(i + 1);
      newModule.marks = Array.apply(null, Array(j - week)).map(() => ({
        value: null
      }));
      this.modules.push(newModule);

      this.moduleWeeks.push({ dates });

      week += 6;
    }

    for (let i = 0; i < 10; ++i) {
      const sampleStudent = new Student(
        'Иванов',
        'Иван',
        'Иванович',
        `ИВБО-${Math.floor(Math.random() * 20 + 1)}-16`,
        HealthGroup.First
      );

      this.fillStudent(sampleStudent);

      this.students.push(sampleStudent);
    }
  }

  private fillStudent(student: Student) {
    student.modules = this.modules.map((m) => {
      const res = new Module(m.position);
      res.marks = m.marks.map((v) => ({ value: v.value }));
      return res;
    });

    student.testMarks = Array.apply(null, Array(this.tests.length)).map(() => ({
      value: null
    }));
  }

  private get filteredStudents() {
    return this.students.filter((s) => {
      if (this.filterString.length === 0) {
        return true;
      }

      const words = this.filterString.toLowerCase().split(' ');
      return words.every(
        (w) =>
          s.fullName.toLowerCase().includes(w) ||
          s.group.toLowerCase().includes(w)
      );

      return false;
    });
  }

  private getTabClass(tab: string) {
    return {
      active: this.state === tab
    };
  }

  private addStudent() {
    this.studentState = 'add';
    this.studentModal.show(new Student());
  }

  private editStudent(student: Student) {
    this.studentState = 'edit';
    this.studentModal.show(student);
  }

  private getLessonInstanceTitle() {
    return `${
      this.$state.currentInstance.lesson
        ? this.$state.currentInstance.lesson.name
        : ''
    } ${this.$state.currentInstance.place}, ${
      this.$state.currentInstance.type
    }`;
  }
}
</script>
