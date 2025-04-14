import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({ title: 'Refresh token', example: 'refresh_token' })
  refreshToken: string;
}
