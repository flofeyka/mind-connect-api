import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CalendarNote } from './notes/note.entity';

@Entity({ name: 'calendars' })
export class Calendar {
  @PrimaryGeneratedColumn()
  public _id: number;

  @ManyToOne((): typeof User => User)
  public user: User;

  @Column({ nullable: true })
  public status: number;

  @Column()
  public date: Date;

  @OneToMany(
    (): typeof CalendarNote => CalendarNote,
    (note: CalendarNote) => note.calendar,
    {
      onDelete: 'SET NULL',
      eager: true,
    },
  )
  public notes: CalendarNote[];
}
