declare module 'globals' {
  import { Bus } from '@/models/Bus';
  import { State } from '@/models/State';

  module 'vue/types/vue' {
    interface Vue {
      $bus: Bus;
      $state: State;
    }
  }
}
