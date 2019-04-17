<template>
  <div class="login-page page">
    <b-form class="window">
      <h3>Авторизация</h3>
      <b-form-group label="Логин">
        <b-input class="w-100"/>
      </b-form-group>
      <b-form-group label="Пароль">
        <b-input class="w-100" type="password"/>
      </b-form-group>
      <b-form-group>
        <b-button class="w-100">Вход</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class LoginPage extends Vue {}
</script>


<style lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .window {
    border: 1px solid var(--secondary);
    padding: 20px;
    border-radius: 0.25rem;
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
