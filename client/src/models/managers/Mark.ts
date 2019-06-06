import axios from 'axios';
import bus from '../Bus';
import { Omit } from '../Stuff';

export interface IMarkData {
  id: number;
  name: string;
  symbol: string;
  weight: number;
}

export class Mark implements IMarkData {
  public id: number = -1;
  public name: string = '';
  public symbol: string = '';
  public weight: number = 0;

  constructor(data?: IMarkData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
    this.symbol = data.symbol;
    this.weight = data.weight;
  }
}

export type MarkEvent = 'mark_created' | 'mark_updated' | 'mark_removed';

export class MarkManager {
  public async fetchAll() {
    const res = await axios.get<IMarkData[]>('marks');
    return res.data.map((data) => new Mark(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IMarkData>(`mark/${id}`);
    return new Mark(res.data);
  }

  public async create(data: Omit<IMarkData, 'id'>) {
    const res = await axios.post<number>('mark', data);

    const mark = new Mark({
      ...data,
      id: res.data
    });
    bus.fire('mark_created', mark);
    return mark;
  }

  public async update(data: IMarkData) {
    await axios.put('mark', data);
    const mark = new Mark(data);

    bus.fire('mark_updated', mark);
    return mark;
  }

  public async remove(id: number) {
    await axios.delete(`mark/${id}`);
    bus.fire('mark_removed', id);
  }
}
