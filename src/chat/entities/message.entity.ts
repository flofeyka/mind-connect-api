import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chat } from './chat.entity';
import { ChatUser } from './chat-user.entity';

@Entity('chat-messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: UUID;

  @Column()
  public value: string;

  @ManyToOne(() => Chat, (chat: Chat) => chat.messages, { onDelete: 'CASCADE' })
  public chat: Chat;

  @UpdateDateColumn({ nullable: true })
  public updated_at: Date | null;

  @ManyToOne(() => ChatUser, (chat_user: ChatUser) => chat_user.user)
  public user: ChatUser;

  @CreateDateColumn()
  public created_at: Date;
}
