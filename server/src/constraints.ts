import {
  Validator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

const validator = new Validator();

@ValidatorConstraint({ name: 'isBefore', async: false })
export class IsBefore implements ValidatorConstraintInterface {
  public validate(propertyValue: any, args: ValidationArguments) {
    return (
      new Date(propertyValue) <
      new Date((args.object as any)[args.constraints[0]])
    );
  }

  public defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must be before "${args.constraints[0]}"`;
  }
}

@ValidatorConstraint({ name: 'sameExistance', async: false })
export class SameExistance implements ValidatorConstraintInterface {
  public validate(propertyValue: any, args: ValidationArguments) {
    const leftExists = propertyValue != null;
    const rightExists = (args.object as any)[args.constraints[0]] != null;

    console.log(`same existance: ${leftExists} ${rightExists}`);

    return leftExists === rightExists;
  }

  public defaultMessage(args: ValidationArguments) {
    return `"${args.property}" must have same existance as "${
      args.constraints[0]
    }"`;
  }
}

@ValidatorConstraint({ name: 'orExists', async: false })
export class OrExists implements ValidatorConstraintInterface {
  public validate(propertyValue: any, args: ValidationArguments) {
    const leftExists = propertyValue != null;
    const rightExists = (args.object as any)[args.constraints[0]] != null;

    console.log(`or exist: ${leftExists} ${rightExists}`);

    return leftExists || rightExists;
  }

  public defaultMessage(args: ValidationArguments) {
    return `"${args.property}" or "${args.constraints[0]}" must exist`;
  }
}

@ValidatorConstraint({ name: 'isParameterValueType', async: false })
export class IsParameterValueType implements ValidatorConstraintInterface {
  public validate(propertyValue: any) {
    return (
      validator.isBoolean(propertyValue) ||
      validator.isNumber(propertyValue) ||
      validator.isDateString(propertyValue) ||
      validator.isString(propertyValue)
    );
  }
}
