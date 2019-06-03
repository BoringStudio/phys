<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

import Page from '@/components/Page.vue';
import LessonStudentModal from '@/components/LessonStudentModal.vue';

import { Student } from '@/models/managers/Student';
import { Test } from '@/models/managers/Test';
import { Lesson } from '../../models/managers/Lesson';
import { Classroom } from '../../models/managers/Classroom';
import { Discipline } from '../../models/managers/Discipline';
import { Semester } from '../../models/managers/Semester';
import {
  getLessonNumberName,
  getDayName,
  insertOrUpdate,
  deleteByIndex
} from '../../models/Stuff';

type State = 'schedule' | 'tests' | 'info';
type StudentState = 'add' | 'edit';

@Component({
  components: {
    Page,
    LessonStudentModal
  }
})
export default class LogPage extends Vue {
  private lessonStudentModal!: LessonStudentModal;

  private filterString: string = '';

  private moduleWeeks: Array<{ dates: Date[] }> = [];

  private tests: Test[] = [];
  //private modules: Module[] = [];

  private state: State = 'schedule';
  private studentState: StudentState = 'edit';

  private lesson: Lesson | null = null;
  private classroom: Classroom | null = null;
  private discipline: Discipline | null = null;
  private semester: Semester | null = null;

  private students: Student[] = [];

  private created() {
    this.$bus.on(
      'lesson_student_added',
      async (entry: { lessonId: number; studentId: number }) => {
        console.log(entry, this.lesson);

        if (this.lesson == null || entry.lessonId !== this.lesson.id) {
          return;
        }

        insertOrUpdate(
          this.students,
          await this.$state.studentManager.fetchOne(entry.studentId)
        );
      }
    );

    this.$bus.on(
      'lesson_student_removed',
      (entry: { lessonId: number; studentId: number }) => {
        if (this.lesson == null || entry.lessonId !== this.lesson.id) {
          return;
        }

        deleteByIndex(this.students, entry.studentId);
      }
    );
  }

  private async beforeMount() {
    this.students = [];

    const lessonId = this.$route.params.id;

    try {
      this.lesson = await this.$state.lessonManager.fetchOne(
        parseInt(lessonId, 10)
      );

      [this.classroom, this.discipline, this.semester] = await Promise.all([
        this.$state.classroomManager.fetchOne(this.lesson.classroom),
        this.$state.disciplineManager.fetchOne(this.lesson.discipline),
        this.$state.semesterManager.fetchOne(this.lesson.semester)
      ]);
    } catch (e) {
      this.$router.back();
      this.$notify({
        title: 'Не удалось открыть журнал',
        type: 'error'
      });
      return;
    }

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

      // const newModule = new Module(i + 1);
      // newModule.marks = Array.apply(null, Array(j - week)).map(() => ({
      //   value: null
      // }));
      //this.modules.push(newModule);

      this.moduleWeeks.push({ dates });

      week += 6;
    }
  }

  private mounted() {
    this.lessonStudentModal = this.$refs[
      'lesson-student-modal'
    ] as LessonStudentModal;
    this.lessonStudentModal.$on(
      'submit',
      async ({ student }: { student: number }) => {
        this.lessonStudentModal.setInProcess(true);

        try {
          await this.$state.lessonManager.addStudent(this.lesson!.id, student);
          this.lessonStudentModal.setVisible(false);
        } catch (e) {
          this.$notify({
            title: 'Невозможно добавить студента',
            type: 'error'
          });
          this.lessonStudentModal.setInProcess(false);
        }
      }
    );
  }

  private addStudent() {
    this.lessonStudentModal.show({
      student: -1
    });
  }

  private get filteredStudents() {
    return this.students.filter((s) => {
      if (this.filterString.length === 0) {
        return true;
      }

      const words = this.filterString.toLowerCase().split(' ');
      return words.every(
        (w) =>
          s.fullName
            .toLowerCase()
            .includes(w) /* ||
          s.group.toLowerCase().includes(w)*/
      );

      return false;
    });
  }

  private getTabClass(tab: string) {
    return {
      active: this.state === tab
    };
  }

  private get lessonTitle() {
    const hasTitle =
      this.lesson != null && this.classroom != null && this.discipline != null;

    if (!hasTitle) {
      return '';
    }

    return hasTitle
      ? `${getDayName(this.lesson!.day)}, ${getLessonNumberName(
          this.lesson!.number
        )}, ${this.classroom!.name}, ${this.discipline!.name}`
      : '';
  }
}
</script>
