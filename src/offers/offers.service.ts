import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailSendlerService } from 'src/email-sendler/email-sendler.service';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishService: WishesService,
    private emailSendlerService: EmailSendlerService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const ownWish = await this.wishService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { offers: { user: true }, owner: true },
    });

    if (user.id === ownWish.owner.id) {
      throw new BadRequestException(
        'Нельзя скидываться на свои подарки',
        '403',
      );
    }

    if (createOfferDto.amount + ownWish.raised > ownWish.price) {
      throw new BadRequestException(
        'Предложенная сумма слишком большая. Уменьшите сумму',
        '403',
      );
    }

    const savedOffer = await this.offerRepository.save({
      user: user,
      item: ownWish,
      ...createOfferDto,
    });

    await this.wishService.updateOne(
      ownWish.id,
      {
        raised: ownWish.raised + createOfferDto.amount,
      },
      user,
    );

    const updatedWish = await this.wishService.findOne({
      where: { id: createOfferDto.itemId },
      relations: { offers: { user: true } },
    });

    if (updatedWish.raised === updatedWish.price) {
      const users = await updatedWish.offers.map((offer) => offer.user.email);

      await this.emailSendlerService.sendEmail(ownWish, users);
    }

    return savedOffer;
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find();
  }

  async findOne(id: number): Promise<Offer> {
    return await this.offerRepository.findOneBy({ id });
  }
}
