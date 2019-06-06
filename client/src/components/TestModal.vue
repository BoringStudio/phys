<template>
  <general-modal size="lg" title="Норматив">
    <template v-slot="{ data }">
      <b-form-group label="Название">
        <b-form-input type="text" autocomplete="false" v-model="data.name"></b-form-input>
      </b-form-group>

      <b-form-group label="Метод оценки">
        <b-form-select
          :options="[
            { value: -1, text: 'меньше - лучше' },
            { value: 1, text: 'больше - лучше' },
          ]"
          v-model="data.direction"
        ></b-form-select>
      </b-form-group>

      <br>

      <table class="table b-table table-striped table-sm">
        <thead>
          <tr>
            <th>Кол-во баллов</th>
            <th>Юноши</th>
            <th>Девушки</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="`mark-${i}`">
            <td class="text-center align-middle">{{ i }}</td>
            <td>
              <b-form-input type="number" autocomplete="false" v-model="data.maleMarks[i - 1]"></b-form-input>
            </td>
            <td>
              <b-form-input type="number" autocomplete="false" v-model="data.femaleMarks[i - 1]"></b-form-input>
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

@Component({
  components: {
    GeneralModal
  }
})
export default class TestModal extends Mixins(ModalMixin) {}
</script>
