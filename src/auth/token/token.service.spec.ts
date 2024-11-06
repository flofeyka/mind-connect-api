import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { ResetPasswordToken } from "./ResetPasswordToken.entity";
import { Token } from "./token.entity";
import { TokenService } from "./token.service";

export const mockTokenService = {
    saveToken: jest.spyOn(TokenService.prototype, "saveToken"),
    generateTokens: jest.spyOn(TokenService.prototype, "generateTokens").mockReturnValue({
        accessToken: "str",
        refreshToken: "str"
    }),
    findRefreshToken: jest.fn()
}

describe("TokenService", () => {
    let service: TokenService;
    let token: Repository<Token>;

    const mockToken: Token = {
        "_id": "gsdfg-gsfdg-gsfdgsf-gsfdgg2-fsfg",
        "token": "refreshToken",
        "user": new User()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TokenService,
                {
                    provide: getRepositoryToken(Repository<Token>),
                    useValue: mockTokenService
                },
                {
                    provide: getRepositoryToken(ResetPasswordToken),
                    useValue: mockTokenService
                }
            ]
        }).overrideProvider(TokenService).useValue(mockTokenService).compile();

        service = module.get<TokenService>(TokenService);
        token = module.get<Repository<Token>>(getRepositoryToken(Repository<Token>))
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })

    describe("findRefreshToken", () => {
        it("Should find and return a refresh token entity by refresh token", async () => {
            jest.spyOn(token, 'findOne').mockResolvedValue(mockToken);
            const result: Token = await service.findRefreshToken("refreshToken");
            expect(token.findOne).toHaveBeenCalledWith("refreshToken");
            expect(result).toEqual(mockToken);
        })

    })
})