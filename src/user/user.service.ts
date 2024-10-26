import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InsertResult, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/CreateUserDto";
import { EditUserDto } from "./dtos/EditUserDto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    public async editUser(_id: number, userDto: EditUserDto): Promise<User> {
        const user: User = await this.userRepository.findOneBy({_id});

        return await this.userRepository.save({...user, ...userDto})

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