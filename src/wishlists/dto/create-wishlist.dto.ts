import { IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(2, 250, {
    message: 'Название вишлиста должно содержать от 2 до 250 символов',
  })
  name: string;
  @Length(1, 1500, {
    message:
      'Слишком короткая или слишком длинная строка. Описание не должно быть менее 1 и более 1500 символов',
  })
  description: string;
  @IsUrl({}, { message: 'Изображение должно быть ссылкой' })
  image: string;
}
