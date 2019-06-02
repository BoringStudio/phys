import { IsInt, IsIn, Validate } from 'class-validator';
import { IsParameterValueType } from '@/constraints';

export enum ParameterType {
  CURRENT_SEMESTER
}

export type ParameterValueType = boolean | number | string | Date;

export class ParameterEditionInfo {
  @IsInt()
  @IsIn([ParameterType.CURRENT_SEMESTER])
  public parameter: ParameterType;

  @Validate(IsParameterValueType)
  public value: ParameterValueType;
}
