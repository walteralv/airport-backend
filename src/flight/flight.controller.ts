import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FlightService } from './flight.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchFlightsDto } from './dto/search-flights.dto';

@ApiTags('flight')
@Controller('flight')
export class FlightController {
  constructor(private readonly flightService: FlightService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new flight' })
  @ApiResponse({
    status: 201,
    description: 'The flight has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createFlightDto: CreateFlightDto) {
    return this.flightService.create(createFlightDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all flights' })
  @ApiResponse({ status: 200, description: 'Return all flights.' })
  findAll() {
    return this.flightService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search available flights' })
  @ApiResponse({ status: 200, description: 'Return available flights.' })
  async searchFlights(@Query() searchFlightsDto: SearchFlightsDto) {
    const flights = await this.flightService.searchFlights(searchFlightsDto);
    flights.outboundFlights;
    flights.outboundFlights.map((flights) => {
      // flights.FlightFares.reduce()
    });
    const transformFlight = (flight) => {
      const itinerary = [];

      if (flight.StopOvers.length > 0) {
        for (let i = 0; i < flight.StopOvers.length; i++) {
          const stop = flight.StopOvers[i];
          if (i === 0) {
            itinerary.push({
              origin: flight.origin_airport.city,
              destination: stop.airport.city,
              duration: stop.layover_duration,
              equipment: flight.equipment,
              aircraftLeaseText: flight.aircraft_lease_text,
              flightNumber: flight.flight_number,
              departure: flight.departure_time,
              arrival: stop.arrival_time,
            });
          } else {
            const previousStop = flight.StopOvers[i - 1];
            itinerary.push({
              origin: previousStop.airport.city,
              destination: stop.airport.city,
              duration: stop.layover_duration,
              equipment: flight.equipment,
              aircraftLeaseText: flight.aircraft_lease_text,
              flightNumber: flight.flight_number,
              departure: previousStop.departure_time,
              arrival: stop.arrival_time,
            });
          }
        }
        const lastStop = flight.StopOvers[flight.StopOvers.length - 1];
        itinerary.push({
          origin: lastStop.airport.city,
          destination: flight.destination_airport.city,
          duration: flight.duration,
          equipment: flight.equipment,
          aircraftLeaseText: flight.aircraft_lease_text,
          flightNumber: flight.flight_number,
          departure: lastStop.departure_time,
          arrival: flight.arrival_time,
        });
      } else {
        itinerary.push({
          origin: flight.origin_airport.city,
          destination: flight.destination_airport.city,
          duration: flight.duration,
          equipment: flight.equipment,
          aircraftLeaseText: flight.aircraft_lease_text,
          flightNumber: flight.flight_number,
          departure: flight.departure_time,
          arrival: flight.arrival_time,
        });
      }

      const flightFares = flight.FlightFares.map((flightFare) => ({
        fareId: flightFare.flight_fare_id,
        fareText: flightFare.fare.fare_type,
        fareDescription: flightFare.fare.description,
        fare: {
          fare_id: flightFare.fare.fare_id,
          fare_type: flightFare.fare.fare_type,
          description: flightFare.fare.description,
          cabin_id: flightFare.fare.cabin_id,
          cabin_label: flightFare.fare.cabin_label,
        },
        price: {
          price: flightFare.price,
          currency: flightFare.currency,
          displayCurrency: flightFare.display_currency,
          display_currency: flightFare.display_currency,
          display_amount: flightFare.display_amount,
          display: `${flightFare.display_currency} ${flightFare.display_amount}`,
        },
        lowestPriceDifference: {
          lowest_price_difference: flightFare.lowest_price_difference,
          display: `${flightFare.display_currency} ${flightFare.lowest_price_difference.toFixed(2)}`,
        },
        lowestPriceBrand: flightFare.lowest_price_brand,
        attributes: flightFare.attributes,
      }));

      const lowestPrice = flight.FlightFares;

      return {
        flightId: flight.flight_id,
        flightNumber: flight.flight_number,
        stopOvers: flight.stopOvers,
        airline: flight.airline,
        departure_time: flight.departure_time,
        arrival_time: flight.arrival_time,
        duration: flight.duration,
        status: flight.status,
        equipment: flight.equipment,
        aircraftLeaseText: flight.aircraft_lease_text,
        origin: {
          departure: flight.departure_time,
          departureTime: flight.departure_time
            .toISOString()
            .split('T')[1]
            .slice(0, 5),
          iataCode: flight.origin_airport.IATA_code,
          airport: flight.origin_airport.name,
          city: flight.origin_airport.city,
        },
        destination: {
          arrival: flight.arrival_time,
          arrivalTime: flight.arrival_time
            .toISOString()
            .split('T')[1]
            .slice(0, 5),
          iataCode: flight.destination_airport.IATA_code,
          airport: flight.destination_airport.name,
          city: flight.destination_airport.city,
        },
        itinerary,
        flightFares,
      };
    };

    const outboundFlights = flights.outboundFlights.map(transformFlight);
    const returnFlights = flights.returnFlights.map(transformFlight);

    return { outboundFlights, returnFlights };
  }

  // @Get('search')
  // @ApiOperation({ summary: 'Search flights by origin, destination, and dates' })
  // @ApiQuery({ name: 'originAirportId', type: 'number' })
  // @ApiQuery({ name: 'destinationAirportId', type: 'number' })
  // @ApiQuery({ name: 'departureDate', type: 'string' })
  // @ApiQuery({ name: 'returnDate', type: 'string', required: false })
  // @ApiQuery({ name: 'passengerCount', type: 'number', required: false })
  // @ApiResponse({ status: 200, description: 'Return the flights that match the search criteria.' })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  // searchFlights(
  //   @Query('originAirportId') originAirportId: string,
  //   @Query('destinationAirportId') destinationAirportId: string,
  //   @Query('departureDate') departureDate: string,
  //   @Query('returnDate') returnDate?: string,
  //   @Query('passengerCount') passengerCount?: string,
  // ) {
  //   return this.flightService.searchFlights(
  //     +originAirportId,
  //     +destinationAirportId,
  //     departureDate,
  //     returnDate,
  //     passengerCount ? +passengerCount : undefined,
  //   );
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get a flight by ID' })
  @ApiResponse({ status: 200, description: 'Return the flight.' })
  @ApiResponse({ status: 404, description: 'Flight not found.' })
  findOne(@Param('id') id: string) {
    return this.flightService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a flight by ID' })
  @ApiResponse({
    status: 200,
    description: 'The flight has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Flight not found.' })
  update(@Param('id') id: string, @Body() updateFlightDto: UpdateFlightDto) {
    return this.flightService.update(+id, updateFlightDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a flight by ID' })
  @ApiResponse({
    status: 200,
    description: 'The flight has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Flight not found.' })
  remove(@Param('id') id: string) {
    return this.flightService.remove(+id);
  }
}
