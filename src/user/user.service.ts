import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/images/images.entity";
import { ImageService } from "src/images/images.service";
import { InsertResult, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/CreateUserDto";
import { EditUserDto } from "./dtos/EditUserDto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { UserDto } from "./dtos/UserDto";
import { UserOutputDto } from "./dtos/UserOutputDto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => ImageService)) private readonly imageService: ImageService
    ) { }

    public async editUser(_id: number, userDto: EditUserDto): Promise<User> {
        const user: User = await this.userRepository.findOneBy({ _id });

        if (userDto.image) {
            const imageFound: Image = await this.imageService.findImage(userDto.image);
            if (!imageFound) {
                throw new NotFoundException("Photo for user avatar not found")
            }

            if (user.image) {
                await this.imageService.deleteImage(user._id, user.image.filename);
                // await this.userRepository.save({...user, image: null});
            }

            user.image = imageFound;
        }

        return await this.userRepository.save({ ...user, ...userDto, image: user.image })

    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const userInsertResult: InsertResult = await this.userRepository.createQueryBuilder().insert().into(User).values(createUserDto).execute();

        return await this.userRepository.findOneBy({ _id: userInsertResult.identifiers[0].id });
    }

    async findUserById(_id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({ _id });
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({ email });
    }

    async changePassword(userId: number, newPassword: string, oldPassword?: string): Promise<UserOutputDto> {
        const user: User = await this.findUserById(userId);

        if (oldPassword) {
            const oldPasswordCorrect: boolean = await bcrypt.compare(oldPassword, user.password);
            if (!oldPasswordCorrect) {
                throw new BadRequestException("Old password is wrong.");
            }
        }


        console.log(newPassword);
        const newPasswordCompared: boolean = await bcrypt.compare(newPassword, user.password);
        if (newPasswordCompared) {
            throw new BadRequestException("Old and new password should not be same");
        }

        const salt: string = await bcrypt.genSalt(10, "a");
        const newPasswordHash: string = await bcrypt.hash(newPassword, salt);
        user.password = newPasswordHash;
        const userSaved: User = await this.userRepository.save(user);

        return new UserOutputDto(userSaved)
    }
};