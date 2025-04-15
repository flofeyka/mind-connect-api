import { IsDateString, IsNotEmpty, IsOptional } from "class-validator";

export class GetCalendarsDto {
  @IsDateString()
  @IsOptional()
  start_date: Date;

  @IsDateString()
  @IsOptional()
  end_date: Date = new Date();
}
