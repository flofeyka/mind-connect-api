import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DeleteResult, InsertResult, Repository } from 'typeorm';
import { CreatePostDto } from './dtos/create-post-dto';
import { PostOutputDto } from './dtos/post-output-dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) {}

  public async findPost(id: number): Promise<Post> {
    return await this.postRepository.findOne({ where: { id } });
  }

  async getUserPosts(userId: number): Promise<PostOutputDto[]> {
    const user: User = await this.userService.findUserById(userId, [
      { key: 'posts' },
    ]);
    return user.posts
      .map((post: Post) => new PostOutputDto(post))
      .sort((a) => (a.pinned ? -1 : 1));
  }

  async createPost(
    userId: number,
    postDto: CreatePostDto,
  ): Promise<PostOutputDto> {
    const creator: User = await this.userService.findUserById(userId);
    const postCreated: InsertResult = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into(Post)
      .values([
        {
          value: postDto.value,
          user: creator,
        },
      ])
      .execute();
    const post: Post = await this.findPost(postCreated.identifiers[0].id);

    return new PostOutputDto(post);
  }

  async pinPost(
    post: Post,
    userId: number,
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const user: User = await this.userService.findUserById(userId, [
      {
        key: 'posts',
      },
    ]);
    if (
      user.posts.filter((post: Post) => post.pinned).length > 2 &&
      !user.posts.find((postItem: Post) => postItem.id === post.id).pinned
    ) {
      throw new BadGatewayException('You can pin only 3 posts');
    }

    post.pinned = !post.pinned;
    await this.postRepository.save(post);

    return {
      success: true,
      message: 'Post pin status is successfully updated',
    };
  }

  async updatePost(post: Post, postDto: CreatePostDto): Promise<PostOutputDto> {
    post.value = postDto.value;
    const postUpdated: Post = await this.postRepository.save(post);
    return new PostOutputDto(postUpdated);
  }

  async deletePost(post: Post): Promise<{
    success: boolean;
    message: string;
  }> {
    const deleteResult: DeleteResult = await this.postRepository.delete({
      id: post.id,
    });

    if (deleteResult.affected !== 1) {
      throw new BadGatewayException('Cannot delete the post');
    }

    return {
      success: true,
      message: 'Post is successfully deleted',
    };
  }

  getUserPost(post: Post): PostOutputDto {
    return new PostOutputDto(post);
  }
}
