<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Classroom } from '@/models/managers/Classroom';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import ClassroomModal from '@/components/ClassroomModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    ClassroomModal
  }
})
export default class ClassroomsPage extends Vue {
  private classroomModal!: ClassroomModal;

  private classrooms: Classroom[] = [];

  private created() {
    this.$bus.on('classroom_updated', (classroom: Classroom) => {
      updateIfExists(this.classrooms, classroom);
    });
    this.$bus.on(['classroom_created', 'classroom_removed'], async () => {
      this.classrooms = await this.$state.classroomManager.fetchAll();
    });
  }

  private async mounted() {
    this.classroomModal = this.$refs['classroom-modal'] as ClassroomModal;
    this.classroomModal.$on('submit', async (classroom: Classroom) => {
      this.classroomModal.setInProcess(true);

      const create: boolean = classroom.id < 0;

      try {
        if (create) {
          await this.$state.classroomManager.create(classroom);
        } else {
          await this.$state.classroomManager.update(classroom);
        }

        this.classroomModal.setVisible(false);
      } catch (e) {
        this.$notify({
          title: `Невозможно ${create ? 'создать' : 'изменить'} аудиторию`,
          type: 'error'
        });
        this.classroomModal.setInProcess(false);
      }
    });

    this.classrooms = await this.$state.classroomManager.fetchAll();
  }

  private addClassroom() {
    this.classroomModal.show(new Classroom());
  }

  private editClassroom(classroom: Classroom) {
    this.classroomModal.show(classroom);
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
