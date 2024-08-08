export type AirportRanking = {
  airport_id: number;
  airport_name: string;
  num_flights: number;
  rank: number;
};

export interface SeatOccupancyRate {
  flight_id: number;
  flight_number: string;
  seat_occupancy_rate: number;
}

export interface SeatOccupancyAnalytics {
  flights: SeatOccupancyRate[];
  average_occupancy_rate: number;
}

export interface SeatCounts {
  flight_id: number;
  flight_number: string;
  total_occupied_seats: number;
  avg_occupied_seats: number;
  difference_from_avg: number;
}

export type CountryFlightRanking = {
  country: string;
  outbound_flights: number;
  inbound_flights: number;
  total_flights: number;
  rank_desc: number;
};

export type FlightStatusCounts = {
  status: string;
  count: number;
};

export type WeeklyFlightCounts = {
  week_start: Date;
  week_end: Date;
  flight_count: number;
};

export type BookingStatusCounts = {
  status: string;
  count: number;
};

export type AverageArrivalTimes = {
  airline: string;
  avg_duration_hours: number;
  overall_avg_duration_hours: number;
  difference_from_avg: number;
};

export type LongestAndShortestFlights = {
  airline: string;
  flight_id: number;
  flight_number: string;
  duration_hours: number;
  rank_desc: number;
  rank_asc: number;
  origin_airport_name: string;
  destination_airport_name: string;
};

export type PassengerCounts = {
  flight_id: number;
  flight_number: string;
  total_passengers: number;
  avg_passengers: number;
  difference_from_avg: number;
};

export type AverageFlightsPerDay = {
  departure_date: Date;
  num_flights: number;
  moving_avg_7_days: number;
};

export type SeatOccupancyRates = {
  flight_id: number;
  flight_number: string;
  seat_occupancy_rate: number;
};

export type AverageLayoverTimes = {
  flight_id: number;
  flight_number: string;
  origin_airport_name: string;
  destination_airport_name: string;
  avg_layover_duration_minutes: number;
};

export type FlightsBelowAveragePrice = {
  flight_number: string;
  airline: string;
  price: number;
  average_price: number;
  rank_desc: number;
};
