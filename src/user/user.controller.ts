import { Body, Controller, Get, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "./user.service";
import { RequestType } from "src/types/RequestType";
import { EditUserDto } from "./dtos/EditUserDto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { UserOutputDto } from "./dtos/UserOutputDto";


@ApiTags("User API")
@Controller("/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: "Get user data"})
    @ApiBearerAuth("Access token")
    @ApiResponse({status: 200, type: UserOutputDto})
    @Get("/")
    @UseGuards(AuthGuard)
    async getUserData(@Request() req: RequestType) {
        return await this.userService.findUserById(req.user._id)
    }

    @ApiOperation({summary: "Update user data"})
    @ApiBearerAuth()
    @ApiResponse({status: 200, type: UserOutputDto})
    @Put("/")
    @UseGuards(AuthGuard)
    editUser(@Request() req: RequestType, @Body() userDto: EditUserDto) {
        return this.userService.editUser(req.user._id, userDto);
    }

}