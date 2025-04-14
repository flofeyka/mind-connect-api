import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestType } from 'types/RequestType';
import { CalendarNote } from './note.entity';
import { NoteService } from './note.service';

@Injectable()
export class NoteGuard implements CanActivate {
  constructor(private readonly noteService: NoteService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestType = context.switchToHttp().getRequest();
      const note_id: number =
        request.body.note_id |
        Number(request.params.note_id) |
        request.body.id |
        Number(request.params.id);

      const noteFound: CalendarNote = await this.noteService.findNote(note_id);
      if (!noteFound || noteFound.calendar.user.id !== request.user.id) {
        throw new NotFoundException('Note not found');
      }

      request.note = noteFound;
      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Note not found');
    }
  }
}
