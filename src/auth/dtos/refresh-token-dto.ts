import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ title: 'Refresh token', example: 'refresh_token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
