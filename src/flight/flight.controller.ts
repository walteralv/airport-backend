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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
    return this.transformFlightResults(flights);
  }

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

  private transformFlightResults(flights: {
    outboundFlights: any[];
    returnFlights: any[];
  }) {
    const transformFlight = (flight) => {
      const itinerary = this.buildItinerary(flight);
      const flightFares = this.transformFlightFares(flight.FlightFares);

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
        origin: this.transformAirportInfo(
          flight.origin_airport,
          flight.departure_time,
          'departure',
        ),
        destination: this.transformAirportInfo(
          flight.destination_airport,
          flight.arrival_time,
          'arrival',
        ),
        itinerary,
        flightFares,
      };
    };

    return {
      outboundFlights: flights.outboundFlights.map(transformFlight),
      returnFlights: flights.returnFlights.map(transformFlight),
    };
  }

  private buildItinerary(flight) {
    const itinerary = [];

    if (flight.StopOvers.length > 0) {
      flight.StopOvers.forEach((stop, index) => {
        if (index === 0) {
          itinerary.push(
            this.createItinerarySegment(
              flight.origin_airport.city,
              stop.airport.city,
              stop.layover_duration,
              flight,
              flight.departure_time,
              stop.arrival_time,
            ),
          );
        } else {
          const previousStop = flight.StopOvers[index - 1];
          itinerary.push(
            this.createItinerarySegment(
              previousStop.airport.city,
              stop.airport.city,
              stop.layover_duration,
              flight,
              previousStop.departure_time,
              stop.arrival_time,
            ),
          );
        }
      });

      const lastStop = flight.StopOvers[flight.StopOvers.length - 1];
      itinerary.push(
        this.createItinerarySegment(
          lastStop.airport.city,
          flight.destination_airport.city,
          flight.duration,
          flight,
          lastStop.departure_time,
          flight.arrival_time,
        ),
      );
    } else {
      itinerary.push(
        this.createItinerarySegment(
          flight.origin_airport.city,
          flight.destination_airport.city,
          flight.duration,
          flight,
          flight.departure_time,
          flight.arrival_time,
        ),
      );
    }

    return itinerary;
  }

  private createItinerarySegment(
    origin,
    destination,
    duration,
    flight,
    departure,
    arrival,
  ) {
    return {
      origin,
      destination,
      duration,
      equipment: flight.equipment,
      aircraftLeaseText: flight.aircraft_lease_text,
      flightNumber: flight.flight_number,
      departure,
      arrival,
    };
  }

  private transformFlightFares(flightFares) {
    return flightFares.map((flightFare) => ({
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
  }

  private transformAirportInfo(airport, time, type) {
    return {
      [type]: time,
      [`${type}Time`]: time.toISOString().split('T')[1].slice(0, 5),
      iataCode: airport.IATA_code,
      airport: airport.name,
      city: airport.city,
    };
  }
}
