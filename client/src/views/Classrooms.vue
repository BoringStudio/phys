<!-- TEMPALTE BEGIN -->
<template>
  <div class="page classrooms-page">
    <h3>Аудитории</h3>
    <hr>
    <b-row class="justify-content-md-center">
      <b-col cols="12" md="8" lg="6">
        <b-input-group>
          <b-input placeholder="Название" v-model="classroomName"/>

          <b-input-group-append>
            <b-button
              variant="outline-success"
              @click="addClassroom"
              :disabled="classroomName.length == 0 || inProcess"
            >Добавить</b-button>
          </b-input-group-append>
        </b-input-group>
        <br>

        <cards-list :items="classrooms" @remove="removeClassroom">
          <template v-slot:default="props">{{ props.item.name }}</template>
        </cards-list>
      </b-col>
    </b-row>
  </div>
</template>
<!-- TEMPALTE END -->


<!-- SCRIPT BEGIN -->
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Classroom } from '../model/Classroom';

import CardsList from '@/components/CardsList.vue';

@Component({
  components: {
    CardsList
  }
})
export default class ClassroomsPage extends Vue {
  private classroomName: string = '';
  private inProcess: boolean = false;

  private classrooms: Classroom[] = [];

  private created() {
    this.$bus.on('classrooms_changed', () => {
      this.classrooms = this.$state.classroomManager.classrooms;
    });
  }

  private async mounted() {
    this.$state.classroomManager.fetchAll();
  }

  private async addClassroom() {
    if (this.inProcess) {
      return;
    }

    this.inProcess = true;

    try {
      await this.$state.classroomManager.create(this.classroomName);
      this.classroomName = '';
    } catch (e) {
      this.$notify({
        title: 'Невозможно создать аудиторию',
        type: 'error'
      });
    }

    this.inProcess = false;
  }

  private async removeClassroom(item: Classroom) {
    if (!confirm('Вы действительно хотите удалить аудиторию?')) {
      return;
    }

    try {
      await this.$state.classroomManager.remove(item.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить аудиторию',
        type: 'error'
      });
    }
  }
}
</script>
<!-- SCRIPT END -->


<!-- STYLE BEGIN -->
<style lang="scss">
@import '@/styles/general.scss';

.classrooms-page {
  padding: 20px 40px;
}
</style>
<!-- STYLE END -->
