import { ApiProperty } from '@nestjs/swagger';
import { CalendarNote } from '../note.entity';

export class NoteDto {
  @ApiProperty({ title: 'Идентификатор заметки', example: 1 })
  public id: number;

  @ApiProperty({ title: 'Идентификатор календаря', example: 1 })
  public calendarId: number;
  
  @ApiProperty({ title: 'Note value', example: 'Around this day i felt good' })
  public note: string;

  @ApiProperty({ title: 'Время', example: '14:50' })
  public createdAt: Date;

  constructor(note: CalendarNote, calendarId: number) {
    this.id = note.id;
    this.calendarId = calendarId;
    this.createdAt = note.createdAt;
    this.note = note.note;
  }
}
