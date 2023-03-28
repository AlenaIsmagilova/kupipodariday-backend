import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    return await this.wishRepository.save({ owner: user, ...createWishDto });
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({ take: 20, order: { copied: 'DESC' } });
  }

  async findOne(options: FindOneOptions<Wish>) {
    return this.wishRepository.findOne(options);
  }

  async findOneById(id: number): Promise<Wish> {
    return this.wishRepository.findOneBy({ id });
  }

  async findWishesById(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: ['owner', 'offers'],
    });
  }

  async copiedWish(id: number, user: User): Promise<Wish> {
    const copiedWish = await this.wishRepository.findOneBy({ id });
    const { name, link, image, price, description } = copiedWish;
    const createdWish = this.wishRepository.create({
      name,
      link,
      image,
      price,
      copied: 0,
      description,
      owner: user,
    });

    const isExist = await this.userRepository.findOne({
      where: { wishes: { id: copiedWish.id } },
    });

    if (isExist) {
      throw new ForbiddenException('Вы уже копировали себе этот подарок');
    }

    const savedWish = await this.wishRepository.save(createdWish);
    await this.wishRepository.update(copiedWish.id, {
      copied: copiedWish.copied + 1,
    });

    return savedWish;
  }

  // async updateWish(id: number, updateWishDto: UpdateWishDto) {
  //   return await this.wishRepository.update(id, updateWishDto);
  // }

  async updateOne(
    id: number,
    updateWishDto: UpdateWishDto,
    user: User,
  ): Promise<Wish> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    console.log(wish);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    if (wish.offers.length === 0) {
      await this.wishRepository
        .createQueryBuilder()
        .update(Wish)
        .set(updateWishDto)
        .where('id = :id', { id })
        .execute();

      return this.wishRepository.findOneBy({ id });
    }
    return null;
  }

  async removeOne(id: number, user: User): Promise<void> {
    const wishesOwner = await this.wishRepository.findOne({
      where: { owner: true },
    });

    if (wishesOwner.id !== user.id) {
      throw new ForbiddenException('Вы не можете удалять чужие подарки');
    }

    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('id = :id', { id })
      .execute();
  }
}
