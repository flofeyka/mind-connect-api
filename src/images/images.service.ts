import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, InsertResult, Repository } from "typeorm";
import { Image } from "./images.entity";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import * as fs from "fs";
import { ImageDto } from "./dtos/image-dto";

@Injectable()
export class ImageService {
    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService
    ) { }

    async uploadImages(userId: number, filenames: string[]): Promise<ImageDto[]> {
        const user: User = await this.userService.findUserById(userId);
        return await Promise.all(filenames.map(async (filename: string) => await this.uploadImage(user, filename)));
    }

    async uploadImage(user: User, filename: string): Promise<ImageDto> {
        const imageCreated: Image = await this.imageRepository.save({
            user,
            filename
        });

        return new ImageDto(imageCreated);
    }

    async deleteImage(userId: number, filename: string): Promise<boolean> {
        const imageDeletedResult: DeleteResult = await this.imageRepository.delete({
            user: {
                _id: userId
            },
            filename
        });

        if (imageDeletedResult.affected === 0) {
            throw new NotFoundException("Image not found");
        }

        fs.unlinkSync(`./uploads/pictures/${filename}`);

        return true;
    }

    async findImage(filename: string): Promise<Image> {
        return await this.imageRepository.findOneBy({
            filename
        });
    }
}