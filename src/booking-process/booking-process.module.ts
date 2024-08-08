import { Module } from '@nestjs/common';
import { BookingProcessService } from './booking-process.service';
import { BookingProcessController } from './booking-process.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PdfTicketService } from './pdf-ticket.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingProcessController],
  providers: [BookingProcessService, PdfTicketService],
})
export class BookingProcessModule {}
