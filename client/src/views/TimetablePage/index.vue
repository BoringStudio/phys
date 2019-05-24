<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Page from '@/components/Page.vue';
import GeneralModal from '@/components/GeneralModal.vue';

import { Day, Lesson, LessonInstance } from '@/models/Lesson';
import state from '@/models/State';

@Component({
  components: {
    Page,
    GeneralModal
  }
})
export default class TimeTablePage extends Vue {
  private lessonInstanceModal!: GeneralModal;

  private days: Day[] = [];

  private mounted() {
    this.lessonInstanceModal = this.$refs[
      'lesson-instance-modal'
    ] as GeneralModal;

    this.lessonInstanceModal.$on('submit', (lessonInstance: LessonInstance) => {
      if (lessonInstance.lesson) {
        lessonInstance.lesson.instances.push(lessonInstance);
      }

      this.lessonInstanceModal.setVisible(false);
    });

    this.days = [
      new Day('Понедельник'),
      new Day('Вторник'),
      new Day('Среда'),
      new Day('Четверг'),
      new Day('Пятница'),
      new Day('Суббота')
    ];
  }

  private addLessonInstance(lesson: Lesson) {
    this.lessonInstanceModal.show(new LessonInstance(lesson));
  }

  private openLog(lessonInstance: LessonInstance) {
    //state.currentInstance = lessonInstance;

    this.$router.push({
      name: 'log'
    });
  }
}
</script>
