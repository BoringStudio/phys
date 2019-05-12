import { HttpError } from 'routing-controllers';

export class AlreadyExistsError extends HttpError {
  constructor() {
    super(400, 'already exists');
  }
}
