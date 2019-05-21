<template>
  <div class="c-cards-list">
    <div v-for="(item, index) in items" :key="`cardlist-item-${index}`" class="list-item">
      <div class="title">
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
}
</script>


<style lang="scss">
@import '@/styles/general.scss';

.c-cards-list {
  .list-item {
    height: $row-height;
    border: 1px solid rgba(0, 0, 0, 0.14);
    box-shadow: inset 4px 0px rgba(0, 0, 0, 0.14);

    display: flex;
    flex-direction: row;

    .title {
      line-height: $row-height;
      margin-right: auto;
      padding-left: 20px;
    }

    .button-delete {
      flex: none;
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
  }
}
</style>
