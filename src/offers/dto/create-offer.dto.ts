import { NotEquals } from 'class-validator';

export class CreateOfferDto {
  @NotEquals(0, { message: 'Сумма сбора не должна быть равна 0' })
  amount: number;
  hidden?: boolean;
  itemId: number;
}
