import { ClassroomEvent } from '@/models/managers/Classroom';
import { TestEvent } from '@/models/managers/Test';
import { StudentEvent } from '@/models/managers/Student';
import { GroupEvent } from '@/models/managers/Group';

type BusEvent = ClassroomEvent | TestEvent | StudentEvent | GroupEvent;

type BusEventHandler = (data?: any) => void;

interface ListenerPair {
  event: BusEvent;
  handler: BusEventHandler;
}

export class Bus {
  private _listeners: Map<BusEvent, BusEventHandler[]> = new Map();
  private _ownedHandlers: Map<object, ListenerPair[]> = new Map();

  public on(
    events: BusEvent | BusEvent[],
    handler: BusEventHandler,
    owner?: object
  ): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this._listeners.get(event);
      this._listeners.set(event, (listeners || []).concat(handler));

      if (!owner) {
        return;
      }

      const handlers = this._ownedHandlers.get(owner);
      this._ownedHandlers.set(
        owner,
        (handlers || []).concat({ event, handler })
      );
    });
  }

  public off(events: BusEvent | BusEvent[], handler: BusEventHandler): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this._listeners.get(event);

      if (listeners == null) {
        return;
      }

      this._listeners.set(event, listeners.filter((v) => v !== handler));
    });
  }

  public fire(events: BusEvent | BusEvent[], data?: any): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this._listeners.get(event);
      if (listeners) {
        listeners.forEach((v) => v(data));
      }
    });
  }

  public clear(owner: object): void {
    const handlers = this._ownedHandlers.get(owner);

    if (handlers == null) {
      return;
    }

    handlers.forEach((pair) => this.off(pair.event, pair.handler));
    this._ownedHandlers.delete(owner);
  }
}

const bus = new Bus();
export default bus;
