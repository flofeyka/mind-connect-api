import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { CalendarController } from './calendar.controller';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { NoteController } from './notes/note.controller';
import { CalendarNote } from './notes/note.entity';
import { NoteService } from './notes/note.service';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, CalendarNote]), UserModule],
  controllers: [CalendarController, NoteController],
  providers: [CalendarService, NoteService],
})
export class CalendarModule {}
