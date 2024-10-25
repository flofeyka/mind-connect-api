import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service"

describe("AuthService", () => {
    let service: AuthService;

    const mockAuthService = {
        signUp: jest.spyOn(AuthService.prototype, "signUp")
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthService],
        }).overrideProvider(AuthService).useValue(mockAuthService).compile();

        service = module.get<AuthService>(AuthService);
    })

    it("should be defined", () => {
        expect(service).toBeDefined();
    })
})