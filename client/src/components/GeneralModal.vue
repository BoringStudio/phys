<template>
  <div class="c-general-modal">
    <b-modal v-model="visible" :size="size" no-fade>
      <template slot="modal-title">{{ title }}</template>

      <slot v-bind:data="data" v-if="data != null"></slot>

      <template slot="modal-footer">
        <button type="button" class="btn btn-secondary" @click="visible = false">Отменить</button>
        <button
          v-if="data != null"
          type="button"
          class="btn btn-primary"
          :disabled="inProcess"
          @click="onSubmitModal"
        >Подтвердить</button>
      </template>
    </b-modal>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';

@Component
export class ModalMixin extends Vue {
  public modal!: GeneralModal;

  public setVisible(visible: boolean) {
    this.modal.setVisible(visible);
  }

  public setInProcess(inProcess: boolean) {
    this.modal.setInProcess(inProcess);
  }

  public show(data: object) {
    this.modal.show(data);
  }

  public mounted() {
    this.modal = this.$children[0] as GeneralModal;
    this.modal.$on('submit', (data: any) => {
      this.$emit('submit', data);
    });
  }
}

@Component
export default class GeneralModal extends Vue {
  public data: object | null = null;

  private visible: boolean = false;
  private inProcess: boolean = false;

  @Prop({
    type: String,
    default: ''
  })
  private readonly title!: string;

  @Prop({
    type: String,
    required: false
  })
  private readonly size!: string;

  public setVisible(visible: boolean) {
    this.visible = visible;
  }

  public setInProcess(inProcess: boolean) {
    this.inProcess = inProcess;
  }

  public show(data: object | null) {
    this.data = data ? Object.assign({}, data) : null;
    this.setInProcess(false);
    this.setVisible(true);
  }

  private onSubmitModal() {
    this.$emit('submit', this.data!);
  }
}
</script>
