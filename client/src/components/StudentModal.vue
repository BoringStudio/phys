<!-- TEMPALTE BEGIN -->
<template>
  <div class="c-student-modal">
    <b-modal v-model="isModalVisible" no-fade>
      <template slot="modal-title">Студент</template>

      <b-form-group label="Фамилия">
        <b-form-input type="text" autocomplete="false" v-model="studentInfo.surname"/>
      </b-form-group>

      <b-form-group label="Имя">
        <b-form-input type="text" autocomplete="false" v-model="studentInfo.name"/>
      </b-form-group>

      <b-form-group label="Отчество">
        <b-form-input type="text" autocomplete="false" v-model="studentInfo.middleName"/>
      </b-form-group>

      <b-form-group label="Учебная группа">
        <b-form-input type="text" autocomplete="false" v-model="studentInfo.group"/>
      </b-form-group>

      <b-form-group label="Группа здоровья">
        <b-form-select
          :options="healthGroupOptions"
          autocomplete="false"
          v-model="studentInfo.healthGroup"
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

class StudentInfo {
  private surname: string = '';
  private name: string = '';
  private middleName: string = '';
  private group: string = '';
  private healthGroup: HealthGroup = HealthGroup.First;

  constructor(student?: Student) {
    if (student == null) {
      return;
    }

    this.surname = student.surname;
    this.name = student.name;
    this.middleName = student.middleName;
    this.group = student.group;
    this.healthGroup = student.healthGroup;
  }

  public apply(student: Student) {
    student.surname = this.surname;
    student.name = this.name;
    student.middleName = this.middleName;
    student.group = this.group;
    student.healthGroup = this.healthGroup;
  }
}

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
  private studentInfo: StudentInfo = new StudentInfo();

  public setVisible(visible: boolean) {
    this.isModalVisible = visible;
  }

  public setInProcess(inProcess: boolean) {
    this.isModalInProcess = inProcess;
  }

  public show(student?: Student) {
    this.student = student || new Student();
    this.studentInfo = new StudentInfo(student);
    this.setInProcess(false);
    this.setVisible(true);
  }

  private onSubmitModal() {
    this.studentInfo.apply(this.student);
    this.$emit('submit', this.student);
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
</style>
<!-- STYLE END -->
