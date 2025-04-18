import { ApiProperty } from '@nestjs/swagger';
import { Image } from 'src/images/images.entity';
import { Post } from 'src/post/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NOT_SELECTED = 'NOT SELECTED',
}

export enum Language {
  ENGLISH = 'English',
  RUSSIAN = 'Russian',
  SPANISH = 'Spanish',
  GERMAN = 'German',
  CHINESE = 'Chinese',
  HINDI = 'Hindi',
  UKRAINIAN = 'Ukrainian',
}

export enum Problem {
  POST_TRAUMATIC_STRESS_DISORDER_PTSD = 'Post-Traumatic Stress Disorder (PTSD)',
  GENERALIZED_ANXIETY_DISORDER_GAD = 'Generalized Anxiety Disorder (GAD)',
  STRESS = 'Stress',
  BURNOUT = 'Burnout',
  ADHD = 'ADHD',
  PANIC_DISORDER = 'Panic Disorder',
  SOCIAL_ANXIETY_DISORDER = 'Social Anxiety Disorder',
  SPECIFIC_PHOBIAS = 'Specific Phobias',
  MAJOR_DEPRESSIVE_DISORDER = 'Major Depressive Disorder',
  BIPOLAR_DISORDER = 'Bipolar Disorder',
  SCHIZOAFFECTIVE_DISORDER = 'Schizoaffective Disorder',
  ALCOHOL_USE_DISORDER = 'Alcohol Use Disorder',
  GAMBLING_DISORDER = 'Gambling Disorder',
  SUBSTANCE_USE_DISORDERS = 'Substance Use Disorders',
  GENDER_DYSPHORIA = 'Gender Dysphoria',
  DEPENDENT_PERSONALITY_DISORDER = 'Dependent Personality Disorder',
}

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ title: 'User ID', example: 1 })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ title: 'User First Name', example: 'John' })
  @Column()
  public firstName: string;

  @ApiProperty({ title: 'User Last Name', example: 'Doe' })
  @Column({ nullable: true })
  public lastName: string;

  @ApiProperty({ title: 'User Email', example: 'john.doe@gmail.com' })
  @Column({ unique: true })
  public email: string;

  @ApiProperty({ title: 'Gender', example: 'MALE' })
  @Column({
    enum: Gender,
    default: Gender.NOT_SELECTED,
  })
  public gender: Gender;

  @ApiProperty({ title: 'Is user a doctor? ', example: true })
  @Column({ default: false })
  public isDoctor: boolean;

  @ApiProperty({ title: 'Languages', example: 'Languages' })
  @Column({
    default: [Language.RUSSIAN],
    enum: Language,
    array: true,
    type: 'enum',
  })
  public languages: Language[];

  @ApiProperty({
    title: 'Problems/Specialties',
    example: Problem.ALCOHOL_USE_DISORDER,
  })
  @Column({
    default: [],
    enum: Problem,
    array: true,
    type: 'enum',
  })
  public problems: Problem[];

  @ApiProperty({ title: 'Problems', example: '' })
  @ApiProperty({ title: 'User Phone Number', example: '0909090909' })
  @Column({ unique: true, nullable: true, type: 'bigint' })
  public phoneNumber: number;

  @ApiProperty({ title: 'User avatar', type: (): typeof Image => Image })
  @OneToOne((): typeof Image => Image, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn()
  public image: Image;

  @ApiProperty({ title: 'User posts', type: (): typeof Post => Post })
  @OneToMany((): typeof Post => Post, (post: Post) => post.user)
  public posts: Post[];

  @ApiProperty({ title: 'User Password', example: 'hashed' })
  @Column()
  public password: string;
}
