import { PartialType } from '@nestjs/mapped-types';
import { Offer } from 'src/offers/entities/offer.entity';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  offers?: Offer[];
}
