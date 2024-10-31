import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({title: "Password", example: "123235424"})
    @IsString()
    @MinLength(8)
    public readonly password: string;
}