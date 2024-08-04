import { Module } from '@nestjs/common';
import { BookingDetailService } from './booking-detail.service';
import { BookingDetailController } from './booking-detail.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BookingDetailController],
  providers: [BookingDetailService],
})
export class BookingDetailModule {}
