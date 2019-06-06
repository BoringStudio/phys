import axios from 'axios';
import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export interface ITestData {
  id: number;
  name: string;
  maleMarks: number[];
  femaleMarks: number[];
  direction: number;
}

export class Test implements ITestData {
  public id: number = -1;
  public name: string = '';
  public maleMarks: number[] = [0, 0, 0, 0, 0];
  public femaleMarks: number[] = [0, 0, 0, 0, 0];
  public direction: number = 1;

  constructor(data?: ITestData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.name = data.name;
    this.maleMarks = data.maleMarks;
    this.femaleMarks = data.femaleMarks;
    this.direction = data.direction;
  }

  public convert(value: number, gender: 'male' | 'female'): number {
    const grades = gender === 'male' ? this.maleMarks : this.femaleMarks;

    if (this.direction > 0) {
      if (value < grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value >= grades[i] && value < grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    } else {
      if (value > grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value <= grades[i] && value > grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    }
  }
}

export type TestEvent = 'test_created' | 'test_updated' | 'test_removed';

export class TestManager {
  public async fetchAll() {
    const res = await axios.get<ITestData[]>('tests');

    return res.data.map((data) => new Test(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<ITestData>(`test/${id}`);
    return new Test(res.data);
  }

  public async create(data: Omit<ITestData, 'id'>) {
    const res = await axios.post<number>('test', data);

    const test = new Test({
      ...data,
      id: res.data
    });
    bus.fire('test_created', test);
    return test;
  }

  public async update(data: ITestData) {
    await axios.put('test', data);
    const test = new Test(data);

    bus.fire('test_updated', test);
    return test;
  }

  public async remove(id: number) {
    await axios.delete(`test/${id}`);
    bus.fire('test_removed', id);
  }
}
