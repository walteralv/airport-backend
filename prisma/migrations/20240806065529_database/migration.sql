-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Airport" (
    "airport_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "IATA_code" CHAR(3) NOT NULL,
    "ICAO_code" CHAR(4) NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "Airport_pkey" PRIMARY KEY ("airport_id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "flight_id" SERIAL NOT NULL,
    "flight_number" VARCHAR(10) NOT NULL,
    "airline" VARCHAR(255) NOT NULL,
    "origin_airport_id" INTEGER NOT NULL,
    "destination_airport_id" INTEGER NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "stopOvers" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "equipment" VARCHAR(50) NOT NULL,
    "aircraft_lease_text" VARCHAR(255) NOT NULL,

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("flight_id")
);

-- CreateTable
CREATE TABLE "StopOver" (
    "stop_id" SERIAL NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "stop_number" INTEGER NOT NULL,
    "airport_id" INTEGER NOT NULL,
    "arrival_time" TIMESTAMP(3) NOT NULL,
    "departure_time" TIMESTAMP(3) NOT NULL,
    "layover_duration" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "StopOver_pkey" PRIMARY KEY ("stop_id")
);

-- CreateTable
CREATE TABLE "Passenger" (
    "passenger_id" SERIAL NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "passport_number" VARCHAR(50) NOT NULL,
    "nationality" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "email" VARCHAR(50) NOT NULL,

    CONSTRAINT "Passenger_pkey" PRIMARY KEY ("passenger_id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "seat_id" SERIAL NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "seat_number" VARCHAR(10) NOT NULL,
    "class" VARCHAR(50) NOT NULL,
    "seat_type" VARCHAR(50) NOT NULL,
    "available" BOOLEAN NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "BaggageOption" (
    "baggage_id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BaggageOption_pkey" PRIMARY KEY ("baggage_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" SERIAL NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "BookingDetail" (
    "booking_detail_id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "passenger_id" INTEGER NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "baggage_id" INTEGER NOT NULL,

    CONSTRAINT "BookingDetail_pkey" PRIMARY KEY ("booking_detail_id")
);

-- CreateTable
CREATE TABLE "Fare" (
    "fare_id" SERIAL NOT NULL,
    "fare_type" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "cabin_id" VARCHAR(10) NOT NULL,
    "cabin_label" VARCHAR(50) NOT NULL,

    CONSTRAINT "Fare_pkey" PRIMARY KEY ("fare_id")
);

-- CreateTable
CREATE TABLE "FlightFare" (
    "flight_fare_id" SERIAL NOT NULL,
    "flight_id" INTEGER NOT NULL,
    "fare_id" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" VARCHAR(10) NOT NULL,
    "display_currency" VARCHAR(10) NOT NULL,
    "display_amount" VARCHAR(50) NOT NULL,
    "lowest_price_difference" DECIMAL(10,2) NOT NULL,
    "lowest_price_brand" VARCHAR(50) NOT NULL,
    "available" BOOLEAN NOT NULL,
    "attributes" JSONB NOT NULL,

    CONSTRAINT "FlightFare_pkey" PRIMARY KEY ("flight_fare_id")
);

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_origin_airport_id_fkey" FOREIGN KEY ("origin_airport_id") REFERENCES "Airport"("airport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_destination_airport_id_fkey" FOREIGN KEY ("destination_airport_id") REFERENCES "Airport"("airport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopOver" ADD CONSTRAINT "StopOver_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopOver" ADD CONSTRAINT "StopOver_airport_id_fkey" FOREIGN KEY ("airport_id") REFERENCES "Airport"("airport_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetail" ADD CONSTRAINT "BookingDetail_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetail" ADD CONSTRAINT "BookingDetail_passenger_id_fkey" FOREIGN KEY ("passenger_id") REFERENCES "Passenger"("passenger_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetail" ADD CONSTRAINT "BookingDetail_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetail" ADD CONSTRAINT "BookingDetail_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seat"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDetail" ADD CONSTRAINT "BookingDetail_baggage_id_fkey" FOREIGN KEY ("baggage_id") REFERENCES "BaggageOption"("baggage_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightFare" ADD CONSTRAINT "FlightFare_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "Flight"("flight_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlightFare" ADD CONSTRAINT "FlightFare_fare_id_fkey" FOREIGN KEY ("fare_id") REFERENCES "Fare"("fare_id") ON DELETE RESTRICT ON UPDATE CASCADE;
