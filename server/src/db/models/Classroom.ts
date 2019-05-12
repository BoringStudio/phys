import { Length, IsInt } from 'class-validator';

export class Classroom {
  public id: string;
  public name: string;
}

export class ClassroomCreationInfo {
  @Length(1, 50)
  public name: string;
}

export class ClassroomEditionInfo {
  @IsInt()
  public id: number;

  @Length(2, 20)
  public name: string;
}
