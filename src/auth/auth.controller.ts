import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import { LoginDto } from "./dtos/login-dto";

@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/sign-up")
    async signUp(@Body() userDto: CreateUserDto) {
        return await this.authService.signUp(userDto);
    }

    @Post("/sign-in")
    async signIn(@Body() userDto: LoginDto) {
        return await this.authService.signIn(userDto);
    }
};