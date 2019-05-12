import { Length, IsInt } from 'class-validator';

export class Discipline {
  public id: number;
  public name: string;
}

export class DisciplineCreationInfo {
  @Length(2, 50)
  public name: string;
}

export class DisciplineEditionInfo {
  @IsInt()
  public id: number;

  @Length(2, 50)
  public name: string;
}
