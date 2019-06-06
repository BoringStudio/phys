<template src="./template.html"></template>
<style lang="scss" src="./style.scss"></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AuthData } from '@/models/managers/User';

@Component
export default class LoginPage extends Vue {
  private authData: AuthData = new AuthData();

  private mounted() {
    if (this.$state.userManager.authorized) {
      this.$router.replace({
        name: 'main'
      });
    }
  }

  private async onLogin() {
    try {
      await this.$state.userManager.auth(this.authData);

      this.$router.replace({
        name: (this.$route.params && this.$route.params.to) || 'main'
      });
    } catch (e) {
      this.$notify({
        type: 'error',
        text: 'Неверный логин или пароль'
      });
    }
  }
}
</script>

