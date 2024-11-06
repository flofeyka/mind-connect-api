import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Calendar } from "./calendar.entity";
import { CalendarController } from "./calendar.controller";
import { CalendarNote } from "./notes/note.entity";
import { CalendarService } from "./calendar.service";

@Module({
    imports: [TypeOrmModule.forFeature([Calendar, CalendarNote])],
    controllers: [CalendarController],
    providers: [CalendarService]
})
export class CalendarModule {};