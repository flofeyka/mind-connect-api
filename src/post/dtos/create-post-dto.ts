import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({title: "Post text value", example: "Hello. How are you?"})
    @IsString()
    public readonly value: string;
}