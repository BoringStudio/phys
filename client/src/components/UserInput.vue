<template>
  <div class="c-user-input">
    <b-model-list-select
      class="form-control"
      :list="users"
      option-value="id"
      :custom-text="serialize"
      v-model="input"
      @searchchange="onSearch"
      @input="onSelect"
    />
  </div>
</template>

<script lang="ts">
import { Component, Model, Watch, Vue } from 'vue-property-decorator';
import { User } from '@/models/managers/User';

@Component
export default class UserInput extends Vue {
  private input: User | null = null;
  private users: User[] = [];

  @Model('input', { type: Number })
  private readonly user!: number;

  @Watch('user', {
    immediate: true
  })
  private async onUserChanged(val: number, oldVal: number) {
    if (val < 0) {
      this.input = null;
      return;
    }

    if (val !== oldVal) {
      const user = await this.$state.userManager.fetchOne(val);
      this.users.push(user);
      this.input = user;
    }
  }

  private async onSearch(input: string) {
    if (input.length < 2) {
      return;
    }

    this.users = await this.$state.userManager.search(input, 5);
  }

  private onSelect(id: number) {
    this.$emit('input', id);
  }

  private serialize(user: User) {
    return user.fullName;
  }
}
</script>
