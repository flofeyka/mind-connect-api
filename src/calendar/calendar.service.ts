import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from './calendar.entity';
import { CalendarResponseDto } from './dtos/calendar-response-dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Calendar)
    private readonly calendarRepository: Repository<Calendar>,
    private readonly userService: UserService,
  ) {}

  async findOrCreateTodayCalendar(
    userId: number,
  ): Promise<CalendarResponseDto> {
    const user: User = await this.userService.findUserById(userId);
    const now: Date = new Date(Date.now());

    const today: number = new Date(now).getUTCDate();
    const currentMonth: number = new Date(now).getUTCMonth();
    const currentYear: number = new Date(now).getUTCFullYear();

    const currentCalendar: Calendar = await this.calendarRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        date: new Date(currentYear, currentMonth, today),
      },
    });

    const calendarSaved: Calendar = await this.calendarRepository.save({
      ...currentCalendar,
      user,
      date: new Date(currentYear, currentMonth, today),
    });

    return new CalendarResponseDto({ success: true, calendar: calendarSaved });
  }

  async setStatus(
    calendar: Calendar,
    status: number,
  ): Promise<CalendarResponseDto> {
    calendar.status = status;
    const calendarSaved: Calendar =
      await this.calendarRepository.save(calendar);

    return new CalendarResponseDto({ success: true, calendar: calendarSaved });
  }

  public async findCalendar(id: number): Promise<Calendar> {
    return await this.calendarRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }
}
