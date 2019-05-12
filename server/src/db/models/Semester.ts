import {
  IsDate,
  IsInt,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  IsDateString
} from 'class-validator';

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBeforeConstraint implements ValidatorConstraintInterface {
  public validate(propertyValue: string, args: ValidationArguments) {
    return (
      new Date(propertyValue) <
      new Date((args.object as any)[args.constraints[0]])
    );
  }

  public defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}

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
