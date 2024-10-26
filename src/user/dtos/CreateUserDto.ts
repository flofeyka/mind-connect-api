import { IsString } from "class-validator";
import { UserDto } from "./UserDto";
import { ApiProperty } from "@nestjs/swagger";


export class CreateUserDto extends UserDto {
    @ApiProperty({title: "Password", example: "12345678"})
    @IsString()
    public readonly password: string;
}