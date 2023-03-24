import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250, {
    message: 'Название подарка должно содержать от 1 до 250 символов',
  })
  name: string;

  @IsNotEmpty()
  @IsUrl({}, { message: 'Введите ссылку на магазин' })
  link: string;

  @IsNotEmpty()
  @IsUrl({}, { message: 'Введите ссылку на подарок' })
  image: string;

  @IsNotEmpty()
  @Min(1, { message: 'Сумма должна быть не менее 1 руб.' })
  price: number;

  @IsOptional()
  @IsNotEmpty()
  @Length(1, 1024, {
    message: 'Описание должно содердать от 1 до 1024 символов',
  })
  description: string;

  @IsOptional()
  raised: number;

  @IsOptional()
  @IsInt()
  copied: number;
}
