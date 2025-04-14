import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { describe } from 'node:test';
import { Repository } from 'typeorm';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatUser } from './entities/chat-user.entity';
import { Chat } from './entities/chat.entity';
import { ChatMessage } from './entities/message.entity';
import { TokenService } from 'src/auth/token/token.service';

jest.mock('src/auth/token/token.service');

describe('chat-controller', () => {
  jest.setTimeout(100000);
  let controller: ChatController;
  let service: ChatService;
  let chatRepository: Repository<Chat>;
  let messageRepository: Repository<ChatMessage>;
  let chatUserRepository: Repository<ChatUser>;
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'ep-wild-recipe-a509vt8y-pooler.us-east-2.aws.neon.tech',
          port: 5173,
          username: 'mind-connect-db_owner',
          password: 'npg_OoGQE5i4sUHD',
          database: 'mind-connect-db',
          entities: ['../../**/*.entity{.ts,.js}'],
          synchronize: true,
          ssl: {
            rejectUnauthorized: false,
          },
        }),
        TypeOrmModule.forFeature([Chat, ChatUser, ChatMessage]),
      ],
      controllers: [ChatController],
      providers: [
        ChatService,
        ChatGateway,
        {
          provide: TokenService,
          useValue: {
            generateTokens: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
    chatRepository = module.get<Repository<Chat>>(Chat);
    messageRepository = module.get<Repository<ChatMessage>>(ChatMessage);
    chatUserRepository = module.get<Repository<ChatUser>>(ChatUser);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });
});
