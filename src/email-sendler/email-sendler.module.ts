import { Module } from '@nestjs/common';
import { EmailSendlerService } from './email-sendler.service';

@Module({
  providers: [EmailSendlerService],
  exports: [EmailSendlerService],
})
export class EmailSendlerModule {}
