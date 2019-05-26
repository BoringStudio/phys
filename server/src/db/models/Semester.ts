import {
  IsInt,
  Validate,
  IsDateString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsBoolean
} from 'class-validator';

import { IsBeforeConstraint } from '@/constraints';

import { ModuleCreationInfo } from './Module';

export class Semester {
  public id: number;
  public begin: Date;
  public end: Date;
}

export class SemesterCreationInfo {
  @IsDateString()
  @Validate(IsBeforeConstraint, ['end'])
  public begin: Date;

  @IsDateString()
  public end: Date;
}

class SemesterModuleCreationInfo extends ModuleCreationInfo {
  @IsOptional()
  public semester: number;
}

export class SemesterWithModulesCreationInfo extends SemesterCreationInfo {
  @IsArray()
  @ValidateNested({
    each: true
  })
  public modules: SemesterModuleCreationInfo[];
}

export class SemesterEditionInfo {
  @IsInt()
  public id: number;

  @IsDateString()
  @Validate(IsBeforeConstraint, ['end'])
  public begin: Date;

  @IsDateString()
  public end: Date;
}

export class SemesterWithModulesEditionInfo extends SemesterEditionInfo {
  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true
  })
  public modules: SemesterEditionInfo[];
}

export const checkAllInRange = (
  target: { begin: Date; end: Date },
  ranges: Array<{ begin: Date; end: Date }>
) => {
  return ranges.every((m) => m.begin >= target.begin && m.end <= target.end);
};
