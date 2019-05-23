<template>
  <div class="c-cards-list">
    <div class="items">
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

    <b-pagination
      v-if="pagination && _properties.total > _properties.perPage"
      :key="uniqueKey"
      :value="_properties.page"
      :total-rows="_properties.total"
      :per-page="_properties.perPage"
      align="fill"
      class="noselect"
      @change="selectPage"
    ></b-pagination>
  </div>
</template>


<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';

export class PaginationProperties {
  public perPage: number;
  public total: number = 0;

  public get page() {
    return this.currentPage;
  }

  public set page(page: number) {
    this.currentPage = page > 0 ? Math.min(page, this.lastPage) : this.lastPage;
  }

  private currentPage: number = 1;

  constructor(perPage: number = 10) {
    this.perPage = perPage;
  }

  public get lastPage() {
    return this.total === 0 ? 1 : Math.ceil(this.total / this.perPage);
  }
}

@Component
export default class CardsList extends Vue {
  private uniqueKey: number = 1;
  private _properties!: PaginationProperties;
  private loader?: (perPage: number, page: number) => any;

  @Prop({
    type: Array,
    default: []
  })
  private readonly items!: any[];

  @Prop({
    type: Boolean,
    default: true
  })
  private readonly editable!: boolean;

  @Prop({
    type: Boolean,
    default: true
  })
  private readonly pagination!: boolean;

  @Prop({
    type: Object,
    default: () => new PaginationProperties()
  })
  private readonly properties!: PaginationProperties;

  @Watch('properties', {
    immediate: true,
    deep: true
  })
  private onPropertiesChanged(
    val: PaginationProperties,
    last: PaginationProperties
  ) {
    this._properties = val;
    this.uniqueKey++;
  }

  public setLoader(loader?: (perPage: number, page: number) => any) {
    this.loader = loader;
  }

  public async selectPage(page: number) {
    this.properties.page = page;
    this.uniqueKey++;

    if (this.loader != null) {
      await this.loader(this.properties.perPage, this.properties.page);
    }
  }
}
</script>


<style lang="scss">
@import '@/styles/general.scss';

.c-cards-list {
  display: flex;
  flex-direction: column;

  .items {
    flex-grow: 1;
  }

  .list-item {
    height: $row-height;
    border: 1px solid rgba(0, 0, 0, 0.14);
    box-shadow: inset 4px 0px rgba(0, 0, 0, 0.14);
    margin-bottom: 1em;

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
