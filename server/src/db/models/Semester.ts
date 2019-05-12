import { IsInt, Validate, IsDateString } from 'class-validator';

import { IsBeforeConstraint } from '@/constraints';

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

export class SemesterEditionInfo {
  @IsInt()
  public id: number;

  @IsDateString()
  @Validate(IsBeforeConstraint, ['end'])
  public begin: Date;

  @IsDateString()
  public end: Date;
}
