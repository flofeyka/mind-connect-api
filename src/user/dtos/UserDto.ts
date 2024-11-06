import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class UserDto {
    @ApiProperty({title: "E-mail", example: "example@gmail.com"})
    @IsEmail()
    public readonly email?: string;

    @ApiProperty({title: "Name", example: "John"})
    @IsString()
    public readonly firstName?: string;

    @ApiProperty({title: "Surname", example: "Doe"})
    @IsString()
    public readonly lastName?: string;

    @ApiProperty({title: "Phone number", example: "89999999999"})
    @IsNumber()
    public readonly phoneNumber?: number;
}