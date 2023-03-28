import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email введен некорректно' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @Length(2, 30, {
    message: 'Имя должно быть указано буквами от 2 до 30 символов',
  })
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsUrl({}, { message: 'Введите ссылку в поле "avatar"' })
  avatar?: string;

  @IsOptional()
  @Length(2, 200, {
    message: 'Раздел "О себе" должен содержать от 2 до 200 символов',
  })
  about?: string;
}
