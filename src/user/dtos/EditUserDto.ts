import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./UserDto";
import { IsString } from "class-validator";

export class EditUserDto extends UserDto {
    @ApiProperty({example: "d2f5fff6-2df4-4761-a23a-e9f708655ee1.png"})
    @IsString()
    public readonly image?: string;    
}