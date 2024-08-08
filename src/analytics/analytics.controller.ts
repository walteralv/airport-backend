import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('airport-ranking')
  @ApiOperation({ summary: 'Ranking de aeropuertos por número de vuelos' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el ranking de aeropuertos por número de vuelos',
  })
  getAirportRanking() {
    return this.analyticsService.getAirportRanking();
  }

  @Get('average-arrival-times')
  @ApiOperation({
    summary: 'Comparar tiempos promedio de llegada de aerolíneas',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve el tiempo promedio de llegada de aerolíneas y su comparación con el promedio general',
  })
  getAverageArrivalTimes() {
    return this.analyticsService.getAverageArrivalTimes();
  }

  @Get('longest-shortest-flights')
  @ApiOperation({
    summary: 'Identificar los 10 vuelos más largos y los 10 más cortos',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve los 10 vuelos más largos y los 10 más cortos',
  })
  getLongestAndShortestFlights() {
    return this.analyticsService.getLongestAndShortestFlights();
  }

  @Get('passenger-counts')
  @ApiOperation({
    summary: 'Total de pasajeros por vuelo y comparación con el promedio',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve el total de pasajeros por vuelo y su comparación con el promedio',
  })
  getPassengerCounts() {
    return this.analyticsService.getPassengerCounts();
  }

  @Get('average-flights-per-day')
  @ApiOperation({ summary: 'Promedio de vuelos por día' })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve el promedio móvil de vuelos por día en los últimos 7 días',
  })
  getAverageFlightsPerDay() {
    return this.analyticsService.getAverageFlightsPerDay();
  }

  @Get('seat-occupancy-rates')
  @ApiOperation({ summary: 'Tasa de ocupación de asientos por vuelo' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la tasa de ocupación de asientos para cada vuelo',
  })
  getSeatOccupancyRates() {
    return this.analyticsService.getSeatOccupancyRates();
  }

  @Get('average-layover-times')
  @ApiOperation({
    summary: 'Tiempo promedio de layover para vuelos con escalas',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve el tiempo promedio de layover para vuelos con escalas',
  })
  getAverageLayoverTimes() {
    return this.analyticsService.getAverageLayoverTimes();
  }

  @Get('flights-below-average-price')
  @ApiOperation({
    summary:
      'Consultar el ranking de vuelos con tarifas más bajas que el promedio',
  })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve los vuelos cuyos precios son menores al precio promedio de todos los vuelos y su ranking',
  })
  getFlightsBelowAveragePrice() {
    return this.analyticsService.getFlightsBelowAveragePrice();
  }

  @Get('country-flight-ranking')
  @ApiOperation({ summary: 'Consultar ranking de países con más vuelos' })
  @ApiResponse({
    status: 200,
    description:
      'Devuelve el número de vuelos de entrada, salida y total de vuelos por país y su ranking',
  })
  getCountryFlightRanking() {
    return this.analyticsService.getCountryFlightRanking();
  }

  @Get('booking-status-counts')
  @ApiOperation({ summary: 'Consultar el estado de las reservas' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el estado de las reservas, las agrupa y las cuenta',
  })
  getBookingStatusCounts() {
    return this.analyticsService.getBookingStatusCounts();
  }

  @Get('weekly-flight-counts')
  @ApiOperation({ summary: 'Consultar la cantidad de vuelos semanales' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la cantidad de vuelos semanales',
  })
  getWeeklyFlightCounts() {
    return this.analyticsService.getWeeklyFlightCounts();
  }

  @Get('flight-status-counts')
  @ApiOperation({ summary: 'Consultar la cantidad de vuelos por estatus' })
  @ApiResponse({
    status: 200,
    description: 'Devuelve la cantidad de vuelos por estatus',
  })
  getFlightStatusCounts() {
    return this.analyticsService.getFlightStatusCounts();
  }
}
