import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Calendar } from '../calendar.entity';

@Entity({ name: 'calendar-notes' })
export class CalendarNote {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne((): typeof Calendar => Calendar, { onDelete: 'CASCADE' })
  public calendar: Calendar;

  @Column()
  public time: Date;

  @Column({ nullable: true })
  public note: string;

  @CreateDateColumn()
  public createdAt: Date;
}
