import { ApiProperty } from '@nestjs/swagger';
import { Calendar } from '../calendar.entity';
import { NoteDto } from '../notes/dtos/note-dto';
import { CalendarNote } from '../notes/note.entity';

export class CalendarDto {
  @ApiProperty({ title: 'Идентификатор календаря', example: 1 })
  public _id: number;

  @ApiProperty({ title: 'Дата', example: '10 ноября' })
  public date: string;

  @ApiProperty({
    title: 'Самочувствие человека на этот день',
    example: 0,
  })
  public status: number;

  @ApiProperty({ title: '', type: [NoteDto] })
  public notes: NoteDto[];

  constructor(calendar: Calendar) {
    this._id = calendar._id;
    this.status = calendar.status;
    this.date =
      new Date(calendar.date).getDate() +
      ' ' +
      (new Date(calendar.date).getMonth() + 1);
    this.notes =
      calendar.notes?.map(
        (note: CalendarNote) => new NoteDto(note, calendar._id),
      ) || [];
  }
}
