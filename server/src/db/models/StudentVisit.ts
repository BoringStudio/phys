import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class StudentVisit {
  public id: number;
  public date: Date;
  public lesson: number;
  public mark: number;
  public student: number;
}

export class StudentVisitCreationInfo {
  @IsDateString()
  public date: Date;

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

  @IsOptional()
  @IsDateString()
  public date: Date;

  @IsOptional()
  @IsInt()
  public lesson: number;

  @IsOptional()
  @IsInt()
  public mark: number;

  @IsOptional()
  @IsInt()
  public student: number;
}
