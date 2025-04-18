import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Image } from 'src/images/images.entity';
import { ImageService } from 'src/images/images.service';
import { InsertResult, Or, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';
import { EditUserDto } from './dtos/EditUserDto';
import { UserOutputDto } from './dtos/UserOutputDto';
import { User } from './entities/user.entity';
import { SearchDoctorDto } from './dtos/search-doctor-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef((): typeof ImageService => ImageService))
    private readonly imageService: ImageService,
  ) {}

  public async editUser(
    id: number,
    userDto: EditUserDto,
  ): Promise<UserOutputDto> {
    const user: User = await this.userRepository.findOneBy({ id });

    if (userDto.image) {
      const imageFound: Image = await this.imageService.findImage(
        userDto.image,
      );
      if (!imageFound) {
        throw new NotFoundException('Photo for user avatar not found');
      }

      if (user.image) {
        await this.imageService.deleteImage(user.id, user.image.filename);
      }

      user.image = imageFound;
    }

    const userUpdated: User = await this.userRepository.save({
      ...user,
      ...userDto,
      image: user.image,
    });

    return new UserOutputDto(userUpdated);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userInsertResult: InsertResult = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([{ ...createUserDto }])
      .execute();

    return await this.userRepository.findOneBy({
      id: userInsertResult.identifiers[0].id,
    });
  }

  async findUserById(
    id: number,
    relations?: [{ key: string }],
  ): Promise<User | null> {
    const relationOptions = relations?.reduce(
      (acc, rel) => ({
        ...acc,
        [rel.key]: true,
      }),
      {},
    );

    return await this.userRepository.findOne({
      where: { id },
      relations: relationOptions || undefined,
    });
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async getDoctors(dto: SearchDoctorDto): Promise<UserOutputDto[]> {
    const { search, gender, languages, problems } = dto;

    let firstName = '';
    let lastName = '';

    if (search?.includes(' ')) {
      const parts = search.split(' ');
      firstName = parts[0];
      lastName = parts[1];
    } else if (search) {
      // Если только одно слово в поиске, ищем по имени или фамилии
      firstName = search;
      lastName = search;
    }

    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.isDoctor = :isDoctor', { isDoctor: true });

    // Поиск по имени/фамилии с улучшенной логикой
    if (search) {
      query.andWhere(
        `(
          (user.firstName ILIKE :firstName AND user.lastName ILIKE :lastName) OR
          (user.firstName ILIKE :lastName AND user.lastName ILIKE :firstName) OR
          (user.firstName ILIKE :search) OR
          (user.lastName ILIKE :search)
        )`,
        {
          firstName: `%${firstName}%`,
          lastName: `%${lastName}%`,
          search: `%${search}%`, // Добавляем общий поиск по одному слову
        },
      );
    }

    // Фильтр по полу
    if (gender) {
      query.andWhere('user.gender = :gender', { gender });
    }

    if (languages?.length) {
      const languagesAsString = languages.map((lang) => lang.toString());
      query.andWhere(
        'user.languages && ARRAY[:...languages]::users_languages_enum[]',
        { languages: languagesAsString },
      );
    }

    // Фильтрация по проблемам
    if (problems?.length) {
      const problemsAsString = problems.map((problem) => problem.toString());
      query.andWhere(
        'user.problems && ARRAY[:...problems]::users_problems_enum[]',
        { problems: problemsAsString },
      );
    }

    const users = await query.getMany();
    return users.map((user) => new UserOutputDto(user));
  }

  async changePassword(
    userId: number,
    newPassword: string,
    oldPassword?: string,
  ): Promise<UserOutputDto> {
    const user: User = await this.findUserById(userId);

    if (oldPassword) {
      const oldPasswordCorrect: boolean = await bcrypt.compare(
        oldPassword,
        user.password,
      );
      if (!oldPasswordCorrect) {
        throw new BadRequestException('Old password is wrong.');
      }
    }

    const newPasswordCompared: boolean = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (newPasswordCompared) {
      throw new BadRequestException('Old and new password should not be same');
    }

    const salt: string = await bcrypt.genSalt(10, 'a');
    user.password = await bcrypt.hash(newPassword, salt);
    const userSaved: User = await this.userRepository.save(user);

    return new UserOutputDto(userSaved);
  }
}
