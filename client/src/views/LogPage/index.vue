<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment-timezone';

import Page from '@/components/Page.vue';
import LessonStudentModal from '@/components/LessonStudentModal.vue';

import { Student } from '@/models/managers/Student';
import { Test } from '@/models/managers/Test';
import { Lesson, LessonFullInfo } from '@/models/managers/Lesson';
import { Classroom } from '@/models/managers/Classroom';
import { Discipline } from '@/models/managers/Discipline';
import { Semester } from '@/models/managers/Semester';
import { Group } from '@/models/managers/Group';
import { Module } from '@/models/managers/Module';
import { Mark } from '@/models/managers/Mark';
import { StudentVisit } from '@/models/managers/StudentVisit';

import {
  getLessonNumberName,
  getDayName,
  insertOrUpdate,
  deleteByIndex,
  findById,
  findIndexById
} from '@/models/Stuff';

type State = 'schedule' | 'tests' | 'info';

interface ModuleWeek {
  number: number;
  date: Date;
}

@Component({
  components: {
    Page,
    LessonStudentModal
  }
})
export default class LogPage extends Vue {
  private lessonStudentModal!: LessonStudentModal;

  private filterString: string = '';

  private uniqueVisitsKey: number = 0;
  private state: State = 'schedule';

  private lesson: Lesson = new Lesson();
  private classroom: Classroom = new Classroom();
  private discipline: Discipline = new Discipline();
  private semester: Semester = new Semester();
  private modules: Module[] = [];
  private students: Student[] = [];
  private groups: Group[] = [];

  private marks: Mark[] = [];

  private studentVisits: StudentVisit[] = [];

  private moduleWeeks: ModuleWeek[][] = [];
  private weekToModule: Map<number, number> = new Map();
  private moduleVisits: Array<StudentVisit | null>[][] = [];

  private created() {
    this.$bus.on(
      'lesson_student_added',
      async (entry: { lessonId: number; studentId: number }) => {
        if (!this.isLessonInitialized || this.lesson.id !== entry.lessonId) {
          return;
        }

        const student = await this.$state.studentManager.fetchOne(
          entry.studentId
        );

        const groupIndex = findIndexById(this.groups, student.group);
        if (groupIndex < 0) {
          insertOrUpdate(
            this.groups,
            await this.$state.groupManager.fetchOne(student.group)
          );
        }

        insertOrUpdate(this.students, student);

        this.fillStudentVisits();
      }
    );

    this.$bus.on(
      'lesson_student_removed',
      (entry: { lessonId: number; studentId: number }) => {
        if (!this.isLessonInitialized || this.lesson.id !== entry.lessonId) {
          return;
        }

        deleteByIndex(this.students, entry.studentId);

        this.fillStudentVisits();
      }
    );

    this.$bus.on('student_visit_updated', (visit: StudentVisit) => {
      insertOrUpdate(this.studentVisits, visit);
    });

    this.$bus.on(
      ['student_visit_created', 'student_visit_removed'],
      async () => {
        this.studentVisits = await this.$state.studentVisitManager.fetchLessonVisits(
          this.lesson.id
        );
      }
    );
  }

  private async beforeMount() {
    this.reset();

    const lessonId = parseInt(this.$route.params.id) || 0;

    try {
      const [info, marks] = await Promise.all([
        this.$state.lessonManager.fetchFullInfo(lessonId),
        this.$state.markManager.fetchAll()
      ]);

      this.classroom = info.classroom;
      this.discipline = info.discipline;
      this.semester = info.semester;
      this.modules = info.modules;
      this.students = info.students;
      this.groups = info.groups;

      this.lesson = info.lesson;

      this.marks = marks;
      this.studentVisits = await this.$state.studentVisitManager.fetchLessonVisits(
        this.lesson.id
      );

      this.fillWeeks();
      this.fillStudentVisits();
    } catch (e) {
      this.$router.back();
      this.$notify({
        title: 'Не удалось открыть журнал',
        type: 'error'
      });
      return;
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
          await this.$state.lessonManager.addStudent(this.lesson.id, student);
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

      const group = this.getStudentGroup(s);

      const words = this.filterString.toLowerCase().split(' ');
      return words.every(
        (w) =>
          s.fullName.toLowerCase().includes(w) ||
          (group != null && group.name.toLowerCase().includes(w))
      );

      return false;
    });
  }

  private getTabClass(tab: string) {
    return {
      active: this.state === tab
    };
  }

  private getStudentGroup(student: Student) {
    return findById(this.groups, student.group);
  }

  private reset() {
    this.lesson = new Lesson();
    this.classroom = new Classroom();
    this.discipline = new Discipline();
    this.semester = new Semester();
    this.students = [];
    this.groups = [];

    this.marks = [];
    this.studentVisits = [];

    this.moduleWeeks = [];
    this.moduleVisits = [];
  }

  private fillWeeks() {
    const weeks = this.lessonDates;

    this.moduleWeeks = this.modules.map(() => []);
    this.weekToModule = new Map();

    let w = 0;
    for (let m = 0; m < this.modules.length; ++m) {
      // Offset weeks which are not in range
      for (
        ;
        w < weeks.length &&
        (weeks[w] < this.modules[m].begin || weeks[w] > this.modules[m].end);
        ++w
      );

      // Add weeks which are in range
      for (
        ;
        w < weeks.length &&
        weeks[w] >= this.modules[m].begin &&
        weeks[w] <= this.modules[m].end;
        ++w
      ) {
        this.moduleWeeks[m].push({
          number: w,
          date: weeks[w]
        });
        this.weekToModule.set(w, m);
      }
    }
  }

  private fillStudentVisits() {
    const lessonDates = this.lessonDates;

    // Fill student visits
    this.moduleVisits = this.students.map((student) => {
      const moduleVisits: (StudentVisit | null)[][] = this.moduleWeeks.map(
        (weeks) => weeks.map(() => null)
      );

      this.studentVisits
        .filter((v) => v.student === student.id)
        .forEach((v) => {
          if (v.week < lessonDates.length) {
            // Find module
            const moduleIndex = this.weekToModule.get(v.week);
            if (moduleIndex == null) {
              return;
            }

            // Find Index
            const weekIndex = this.moduleWeeks[moduleIndex].findIndex(
              (w) => w.number === v.week
            );
            if (weekIndex == null) {
              return;
            }

            // Set visit to week in module
            moduleVisits[moduleIndex][weekIndex] = v;
          }
        });

      return moduleVisits;
    });
  }

  private getStudentVisits(student: Student) {
    const studentIndex = this.students.findIndex((s) => s.id === student.id);
    if (studentIndex < 0 || studentIndex >= this.moduleVisits.length) {
      return [];
    }

    return this.moduleVisits[studentIndex];
  }

  private async onMarkChanged(
    student: Student,
    moduleIndex: number,
    visitIndex: number,
    value: number
  ) {
    const studentVisits = this.getStudentVisits(student);
    const visit = studentVisits[moduleIndex][visitIndex];

    if (value == null) {
      if (visit == null) {
        return;
      }

      try {
        await this.$state.studentVisitManager.remove(visit.id);
        this.updateVisit(student, moduleIndex, visitIndex, null);
      } catch (e) {
        this.$notify({
          title: 'Невозможно удалить посещение',
          type: 'error'
        });
        this.updateVisit(student, moduleIndex, visitIndex, visit);
      }
      return;
    }

    const create = visit == null;

    try {
      let res: StudentVisit = new StudentVisit();
      if (create) {
        res = await this.$state.studentVisitManager.create({
          mark: value,
          week: this.moduleWeeks[moduleIndex][visitIndex].number,
          lesson: this.lesson.id,
          student: student.id
        });
      } else {
        res = await this.$state.studentVisitManager.update({
          ...visit!,
          mark: value
        });
      }

      this.updateVisit(student, moduleIndex, visitIndex, res);
    } catch (e) {
      this.$notify({
        title: `Невозможно ${create ? 'создать' : 'изменить'} посещение`,
        type: 'error'
      });
      this.updateVisit(student, moduleIndex, visitIndex, visit);
    }
  }

  private updateVisit(
    student: Student,
    moduleIndex: number,
    visitIndex: number,
    value: StudentVisit | null
  ) {
    const studentIndex = this.students.findIndex((s) => s.id === student.id);

    const moduleVisits = this.moduleVisits[studentIndex];
    moduleVisits[moduleIndex][visitIndex] = value;

    Vue.set(this.moduleVisits, studentIndex, moduleVisits);

    ++this.uniqueVisitsKey;
  }

  private getModuleSumm(visits: Array<StudentVisit | null>) {
    return visits.reduce((sum, visit) => {
      if (visit == null) {
        return sum;
      }

      const mark = findById(this.marks, visit.mark);
      return sum + ((mark && mark.weight) || 0);
    }, 0);
  }

  private getStudentSumm(student: Student) {
    const studentVisits = this.getStudentVisits(student);
    return studentVisits.reduce((sum, m) => sum + this.getModuleSumm(m), 0);
  }

  private get lessonDates() {
    const weekBegin = moment(this.semester.begin).startOf('week');
    const end = moment(this.semester.end);

    const weeks: Date[] = [];

    const current = weekBegin.add(this.lesson.day, 'days');
    while (current < end) {
      weeks.push(current.toDate());
      current.add(1, 'week');
    }

    return weeks;
  }

  private get lessonTitle() {
    if (!this.isLessonInitialized) {
      return '';
    }

    return `${getDayName(this.lesson.day)}, ${getLessonNumberName(
      this.lesson.number
    )}, ${this.classroom.name}, ${this.discipline.name}`;
  }

  private get isLessonInitialized() {
    return this.lesson.id > 0;
  }

  private get markOptions() {
    const options: Array<{ value: number | null; text: string }> = [
      { value: null, text: '' }
    ];

    return options.concat(
      this.marks.map((m) => ({
        value: m.id,
        text: m.symbol
      }))
    );
  }
}
</script>
