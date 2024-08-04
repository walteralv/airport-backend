import { Module } from '@nestjs/common';
import { FlightFareService } from './flight-fare.service';
import { FlightFareController } from './flight-fare.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FlightFareController],
  providers: [FlightFareService],
})
export class FlightFareModule {}
