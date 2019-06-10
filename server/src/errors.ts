import { HttpError } from 'routing-controllers';

export const createErrorHandler = (error?: Error) => {
  return (e: any) => {
    console.log(e);

    if (error != null) {
      throw error;
    }

    throw new Error();
  };
};

export const simpleErrorHandler = createErrorHandler();

export class AlreadyExistsError extends HttpError {
  constructor() {
    super(400, 'already exists');
  }
}

export const alreadyExistsErrorHandler = createErrorHandler(
  new AlreadyExistsError()
);

export class HaveDependenciesError extends HttpError {
  constructor() {
    super(400, 'have dependencies');
  }
}

export const haveDependenciesErrorHandler = createErrorHandler(
  new HaveDependenciesError()
);

export class NotAllowedError extends HttpError {
  constructor() {
    super(400, 'not alowed');
  }
}

export const notAllowedErrorHandler = createErrorHandler(new NotAllowedError());

export class NotInRangeError extends HttpError {
  constructor() {
    super(400, 'not in range');
  }
}

export const notInRangeErrorHandler = createErrorHandler(new NotInRangeError());

export class InactiveModuleError extends HttpError {
  constructor() {
    super(400, 'inactive module');
  }
}

export const inactiveModuleErrorHandler = createErrorHandler(
  new InactiveModuleError()
);
