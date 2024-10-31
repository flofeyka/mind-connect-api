import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/user/dtos/UserDto";
import { UserOutputDto } from "src/user/dtos/UserOutputDto";
import { User } from "src/user/entities/user.entity";

export class AuthOutputDto {
    @ApiProperty({type: UserOutputDto})
    public readonly user: UserOutputDto;

    @ApiProperty({example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoiZmxvZmV5QHlhbmRleC5ydSIsImlhdCI6MTcyOTc4MjI1OCwiZXhwIjoxNzMwMzg3MDU4fQ.wkI8e_b2WwI4TkJ4qEMagzj_6rb6mC3cMBL4-nVtX5o"})
    public readonly accessToken: string;

    @ApiProperty({example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjEsImVtYWlsIjoiZmxvZmV5QHlhbmRleC5ydSIsImlhdCI6MTcyOTc4MjI1OCwiZXhwIjoxNzMwMzg3MDU4fQ.wkI8e_b2WwI4TkJ4qEMagzj_6rb6mC3cMBL4-nVtX5o"})
    public readonly refreshToken: string;

    constructor({user, accessToken, refreshToken}: {user: User, accessToken: string, refreshToken: string}) {
        this.user = new UserOutputDto(user);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}