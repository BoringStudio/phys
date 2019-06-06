<template>
  <general-modal title="Семестр" size="lg">
    <template v-slot="{ data }">
      <b-form-group label="Дата начала">
        <!-- <b-form-input type="date" autocomplete="false" v-model="data.begin"/> -->
        <datepicker
          v-model="data.begin"
          :language="locale"
          :format="format"
          bootstrap-styling
          monday-first
        />
      </b-form-group>

      <b-form-group label="Дата конца">
        <!-- <b-form-input type="date" autocomplete="false" v-model="data.end"/> -->
        <datepicker
          v-model="data.end"
          :language="locale"
          :format="format"
          bootstrap-styling
          monday-first
        />
      </b-form-group>

      <table class="table b-table table-striped table-sm">
        <thead class="noselect">
          <tr>
            <th>№</th>
            <th>Начало</th>
            <th>Конец</th>
            <th>Активен</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data.modules" :key="`semester-module-${index}`">
            <td class="text-center align-middle noselect">{{ index + 1 }}</td>
            <td>
              <datepicker
                v-model="item.begin"
                :language="locale"
                :format="format"
                bootstrap-styling
                monday-first
              />
            </td>
            <td>
              <datepicker
                v-model="item.end"
                :language="locale"
                :format="format"
                bootstrap-styling
                monday-first
              />
            </td>
            <td>
              <b-form-checkbox v-model="item.isActive" :value="true" :unchecked-value="false"/>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </general-modal>
</template>


<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import GeneralModal, { ModalMixin } from './GeneralModal.vue';

import { ru } from 'vuejs-datepicker/dist/locale';

@Component({
  components: {
    GeneralModal
  }
})
export default class SemesterModal extends Mixins(ModalMixin) {
  get locale() {
    return ru;
  }

  get format() {
    return 'dd.MM.yyyy';
  }
}
</script>
