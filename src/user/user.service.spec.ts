import { Test, TestingModule } from "@nestjs/testing";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/CreateUserDto";
import { EditUserDto } from "./dtos/EditUserDto";
import { Image } from "src/images/images.entity";
import { UserOutputDto } from "./dtos/UserOutputDto";

export const mockUserService = {
    createUser: jest.spyOn(UserService.prototype, "createUser").mockResolvedValue({
        _id: 1,
        firstName: "Danil",
        lastName: "Bashirov",
        email: "userDto@test.ru",
        password: "12345678"
    } as User),

    findUserByEmail: jest.spyOn(UserService.prototype, "findUserByEmail").mockResolvedValue({
        _id: 1,
        firstName: "Danil",
        lastName: "Bashirov",
        email: "userDto@test.ru",
        password: "12345678"
    } as User),

    findUserById: jest.spyOn(UserService.prototype, "findUserById").mockImplementation(async (_id: number) => {
        const user: User = new User();
        Object.assign(user, {
            _id,
            firstName: String(Math.random()),
            lastName: String(Math.random()),
            email: String(Math.random()),
        })

        return user;
    }),

    editUser: jest.spyOn(UserService.prototype, "editUser").mockImplementation(async (_id: number, userDto: EditUserDto) => {
        const user = new User();
        Object.assign(user, {_id, ...userDto});

        return user;
    })
}

describe("UserService", () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService],
        }).overrideProvider(UserService).useValue(mockUserService).compile();

        service = module.get<UserService>(UserService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })

    it("should create a user", async () => {
        const dto = {
            firstName: "Danil",
            lastName: "Bashirov",
            email: "userDto@test.ru",
            isDoctor: false,
            password: "12345678"
        }

        expect(await service.createUser(dto)).toEqual(new UserOutputDto({
            _id: expect.any(Number),
            ...dto
        } as User))
    });

    it("should find a user by id", async () => {
        const _id: number = 1;
        expect(await service.findUserById(_id)).toEqual({
            _id,
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            password: expect.any(String)
        })
    })

    it("should find a user by email", async () => {
        const email: string = "userDto@test.ru";
        expect(await service.findUserByEmail(email)).toEqual({
            _id: expect.any(Number),
            firstName: expect.any(String),
            lastName: expect.any(String),
            email,
            password: expect.any(String)
        })
    })
})