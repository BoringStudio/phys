<template src="./template.html"></template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User, FullUserInfo } from '@/models/managers/User';
import { updateIfExists } from '@/models/Stuff';

import Page from '@/components/Page.vue';
import CardsList from '@/components/CardsList.vue';
import UserModal from '@/components/UserModal.vue';

@Component({
  components: {
    Page,
    CardsList,
    UserModal
  }
})
export default class UsersPage extends Vue {
  private userModal!: UserModal;

  private users: User[] = [];

  private created() {
    this.$bus.on('user_updated', (user: User) => {
      updateIfExists(this.users, user);
    });
    this.$bus.on(['user_created', 'user_removed'], async () => {
      this.users = await this.$state.userManager.fetchAll();
    });
  }

  private async mounted() {
    this.userModal = this.$refs['user-modal'] as UserModal;

    this.users = await this.$state.userManager.fetchAll();
  }

  private addUser() {
    this.userModal.show(new FullUserInfo());
  }

  private editUser(user: User) {
    this.userModal.show(new FullUserInfo(user));
  }

  private async removeUser(user: User) {
    if (!confirm('Вы действительно хотите удалить пользователя?')) {
      return;
    }

    try {
      await this.$state.userManager.remove(user.id);
    } catch (e) {
      this.$notify({
        title: 'Невозможно удалить пользователя',
        type: 'error'
      });
    }
  }

  private async onSubmit(user: FullUserInfo) {
    this.userModal.setInProcess(true);

    const create: boolean = user.id < 0;

    try {
      if (create) {
        await this.$state.userManager.create(user);
      } else {
        if (user.password == null) {
          delete user.password;
        }
        await this.$state.userManager.update(user);
      }

      this.userModal.setVisible(false);
    } catch (e) {
      this.$notify({
        title: `Невозможно ${create ? 'создать' : 'изменить'} пользователя`,
        type: 'error'
      });
      this.userModal.setInProcess(false);
    }
  }
}
</script>
