import { IsUrl, Length, Max } from 'class-validator';

export class CreateWishlistDto {
  @Length(2, 250, {
    message: 'Название вишлиста должно содержать от 2 до 250 симловов',
  })
  name: string;
  @Max(1500, {
    message:
      'Слишком длинная строка. Описание не должно быть более 1500 симловов',
  })
  description: string;
  @IsUrl({}, { message: 'Изображение должно быть ссылкой' })
  image: string;
}
