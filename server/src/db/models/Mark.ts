import { IsString, Length, IsNumber, IsInt, IsOptional } from 'class-validator';

export class Mark {
  public id: number;
  public name: string;
  public symbol: string;
  public weight: number;
}

export class MarkCreationInfo {
  @IsString()
  @Length(2, 50)
  public name: string;

  @IsString()
  @Length(1, 8)
  public symbol: string;

  @IsNumber()
  public weight: number;
}

export class MarkEditionInfo {
  @IsInt()
  public id: number;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  public name: string;

  @IsOptional()
  @IsString()
  @Length(1, 8)
  public symbol: string;

  @IsOptional()
  @IsNumber()
  public weight: number;
}
