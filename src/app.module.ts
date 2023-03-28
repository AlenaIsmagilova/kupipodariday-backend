import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { User } from './users/entities/user.entity';
import { Wish } from './wishes/entities/wish.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Offer } from './offers/entities/offer.entity';
import { HashModule } from './hash/hash.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSendlerModule } from './email-sendler/email-sendler.module';
import { MailerModule } from '@nestjs-modules/mailer';
import config from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'nest_project',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: 'SeboMik@yandex.ru',
          pass: 'sgdAdvBJ_u!_zU8',
        },
      },
    }),

    UsersModule,
    OffersModule,
    WishesModule,
    WishlistsModule,
    HashModule,
    AuthModule,
    ConfigModule.forRoot({ load: [config] }),
    EmailSendlerModule,
  ],
})
export class AppModule {}
