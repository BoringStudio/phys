<!-- BEGIN TEMPLATE -->
<template>
  <div class="log-page">
    <b-row class="m-0">
      <b-col md="3" class="students-list p-0">
        <div class="title">Студенты</div>
        <b-input v-model="filterString" class="search" placeholder="Поиск студента..."></b-input>
        <div class="items-container">
          <div
            class="item"
            v-for="(student, index) in filteredStudents"
            :key="`student-${index}`"
          >{{ student.fullName }} - {{ student.group }}</div>
        </div>
      </b-col>
      <b-col md="9" class="p-0">
        <div class="tabs">
          <div class="tab">Расписание</div>
          <div class="tab">Нормативы</div>
          <div class="tab">Инфо</div>
        </div>
        <div class="marks-table">
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
              class="marks-row"
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
      </b-col>
    </b-row>
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

class ModuleItem {}

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

      this.students.push(sampleStudent);
    }
  }

  public get filteredStudents() {
    return this.students.filter((s) => {
      if (this.filterString.length == 0) {
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
  .students-list {
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
    }
  }

  .marks-table {
    .title {
      display: flex;
      flex-direction: row;

      .item {
        width: 3.5em;
        height: 3em;
        @extend .item-centered;

        &.module {
          background-color: $module-color;
        }

        &:nth-child(odd) {
          background-color: darken($mark-color, 7.5);

          &.module {
            background-color: darken($module-color, 7.5);
          }
        }
      }
    }

    .rows-container {
      display: flex;
      flex-direction: column;

      .marks-row {
        height: 3em;
        display: flex;
        flex-direction: row;

        .item {
          width: 3.5em;
          @extend .item-centered;

          font-weight: bold;

          background-color: $mark-color;
          &.module {
            background-color: $module-color;
          }

          .custom-select {
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

        &:nth-child(odd) {
          .item:nth-child(odd),
          .item:nth-child(odd) .custom-select {
            background-color: darken($mark-color, 14);

            &.module {
              background-color: darken($module-color, 7.5);
            }
          }

          .item:nth-child(even),
          .item:nth-child(even) .custom-select {
            background-color: darken($mark-color, 7.5);

            &.module {
              background-color: darken($module-color, 7.5);
            }
          }
        }

        &:nth-child(even) {
          .item:nth-child(odd),
          .item:nth-child(odd) .custom-select {
            background-color: darken($mark-color, 7.5);

            &.module {
              background-color: $module-color;
            }
          }
        }
      }
    }
  }
}
</style>
<!-- END STYLE -->