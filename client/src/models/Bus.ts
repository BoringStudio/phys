import { ClassroomEvent } from '@/models/managers/Classroom';
import { TestEvent } from '@/models/managers/Test';
import { StudentEvent } from '@/models/managers/Student';
import { GroupEvent } from '@/models/managers/Group';
import { DisciplineEvent } from '@/models/managers/Discipline';
import { MarkEvent } from '@/models/managers/Mark';
import { ModuleEvent } from '@/models/managers/Module';
import { SemesterEvent } from '@/models/managers/Semester';
import { LessonEvent } from './managers/Lesson';
import { ParameterEvent } from './managers/Parameters';
import { StudentVisitEvent } from './managers/StudentVisit';
import { StudentInfoEvent } from './managers/StudentInfo';
import { UserEvent } from './managers/User';

type BusEvent =
  | ClassroomEvent
  | TestEvent
  | StudentEvent
  | GroupEvent
  | DisciplineEvent
  | MarkEvent
  | ModuleEvent
  | SemesterEvent
  | LessonEvent
  | ParameterEvent
  | StudentVisitEvent
  | StudentInfoEvent
  | UserEvent;

type BusEventHandler = (data?: any) => void;

interface ListenerPair {
  event: BusEvent;
  handler: BusEventHandler;
}

export class Bus {
  private listeners: Map<BusEvent, BusEventHandler[]> = new Map();
  private ownedHandlers: Map<object, ListenerPair[]> = new Map();

  public on(
    events: BusEvent | BusEvent[],
    handler: BusEventHandler,
    owner?: object
  ): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this.listeners.get(event);
      this.listeners.set(event, (listeners || []).concat(handler));

      if (!owner) {
        return;
      }

      const handlers = this.ownedHandlers.get(owner);
      this.ownedHandlers.set(
        owner,
        (handlers || []).concat({ event, handler })
      );
    });
  }

  public off(events: BusEvent | BusEvent[], handler: BusEventHandler): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this.listeners.get(event);

      if (listeners == null) {
        return;
      }

      this.listeners.set(event, listeners.filter((v) => v !== handler));
    });
  }

  public fire(events: BusEvent | BusEvent[], data?: any): void {
    events = events instanceof Array ? events : [events];

    events.forEach((event) => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.forEach((v) => v(data));
      }
    });
  }

  public clear(owner: object): void {
    const handlers = this.ownedHandlers.get(owner);

    if (handlers == null) {
      return;
    }

    handlers.forEach((pair) => this.off(pair.event, pair.handler));
    this.ownedHandlers.delete(owner);
  }
}

const bus = new Bus();
export default bus;
