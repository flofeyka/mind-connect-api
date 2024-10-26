import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "images"})
export class Image {
    @PrimaryGeneratedColumn("uuid")
    public readonly _id: number;

    @Column({unique: true})
    public readonly filename: string;

    @ManyToOne(() => User)
    @JoinColumn()
    public readonly user: User;
}