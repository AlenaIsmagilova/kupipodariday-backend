import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { HashService } from 'src/hash/hash.service';
import { User } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly wishesService: WishesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @Get('me')
  async findMe(@Req() req): Promise<User> {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const hashedPass = await this.hashService.hashPassword(
      updateUserDto.password,
    );
    const updatedUser = this.usersService.updateOne(req.user.id, {
      ...updateUserDto,
      password: hashedPass,
    });

    return updatedUser;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return await this.wishesService.findWishesById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get('find')
  async findMany(@Body() searchUserDto: SearchUserDto): Promise<User[]> {
    const users = await this.usersService.findMany(searchUserDto);
    return users;
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  findOneByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async findWishesOfUser(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findOneByUsername(username);
    return await this.wishesService.findWishesById(user.id);
  }
}
