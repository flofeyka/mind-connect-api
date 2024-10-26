import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { AuthModule } from "src/auth/auth.module";
import { ImageModule } from "src/images/images.module";

@Module({
    controllers: [UserController],
    imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), forwardRef(() => ImageModule)],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {};