import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @ApiProperty({title: "User ID", example: 1})
    @PrimaryGeneratedColumn()
    public readonly _id: number;

    @ApiProperty({title: "User First Name", example: "John"})
    @Column()
    public firstName: string;

    @ApiProperty({title: "User Last Name", example: "Doe"})
    @Column({nullable: true})
    public lastName: string;

    @ApiProperty({title: "User Email", example: "john.doe@gmail.com"})
    @Column({unique: true})
    public email: string;

    @ApiProperty({title: "User Phone Number", example: "0909090909"})
    @Column({unique: true, nullable: true, type: "bigint"})
    public phoneNumber: number;

    @ApiProperty({title: "User Password", example: "hashed"})
    @Column()
    public password: string;
}