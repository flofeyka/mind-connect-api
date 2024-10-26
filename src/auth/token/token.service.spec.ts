import { Test, TestingModule } from "@nestjs/testing";
import { TokenService } from "./token.service"
import { JwtModule } from "@nestjs/jwt";
import Module from "module";

export const mockTokenService = {
    saveToken: jest.spyOn(TokenService.prototype, "saveToken")
}

describe("TokenService", () => {
    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [JwtModule],
            providers: [TokenService]
        }).overrideProvider(TokenService).useValue(mockTokenService).compile();

        service = module.get<TokenService>(TokenService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })
    
})