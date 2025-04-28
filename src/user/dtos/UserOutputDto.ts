import { ImageDto } from 'src/images/dtos/image-dto';
import { Gender, Language, Problem, User } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserOutputDto {
  @ApiProperty({ example: 1 })
  public readonly id: number;
  // @ApiProperty({example: "example@gmail.com"})
  // public readonly email: string;
  @ApiProperty({ example: 'John' })
  public readonly firstName: string;
  @ApiProperty({ example: 'Doe' })
  public readonly lastName?: string;
  // @ApiProperty({example: "89999999999"})
  // public readonly phoneNumber?: number;
  @ApiProperty({ type: ImageDto })
  public readonly image: ImageDto;

  @ApiProperty({ title: 'Doctor gender', enum: Gender, enumName: 'Gender' })
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
  problems: Problem[];

  @ApiProperty({ title: 'subscriptions count', example: 2 })
  subscriptions: UserOutputDto[];

  @ApiProperty({ title: 'followers count', example: 3 })
  followers: UserOutputDto[];

  constructor(user: User) {
    this.id = user.id;
    // this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    // this.phoneNumber = user?.phoneNumber;
    this.image = user.image ? new ImageDto(user.image) : null;
    this.gender = user.gender;
    this.problems = user.problems;
    this.languages = user.languages;

  }
}
