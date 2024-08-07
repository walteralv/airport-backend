import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AirportModule } from './airport/airport.module';
import { FlightModule } from './flight/flight.module';
import { PassengerModule } from './passenger/passenger.module';
import { SeatModule } from './seat/seat.module';
import { BaggageOptionModule } from './baggage-option/baggage-option.module';
import { BookingModule } from './booking/booking.module';
import { BookingDetailModule } from './booking-detail/booking-detail.module';
import { StopOverModule } from './stop-over/stop-over.module';
import { UserModule } from './user/user.module';
import { FareModule } from './fare/fare.module';
import { FlightFareModule } from './flight-fare/flight-fare.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BookingProcessModule } from './booking-process/booking-process.module';

@Module({
  imports: [
    PrismaModule,
    AirportModule,
    FlightModule,
    PassengerModule,
    SeatModule,
    BaggageOptionModule,
    BookingModule,
    BookingDetailModule,
    StopOverModule,
    UserModule,
    FareModule,
    FlightFareModule,
    AnalyticsModule,
    BookingProcessModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
