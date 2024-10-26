import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Image } from "src/images/images.entity";
import { ImageService } from "src/images/images.service";
import { InsertResult, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/CreateUserDto";
import { EditUserDto } from "./dtos/EditUserDto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => ImageService)) private readonly imageService: ImageService
    ) {}

    public async editUser(_id: number, userDto: EditUserDto): Promise<User> {
        const user: User = await this.userRepository.findOneBy({_id});

        if(userDto.image) {
            const imageFound: Image = await this.imageService.findImage(userDto.image);
            if(!imageFound) {
                throw new NotFoundException("Photo for user avatar not found")
            }

            if(user.image) {
                await this.imageService.deleteImage(user._id, user.image.filename);
                // await this.userRepository.save({...user, image: null});
            }

            user.image = imageFound;
        }

        return await this.userRepository.save({...user, ...userDto, image: user.image})

    }

    async createUser(createUserDto: CreateUserDto): Promise<User>{
        const userInsertResult: InsertResult = await this.userRepository.createQueryBuilder().insert().into(User).values(createUserDto).execute();
        
        return await this.userRepository.findOneBy({_id: userInsertResult.identifiers[0].id});
    }

    async findUserById(_id: number): Promise<User | null> {
        return await this.userRepository.findOneBy({_id});
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOneBy({email});
    }
};