import axios from 'axios';
import bus from '@/models/Bus';

export enum ParameterType {
  CURRENT_SEMESTER
}

export type ParameterValueType = boolean | number | string | Date;

export interface IParameterData {
  parameter: ParameterType;
  value: ParameterValueType;
}

export class Parameter implements IParameterData {
  public parameter: ParameterType;
  public value: ParameterValueType;

  constructor(data: IParameterData) {
    this.parameter = data.parameter;
    this.value = data.value;
  }
}

export type ParameterEvent = 'parameter_updated';

export class ParameterManager {
  public async get(parameter: ParameterType) {
    const res = await axios.get<ParameterValueType>(`parameter/${parameter}`);
    return res.data;
  }

  public async update(data: IParameterData) {
    await axios.put('parameter', data);
    bus.fire('parameter_updated', new Parameter(data));
  }
}
