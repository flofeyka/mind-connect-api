import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((): typeof User => User, (user: User) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  }) //posts
  public user: User;

  @Column()
  public value: string;

  @Column({ default: false })
  public pinned: boolean;

  @OneToMany(
    (): typeof Comment => Comment,
    (comment: Comment): Post => comment.post,
    { onDelete: 'SET NULL', eager: true },
  )
  public comments: Comment[];

  @UpdateDateColumn()
  public updatedAt: Date;

  @CreateDateColumn()
  public createdAt: Date;
}
