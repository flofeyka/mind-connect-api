import { Request } from 'express';
import { Calendar } from 'src/calendar/calendar.entity';
import { CalendarNote } from 'src/calendar/notes/note.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from '../src/post/entities/comment.entity';

export interface RequestType extends Request {
  user: { id: number; email: string };
  calendar?: Calendar;
  note?: CalendarNote;
  post?: Post;
  comment?: Comment;
}
