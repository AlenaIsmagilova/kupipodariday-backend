import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class EmailSendlerService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(
    wish: Wish,
    users: string[],
  ): Promise<SentMessageInfo> {
    return await this.mailerService.sendMail({
      to: users,
      from: '"КупиПодариДай Сервис" SeboMik@yandex.ru',
      subject: 'Вы собрали необходимую сумму на подарок!',
      html: `
        <h3>Поздравляем!</h3>
        <p>Вы собрали необходимую сумму на подарок ${wish.name}</p>
        <p>Вот контакты тех, кто помог собрать нужную сумму: ${users}
      `,
    });
  }
}
