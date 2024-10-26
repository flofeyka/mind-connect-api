import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import { LoginDto } from "./dtos/login-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthOutputDto } from "./dtos/auth-output-dto";

@ApiTags("Auth API")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({summary: "Sign up"})
    @ApiResponse({status: 200, type: AuthOutputDto})
    @Post("/sign-up")
    async signUp(@Body() userDto: CreateUserDto) {
        return await this.authService.signUp(userDto);
    }

    @ApiOperation({summary: "Sign in"})
    @ApiResponse({status: 200, type: AuthOutputDto})
    @Post("/sign-in")
    async signIn(@Body() userDto: LoginDto) {
        return await this.authService.signIn(userDto);
    }
};