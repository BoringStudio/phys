<!-- TEMPALTE BEGIN -->
<template>
  <div class="page timetable-page">
    <div class="wrapper">
      <h3>Расписание</h3>
      <hr>

      <b-row>
        <b-col sm="12" lg="6" xl="4" v-for="(day, dayIndex) in days" :key="`day-${dayIndex}`">
          <div class="day">
            <div class="title">{{ day.name }}</div>
            <div class="lessons-list">
              <b-row
                class="lesson m-0"
                v-for="(lesson, lessonIndex) in day.lessons"
                :key="`lesson-${dayIndex}-${lessonIndex}`"
              >
                <b-col class="p-0 item-centered">{{ lesson.name }}</b-col>
                <b-col class="p-0">
                  <b-row
                    class="place m-0"
                    v-for="(instance, instanceIndex) in lesson.instances"
                    :key="`lesson-${dayIndex}-${lessonIndex}-${instanceIndex}`"
                    @click="openLog(instance)"
                  >
                    <b-col class="item-centered">{{ instance.place }}</b-col>
                    <b-col class="item-centered">{{ instance.type }}</b-col>
                  </b-row>

                  <b-row class="place m-0" v-if="lesson.isEmpty" @click="addLessonInstance(lesson)">
                    <b-col class="item-centered button-add">
                      <a-icon icon="plus"/>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
    </div>

    <lesson-instance-modal ref="lesson-instance-modal" />
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LessonInstanceModal from '@/components/LessonInstanceModal.vue';

import { Day, Lesson, LessonInstance } from '@/model/Lesson';
import state from '@/model/State';

class Teacher {}

@Component({
  components: {
    LessonInstanceModal
  }
})
export default class TimeTablePage extends Vue {
  private lessonInstanceModal!: LessonInstanceModal;

  private days: Day[] = [];

  private mounted() {
    this.lessonInstanceModal = this.$refs['lesson-instance-modal'] as LessonInstanceModal;
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
    state.currentInstance = lessonInstance;

    this.$router.push({
      name: 'log'
    })
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

$border-color: rgba(0, 0, 0, 0.14);

.timetable-page {
  & > .title {
    height: $title-height;
    font-weight: bold;

    @extend .item-centered;
    align-items: flex-start;

    background-color: $title-color;
  }

  .wrapper {
    margin: 20px 40px;
  }

  .day {
    border: 1px solid $border-color;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .title {
      @extend .item-centered;

      height: $title-height;
      background-color: rgba(0, 0, 0, 0.075);
    }

    .lesson {
      min-height: $title-height;

      .place {
        height: $row-height;

        &:hover {
          background-color: rgba(0, 0, 0, 0.14);
          cursor: pointer;
        }
      }

      &:not(:last-child),
      .place:not(:last-child) {
        border-bottom: 1px solid $border-color;
      }

      & > .col:first-child {
        border-right: 1px solid $border-color;
      }

      .button-add {
        color: $border-color;
      }
    }
  }
}
</style>
<!-- STYLE END -->