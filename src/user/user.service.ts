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
import { InsertResult, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUserDto';
import { EditUserDto } from './dtos/EditUserDto';
import { UserOutputDto } from './dtos/UserOutputDto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef((): typeof ImageService => ImageService))
    private readonly imageService: ImageService,
  ) {}

  public async editUser(
    _id: number,
    userDto: EditUserDto,
  ): Promise<UserOutputDto> {
    const user: User = await this.userRepository.findOneBy({ _id });

    if (userDto.image) {
      const imageFound: Image = await this.imageService.findImage(
        userDto.image,
      );
      if (!imageFound) {
        throw new NotFoundException('Photo for user avatar not found');
      }

      if (user.image) {
        await this.imageService.deleteImage(user._id, user.image.filename);
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
      _id: userInsertResult.identifiers[0]._id,
    });
  }

  async findUserById(_id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ _id });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
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
