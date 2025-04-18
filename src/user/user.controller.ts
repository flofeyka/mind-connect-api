import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { RequestType } from 'types/RequestType';
import { EditUserDto } from './dtos/EditUserDto';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserOutputDto } from './dtos/UserOutputDto';
import { UserDto } from './dtos/UserDto';
import { SearchDoctorDto } from './dtos/search-doctor-dto';

@ApiTags('User API')
@Controller('/user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({ status: 200, type: UserOutputDto })
  @Get('/')
  @UseGuards(AuthGuard)
  async getUserData(@Req() req: RequestType): Promise<UserOutputDto> {
    const userData: User = await this.userService.findUserById(req.user.id);
    return new UserOutputDto(userData);
  }

  @ApiOperation({ summary: 'Get doctor list' })
  @ApiResponse({ status: 200, type: [UserOutputDto] })
  @Post('/doctors')
  @UseGuards(AuthGuard)
  async getDoctors(@Query() dto: SearchDoctorDto) {
    return await this.userService.getDoctors(dto);
  }

  @ApiOperation({ summary: 'Update user data' })
  @ApiOkResponse({ type: UserOutputDto })
  @ApiNotFoundResponse({
    example: new NotFoundException(
      'Photo for user avatar not found',
    ).getResponse(),
  })
  @Put('/')
  @UseGuards(AuthGuard)
  editUser(
    @Req() req: RequestType,
    @Body() userDto: EditUserDto,
  ): Promise<UserOutputDto> {
    return this.userService.editUser(req.user.id, userDto);
  }
}
