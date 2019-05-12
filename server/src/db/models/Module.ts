import {
  IsDateString,
  IsInt,
  IsBoolean,
  Validate,
  IsOptional
} from 'class-validator';
import { IsBeforeConstraint, SameExistance, OrExists } from '@/constraints';

export class Module {
  public id: number;
  public semester: number;
  public begin: Date;
  public end: Date;
  public isActive: boolean;
}

export class ModuleCreationInfo {
  @IsInt()
  public semester: number;

  @IsDateString()
  @Validate(IsBeforeConstraint, ['end'])
  public begin: Date;

  @Validate(SameExistance, ['begin'])
  @IsDateString()
  public end: Date;
}

export class ModuleEditionInfo {
  @IsInt()
  public id: number;

  @Validate(SameExistance, ['end'])
  @IsOptional()
  @IsDateString()
  @Validate(IsBeforeConstraint, ['end'])
  public begin?: Date;

  @Validate(SameExistance, ['begin'])
  @IsOptional()
  @IsDateString()
  public end?: Date;

  @Validate(OrExists, ['end'])
  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
