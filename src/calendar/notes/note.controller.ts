import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dtos/create-note-dto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CalendarGuard } from '../calendar.guard';
import { RequestType } from 'types/RequestType';
import { NoteDto } from './dtos/note-dto';
import { NoteGuard } from './note.guard';
import { UpdateNoteDto } from './dtos/update-note-dto';

@ApiTags('Calendar Note API')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('/calendar/note')
export class NoteController {
  constructor(private readonly noteService: NoteService) { }

  @ApiOperation({ summary: 'Create a note' })
  @ApiOkResponse({ type: NoteDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Calendar not found').getResponse(),
  })
  @Post('/')
  @UseGuards(CalendarGuard)
  createNote(
    @Body() noteDto: CreateNoteDto,
    @Req() request: RequestType,
  ): Promise<NoteDto> {
    return this.noteService.createNote(
      request.calendar,
      new Date(Date.now()),
      noteDto.note,
    );
  }

  @ApiOperation({ summary: 'Update the note' })
  @ApiOkResponse({ type: NoteDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Note not found').getResponse(),
  })
  @Put('/')
  @UseGuards(AuthGuard, NoteGuard)
  updateNote(
    @Body() noteDto: UpdateNoteDto,
    @Req() request: RequestType,
  ): Promise<NoteDto> {
    return this.noteService.updateNote(request.note, noteDto.note);
  }

  @ApiOperation({ summary: "Delete the note" })
  @ApiOkResponse({
    example: {
      success: true,
      message: "Note is successfully deleted"
    }
  })
  @ApiNotFoundResponse({
    example: new NotFoundException('Note not found').getResponse(),
  })
  @Delete("/:id")
  @UseGuards(AuthGuard, NoteGuard)
  deleteNote(@Req() request: RequestType): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.noteService.deleteNote(request.note)
  }

  @ApiOperation({ summary: "Get note by id" })
  @ApiOkResponse({ type: NoteDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Note not found').getResponse(),
  })
  @Get("/:id")
  @UseGuards(NoteGuard)
  getNote(@Req() request: RequestType): NoteDto {
    return this.noteService.getUserNote(request.note);
  }
}
