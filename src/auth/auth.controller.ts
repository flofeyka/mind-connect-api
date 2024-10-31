import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/user/dtos/CreateUserDto";
import { LoginDto } from "./dtos/login-dto";
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthOutputDto } from "./dtos/auth-output-dto";
import { Request, Response } from "express";
import { RequestType } from "src/types/RequestType";
import { Token } from "./token/token.entity";
import { ResetPasswordDto } from "./dtos/reset-password-dto";

@ApiTags("Auth API")
@Controller("/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: "Sign up" })
    @ApiResponse({ status: 200, type: AuthOutputDto })
    @Post("/sign-up")
    async signUp(@Body() userDto: CreateUserDto, @Res({passthrough: true}) response: Response): Promise<AuthOutputDto> {
        const authData: AuthOutputDto = await this.authService.signUp(userDto);
        response.cookie("refreshToken", authData.refreshToken, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        })

        return authData;
    }

    @ApiOperation({ summary: "Sign in" })
    @ApiResponse({ status: 200, type: AuthOutputDto })
    @Post("/sign-in")
    async signIn(@Body() userDto: LoginDto, @Res({passthrough: true}) response: Response): Promise<AuthOutputDto> {
        const authData: AuthOutputDto = await this.authService.signIn(userDto);
        response.cookie("refreshToken", authData.refreshToken, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true
        });

        return authData;
    }

    @ApiOperation({ summary: "Log out"})
    @ApiOkResponse({ example: true })
    @Delete("/logout")
    async logout(@Req() request: Request, @Res({passthrough: true}) response: Response): Promise<boolean> {
        const logoutData: boolean = await this.authService.logout(request.cookies?.refreshToken);
        response.clearCookie('refreshToken');
        return logoutData;
    }

    @ApiOperation({ summary: "Send email-request to password reset "})
    @Post("/request-password-reset")
    requestPasswordReset(@Query('email') email: string, @Req() request: Request): Promise<boolean> {
        return this.authService.requestPasswordReset(email, request.headers.host);
    }

    @ApiOperation({ summary: "Reset password" })
    @Put("/reset-password/:token")
    resetPassword(@Param('token') token: string, @Body() {password}: ResetPasswordDto) {
        return this.authService.resetPassword(token, password);
    }
};