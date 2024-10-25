import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn()
    public readonly _id: number;

    @Column()
    public firstName: string;

    @Column({nullable: true})
    public lastName: string;

    @Column({unique: true})
    public email: string;

    @Column({unique: true, nullable: true, type: "bigint"})
    public phoneNumber: number;

    @Column()
    public password: string;
}