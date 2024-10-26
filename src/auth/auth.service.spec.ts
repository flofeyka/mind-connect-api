import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service"
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { mockUserService } from "src/user/user.service.spec";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import * as bcrypt from 'bcrypt';
import { User } from "src/user/entities/user.entity";
import { LoginDto } from "./dtos/login-dto";
import { UnauthorizedException } from "@nestjs/common";

const mockAuthService = {
    signUp: jest.fn().mockImplementation((dto: CreateUserDto) => ({
        _id: Date.now(),
        token: "token",
        ...dto
    })),
    // signUp: jest.spyOn(AuthService.prototype, "signUp").mockImplementation(async (dto: CreateUserDto) => {
    //     const users: User[] = [
    //         {
    //             _id: 1,
    //             firstName: "John",
    //             lastName: "Doe",
    //             email: "john.doe@gmail.com",
    //             phoneNumber: 123456789,
    //             password: bcrypt.hashSync("123456789", bcrypt.genSaltSync(10, "a"))    
    //         },
    //         {
    //             _id: 2,
    //             firstName: "Jane",
    //             lastName: "Doe",
    //             email: "jane.doe@gmail.com",
    //             phoneNumber: 123456789,
    //             password: bcrypt.hashSync("123456789", bcrypt.genSaltSync(10, "a"))
    //         }
    //     ]

    //     const userExisted: User | null = users.find(user => user.email === dto.email);
    //     if (userExisted) {
    //         throw new Error("User already existed");
    //     }
    //     return {
    //         token: String(Math.random()),
    //         user: {
    //             _id: Math.random(),
    //             firstName: dto.firstName,
    //             lastName: dto.lastName,
    //             email: dto.email,
    //             phoneNumber: dto.phoneNumber,
    //             password: bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10, "a"))
    //         }
    //     }
    // }
    // ),

    signIn: jest.spyOn(AuthService.prototype, "signIn").mockImplementation(async (dto: LoginDto) => {
        const passwordHashed: string = await bcrypt.hash("123456789", bcrypt.genSaltSync(10, "a"));
        const passwordVerified: boolean = await bcrypt.compare(dto.password, passwordHashed);
        if (!passwordVerified) {
            throw new UnauthorizedException("Wrong email or password");
        }

        return {
            token: String(Math.random),
            user: {
                _id: Math.random(),
                firstName: String(Math.random()),
                lastName: String(Math.random()),
                email: dto.email,
                phoneNumber: Date.now() + 10,
                password: bcrypt.hashSync(dto.password, bcrypt.genSaltSync(10, "a"))
            }
        }
    })
}

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
            providers: [AuthService, {
                provide: UserService,
                useValue: mockUserService
            }],
        }).overrideProvider(AuthService).useValue(mockAuthService).compile();

        service = module.get<AuthService>(AuthService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    });

    it("should signed up", async () => {
        const userDto: CreateUserDto = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@gmail.com",
            phoneNumber: 123456789,
            password: 'a'
        }
        expect(await service.signUp(userDto)).toEqual({
            user: {
                ...userDto,
                _id: expect.any(Number),
                password: expect.any(String)
            },
            token: expect.any(String),
        })

        expect(mockAuthService.signUp).toHaveBeenCalledWith(userDto);
    })

    it("should be signed in", async () => {
        const loginDto: LoginDto = {
            email: "john.doe@gmail.com",
            password: "123456789"
        }
        expect(await service.signIn(loginDto)).toEqual({
            user: {
                _id: expect.any(Number),
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: loginDto.email,
                phoneNumber: expect.any(Number),
                password: expect.any(String)
            },
            token: expect.any(String),
        })
    })

    it("should throw an error", async () => {
        const loginDto: LoginDto = {
            email: "john.doe@gmail.com",
            password: String(Math.random())
        }

        expect(await service.signIn(loginDto).catch((error) => error)).toEqual(new UnauthorizedException("Wrong email or password"));
    })

})