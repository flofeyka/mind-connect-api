import { Request } from 'express';
import { Calendar } from 'src/calendar/calendar.entity';
import { CalendarNote } from '../calendar/notes/note.entity';

export interface RequestType extends Request {
  user: { _id: number; email: string };
  calendar: Calendar;
  note: CalendarNote;
}
