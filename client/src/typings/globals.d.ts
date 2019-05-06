declare module 'globals' {
  import { Bus } from '@/model/Bus';
  import { State } from '@/model/State';

  module 'vue/types/vue' {
    interface Vue {
      $bus: Bus;
      $state: State;
    }
  }
}
