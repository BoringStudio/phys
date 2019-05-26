import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class PaginationQueryParams {
  @IsOptional()
  @IsNumberString()
  public perPage?: number;

  @IsOptional()
  @IsNumberString()
  public page?: number;
}

export class SearchParams {
  @IsOptional()
  @IsNumberString()
  public limit: number;

  @IsOptional()
  @IsString()
  public match: string;
}
