import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    public readonly _id: number;

    @ManyToOne((): typeof User => User, (user: User) => user.posts, {eager: true, onDelete: "CASCADE"}) //posts
    public user: User;

    @Column()
    public value: string;
}