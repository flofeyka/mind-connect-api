import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDialogDto {
  @IsString()
  @ApiProperty({ title: 'Название диалога', example: 'Диалог о дружбе' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    title: 'Фотография(Название)',
    example: 'gsdfg-4q5gksfd-543gfs-2fdf.png',
  })
  image: string;
}
