import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/user/dtos/UserDto";
import { UserOutputDto } from "src/user/dtos/UserOutputDto";
import { Post } from "../entities/post.entity";

export class PostOutputDto {
    @ApiProperty({ title: "Post id", example: 1 })
    public readonly _id: number;

    @ApiProperty({ title: "Post text value", example: "Hello. How are you?" })
    public readonly value: string;

    @ApiProperty({ title: "Post creator", type: UserOutputDto })
    public readonly user: UserOutputDto

    constructor(post: Post) {
        this._id = post._id
        this.value = post.value;
        this.user = new UserOutputDto(post.user);
    }
}