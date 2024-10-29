import { ImageDto } from "src/images/dtos/image-dto";
import { User } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class UserOutputDto {
    @ApiProperty({example: 1})
    public readonly _id: number;
    @ApiProperty({example: "example@gmail.com"})
    public readonly email: string;
    @ApiProperty({example: "John"})
    public readonly firstName: string;
    @ApiProperty({example: "Doe"})
    public readonly lastName?: string;
    @ApiProperty({example: "89999999999"})
    public readonly phoneNumber?: number;
    @ApiProperty({type: ImageDto})
    public readonly image: ImageDto;

    constructor(user: User) {
        this._id = user._id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.phoneNumber = user?.phoneNumber;
        this.image = new ImageDto(user.image);
    }
}