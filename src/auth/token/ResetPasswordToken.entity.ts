import { UUID } from "crypto";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: "reset_password_tokens"})
export class ResetPasswordToken {
    @PrimaryGeneratedColumn('uuid')
    public readonly id: UUID

    @OneToOne(() => User)
    @JoinColumn()
    public readonly user: User;

    @Column()
    public token: string;

    @UpdateDateColumn({default: new Date(Date.now())})
    public readonly updatedAt: Date
}