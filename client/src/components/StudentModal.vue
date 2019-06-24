<template>
  <general-modal size="lg" title="Студент">
    <template v-slot="{ data }">
      <b-form-group label="Фамилия">
        <b-form-input type="text" autocomplete="false" v-model="data.surname"/>
      </b-form-group>

      <b-form-group label="Имя">
        <b-form-input type="text" autocomplete="false" v-model="data.name"/>
      </b-form-group>

      <b-form-group label="Отчество">
        <b-form-input type="text" autocomplete="false" v-model="data.middlename"/>
      </b-form-group>

      <b-form-radio-group :options="genderOptions" autocomplete="false" v-model="data.gender"/>
      <hr>

      <b-form-row>
        <b-col cols="12">
          <b-row>
            <b-col class="d-flex align-items-center">Учебная группа</b-col>
            <b-col cols="auto" class="ml-auto">
              <b-button size="sm" class="m-2" @click="createGroup">Создать новую группу</b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12">
          <group-input v-model="data.group"/>
        </b-col>
      </b-form-row>
    </template>

    <template v-slot:utility>
      <group-modal ref="group-modal" @submit="onSubmitGroup"/>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import GroupInput from './GroupInput.vue';
import GroupModal from './GroupModal.vue';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import { Group } from '../models/managers/Group';

@Component({
  components: {
    GroupInput,
    GroupModal,
    GeneralModal
  }
})
export default class StudentModal extends Mixins(ModalMixin) {
  private groupModal!: GroupModal;

  private get genderOptions() {
    return [
      { value: 'male', text: 'Юноша' },
      { value: 'female', text: 'Девушка' }
    ];
  }

  public mounted() {
    this.groupModal = this.$refs['group-modal'] as GroupModal;
  }

  private createGroup() {
    this.groupModal.show(new Group());
  }

  private async onSubmitGroup(group: Group) {
    this.groupModal.setInProcess(true);

    try {
      await this.$state.groupManager.create(group);
      this.groupModal.setVisible(false);
    } catch (e) {
      this.$notify({
        title: `Невозможно создать группу`,
        type: 'error'
      });
      this.groupModal.setInProcess(false);
    }
  }
}
</script>
