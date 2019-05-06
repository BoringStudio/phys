<!-- TEMPALTE BEGIN -->
<template>
  <div class="c-lesson-instance-modal">
    <b-modal v-model="isModalVisible" no-fade>
      <template slot="modal-title">Пара</template>

      <b-form-group label="Аудитория">
        <b-form-input type="text" autocomplete="false" v-model="lessonInstance.place"/>
      </b-form-group>

      <b-form-group label="Дисциплина">
        <b-form-input type="text" autocomplete="false" v-model="lessonInstance.type"/>
      </b-form-group>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="isModalVisible = false">Отменить</button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="isModalInProcess"
          @click="onSubmitModal"
        >Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>
<!-- TEMAPLTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { Lesson, LessonInstance } from '@/model/Lesson';

@Component
export default class LessonInstanceModal extends Vue {
  private isModalVisible: boolean = false;
  private isModalInProcess: boolean = false;

  private lessonInstance: LessonInstance = new LessonInstance();

  public setVisible(visible: boolean) {
    this.isModalVisible = visible;
  }

  public setInProcess(inProcess: boolean) {
    this.isModalInProcess = inProcess;
  }

  public show(lessonInstance?: LessonInstance) {
    this.lessonInstance = lessonInstance || new LessonInstance();
    this.setInProcess(false);
    this.setVisible(true);
  }

  private onSubmitModal() {
    this.$emit('submit', this.lessonInstance);
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
