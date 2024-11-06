import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Calendar } from "../calendar.entity";

@Entity({name: "calendar-notes"})
export class CalendarNote {
    @PrimaryGeneratedColumn()
    public _id: number;

    @ManyToOne(() => Calendar, {onDelete: "CASCADE"})
    public calendar: Calendar;

    @Column()
    public time: Date;

    @CreateDateColumn()
    public createdAt: Date;
}