<template>
  <div class="c-general-modal">
    <b-modal v-model="isModalVisible" :size="size" no-fade>
      <template slot="modal-title">{{ title }}</template>

      <slot v-bind:data="data" v-if="data != null"></slot>

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


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class GeneralModal extends Vue {
  private isModalVisible: boolean = false;
  private isModalInProcess: boolean = false;

  private data: object | null = null;

  @Prop({
    type: String,
    default: ''
  })
  private title!: string;

  @Prop({
    type: String,
    required: false
  })
  private size!: string;

  public setVisible(visible: boolean) {
    this.isModalVisible = visible;
  }

  public setInProcess(inProcess: boolean) {
    this.isModalInProcess = inProcess;
  }

  public show(data: object) {
    this.data = data;
    this.setInProcess(false);
    this.setVisible(true);
  }

  private onSubmitModal() {
    this.$emit('submit', this.data!);
  }
}
</script>
