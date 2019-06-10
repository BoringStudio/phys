import { IsInt, IsNumber } from 'class-validator';

export class StudentTestMark {
  public id: number;
  public test: number;
  public result: number;
  public student: number;
  public semester: number;
}

export class StudentTestMarkCreationInfo {
  @IsInt()
  public test: number;

  @IsNumber()
  public result: number;

  @IsInt()
  public student: number;

  @IsInt()
  public semester: number;
}

export class StudentTestMarkEditionInfo {
  @IsInt()
  public id: number;

  @IsNumber()
  public result: number;
}
