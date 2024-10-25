import { IsEmail, IsNumber, IsString } from "class-validator";
import { User } from "../entities/user.entity";

export class UserDto {
    @IsEmail()
    public readonly email: string;

    @IsString()
    public readonly firstName: string;

    @IsString()
    public readonly lastName?: string;

    @IsNumber()
    public readonly phoneNumber?: number;
}