import { IsInt } from 'class-validator';

export class StudentVisit {
  public id: number;
  public date: Date;
  public lesson: number;
  public mark: number;
  public student: number;
}

export class StudentVisitCreationInfo {
  @IsInt()
  public week: number;

  @IsInt()
  public lesson: number;

  @IsInt()
  public mark: number;

  @IsInt()
  public student: number;
}

export class StudentVisitEditionInfo {
  @IsInt()
  public id: number;

  @IsInt()
  public mark: number;
}
