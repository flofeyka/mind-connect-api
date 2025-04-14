import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from './post.entity';
import { Reply } from './reply.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public value: string;

  @ManyToOne((): typeof User => User, { eager: true })
  @JoinColumn()
  public user: User;

  @ManyToOne(
    (): typeof Post => Post,
    (post: Post): Comment[] => post.comments,
    {
      onDelete: 'CASCADE',
    },
  )
  public post: Post;

  @OneToMany(() => Reply, (reply: Reply) => reply.comment)
  public replies: Reply[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
