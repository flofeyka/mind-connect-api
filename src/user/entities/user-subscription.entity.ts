import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserSubscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions, { onDelete: 'CASCADE' })
  subscriber: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  subscribedTo: User;
}
