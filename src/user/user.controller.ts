import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from './user.service';
import { RequestType } from 'src/types/RequestType';
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
    const userData: User = await this.userService.findUserById(req.user._id);
    return new UserOutputDto(userData);
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
    return this.userService.editUser(req.user._id, userDto);
  }
}
