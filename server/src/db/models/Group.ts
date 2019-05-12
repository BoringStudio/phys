import { Length, IsInt } from 'class-validator';

export class Group {
  public id: number;
  public name: string;
}

export class GroupCreationInfo {
  @Length(2, 20)
  public name: string;
}

export class GroupEditionInfo {
  @IsInt()
  public id: number;

  @Length(2, 20)
  public name: string;
}
