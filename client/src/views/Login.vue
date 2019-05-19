<template>
  <div class="login-page page">
    <b-form class="window">
      <h3>Авторизация</h3>
      <b-form-group label="Логин">
        <b-input class="w-100" v-model.trim="authData.login"/>
      </b-form-group>
      <b-form-group label="Пароль">
        <b-input class="w-100" type="password" v-model="authData.password"/>
      </b-form-group>
      <b-form-group>
        <b-button class="w-100" @click="onLogin">Вход</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { AuthData } from '@/model/User';

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


<style lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .window {
    border: 1px solid rgba(0, 0, 0, 0.14);
    padding: 20px;
    width: 300px;

    h3 {
      text-align: center;
    }

    .form-group:last-child {
      margin-top: 3em;
    }
  }
}
</style>
<!-- STYLE END -->
