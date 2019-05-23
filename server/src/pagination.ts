import { IsOptional, IsNumberString } from 'class-validator';

export class PaginationQueryParams {
  @IsOptional()
  @IsNumberString()
  public perPage?: number;

  @IsOptional()
  @IsNumberString()
  public page?: number;
}
