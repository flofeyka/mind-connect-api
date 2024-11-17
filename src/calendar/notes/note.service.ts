import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CalendarNote } from './note.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarService } from '../calendar.service';
import { Calendar } from '../calendar.entity';
import { NoteDto } from './dtos/note-dto';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(CalendarNote)
    private readonly noteRepository: Repository<CalendarNote>,
    private readonly calendarService: CalendarService,
  ) {}

  public async findNote(noteId: number): Promise<CalendarNote> {
    return await this.noteRepository.findOne({
      where: {
        _id: noteId,
      },
      relations: {
        calendar: {
          user: true,
        },
      },
    });
  }

  async createNote(
    calendar: Calendar,
    date: Date,
    note: string,
  ): Promise<NoteDto> {
    const noteCreated: CalendarNote = await this.noteRepository.save({
      calendar,
      time: new Date(date),
      note,
    });

    return new NoteDto(noteCreated, calendar._id);
  }

  async updateNote(calendarNote: CalendarNote, note: string): Promise<NoteDto> {
    calendarNote.note = note;
    const noteUpdated: CalendarNote =
      await this.noteRepository.save(calendarNote);

    return new NoteDto(noteUpdated, calendarNote.calendar._id);
  }
}
