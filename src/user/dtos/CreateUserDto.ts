import { IsString } from "class-validator";
import { UserDto } from "./UserDto";


export class CreateUserDto extends UserDto {
    @IsString()
    public readonly password: string;
}