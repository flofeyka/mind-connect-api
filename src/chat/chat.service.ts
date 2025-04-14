import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/message.entity';
import { CreateUpdateChatDto } from './dtos/create-update-chat-dto';
import { RequestType } from 'types/RequestType';
import { ChatDto } from './dtos/chat-dto';
import { ChatUser } from './entities/chat-user.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(ChatMessage)
    private readonly chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(ChatUser)
    private readonly chatUserRepository: Repository<ChatUser>,
  ) {}

  async createChat(
    chatDto: CreateUpdateChatDto,
    user_id: number,
  ): Promise<ChatDto> {
    try {
      const chat: Chat = await this.chatRepository.save({
        ...chatDto,
        image: {
          filename: chatDto.image,
        },
      });
      const chatMember: ChatUser = await this.chatUserRepository.save({
        user_id,
        chat_id: chat.id,
      });

      return new ChatDto(chat);
    } catch (e) {
      throw new BadRequestException('Incorrect data for chat creating');
    }
  }

  async getChat(id: number) {}
}
