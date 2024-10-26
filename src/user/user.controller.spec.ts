import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "src/auth/auth.module";
import { RequestType } from "src/types/RequestType";
import { EditUserDto } from "./dtos/EditUserDto";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { mockUserService } from "./user.service.spec";

describe("UserController", () => {
    let controller: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            imports: [AuthModule],
            providers: [UserService],
        }).overrideProvider(UserService).useValue(mockUserService).compile();

        controller = module.get<UserController>(UserController);
    })

    it("should be defined", () => {
        expect(controller).toBeDefined();
    })

    it("user should be edited", async () => {
        const dto: EditUserDto = {
            firstName: "Danil",
            lastName: "Bashirov",
            email: "userDto@test.ru"
        }
        const request = {
            user: {
                _id: 1,
                email: "test@test.ru"
            },
        }
        expect(await controller.editUser(request as RequestType, dto)).toEqual({
            _id: request.user._id,
            ...dto,
            password: expect.any(String)
        })

        expect(mockUserService.editUser).toHaveBeenCalledWith(request.user._id, dto);
    })

    it("user should be got", async () => {
        const request = {
            user: {
                _id: 1
            },
        }
        expect(await controller.getUserData(request as RequestType)).toEqual({
            _id: request.user._id,
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String),
            password: expect.any(String)
        })

        expect(mockUserService.findUserById).toHaveBeenCalledWith(request.user._id);
    })
})