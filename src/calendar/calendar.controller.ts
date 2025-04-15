import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestType } from 'types/RequestType';
import { CalendarResponseDto } from './dtos/calendar-response-dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CalendarGuard } from './calendar.guard';
import { CalendarStatusDto } from './dtos/calendar-status-dto';
import { CalendarDto } from './dtos/calendar-dto';

@ApiTags('Calendar API')
@ApiBearerAuth()
@Controller('/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @ApiOperation({ summary: 'Get calendar by id' })
  @ApiOkResponse({ type: CalendarResponseDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Calendar not found').getResponse(),
  })
  @UseGuards(AuthGuard, CalendarGuard)
  @Get('/:id')
  getCalendarById(@Req() request: RequestType): CalendarResponseDto {
    return new CalendarResponseDto({
      success: true,
      calendar: request.calendar,
    });
  }

  @ApiOperation({ summary: 'Find or create today calendar' })
  @ApiOkResponse({ type: CalendarResponseDto })
  @UseGuards(AuthGuard)
  @Post('/today-calendar')
  findOrCreateTodayCalendar(
    @Request() request: RequestType,
  ): Promise<CalendarResponseDto> {
    return this.calendarService.findOrCreateTodayCalendar(request.user.id);
  }

  @ApiOperation({ summary: 'Get calendars' })
  @ApiOkResponse({ type: [CalendarDto] })
  @UseGuards(AuthGuard)
  @Get('/all/by-dates')
  getCalendarsByDates(
    @Request() request: RequestType,
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
  ): Promise<CalendarDto[]> {
    return this.calendarService.getCalendarsByDates(request.user.id, start_date, end_date);
  }

  @ApiOperation({ summary: 'Setting your well-being' })
  @ApiNotFoundResponse({
    example: new NotFoundException('Calendar not found').getResponse(),
  })
  @ApiOkResponse({ type: CalendarResponseDto })
  @UseGuards(AuthGuard, CalendarGuard)
  @Post('/status')
  async setStatus(
    @Request() request: RequestType,
    @Body() calendarDto: CalendarStatusDto,
  ): Promise<CalendarResponseDto> {
    return this.calendarService.setStatus(request.calendar, calendarDto.status);
  }
}
