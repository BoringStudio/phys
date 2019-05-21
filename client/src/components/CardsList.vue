<template>
  <div class="c-cards-list">
    <div
      v-for="(item, index) in items"
      :key="`cardlist-item-${index}`"
      class="list-item d-flex"
      v-bind:class="{editable}"
    >
      <div class="title flex-grow-1" @click="editable ? $emit('edit', item) : ''">
        <slot v-bind:item="item"></slot>
      </div>
      <div class="button-delete" @click="$emit('remove', item)">
        <a-icon icon="times"/>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CardsList extends Vue {
  @Prop({
    type: Array,
    default: []
  })
  private readonly items!: any[];

  @Prop({
    type: Boolean,
    default: false
  })
  private readonly editable!: boolean;
}
</script>


<style lang="scss">
@import '@/styles/general.scss';

.c-cards-list {
  .list-item {
    height: $row-height;
    border: 1px solid rgba(0, 0, 0, 0.14);
    box-shadow: inset 4px 0px rgba(0, 0, 0, 0.14);

    .title {
      line-height: $row-height;
      margin-right: auto;
      padding-left: 20px;
    }

    .button-delete {
      text-align: center;
      line-height: $row-height;

      width: $row-height;
      height: 100%;

      &:hover {
        color: var(--danger);
        cursor: pointer;
      }
    }

    &:not(:last-child) {
      margin-bottom: 1em;
    }

    &.editable {
      .title {
        cursor: pointer;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.075);
      }
    }
  }
}
</style>
