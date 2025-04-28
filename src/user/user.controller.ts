import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
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
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserOutputDto } from './dtos/UserOutputDto';
import { SearchDoctorDto } from './dtos/search-doctor-dto';

@ApiTags('User API')
@Controller('/user')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({
    status: 200,
    type: UserOutputDto,
  })
  @Get('/')
  async getUserData(@Req() req: RequestType): Promise<UserOutputDto> {
    const userData: User = await this.userService.findUserById(req.user.id);
    return new UserOutputDto(userData);
  }

  @ApiOperation({ summary: 'Get doctor list' })
  @ApiResponse({
    status: 200,
    type: [UserOutputDto],
  })
  @Post('/doctors')
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
  editUser(
    @Req() req: RequestType,
    @Body() userDto: EditUserDto,
  ): Promise<UserOutputDto> {
    return this.userService.editUser(req.user.id, userDto);
  }

  @Post('follow/:id')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to follow',
  })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Successfully followed' } },
    description: 'Successfully followed',
  })
  follow(@Req() req: RequestType, @Param('id') id: number) {
    const subscriberId = req.user.id;
    return this.userService.follow(subscriberId, id);
  }

  @Post('unfollow/:id')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user to unfollow',
  })
  @ApiResponse({
    status: 200,
    schema: { example: { message: 'Successfully followed' } },
    description: 'Successfully unfollowed',
  })
  unfollow(@Req() req: RequestType, @Param('id') id: number) {
    const subscriberId = req.user.id;
    return this.userService.unfollow(subscriberId, id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user',
  })
  @ApiResponse({
    status: 200,
    type: [UserOutputDto],
    description: 'List of followers',
  })
  async getFollowers(@Param('id') id: number): Promise<UserOutputDto[]> {
    return await this.userService.getFollowers(id);
  }

  @Get(':id/subscriptions')
  @ApiOperation({ summary: 'Get subscriptions of a user' })
  @ApiParam({
    name: 'id',
    description: 'ID of the user',
  })
  @ApiResponse({
    status: 200,
    type: [UserOutputDto],
    description: 'List of subscriptions',
  })
  async getSubscriptions(@Param('id') id: number): Promise<UserOutputDto[]> {
    return await this.userService.getSubscriptions(id);
  }

  @Get('/profile/:id')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({
    name: 'id',
    description: 'Id of user',
  })
  @ApiResponse({ status: 200, type: UserOutputDto })
  async getProfile(@Param('id') id: string) {
    return await this.userService.getProfile(Number(id));
  }
}
