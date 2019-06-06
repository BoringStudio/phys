<template>
  <b-form-checkbox-group
    :checked="testIds"
    :options="options"
    stacked
    @input="onInput"
    class="noselect"
  />
</template>

<script lang="ts">
import { Component, Model, Watch, Vue } from 'vue-property-decorator';
import { Discipline } from '@/models/managers/Discipline';
import { Test } from '@/models/managers/Test';
import { updateIfExists } from '@/models/Stuff';

class TestOption {
  public text: string;
  public value: number;

  constructor(test: Test) {
    this.text = test.name;
    this.value = test.id;
  }
}

@Component
export default class DisciplineTestsInput extends Vue {
  private options: TestOption[] = [];

  @Model('input', { type: Array, default: [] })
  private readonly testIds!: number[];

  private async mounted() {
    this.options = (await this.$state.testManager.fetchAll()).map(
      (test) => new TestOption(test)
    );
  }

  private onInput(input: number[]) {
    this.$emit('input', input);
  }
}
</script>
