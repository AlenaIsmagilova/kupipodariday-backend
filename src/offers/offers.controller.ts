import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { EmailSendlerService } from 'src/email-sendler/email-sendler.service';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private es: EmailSendlerService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    const newOffer = await this.offersService.create(createOfferDto, req.user);

    return newOffer;
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(+id);
  }
}
