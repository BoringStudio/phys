import { Length, IsOptional, IsInt } from 'class-validator';

export class User {
  public id: number;
  public login: string;
  public password: string;
  public surname: string;
  public name: string;
  public middlename?: string;
  public fullAccess: boolean;
}

export class UserCreationInfo {
  @Length(2, 50)
  public login: string;

  @Length(6, 50)
  public password: string;

  @Length(2, 50)
  public surname: string;

  @Length(2, 50)
  public name: string;

  @IsOptional()
  @Length(6, 50)
  public middlename?: string | null;
}

export class UserEditionInfo {
  @IsInt()
  public id: number;

  @IsOptional()
  @Length(2, 50)
  public login?: string;

  @IsOptional()
  @Length(6, 50)
  public password?: string;

  @IsOptional()
  @Length(2, 50)
  public surname?: string;

  @IsOptional()
  @Length(2, 50)
  public name?: string;

  @IsOptional()
  @Length(6, 50)
  public middlename?: string | null;
}
