import { Injectable } from '@nestjs/common';
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
    const savedWish = await this.wishRepository.save(createdWish);
    await this.wishRepository.update(copiedWish.id, {
      copied: copiedWish.copied + 1,
    });

    return savedWish;
  }

  async updateWish(id: number, updateWishDto: UpdateWishDto) {
    return await this.wishRepository.update(id, updateWishDto);
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });
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

  async removeOne(id: number): Promise<void> {
    await this.wishRepository
      .createQueryBuilder()
      .delete()
      .from(Wish)
      .where('id = :id', { id })
      .execute();
  }
}
