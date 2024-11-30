import { Request } from 'express';
import { Calendar } from 'src/calendar/calendar.entity';
import { CalendarNote } from 'src/calendar/notes/note.entity';
import { Post } from 'src/post/entities/post.entity';

export interface RequestType extends Request {
  user: { _id: number; email: string };
  calendar: Calendar;
  note: CalendarNote;
  post: Post;
}
