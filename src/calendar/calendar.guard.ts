import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RequestType } from 'types/RequestType';
import { Calendar } from './calendar.entity';
import { CalendarService } from './calendar.service';

@Injectable()
export class CalendarGuard implements CanActivate {
  constructor(private readonly calendarService: CalendarService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestType = context.switchToHttp().getRequest();
      const calendar_id: number =
        request.params.calendar_id ||
        request.query.calendar_id ||
        request.body.calendar_id ||
        request.body.id ||
        request.params.id ||
        request.query.id;

      if (!calendar_id) {
        throw new BadRequestException('Calendar not found');
      }

      const calendarFound: Calendar =
        await this.calendarService.findCalendar(calendar_id);

      if (calendarFound.user.id !== request.user.id) {
        throw new NotFoundException('Calendar not found');
      }

      request.calendar = calendarFound;
      return true;
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Calendar not found');
    }
  }
}
