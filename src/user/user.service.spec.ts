import { Test, TestingModule } from "@nestjs/testing";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
    let service: UserService;

    const mockUserService = {
        createUser: jest.spyOn(UserService.prototype, "createUser").mockResolvedValue({
            _id: 1,
            firstName: "Danil",
            lastName: "Bashirov",
            email: "userDto@test.ru",
            password: "12345678"
        } as User)
    }

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
            password: "12345678"
        }

        expect(await service.createUser(dto)).toEqual({
            _id: expect.any(Number),
            ...dto
        })
    });
})