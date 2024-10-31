import { Body, Controller, Get, NotFoundException, Put, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { UserService } from "./user.service";
import { RequestType } from "src/types/RequestType";
import { EditUserDto } from "./dtos/EditUserDto";
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./entities/user.entity";
import { UserOutputDto } from "./dtos/UserOutputDto";


@ApiTags("User API")
@Controller("/user")
@ApiBearerAuth()
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({summary: "Get user data"})
    @ApiResponse({status: 200, type: UserOutputDto})
    @Get("/")
    @UseGuards(AuthGuard)
    async getUserData(@Request() req: RequestType) {
        return await this.userService.findUserById(req.user._id)
    }

    @ApiOperation({summary: "Update user data"})
    @ApiOkResponse({type: UserOutputDto})
    @ApiNotFoundResponse({example: new NotFoundException("Photo for user avatar not found").getResponse()})
    @Put("/")
    @UseGuards(AuthGuard)
    editUser(@Request() req: RequestType, @Body() userDto: EditUserDto) {
        return this.userService.editUser(req.user._id, userDto);
    }

}