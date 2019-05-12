import {
  Length,
  IsIn,
  IsInt,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional
} from 'class-validator';

export class Test {
  public id: number;
  public name: string;
  public direction: number;
  public maleMarks: number[];
  public femaleMarks: number[];
}

export class TestCreationInfo {
  @Length(2, 50)
  public name: string;

  @IsIn([1, -1])
  @IsInt()
  public direction: number;

  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  public maleMarks: number[];

  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  public femaleMarks: number[];
}

export class TestEditionInfo {
  @IsInt()
  public id: number;

  @IsOptional()
  @Length(2, 50)
  public name: string;

  @IsOptional()
  @IsIn([1, -1])
  @IsInt()
  public direction: number;

  @IsOptional()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  public maleMarks: number[];

  @IsOptional()
  @ArrayMinSize(5)
  @ArrayMaxSize(5)
  public femaleMarks: number[];
}
