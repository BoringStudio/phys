<!-- TEMPALTE BEGIN -->
<template>
  <div class="c-student-modal">
    <b-modal v-model="isModalVisible" no-fade>
      <template slot="modal-title">Студент</template>

      <b-form-group label="Фамилия">
        <b-form-input type="text" autocomplete="false" v-model="student.surname"/>
      </b-form-group>

      <b-form-group label="Имя">
        <b-form-input type="text" autocomplete="false" v-model="student.name"/>
      </b-form-group>

      <b-form-group label="Отчество">
        <b-form-input type="text" autocomplete="false" v-model="student.middleName"/>
      </b-form-group>

      <b-form-group label="Учебная группа">
        <b-form-input type="text" autocomplete="false" v-model="student.group"/>
      </b-form-group>

      <b-form-group label="Группа здоровья">
        <b-form-select
          :options="healthGroupOptions"
          autocomplete="false"
          v-model="student.healthGroup"
        />
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
import { HealthGroup, healthGroupName, Student } from '../model/Student';

@Component
export default class StudentModal extends Vue {
  private healthGroupOptions = [
    {
      value: HealthGroup.First,
      text: healthGroupName(HealthGroup.First)
    },
    {
      value: HealthGroup.Second,
      text: healthGroupName(HealthGroup.Second)
    },
    {
      value: HealthGroup.Third,
      text: healthGroupName(HealthGroup.Third)
    }
  ];

  private isModalVisible: boolean = false;
  private isModalInProcess: boolean = false;

  private student: Student = new Student();

  public setVisible(visible: boolean) {
    this.isModalVisible = visible;
  }

  public setInProcess(inProcess: boolean) {
    this.isModalInProcess = inProcess;
  }

  public show(student?: Student) {
    this.student = student || new Student();
    this.setInProcess(false);
    this.setVisible(true);
  }

  private onSubmitModal() {
    this.$emit('submit', this.student);
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
