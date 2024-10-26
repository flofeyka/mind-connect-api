import { UUID } from "crypto";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users_tokens"})
export class Token {
    @PrimaryGeneratedColumn('uuid')
    public readonly _id: UUID;

    @Column()
    public token: string;

    @OneToOne(() => User, { onUpdate: "CASCADE" })
    @JoinColumn()
    public readonly user: User;
}