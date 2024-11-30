import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';
import { NoteController } from './notes/note.controller';
import { CalendarNote } from './notes/note.entity';
import { NoteService } from './notes/note.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, CalendarNote]),
    forwardRef(() => AuthModule),
    UserModule,
  ],
  controllers: [CalendarController, NoteController],
  providers: [CalendarService, NoteService],
})
export class CalendarModule {}
