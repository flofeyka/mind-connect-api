import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { NotFoundError, Observable } from "rxjs";
import { RequestType } from "types/RequestType";
import { Post } from "./entities/post.entity";
import { PostService } from "./post.service";

@Injectable()
export class PostGuard implements CanActivate {
    constructor(private readonly postService: PostService) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: RequestType = context.switchToHttp().getRequest();
        const _id = request.params.id || request.body.id || request.query.id;
        const userId = request.user._id;

        const post: Post = await this.postService.findPost(_id);
        if(!post) {
            throw new NotFoundException("Post not found");
        }

        if(post.user._id !== userId) {
            throw new NotFoundException("Post not found");
        }

        request.post = post;
        return true;
    }
}