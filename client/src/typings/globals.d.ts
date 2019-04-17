declare module 'globals' {
  import { Bus } from '@/model/Bus';

  module 'vue/types/vue' {
    interface Vue {
      $bus: Bus;
    }
  }
}
