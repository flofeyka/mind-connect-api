import { forwardRef } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm"
import { Token } from "./token/token.entity"
import { AppModule } from "src/app.module"
import { JwtModule } from "@nestjs/jwt"
import { UserModule } from "src/user/user.module"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { TokenService } from "./token/token.service"
import { CreateUserDto } from "src/user/dtos/CreateUserDto"
import { User } from "src/user/entities/user.entity"
import { mockAuthService } from "./auth.service.spec"

describe('AuthController', () => {
    let authController: AuthController;
    const mockUserRepository = {}
    const mockTokenRepository = {}


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                forwardRef(() => AppModule),
                TypeOrmModule.forFeature([Token]),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '7d' },
                }),
                forwardRef(() => UserModule)
            ],
            controllers: [AuthController],
            providers: [AuthService, TokenService, {
                provide: getRepositoryToken(User),
                useValue: mockUserRepository
            },
                {
                    provide: getRepositoryToken(Token),
                    useValue: mockTokenRepository
                }
            ],
            exports: [TokenService]
        }).overrideProvider(AuthService).useValue(mockAuthService).compile();

        authController = module.get<AuthController>(AuthController);
    })

    it('should be defined', () => {
        expect(authController).toBeDefined();
    })

    // it('User should be signed up', async () => {
    //     const dto = {
    //         firstName: "Danil1",
    //         lastName: "Bashiro1v",
    //         email: "userDt1o@test.ru",
    //         password: "12345678"
    //     }

    //     expect(await authController.signUp(dto)).toEqual({
    //         user: {
    //             _id: expect.any(Number),
    //             ...dto
    //         },
    //         token: expect.any(String),
    //     })

    // })
})