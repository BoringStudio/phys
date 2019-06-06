import { Length, IsOptional, IsIn, IsInt } from 'class-validator';

export type StudentGender = 'male' | 'female';

export class Student {
  public id: number;
  public surname: string;
  public name: string;
  public middlename?: string;
  public gender: StudentGender;
  public group: number;
}

export class StudentCreationInfo {
  @Length(2, 50)
  public surname: string;

  @Length(2, 50)
  public name: string;

  @Length(0, 50)
  public middlename: string;

  @IsIn(['male', 'female'])
  public gender: StudentGender;

  @IsInt()
  public group: number;
}

export class StudentEditionInfo {
  @IsInt()
  public id: string;

  @IsOptional()
  @Length(2, 50)
  public surname: string;

  @IsOptional()
  @Length(2, 50)
  public name: string;

  @IsOptional()
  @Length(0, 50)
  public middlename: string;

  @IsOptional()
  @IsIn(['male', 'female'])
  public gender: StudentGender;

  @IsOptional()
  @IsInt()
  public group: number;
}
