import { UUID } from 'crypto';
import { GigaChatDialog } from '../entities/dialog.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/images/dtos/image-dto';

export class DialogsDto {
  @ApiProperty({ title: 'Уникальный ID' })
  id: UUID;
  @ApiProperty({ title: 'Название диалога' })
  title: string;
  @ApiProperty({ title: 'Ссылка на аватарку изображения' })
  image: ImageDto;
  @ApiProperty({
    title: 'Последнее сообщение',
    example: {

      lastMessage: {
        role: 'assistant',
        content: 'Все отлично',
        created_at: '12-12-12',
      },
    },
  })
  lastMessage: {
    role: string;
    content: string;
    created_at: Date;
  };

  constructor(model: GigaChatDialog) {
    this.id = model.id;
    this.title = model.title;
    this.image = model.image ? new ImageDto(model.image) : null;
    this.lastMessage =
      model.messages.length > 1
        ? {
            role: model.messages[model.messages.length - 1].role,
            content: model.messages[model.messages.length - 1].content,
            created_at: model.messages[model.messages.length - 1].created_at,
          }
        : null;
  }
}
