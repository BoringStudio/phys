import { IsInt, IsIn, IsOptional } from 'class-validator';

export class Lesson {
  public id: number;
  public semester: number;
  public teacher: number;
  public discipline: number;
  public classroom: number;
  public day: number;
  public number: number;
}

export class LessonCreationInfo {
  @IsOptional()
  @IsInt()
  public semester: number;

  @IsOptional()
  @IsInt()
  public teacher: number;

  @IsInt()
  public discipline: number;

  @IsInt()
  public classroom: number;

  @IsIn([0, 1, 2, 3, 4, 5])
  public day: number;

  @IsIn([0, 1, 2, 3, 4, 5])
  public number: number;
}

export class LessonEditionInfo {
  @IsInt()
  public id: number;

  @IsOptional()
  @IsInt()
  public semester: number;

  @IsOptional()
  @IsInt()
  public teacher: number;

  @IsOptional()
  @IsInt()
  public discipline: number;

  @IsOptional()
  @IsInt()
  public classroom: number;

  @IsOptional()
  @IsIn([1, 2, 3, 4, 5, 6])
  public day: number;

  @IsOptional()
  @IsIn([1, 2, 3, 4, 5, 6])
  public number: number;
}

export class StudentEntryInfo {
  @IsInt()
  public studentId: number;
}
