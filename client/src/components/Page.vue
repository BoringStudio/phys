<template>
  <div class="page">
    <h3>
      <span>{{ title }}</span>
      <span class="ml-3">
        <slot name="actions"></slot>
      </span>
      <hr>
    </h3>

    <template v-if="wide">
      <slot></slot>
    </template>
    <template v-else>
      <b-row class="justify-content-md-center flex-grow-1">
        <b-col cols="12" md="8" lg="6">
          <slot></slot>
        </b-col>
      </b-row>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Page extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  private readonly title!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  private readonly wide!: boolean;
}
</script>
