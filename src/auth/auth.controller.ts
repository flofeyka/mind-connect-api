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
    signUp(@Body() userDto: CreateUserDto): Promise<AuthOutputDto> {
        return this.authService.signUp(userDto);
    }

    @ApiOperation({summary: "Sign in"})
    @ApiResponse({status: 200, type: AuthOutputDto})
    @Post("/sign-in")
    signIn(@Body() userDto: LoginDto): Promise<AuthOutputDto> {
        return this.authService.signIn(userDto);
    }
};