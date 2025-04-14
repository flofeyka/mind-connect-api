import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { ChatMessage } from './message.entity';
import { UUID } from 'crypto';

@Entity()
export class ChatUser {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: UUID;

  @Column()
  public user_id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column()
  public chat_id: number;

  @ManyToOne(() => Chat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'chat_id' })
  public chat: Chat;

  @OneToMany(
    () => ChatMessage,
    (chat_message: ChatMessage) => chat_message.user,
  )
  public messages: ChatMessage[];
}
