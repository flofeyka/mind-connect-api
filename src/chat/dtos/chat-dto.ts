import { ApiProperty } from '@nestjs/swagger';
import { ImageDto } from 'src/images/dtos/image-dto';
import { ChatUser } from '../entities/chat-user.entity';
import { Chat } from '../entities/chat.entity';

export class ChatDto {
  @ApiProperty({ title: 'Chat name', example: 'New chat' })
  title: string;

  @ApiProperty({ title: 'Chat image', type: ImageDto })
  image: ImageDto;

  @ApiProperty({ title: 'Members', type: [ChatUser] })
  users: ChatUser[];

  constructor(chat: Chat) {
    this.title = chat.title;
    this.image = new ImageDto(chat.image);
    this.users = chat.users;
  }
}
