import { BadRequestException, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ImageService } from "./images.service";
import { Request, Response } from "express";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import {v4 as uuid} from "uuid"
import { RequestType } from "src/types/RequestType";
import { AuthGuard } from "src/auth/auth.guard";
import { ImageDto } from "./dtos/image-dto";

@ApiTags("Images API")
@Controller("/image")
export class ImageController {
    constructor(private readonly imagesService: ImageService) {}


    @ApiOperation({summary: "Get image file by id", description: "Should return a file if exists"})
    @Get("/:filename")
    getImage(@Res() response: Response, @Param("filename") filename: string): void {
        return response.sendFile(filename, { root: "./uploads/pictures" });
    }

    @ApiOperation({summary: "Add image to DB", description: "File should be sent by name 'pictures'"})
    @ApiCreatedResponse({type: [ImageDto]})
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            pictures: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @Post("/")
    @HttpCode(HttpStatus.CREATED)
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
    uploadImages(@UploadedFiles() files: Express.Multer.File[], @Req() request: RequestType): Promise<ImageDto[]> {
        return this.imagesService.uploadImages(request.user._id, files.map(file => file.filename));
    }

    @ApiOperation({summary: "Delete image from DB and filesystem"})
    @ApiOkResponse({example: true})
    @Delete("/:filename")
    @UseGuards(AuthGuard)
    deleteImage(@Param("filename") filename: string, @Req() request: RequestType): Promise<boolean> {
        return this.imagesService.deleteImage(request.user._id, filename);
    }
}