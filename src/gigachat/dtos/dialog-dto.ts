import { ApiProperty } from "@nestjs/swagger";
import { ImageDto } from "src/images/dtos/image-dto";
import { GigaChatMessage } from "../entities/message.entity";
import { GigaChatDialog } from "../entities/dialog.entity";
import { UUID } from "crypto";

export class DialogDto {
    @ApiProperty({
        title: "Уникальный ID", 
        example: "123e4567-e89b-12d3-a456-426614174000"
    })
    id: UUID;

    @ApiProperty({
        title: "Название диалога",
        example: "Диалог с ИИ"
    })

    title: string;

    @ApiProperty({
        title: "Аватарка",
        type: ImageDto
    })
    image: ImageDto;

    @ApiProperty({
        title: "Сообщения",
        type: [GigaChatMessage]
    })
    messages: GigaChatMessage[];

    constructor(model: GigaChatDialog) {
        this.id = model.id;
        this.title = model.title;
        this.image = model.image ? new ImageDto(model.image) : null;
        this.messages = model.messages;
    }

}