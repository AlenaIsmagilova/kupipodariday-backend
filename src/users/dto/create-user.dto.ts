import { IsEmail, IsNotEmpty, IsUrl, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email введен некорректно' })
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
  @Min(2, { message: 'Имя должно быть указано буквами от 2 до 30 символов' })
  @Max(30, { message: 'Имя должно быть указано буквами от 2 до 30 символов' })
  @IsNotEmpty()
  username: string;
  @IsUrl({}, { message: 'Введите ссылку в поле "avatar"' })
  avatar?: string;
  @Min(2, { message: 'Раздел "О себе" должен содержать от 2 до 200 символов' })
  @Max(200, {
    message: 'Раздел "О себе" должен содержать от 2 до 200 символов',
  })
  about?: string;
}
