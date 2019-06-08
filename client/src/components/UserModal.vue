<template>
  <general-modal class="c-user-modal" title="Пользователь">
    <template v-slot="{ data }">
      <b-form-group label="Логин">
        <b-form-input type="text" autocomplete="false" v-model="data.login"/>
      </b-form-group>

      <b-form-group label="Фамилия">
        <b-form-input type="text" autocomplete="false" v-model="data.surname"/>
      </b-form-group>

      <b-form-group label="Имя">
        <b-form-input type="text" autocomplete="false" v-model="data.name"/>
      </b-form-group>

      <b-form-group label="Отчество">
        <b-form-input type="text" autocomplete="false" v-model="data.middlename"/>
      </b-form-group>

      <b-form-checkbox
        v-if="notCurrentUser"
        :value="true"
        :unchecked-value="false"
        v-model="data.fullAccess"
        class="noselect"
      >Полный доступ</b-form-checkbox>
      <br>

      <template v-if="data.id > 0">
        <b-form-checkbox
          :value="true"
          :unchecked-value="false"
          v-model="changePassword"
          class="noselect"
        >Изменить пароль</b-form-checkbox>
      </template>

      <b-form-group v-if="changePassword || data.id < 0">
        <b-input-group>
          <b-form-input type="text" autocomplete="false" v-model="data.password"/>
          <b-input-group-append>
            <b-button @click="generate">
              <a-icon icon="redo"/>
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-form-text>Обязательно запишите куда-нибудь этот пароль</b-form-text>
      </b-form-group>
    </template>
  </general-modal>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import GeneralModal, { ModalMixin } from './GeneralModal.vue';
import { FullUserInfo } from '../models/managers/User';

@Component({
  components: {
    GeneralModal
  }
})
export default class UserModal extends Mixins(ModalMixin) {
  private changePassword: boolean = false;

  private generate() {
    (this.modal.data as FullUserInfo).password = Array(10)
      .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
      .map((x) => {
        return x[Math.floor(Math.random() * x.length)];
      })
      .join('');
  }

  private get notCurrentUser() {
    return (
      this.$state.userManager.currentUser!.id !==
      (this.modal.data as FullUserInfo).id
    );
  }
}
</script>

<style lang="scss">
.c-user-modal {
  .button-show-password {
    width: 3em;
  }
}
</style>
