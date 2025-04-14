import { Image } from 'src/images/images.entity';
import { Comment } from 'src/post/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment-replies')
export class Reply {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ foreignKeyConstraintName: 'comment' })
  public comment_id: number;

  @ManyToOne(() => Comment, (comment: Comment) => comment.replies)
  public comment: Comment;

  @Column({ foreignKeyConstraintName: 'user' })
  public user_id: number;

  @ManyToOne(() => User)
  public user: User;

  @Column({ type: 'text' })
  public text: string;

  @ManyToMany(() => Image)
  @JoinTable()
  public images: Image[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
