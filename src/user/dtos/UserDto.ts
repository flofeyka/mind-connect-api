import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender, Language, Problem } from '../entities/user.entity';

export class UserDto {
  @ApiProperty({ title: 'E-mail', example: 'example@gmail.com' })
  @IsEmail()
  public readonly email: string;

  @ApiProperty({ title: 'Name', example: 'John' })
  @IsString()
  public readonly firstName: string;

  @ApiProperty({ title: 'Surname', example: 'Doe' })
  @IsString()
  public readonly lastName: string;

  @ApiProperty({ title: 'Phone number', example: '89999999999' })
  @IsOptional()
  @IsNumber()
  public readonly phoneNumber: number;

  @ApiProperty({ title: 'Doctor gender', enum: Gender, enumName: 'Gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({
    title: 'Languages',
    enum: Language,
    example: [
      Language.CHINESE,
      Language.ENGLISH,
      Language.GERMAN,
      Language.HINDI,
      Language.RUSSIAN,
      Language.RUSSIAN,
      Language.SPANISH,
      Language.UKRAINIAN,
    ],
  })
  @IsOptional()
  @IsEnum(Language, { each: true })
  languages?: Language[];

  @ApiProperty({
    title: 'Problems',
    enum: Problem,
    example: [
      Problem.ADHD,
      Problem.ALCOHOL_USE_DISORDER,
      Problem.BIPOLAR_DISORDER,
      Problem.BURNOUT,
      Problem.DEPENDENT_PERSONALITY_DISORDER,
      Problem.GAMBLING_DISORDER,
      Problem.GENDER_DYSPHORIA,
      Problem.GENERALIZED_ANXIETY_DISORDER_GAD,
      Problem.MAJOR_DEPRESSIVE_DISORDER,
      Problem.PANIC_DISORDER,
      Problem.POST_TRAUMATIC_STRESS_DISORDER_PTSD,
      Problem.SCHIZOAFFECTIVE_DISORDER,
      Problem.SOCIAL_ANXIETY_DISORDER,
      Problem.SPECIFIC_PHOBIAS,
      Problem.STRESS,
      Problem.SUBSTANCE_USE_DISORDERS,
    ],
  })
  @IsOptional()
  @IsEnum(Problem, { each: true })
  problems: Problem[];
}
