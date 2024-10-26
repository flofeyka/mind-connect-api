import { Image } from "../images.entity";

export class ImageDto {
    readonly filename: string;
    readonly path: string;

    constructor(model: Image) {
        this.filename = model.filename;
        this.path = `${process.env.API_URL}/image/${model.filename}`;
    }
}