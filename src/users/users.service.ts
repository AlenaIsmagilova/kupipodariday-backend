import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPass = await this.hashService.hashPassword(
      createUserDto.password,
    );

    const createdUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPass,
    });

    const y = await this.userRepository.save(createdUser);

    return createdUser;
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async findMany(options: SearchUserDto): Promise<User[]> {
    const users = await this.userRepository.find({ where: options });

    if (users.length === 0) {
      throw new UnauthorizedException();
    }

    return users;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();

    return this.userRepository.findOneBy({ id });
  }

  async findUserWithPasswordByUsername(username: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder()
      .select('user')
      .from(User, 'user')
      .where('user.username = :username', { username })
      .addSelect('user.password')
      .getOne();
  }
}
