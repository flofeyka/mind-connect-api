import { BadRequestException, Controller, Delete, Get, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ImageService } from "./images.service";
import { Request, Response } from "express";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {v4 as uuid} from "uuid"
import { RequestType } from "src/types/RequestType";
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags("Images API")
@Controller("/image")
export class ImageController {
    constructor(private readonly imagesService: ImageService) {}

    @Get("/:filename")
    getImage(@Res() response: Response, @Param("filename") filename: string): void {
        return response.sendFile(filename, { root: "./uploads/pictures" });
    }

    @Post("/")
    @UseInterceptors(FilesInterceptor('pictures', 10, {
        storage: diskStorage({
            destination: "./uploads/pictures",
            filename:  (req: Request, file: Express.Multer.File, callback) => {
                const fileExtension: string = file.originalname.split(".")[1];
                const newFileName: string = uuid() + "." + fileExtension;

                callback(null, newFileName);
            }
        }),
        fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                callback(null, false);
            } 

            callback(null, true);
        }
    }))
    @UseGuards(AuthGuard)
    uploadImages(@UploadedFiles() files: Express.Multer.File[], @Req() request: RequestType) {
        console.log(files);
        return this.imagesService.uploadImages(request.user._id, files.map(file => file.filename));
    }

    @Delete("/:filename")
    @UseGuards(AuthGuard)
    deleteImage(@Param("filename") filename: string, @Req() request: RequestType) {
        return this.imagesService.deleteImage(request.user._id, filename);
    }
}