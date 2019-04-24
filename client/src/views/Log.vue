<!-- BEGIN TEMPLATE -->
<template>
  <div class="log-page">
    <div class="wrapper">
      <div class="students-list">
        <div class="title noselect">Студенты</div>
        <b-input v-model="filterString" class="search" placeholder="Поиск студента..."></b-input>
        <div class="items-container">
          <div
            class="item"
            v-for="(student, index) in filteredStudents"
            :key="`student-${index}`"
          >{{ student.fullName }} - {{ student.group }}</div>
        </div>
      </div>
      <div class="tables">
        <div class="tabs noselect">
          <div class="tab" :class="getTabClass('schedule')" @click="state = 'schedule'">Расписание</div>
          <div class="tab" :class="getTabClass('tests')" @click="state = 'tests'">Нормативы</div>
          <div class="tab" :class="getTabClass('info')" @click="state = 'info'">Инфо</div>
        </div>

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

        <!-- BEGIN MARKS TABLE -->
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
        <!-- END MARKS TABLE -->
      </div>
    </div>
  </div>
</template>
<!-- END TEMPLATE -->


<!-- BEGIN SCRIPT -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import moment from 'moment-timezone';

class Student {
  public surname: string;
  public name: string;
  public middleName: string;

  public group: string;

  public modules: Module[] = [];

  public testMarks: Array<{ value: number | null }> = [];

  constructor(
    surname: string,
    name: string,
    middleName: string,
    group: string
  ) {
    this.surname = surname;
    this.name = name;
    this.middleName = middleName;
    this.group = group;
  }

  public get fullName(): string {
    return `${this.surname} ${this.name} ${this.middleName}`;
  }
}

type State = 'schedule' | 'tests' | 'info';

class Module {
  public position: number;
  public marks: Array<{ value: MarkType | null }> = [];

  constructor(position: number) {
    this.position = position;
  }

  public get summ() {
    return this.marks.reduce(
      (sum, mark) =>
        sum + (mark.value == null ? 0 : Module.markWeight(mark.value)),
      0
    );
  }

  public static markWeight(mark: MarkType) {
    switch (mark) {
      case MarkType.Schedule:
        return 2.5;
      case MarkType.OutOfSchedule:
        return 2;
      case MarkType.Skip:
        return 0;
      case MarkType.TrustedSkip:
        return 2.5;
      case MarkType.Ill:
        return 2;
      case MarkType.Retrieval:
        return 2;
    }
  }
}

enum MarkType {
  Schedule,
  OutOfSchedule,
  Skip,
  TrustedSkip,
  Ill,
  Retrieval
}

class Test {
  public name: string;
  public grades: number[] = [];
  public direction: 'min' | 'max' = 'max';

  constructor(name: string) {
    this.name = name;
  }

  public convert(value: number): number {
    if (this.grades.length !== 5) {
      throw 'Each test must contain 5 grades!';
    }

    if (this.direction === 'max') {
      if (value < this.grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value >= this.grades[i] && value < this.grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    } else {
      if (value > this.grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value <= this.grades[i] && value > this.grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    }
  }
}

@Component
export default class LogPage extends Vue {
  private filterString: string = '';

  private moduleWeeks: Array<{ dates: Date[] }> = [];

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

  private tests: Test[] = [];

  private state: State = 'schedule';

  public mounted() {
    const septemberBegin = moment('11.02.2019', 'DD.MM.YYYY');

    const defaultModules: Module[] = [];

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
      defaultModules.push(newModule);

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

    for (let i = 0; i < 20; ++i) {
      const sampleStudent = new Student(
        'Иванов',
        'Иван',
        'Иванович',
        `ИВБО-${Math.floor(Math.random() * 20 + 1)}-16`
      );

      sampleStudent.modules = defaultModules.map((m) => {
        const res = new Module(m.position);
        res.marks = m.marks.map((v) => ({ value: v.value }));
        return res;
      });

      sampleStudent.testMarks = Array.apply(null, Array(this.tests.length)).map(
        () => ({ value: null })
      );

      this.students.push(sampleStudent);
    }
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
}
</script>
<!-- END SCRIPT -->


<!-- BEGIN STYLE -->
<style lang="scss">
.item-centered {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

$title-color: #b1bed5;
$mark-color: white;
$module-color: #b1bed5;
$summ-color: #bfd8d5;

.log-page {
  .wrapper {
    min-width: 1000px;
    overflow-x: scroll;

    display: flex;
    flex-direction: row;
    justify-items: stretch;
  }

  .students-list {
    flex: 1;
    display: flex;
    flex-direction: column;

    .title {
      height: 3em;
      padding: 5px;
      font-weight: bold;

      @extend .item-centered;
      align-items: flex-start;

      background-color: $title-color;
    }

    .search {
      height: 3em;
      border-radius: 0;
      border: none;

      &:focus {
        box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.75);
      }
    }

    .items-container {
      .item {
        width: 100%;
        height: 3em;
        padding: 5px;

        @extend .item-centered;
        align-items: flex-start;

        &:nth-child(odd) {
          background-color: darken($mark-color, 7.5);
        }
      }
    }
  }

  .tabs {
    height: 3em;

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

  .tables {
    flex: 3;
    width: 100%;

    .rows-container {
      display: flex;
      flex-direction: column;
    }

    .items-row,
    .title {
      height: 3em;
      display: flex;
      flex-direction: row;

      .item {
        width: 3.5em;
        @extend .item-centered;

        font-weight: bold;

        .custom-select,
        .form-control {
          height: 3em;

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