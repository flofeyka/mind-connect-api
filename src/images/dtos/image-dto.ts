import { ApiProperty } from "@nestjs/swagger";
import { Image } from "../images.entity";

export class ImageDto {
    @ApiProperty({name: "filename", description: "Image filename", example: "d2f5fff6-2df4-4761-a23a-e9f708655ee1.png"})
    public filename: string;
    @ApiProperty({name: "path", description: "Image path", example: "https://api.mind-connect.ru/image/d2f5fff6-2df4-4761-a23a-e9f708655ee1.png"})
    public  path: string;
    constructor(model: Image) {
        this.filename = model.filename;
        this.path = `${process.env.API_URL}/image/${model.filename}`;
    }
}