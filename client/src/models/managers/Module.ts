import axios from 'axios';
import bus from '../Bus';
import { Omit } from '../Stuff';

export interface IModuleData {
  id: number;
  begin: Date;
  end: Date;
  isActive: boolean;
  semester: number;
}

export class Module {
  public id: number = -1;
  public begin: Date = new Date();
  public end: Date = new Date();
  public isActive: boolean = false;
  public semester: number = -1;

  constructor(data?: IModuleData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.begin = data.begin;
    this.end = data.end;
    this.isActive = data.isActive;
    this.semester = data.semester;
  }
}

export type ModuleEvent =
  | 'module_created'
  | 'module_updated'
  | 'module_removed';

export class ModuleManager {
  public async fetchAll() {
    const res = await axios.get<IModuleData[]>('modules');
    return res.data.map((data) => new Module(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IModuleData>(`module/${id}`);
    return new Module(res.data);
  }

  public async create(data: Omit<IModuleData, 'id'>) {
    const res = await axios.post<number>('module', data);

    const item = new Module({
      ...data,
      id: res.data
    });
    bus.fire('module_created', item);
    return item;
  }

  public async update(data: IModuleData) {
    await axios.put('module', data);
    const item = new Module(data);

    bus.fire('module_updated', item);
    return item;
  }

  public async remove(id: number) {
    await axios.delete(`module/${id}`);
    bus.fire('module_removed', id);
  }
}
