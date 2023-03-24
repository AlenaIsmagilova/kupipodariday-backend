import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    return this.wishlistRepository.save(createWishlistDto);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find();
  }

  async findOne(id: number): Promise<Wishlist> {
    return this.wishlistRepository.findOneBy({ id });
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    await this.wishlistRepository
      .createQueryBuilder()
      .update(Wishlist)
      .set(updateWishlistDto)
      .where('id = :id', { id })
      .execute();

    return this.wishlistRepository.findOneBy({ id });
  }

  async removeOne(id: number): Promise<void> {
    await this.wishlistRepository
      .createQueryBuilder()
      .delete()
      .from(Wishlist)
      .where('id = :id', { id })
      .execute();
  }
}
