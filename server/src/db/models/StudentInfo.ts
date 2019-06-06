import { IsInt, IsIn, IsOptional, Validate, IsNumber } from 'class-validator';
import { NullableDateString } from '@/constraints';

export class StudentInfo {
  public id: number;
  public student: number;
  public semester: number;
  public healthGroup: number;
  public receiptDate: Date | null;
  public diary: number;
  public competitions: number;
  public personalQualities: number;
  public examDate?: Date | null;
}

export class StudentInfoCreationInfo {
  @IsInt()
  public student: number;

  @IsInt()
  public semester: number;

  @IsIn([1, 2, 3])
  public healthGroup: number;

  @Validate(NullableDateString)
  public receiptDate: Date | null;

  @IsNumber()
  public diary: number;

  @IsNumber()
  public competitions: number;

  @IsNumber()
  public personalQualities: number;

  @Validate(NullableDateString)
  public examDate?: Date | null;
}

export class StudentInfoEditionInfo {
  @IsInt()
  public id: number;

  @IsOptional()
  @IsIn([1, 2, 3])
  public healthGroup: number;

  @IsOptional()
  @Validate(NullableDateString)
  public receiptDate?: Date | null;

  @IsOptional()
  @IsNumber()
  public diary: number;

  @IsOptional()
  @IsNumber()
  public competitions: number;

  @IsOptional()
  @IsNumber()
  public personalQualities: number;

  @IsOptional()
  @Validate(NullableDateString)
  public examDate?: Date | null;
}
