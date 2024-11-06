import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Calendar } from "./calendar.entity";
import { Repository } from "typeorm";
import { CalendarNote } from "./notes/note.entity";

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) private readonly calendarRepository: Repository<Calendar>,
        @InjectRepository(CalendarNote) private readonly noteRepository: Repository<CalendarNote>
    ) {}

    async addNote(userId: number, date: Date, time: Date, note: number) {
        const calendars: Calendar[] = await this.calendarRepository.find({where: {user: {
            _id: userId
        }}});

        let highestIndex = 0;
        for (const calendar of calendars) {
          if (calendar.index > highestIndex) {
            highestIndex = calendar.index;
          }
        }

        const calendarFound: Calendar = calendars.find((calendar: Calendar) => calendar.date === date);
        if(!calendarFound) {
            throw new NotFoundException(`Calendar with this date ${date} is not found`)
        }
        calendarFound.index = highestIndex + 1;
        

    }
};