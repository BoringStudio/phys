<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Classroom } from '@/model/Classroom';

import CardsList from '@/components/CardsList.vue';
import GeneralModal from '@/components/GeneralModal.vue';

@Component({
  components: {
    CardsList,
    GeneralModal
  }
})
export default class ClassroomsPage extends Vue {
  private classroomModal!: GeneralModal;

  private classrooms: Classroom[] = [];

  private created() {
    this.$bus.on('classrooms_changed', () => {
      this.classrooms = this.$state.classroomManager.classrooms;
    });
  }

  private async mounted() {
    this.classroomModal = this.$refs['classroom-modal'] as GeneralModal;
    this.classroomModal.$on('submit', async (classroom: Classroom) => {
      this.classroomModal.setInProcess(true);

      try {
        await this.$state.classroomManager.create(classroom.name);
        this.classroomModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: 'Невозможно создать аудиторию',
          type: 'error'
        });
        this.classroomModal.setInProcess(false);
      }
    });

    this.$state.classroomManager.fetchAll();
  }

  private addClassroom() {
    this.classroomModal.show(new Classroom());
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
