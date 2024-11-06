import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalendarNote } from "./notes/note.entity";

@Entity({name: "calendars"})
export class Calendar {
    @PrimaryGeneratedColumn()
    public _id: number;

    @ManyToOne(() => User)
    public user: User;

    @Column()
    public status: 'very bad' | 'bad' | '50/50' | 'ok' | 'good' | 'very good';

    @Column()
    public date: Date;

    @Column()
    public index: number;

    @OneToMany(() => CalendarNote, (note: CalendarNote) => note.calendar, {onDelete: "SET NULL"})
    public notes: CalendarNote[];

}