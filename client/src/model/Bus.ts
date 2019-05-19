import { ClassroomEvent } from '@/model/Classroom';

type BusEvent = ClassroomEvent;

type BusEventHandler = () => void;

interface ListenerPair {
  event: BusEvent;
  handler: BusEventHandler;
}

export class Bus {
  private _listeners: Map<BusEvent, BusEventHandler[]> = new Map();
  private _ownedHandlers: Map<object, ListenerPair[]> = new Map();

  public on(event: BusEvent, handler: BusEventHandler, owner?: object): void {
    const listeners = this._listeners.get(event);
    this._listeners.set(event, (listeners || []).concat(handler));

    if (!owner) {
      return;
    }

    const handlers = this._ownedHandlers.get(owner);
    this._ownedHandlers.set(owner, (handlers || []).concat({ event, handler }));
  }

  public off(event: BusEvent, handler: BusEventHandler): void {
    const listeners = this._listeners.get(event);

    if (listeners == null) {
      return;
    }

    this._listeners.set(event, listeners.filter((v) => v !== handler));
  }

  public fire(event: BusEvent): void {
    const listeners = this._listeners.get(event);
    if (listeners) {
      listeners.forEach((v) => v());
    }
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
