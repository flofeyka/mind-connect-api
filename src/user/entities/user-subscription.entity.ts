import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  subscriber: User;

  @ManyToOne(() => User, (user) => user.followers, {
    onDelete: 'CASCADE',
    eager: true,
  })
  subscribedTo: User;
}
