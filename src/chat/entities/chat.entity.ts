import { Image } from 'src/images/images.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessage } from './message.entity';
import { User } from 'src/user/entities/user.entity';
import { UUID } from 'crypto';
import { ChatUser } from './chat-user.entity';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn()
  public readonly id: number;

  @Column()
  public title: string;

  @OneToOne(() => Image, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  public image: Image;

  @OneToMany(() => ChatMessage, (message: ChatMessage) => message.chat)
  public messages: ChatMessage[];

  @OneToMany(() => ChatUser, (chat_user: ChatUser) => chat_user.chat, {
    onDelete: 'SET NULL',
  })
  @JoinTable()
  public users: ChatUser[];
}
