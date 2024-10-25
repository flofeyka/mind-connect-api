import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TokenService } from "src/auth/token/token.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { forwardRef } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AppModule } from "src/app.module";
import { RequestType } from "src/types/RequestType";
import { EditUserDto } from "./dtos/EditUserDto";
import { first } from "rxjs";
import exp from "constants";

describe("UserController", () => {
    let controller: UserController;
    const mockUserService = {
        editUser: jest.fn((_id: number, dto: EditUserDto) => ({
            _id, ...dto, password: String(Math.random())
        })),
        getUserData: jest.fn((_id: number) => (
            {
                _id,
                firstName: String(Math.random()),
                lastName: String(Math.random()),
                email: String(Math.random()),
                password: String(Math.random())
            }
        ))
    };

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

    it("user should be created", () => {
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
        expect(controller.editUser(request as RequestType, dto)).toEqual({
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

        expect(mockUserService.getUserData).toHaveBeenCalledWith(request.user._id);
    })
})