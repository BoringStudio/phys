<!-- BEGIN TEMPLATE -->
<template>
  <div class="page log-page">
    <h3>
      <b-button variant="primary" class="mr-2" @click="$router.push('/')">Назад</b-button>
      {{ getLessonInstanceTitle() }}
    </h3>
    <hr>

    <div class="title noselect">
      <b-row class="m-0">
        <b-col class="p-1">
          <b-button variant="success" class="w-100 h-100" @click="addStudent">Добавить студента</b-button>
        </b-col>
        <b-col class="p-0">
          <div class="tabs">
            <div class="tab" :class="getTabClass('schedule')" @click="state = 'schedule'">Расписание</div>
            <div class="tab" :class="getTabClass('tests')" @click="state = 'tests'">Нормативы</div>
            <div class="tab" :class="getTabClass('info')" @click="state = 'info'">Инфо</div>
          </div>
        </b-col>
      </b-row>
    </div>

    <div class="wrapper">
      <div class="students-list">
        <b-input v-model="filterString" class="search" placeholder="Поиск студента..."></b-input>
        <div class="items-container">
          <div
            class="item"
            v-for="(student, index) in filteredStudents"
            :key="`student-${index}`"
            @click="editStudent(student)"
          >
            <b-row class="w-100">
              <b-col cols="8" class="my-auto">{{ student.fullName }}</b-col>
              <b-col cols="4">{{ student.group }}</b-col>
            </b-row>
          </div>
        </div>
      </div>
      <div class="tables">
        <!-- BEGIN MARKS TABLE -->
        <div class="schedule-table" v-if="state === 'schedule'">
          <div class="title">
            <template v-for="(semestrModule, moduleIndex) in moduleWeeks">
              <div
                class="item"
                v-for="(week, weekIndex) in semestrModule.dates"
                :key="`week-${moduleIndex}-${weekIndex}`"
              >{{ week | moment('DD.MM') }}</div>
              <div class="item module" :key="`title-module-${moduleIndex}`">
                <b>M {{ moduleIndex + 1 }}</b>
              </div>
            </template>
            <div class="item module">Баллы</div>
          </div>

          <div class="rows-container">
            <div
              class="items-row"
              v-for="(student, studentIndex) in filteredStudents"
              :key="`student-row-${studentIndex}`"
            >
              <template v-for="(semestrModule, moduleindex) in student.modules">
                <div
                  class="item"
                  v-for="(mark, markIndex) in semestrModule.marks"
                  :key="`mark-${studentIndex}-${moduleindex}-${markIndex}`"
                >
                  <b-form-select v-model="mark.value" :options="markOptions"></b-form-select>
                </div>
                <div
                  class="item module"
                  :key="`marks-module-${studentIndex}-${moduleindex}`"
                >{{ semestrModule.summ }}</div>
              </template>
              <div class="item module">{{ student.modules.reduce((s, v) => s + v.summ, 0) }}</div>
            </div>
          </div>
        </div>
        <!-- END MARKS TABLE -->

        <!-- BEGIN TESTS TABLE -->
        <div class="tests-table" v-else-if="state === 'tests'">
          <div class="title">
            <template v-for="(test, testIndex) in tests">
              <div class="item" :key="`test-${testIndex}`">{{test.name}}</div>
            </template>
          </div>
          <div class="rows-container">
            <div
              class="items-row"
              v-for="(student, studentIndex) in filteredStudents"
              :key="`student-row-${studentIndex}`"
            >
              <template v-for="(testMark, markIndex) in student.testMarks">
                <div class="item" :key="`test-result-${studentIndex}-${markIndex}`">
                  <b-input v-model="testMark.value"/>
                </div>
                <div
                  class="item"
                  :key="`test-mark-${studentIndex}-${markIndex}`"
                >{{testMark.value ? tests[markIndex].convert(testMark.value) : '-'}}</div>
              </template>
            </div>
          </div>
        </div>
        <!-- END TESTS TABLE -->
      </div>
    </div>

    <student-modal ref="student-modal"/>
  </div>
</template>
<!-- END TEMPLATE -->


<!-- BEGIN SCRIPT -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

import StudentModal from '@/components/StudentModal.vue';

import { Module, MarkType } from '@/model/Module';
import { Student, HealthGroup } from '@/model/Student';
import { Test } from '@/model/Test';

type State = 'schedule' | 'tests' | 'info';
type StudentState = 'add' | 'edit';

@Component({
  components: {
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

  public mounted() {
    this.studentModal = this.$refs['student-modal'] as StudentModal;
    this.studentModal.$on('submit', (student: Student) => {
      if (this.studentState == 'add') {
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

    const shuttleRunning = new Test('Челночный бег');
    shuttleRunning.grades = [22.0, 21.5, 20.5, 19.5, 18.5];
    shuttleRunning.direction = 'min';

    const maraphon = new Test('Бег на выносливость');
    maraphon.grades = [10, 11, 12, 13, 14];
    maraphon.direction = 'max';

    const lifts = new Test('Подтягивания');
    lifts.grades = [5, 7, 9, 12, 15];
    lifts.direction = 'max';

    const jumping = new Test('Прыжок в длину с места');
    jumping.grades = [2.1, 2.2, 2.3, 2.4, 2.5];
    jumping.direction = 'max';

    const lowerLifts = new Test('Отжимания');
    lowerLifts.grades = [10, 15, 20, 30, 45];
    lowerLifts.direction = 'max';

    this.tests = [shuttleRunning, maraphon, lifts, jumping, lowerLifts];

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

  public get filteredStudents() {
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

  public getTabClass(tab: string) {
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
<!-- END SCRIPT -->


<!-- BEGIN STYLE -->
<style lang="scss">
@import '@/styles/general.scss';

$mark-color: white;
$module-color: #b1bed5;
$summ-color: #bfd8d5;

$students-width: 425px;

.log-page {
  padding: 20px 40px;

  .wrapper {
    min-width: 1000px;
    overflow-x: auto;

    display: flex;
    flex-direction: row;
  }

  & > .title {
    height: $title-height;
    font-weight: bold;

    @extend .item-centered;
    align-items: flex-start;

    background-color: $title-color;

    .col:first-child {
      flex: none;
      width: $students-width;
    }
  }

  .tabs {
    height: $title-height;

    display: flex;
    flex-direction: row;

    background-color: $title-color;

    .tab {
      padding: 10px;
      @extend .item-centered;
      font-weight: bold;

      &:hover {
        background-color: darken($title-color, 7.5);
        cursor: pointer;
      }

      &.active {
        background-color: darken($title-color, 14);
      }
    }
  }

  .students-list {
    flex: none;
    display: flex;
    flex-direction: column;
    width: $students-width;

    .search {
      height: $row-height;
      border-radius: 0;
      border: none;

      &:focus {
        box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.75);
      }
    }

    .items-container {
      .item {
        width: 100%;
        height: $row-height;
        padding: 5px;

        @extend .item-centered;
        align-items: flex-start;

        &:nth-child(odd) {
          background-color: darken($mark-color, 7.5);
        }

        &:hover {
          cursor: pointer;
          background-color: darken($mark-color, 14);
        }
      }
    }
  }

  .tables {
    width: 100%;

    .rows-container {
      display: flex;
      flex-direction: column;
    }

    .items-row,
    .title {
      height: $row-height;
      display: flex;
      flex-direction: row;

      .item {
        width: 3.5em;
        height: 100%;
        @extend .item-centered;

        font-weight: bold;

        .custom-select,
        .form-control {
          height: $row-height;

          padding-right: 0px;
          border-radius: 0px;

          border: none;
          background-position: right 5px bottom 50%;
          transition: none;

          &:hover,
          &:focus {
            transition: none;
            box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.75);
          }
        }
      }

      .item:nth-child(odd),
      .item:nth-child(odd) .custom-select,
      .item:nth-child(odd) .form-control {
        background-color: rgba(0, 0, 0, 0.025);
      }

      .item:nth-child(even),
      .item:nth-child(even) .custom-select,
      .item:nth-child(even) .form-control {
        background-color: transparent;
      }

      &:nth-child(odd) {
        &:not(.title) {
          background-color: darken($mark-color, 7);
        }

        .item.module {
          background-color: darken($module-color, 7);
        }
      }

      &:nth-child(even) {
        .item.module {
          background-color: $module-color;
        }
      }

      .item.module:last-child {
        margin-left: auto;
      }
    }
  }

  .tests-table {
    .title .item {
      width: 14em;
    }

    .items-row .item {
      width: 7em;
    }
  }
}
</style>
<!-- END STYLE -->