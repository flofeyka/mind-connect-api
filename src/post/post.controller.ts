import {
  BadGatewayException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestType } from 'types/RequestType';
import { CreatePostDto } from './dtos/create-post-dto';
import { PostOutputDto } from './dtos/post-output-dto';
import { PostGuard } from './post.guard';
import { PostService } from './post.service';

@ApiTags('Post API')
@Controller('/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Get user posts' })
  @ApiOkResponse({ type: [PostOutputDto] })
  @UseGuards(AuthGuard)
  @Get('/')
  getUserPosts(@Req() request: RequestType) {
    return this.postService.getUserPosts(request.user.id);
  }

  @ApiOperation({ summary: 'Create a post' })
  @ApiOkResponse({ type: PostOutputDto })
  @UseGuards(AuthGuard)
  @Post('/')
  createPost(
    @Body() postDto: CreatePostDto,
    @Req() request: RequestType,
  ): Promise<PostOutputDto> {
    return this.postService.createPost(request.user.id, postDto);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiOkResponse({ type: PostOutputDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Post not found').getResponse(),
  })
  @UseGuards(AuthGuard, PostGuard)
  @Get('/:id')
  getPostById(@Req() request: RequestType): PostOutputDto {
    return this.postService.getUserPost(request.post);
  }

  @ApiOperation({ summary: 'Update post ' })
  @ApiOkResponse({ type: PostOutputDto })
  @ApiNotFoundResponse({
    example: new NotFoundException('Post not found').getResponse(),
  })
  @ApiBadGatewayResponse({
    example: new BadGatewayException('Cannot delete the post').getResponse(),
  })
  @UseGuards(AuthGuard, PostGuard)
  @Put('/:id')
  updatePost(
    @Req() request: RequestType,
    @Body() postDto: CreatePostDto,
  ): Promise<PostOutputDto> {
    return this.postService.updatePost(request.post, postDto);
  }

  @ApiOperation({
    summary: 'Pin and unpin post',
    description: 'You can pin and unpin a post by this endpoint',
  })
  @ApiOkResponse({
    example: {
      success: true,
      message: 'Post pin status is successfully updated',
    },
  })
  @ApiNotFoundResponse({
    example: new NotFoundException('Post not found').getResponse(),
  })
  @UseGuards(AuthGuard, PostGuard)
  @Put('/:id/pin')
  pinPost(@Req() request: RequestType) {
    return this.postService.pinPost(request.post, request.user.id);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiOkResponse({
    example: {
      success: true,
      message: 'Post is successfully deleted',
    },
  })
  @ApiNotFoundResponse({
    example: new NotFoundException('Post not found').getResponse(),
  })
  @UseGuards(AuthGuard, PostGuard)
  @Delete('/:id')
  deletePost(@Req() request: RequestType) {
    return this.postService.deletePost(request.post);
  }
}
