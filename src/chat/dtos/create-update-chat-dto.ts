import { IsOptional, IsString } from "class-validator";

export class CreateUpdateChatDto {
    @IsString()
    public title: string;

    @IsOptional()
    @IsString()
    public image: string;
}