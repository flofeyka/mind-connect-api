import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'images' })
export class Image {
  @PrimaryGeneratedColumn('uuid')
  public readonly _id: number;

  @Column({ unique: true })
  public readonly filename: string;

  @ApiProperty({
    name: 'user',
    description: 'User',
    example: (): typeof User => User,
  })
  @ManyToOne((): typeof User => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  public readonly user: User;
}
