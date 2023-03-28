import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req,
  ): Promise<Wish> {
    return await this.wishesService.create(createWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Param('id') id: string, @Req() req): Promise<Wish> {
    const copiedWish = await this.wishesService.copiedWish(+id, req.user);
    return copiedWish;
  }

  @Get('last')
  async findAllLast() {
    const lastFourtyWishes = await this.wishesService.findLast();
    return lastFourtyWishes;
  }

  @Get('top')
  async findAllTop() {
    const topTwentyWishes = await this.wishesService.findTop();
    return topTwentyWishes;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOneById(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return this.wishesService.updateOne(+id, updateWishDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    await this.wishesService.removeOne(+id, req.user);
    return { message: 'Ваш подарок успешно удален' };
  }
}
