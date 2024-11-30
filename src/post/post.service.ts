import { BadGatewayException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { DeleteResult, InsertResult, Repository } from "typeorm";
import { CreatePostDto } from "./dtos/create-post-dto";
import { PostOutputDto } from "./dtos/post-output-dto";
import { Post } from "./entities/post.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
        private readonly userService: UserService
    ) { }

    public async findPost(_id: number): Promise<Post> {
        return await this.postRepository.findOne({ where: { _id } });
    }

    async getUserPosts(userId: number): Promise<PostOutputDto[]> {
        const user: User = await this.userService.findUserById(userId, [{key: "posts"}]);
        return user.posts.map((post: Post) => new PostOutputDto(post));
    } 

    async createPost(userId: number, postDto: CreatePostDto): Promise<PostOutputDto> {
        const creator: User = await this.userService.findUserById(userId);
        const postCreated: InsertResult = await this.postRepository.createQueryBuilder().insert().into(Post).values([{
            value: postDto.value,
            user: creator
        }]).execute()
        const post: Post = await this.findPost(postCreated.identifiers[0]._id);

        return new PostOutputDto(post);
    }

    async updatePost(post: Post, postDto: CreatePostDto): Promise<PostOutputDto> {
        post.value = postDto.value;
        const postUpdated: Post = await this.postRepository.save(post);
        return new PostOutputDto(postUpdated);
    }

    async deletePost(post: Post): Promise<{
        success: boolean;
        message: string
    }> {
        const deleteResult: DeleteResult = await this.postRepository.delete({
            _id: post._id
        });

        if(deleteResult.affected !== 1) {
            throw new BadGatewayException("Cannot delete the post");
        }

        return {
            success: true,
            message: "Post is successfully deleted"
        }
    }

    getUserPost(post: Post): PostOutputDto {
        return new PostOutputDto(post);
    }

};