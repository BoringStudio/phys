<!-- BEGIN TEMPLATE -->
<template>
  <div class="log-page">
    <b-row>
      <b-col md="3" class="students-list">
        <div class="title">Студенты</div>
        <b-input class="search" placeholder="Поиск студента..."></b-input>
        <div class="items-container">
          <div class="item" v-for="(student, index) in students" :key="`student-${index}`">
            {{ student.fullName }} - {{ student.group }}
          </div>
        </div>
      </b-col>
      <b-col md="9">
        <div class="tabs">
          <div class="tab">Расписание</div>
        </div>
        <div class="marks-table">
          <div class="title">
            <template v-for="(semestrModule, moduleindex) in modules">
              <div class="item" v-for="(week, weekIndex) in semestrModule.weeks" :key="`week-${moduleindex}-${weekIndex}`">
                {{ week | moment('DD.MM') }}
              </div>
              <div class="item">
                <b>M {{ moduleindex + 1 }}</b>
              </div>
            </template>
          </div>
          <div class="rows-container">
            <div class="marks-row" v-for="(student, studentIndex) in students" :key="`student-row-${studentIndex}`">
              <template v-for="(semestrModule, moduleindex) in modules">
                <div class="item" v-for="(week, markIndex) in semestrModule.weeks" :key="`mark-${studentIndex}-${moduleindex}-${markIndex}`">
                  <b-form-select :options="markOptions"></b-form-select>
                </div>
                <div class="item"></div>
              </template>
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

  constructor(surname: string, name: string, middleName: string, group: string) {
    this.surname = surname;
    this.name = name;
    this.middleName = middleName;
    this.group = group;
  }

  public get fullName(): string {
    return `${this.surname} ${this.name} ${this.middleName}`;
  }
}

class ModuleItem {

}

class Module {
  public id: number;
  public weeks: Date[] = [];

  constructor(id: number) {
    this.id = id;
  }
}

@Component
export default class LogPage extends Vue {
  private modules: Module[] = [];
  private students: Student[] = [];

  private markOptions = [
    { value: null, text: '' },
    { value: 1, text: 'V' },
    { value: 2, text: 'W' },
    { value: 3, text: 'Н' },
    { value: 4, text: 'У' },
    { value: 5, text: 'Б' },
    { value: 6, text: 'О' },
  ];

  public mounted() {
    const septemberBegin = moment('11.02.2019', 'DD.MM.YYYY');

    let week = 0;
    for (let i = 0; i < 3; ++i) {
      const semestrModule = new Module(i);

      for (let j = week; j < (week + 6) && j < 15; ++j) {
        semestrModule.weeks.push(new Date(septemberBegin.clone().add(j, 'weeks').toDate()));
      }

      this.modules.push(semestrModule);

      week += 6;
    }

    const sampleStudent = new Student('Иванов', 'Иван', 'Иванович', 'ИВБО-01-16');
    for (let i = 0; i < 20; ++i) {
      this.students.push(sampleStudent);
    }
  }
}
</script>
<!-- END SCRIPT -->


<!-- BEGIN STYLE -->
<style lang="scss">
.log-page {
  .students-list {
    display: flex;
    flex-direction: column;

    .title {
      height: 3em;
      padding: 5px;
      font-weight: bold;
    }

    .search {
      height: 3em;
    }

    .items-container {
      .item {
        width: 100%;
        height: 3em;
        padding: 5px;

        display: flex;
        flex-direction: column;
        justify-items: center;
        justify-content: center;

        &:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.075);
        }
      }
    }
  }

  .tabs {
    height: 3em;
  }

  .marks-table {
    .title {
      display: flex;
      flex-direction: row;
      

      .item {
        width: 3.5em;
        height: 3em;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &:nth-child(odd) {
          background-color: rgba(0, 0, 0, 0.075);
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

          .custom-select {
            margin: 1px;
            height: 3em;

            padding-right: 0px;
            border-radius: 0px;

            background-position: right 5px bottom 50%;

            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }
  }
}
</style>
<!-- END STYLE -->