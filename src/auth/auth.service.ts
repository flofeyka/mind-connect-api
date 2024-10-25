import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import { UserService } from "src/user/user.service";
import { TokenService } from "./token/token.service";
import { User } from "src/user/entities/user.entity";
import { LoginDto } from "./dtos/login-dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {}

    async signUp(createUserDto: CreateUserDto): Promise<{token: string, user: User}> {
        const userExisted: User | null = await this.userService.findUserByEmail(createUserDto.email);
        if (userExisted) {
            throw new BadRequestException('User already existed');
        }

        const salt: string = await bcrypt.genSalt(10, "a");
        const password: string = await bcrypt.hash(createUserDto.password, salt);

        const userCreated: User = await this.userService.createUser({...createUserDto, password});
        const token: string = await this.tokenService.saveToken(userCreated);


        //should return user-dto and token
        return {
            user: userCreated,
            token
        };
    }

    async signIn(loginDto: LoginDto) {
        const userExisted: User | null = await this.userService.findUserByEmail(loginDto.email);
        if (!userExisted) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const isPasswordValid: boolean = await bcrypt.compare(loginDto.password, userExisted.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Wrong email or password');
        }

        const token: string = await this.tokenService.saveToken(userExisted);

        //should return user-dto and token
        return {
            user: userExisted,
            token
        };
        
    }
};