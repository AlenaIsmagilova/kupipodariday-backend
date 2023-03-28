import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { UsersModule } from 'src/users/users.module';
import { EmailSendlerModule } from 'src/email-sendler/email-sendler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesModule,
    UsersModule,
    EmailSendlerModule,
  ],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
