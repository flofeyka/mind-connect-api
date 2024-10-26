import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty({title: "Email", example: "user@test.ru"})
    @IsEmail()
    public readonly email: string;

    @ApiProperty({title: "Password", example: "12345678"})
    @IsString()
    public readonly password: string;
}