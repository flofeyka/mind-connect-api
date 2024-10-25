import { Body, Controller, Get, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "./user.service";
import { RequestType } from "src/types/RequestType";
import { EditUserDto } from "./dtos/EditUserDto";

@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get("/")
    @UseGuards(AuthGuard)
    async getUserData(@Request() req: RequestType) {
        return await this.userService.getUserData(req.user._id)
    }

    @Put("/")
    @UseGuards(AuthGuard)
    editUser(@Request() req: RequestType, @Body() userDto: EditUserDto) {
        return this.userService.editUser(req.user._id, userDto);
    }
}