-- Insert data into Airports table
INSERT INTO "Airport" (name, city, country, "IATA_code", "ICAO_code", status) VALUES
('Los Angeles International', 'Los Angeles', 'USA', 'LAX', 'KLAX', 'Active'),
('John F. Kennedy International', 'New York', 'USA', 'JFK', 'KJFK', 'Active'),
('Heathrow', 'London', 'UK', 'LHR', 'EGLL', 'Active');

-- Insert data into Flights table
INSERT INTO "Flight" (flight_number, airline, departure_time, arrival_time, origin_airport_id, destination_airport_id, status) VALUES
('AA100', 'American Airlines', '2024-07-21 08:00:00', '2024-07-21 12:00:00', 1, 2, 'Scheduled'),
('BA200', 'British Airways', '2024-07-21 09:00:00', '2024-07-21 13:00:00', 2, 3, 'Scheduled');

-- Insert data into Routes table
INSERT INTO "Route" (flight_id, origin_airport_id, destination_airport_id, total_duration, total_distance, status) VALUES
(1, 1, 2, 240, 4500, 'Active'),
(2, 2, 3, 240, 5500, 'Active');

-- Insert data into Stops table
INSERT INTO "Stop" (route_id, stop_number, airport_id, arrival_time, departure_time, layover_duration, status) VALUES
(1, 1, 1, '2024-07-21 08:00:00', '2024-07-21 08:30:00', 30, 'Active'),
(1, 2, 2, '2024-07-21 11:30:00', '2024-07-21 12:00:00', 30, 'Active');

-- Insert data into Passengers table
INSERT INTO "Passenger" (first_name, last_name, passport_number, nationality, phone, email) VALUES
('John', 'Doe', 'A1234567', 'USA', '1234567890', 'john.doe@example.com'),
('Jane', 'Smith', 'B7654321', 'UK', '0987654321', 'jane.smith@example.com');

-- Insert data into Seats table
INSERT INTO "Seat" (flight_id, seat_number, class, seat_type, available, price) VALUES
(1, '1A', 'Economy', 'Window', true, 199.99),
(1, '1B', 'Economy', 'Aisle', true, 199.99),
(2, '2A', 'Business', 'Window', true, 499.99),
(2, '2B', 'Business', 'Aisle', true, 499.99);

-- Insert data into BaggageOptions table
INSERT INTO "BaggageOption" (type, price) VALUES
('Carry-On', 0.00),
('Checked', 30.00),
('Oversized', 50.00);

-- Insert data into Bookings table
INSERT INTO "Booking" (booking_date, total_price, status) VALUES
('2024-07-20 10:00:00', 429.98, 'Confirmed'),
('2024-07-20 11:00:00', 549.99, 'Confirmed');

-- Insert data into BookingDetails table
INSERT INTO "BookingDetail" (booking_id, passenger_id, flight_id, seat_id, baggage_id) VALUES
(1, 1, 1, 1, 2),
(1, 2, 1, 2, 1),
(2, 1, 2, 3, 3),
(2, 2, 2, 4, 2);


SELECT 
    f.flight_id,
    f.flight_number,
    f.airline,
    f.departure_time,
    f.arrival_time,
    a1.name AS origin_airport_name,
    a2.name AS destination_airport_name
FROM 
    "Flight" as f
JOIN 
    "Airport" as a1 ON f.origin_airport_id = a1.airport_id
JOIN 
    "Airport" as a2 ON f.destination_airport_id = a2.airport_id
WHERE 
    a1.IATA_code = 'IATA_CODE_ORIGEN'   -- Reemplaza 'IATA_CODE_ORIGEN' por el código IATA del aeropuerto de origen
    AND a2.IATA_code = 'IATA_CODE_DESTINO'  -- Reemplaza 'IATA_CODE_DESTINO' por el código IATA del aeropuerto de destino
    AND DATE(f.departure_time) = '2024-07-20';  -- Reemplaza '2024-07-20' por la fecha deseada

               List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | Airport            | table | postgres
 public | BaggageOption      | table | postgres
 public | Booking            | table | postgres
 public | BookingDetail      | table | postgres
 public | Flight             | table | postgres
 public | Passenger          | table | postgres
 public | Route              | table | postgres
 public | Seat               | table | postgres
 public | Stop               | table | postgres
 public | _prisma_migrations | table | postgres
(10 rows)

postgres=# WITH FlightDetails AS (
    SELECT 
        f.flight_id,
        f.flight_number,
        f.airline,
        f.departure_time,
        f.arrival_time,
        ao.name as origin_airport,
        ad.name as destination_airport,
        f.status
    FROM 
        "Flight" f
    JOIN 
        "Airport" ao ON f.origin_airport_id = ao.airport_id
    JOIN 
        "Airport" ad ON f.destination_airport_id = ad.airport_id
    WHERE 
        ao.name = 'Los Angeles International' 
        AND ad.name = 'John F. Kennedy International'
        AND f.departure_time::date = '2024-07-21'
)
SELECT
    fd.flight_number,
    fd.airline,
    fd.departure_time,
    fd.arrival_time,
    fd.origin_airport,
    fd.flight_number, s.stop_number;a.airport_id
postgres=# 
postgres=# 
postgres=# WITH FlightDetails AS (
    SELECT 
        f.flight_id,
        f.flight_number,
        f.airline,
        f.departure_time,
        f.arrival_time,
        ao.name as origin_airport,
        ad.name as destination_airport,
        f.status
    FROM 
        "Flight" f
    JOIN 
        "Airport" ao ON f.origin_airport_id = ao.airport_id
    JOIN 
        "Airport" ad ON f.destination_airport_id = ad.airport_id
    WHERE 
        ao.name = 'Los Angeles International' 
        AND ad.name = 'John F. Kennedy International'
        AND f.departure_time::date = '2024-07-21'
)
SELECT
    fd.flight_number,
    fd.airline,
    fd.departure_time,
    fd.arrival_time,
    fd.origin_airport,
    fd.flight_number, s.stop_number;a.airport_id


| flight_number |      airline      |   departure_time    |    arrival_time     |      origin_airport       |      destination_airport      | flight_status | stop_number |         stop_airport          |  stop_arrival_time  | stop_departure_time | layover_duration | stop_status 
---------------+-------------------+---------------------+---------------------+---------------------------+-------------------------------+---------------+-------------+-------------------------------+---------------------+---------------------+------------------+-------------
| AA100         | American Airlines | 2024-07-21 08:00:00 | 2024-07-21 12:00:00 | Los Angeles International | John F. Kennedy International | Scheduled     |           1 | Los Angeles International     | 2024-07-21 08:00:00 | 2024-07-21 08:30:00 |               30 | Active
| AA100         | American Airlines | 2024-07-21 08:00:00 | 2024-07-21 12:00:00 | Los Angeles International | John F. Kennedy International | Scheduled     |           2 | John F. Kennedy International | 2024-07-21 11:30:00 | 2024-07-21 12:00:00 |               30 | Active


-- Inserción de vuelos en la tabla Flight
INSERT INTO "Flight" (flight_number, airline, origin_airport_id, destination_airport_id, departure_time, arrival_time, "stopOvers", duration, status, equipment, aircraft_lease_text)
VALUES
('AA101', 'American Airlines', 1, 2, '2024-08-01 08:00:00', '2024-08-01 12:00:00', 0, 240, 'scheduled', 'Boeing 737', 'Leased from XYZ'),
('AA102', 'American Airlines', 2, 1, '2024-08-02 08:00:00', '2024-08-02 12:00:00', 0, 240, 'scheduled', 'Boeing 737', 'Leased from XYZ'),

('BA201', 'British Airways', 3, 4, '2024-08-01 10:00:00', '2024-08-01 14:00:00', 0, 240, 'scheduled', 'Airbus A320', 'Leased from ABC'),
('BA202', 'British Airways', 4, 3, '2024-08-02 10:00:00', '2024-08-02 14:00:00', 0, 240, 'scheduled', 'Airbus A320', 'Leased from ABC'),

('DL301', 'Delta Airlines', 5, 6, '2024-08-01 06:00:00', '2024-08-01 10:00:00', 0, 240, 'scheduled', 'Boeing 767', 'Leased from DEF'),
('DL302', 'Delta Airlines', 6, 5, '2024-08-02 06:00:00', '2024-08-02 10:00:00', 0, 240, 'scheduled', 'Boeing 767', 'Leased from DEF'),

('AF401', 'Air France', 7, 8, '2024-08-01 07:00:00', '2024-08-01 11:00:00', 0, 240, 'scheduled', 'Airbus A380', 'Leased from GHI'),
('AF402', 'Air France', 8, 7, '2024-08-02 07:00:00', '2024-08-02 11:00:00', 0, 240, 'scheduled', 'Airbus A380', 'Leased from GHI'),

('KL501', 'KLM', 9, 10, '2024-08-01 09:00:00', '2024-08-01 13:00:00', 0, 240, 'scheduled', 'Boeing 777', 'Leased from JKL'),
('KL502', 'KLM', 10, 9, '2024-08-02 09:00:00', '2024-08-02 13:00:00', 0, 240, 'scheduled', 'Boeing 777', 'Leased from JKL'),

('IB601', 'Iberia', 4, 3, '2024-08-01 08:30:00', '2024-08-01 12:30:00', 0, 240, 'scheduled', 'Airbus A350', 'Leased from MNO'),
('IB602', 'Iberia', 3, 4, '2024-08-02 08:30:00', '2024-08-02 12:30:00', 0, 240, 'scheduled', 'Airbus A350', 'Leased from MNO'),

('LH701', 'Lufthansa', 5, 6, '2024-08-01 10:30:00', '2024-08-01 14:30:00', 1, 300, 'scheduled', 'Airbus A330', 'Leased from PQR'),
('LH702', 'Lufthansa', 6, 5, '2024-08-02 10:30:00', '2024-08-02 14:30:00', 1, 300, 'scheduled', 'Airbus A330', 'Leased from PQR'),

('JJ801', 'LATAM', 9, 8, '2024-08-01 11:00:00', '2024-08-01 15:00:00', 1, 300, 'scheduled', 'Boeing 787', 'Leased from STU'),
('JJ802', 'LATAM', 8, 9, '2024-08-02 11:00:00', '2024-08-02 15:00:00', 1, 300, 'scheduled', 'Boeing 787', 'Leased from STU'),

('UA901', 'United Airlines', 1, 10, '2024-08-01 12:00:00', '2024-08-01 16:00:00', 1, 300, 'scheduled', 'Boeing 757', 'Leased from VWX'),
('UA902', 'United Airlines', 10, 1, '2024-08-02 12:00:00', '2024-08-02 16:00:00', 1, 300, 'scheduled', 'Boeing 757', 'Leased from VWX'),

('AV1001', 'Avianca', 2, 9, '2024-08-01 07:00:00', '2024-08-01 11:00:00', 1, 300, 'scheduled', 'Airbus A320', 'Leased from YZA'),
('AV1002', 'Avianca', 9, 2, '2024-08-02 07:00:00', '2024-08-02 11:00:00', 1, 300, 'scheduled', 'Airbus A320', 'Leased from YZA'),

('G31001', 'Gol', 6, 3, '2024-08-01 13:00:00', '2024-08-01 17:00:00', 1, 300, 'scheduled', 'Boeing 737', 'Leased from BCD'),
('G31002', 'Gol', 3, 6, '2024-08-02 13:00:00', '2024-08-02 17:00:00', 1, 300, 'scheduled', 'Boeing 737', 'Leased from BCD');

-- Inserción de escalas en la tabla StopOver
INSERT INTO "StopOver" (flight_id, stop_number, airport_id, arrival_time, departure_time, layover_duration, status)
VALUES
-- Para vuelo LH701
(13, 1, 9, '2024-08-01 12:30:00', '2024-08-01 13:00:00', 30, 'scheduled'),
-- Para vuelo LH702
(14, 1, 9, '2024-08-02 12:30:00', '2024-08-02 13:00:00', 30, 'scheduled'),

-- Para vuelo JJ801
(15, 1, 5, '2024-08-01 13:00:00', '2024-08-01 13:30:00', 30, 'scheduled'),
-- Para vuelo JJ802
(16, 1, 5, '2024-08-02 13:00:00', '2024-08-02 13:30:00', 30, 'scheduled'),

-- Para vuelo UA901
(17, 1, 3, '2024-08-01 14:00:00', '2024-08-01 14:30:00', 30, 'scheduled'),
-- Para vuelo UA902
(18, 1, 3, '2024-08-02 14:00:00', '2024-08-02 14:30:00', 30, 'scheduled'),

-- Para vuelo AV1001
(19, 1, 4, '2024-08-01 09:00:00', '2024-08-01 09:30:00', 30, 'scheduled'),
-- Para vuelo AV1002
(20, 1, 4, '2024-08-02 09:00:00', '2024-08-02 09:30:00', 30, 'scheduled'),

-- Para vuelo G31001
(21, 1, 1, '2024-08-01 15:00:00', '2024-08-01 15:30:00', 30, 'scheduled'),
-- Para vuelo G31002
(22, 1, 1, '2024-08-02 15:00:00', '2024-08-02 15:30:00', 30, 'scheduled');




INSERT INTO "FlightFare" (flight_id, fare_id, price, currency, display_currency, display_amount, lowest_price_difference, lowest_price_brand, available, attributes)
VALUES
-- Para vuelo AA101
(1, 1, 200.00, 'USD', 'USD', '200.00', 0.00, 'Basic', true, '{
  "comfortableSeat": {"show": false},
  "food": {"show": false, "exclusive": false},
  "personalItem": {"show": true},
  "seatSelection": {"show": false},
  "flexibility": {"show": false},
  "changes": {"show": false},
  "alcohol": {"show": false}
}'),
(1, 2, 500.00, 'USD', 'USD', '500.00', 0.00, 'Premium', true, '{
  "comfortableSeat": {"show": false},
  "food": {"show": true, "exclusive": false},
  "personalItem": {"show": true},
  "seatSelection": {"show": true},
  "flexibility": {"show": true},
  "changes": {"show": true},
  "alcohol": {"show": false}
}'),
(1, 3, 1000.00, 'USD', 'USD', '1000.00', 0.00, 'Luxury', true, '{
  "comfortableSeat": {"show": true},
  "food": {"show": false, "exclusive": true},
  "personalItem": {"show": true},
  "seatSelection": {"show": true},
  "flexibility": {"show": true},
  "changes": {"show": true},
  "alcohol": {"show": true}
}'),

-- Para vuelo AA102
(2, 1, 200.00, 'USD', 'USD', '200.00', 0.00, 'Basic', true, '{
  "comfortableSeat": {"show": false},
  "food": {"show": false, "exclusive": false},
  "personalItem": {"show": true},
  "seatSelection": {"show": true},
  "flexibility": {"show": true},
  "changes": {"show": false},
  "alcohol": {"show": true}
}'),
(2, 2, 500.00, 'USD', 'USD', '500.00', 0.00, 'Premium', true, '{
  "comfortableSeat": {"show": false},
  "food": {"show": false, "exclusive": false},
  "personalItem": {"show": true},
  "seatSelection": {"show": true},
  "flexibility": {"show": true},
  "changes": {"show": false},
  "alcohol": {"show": true}
}'),
(2, 3, 1000.00, 'USD', 'USD', '1000.00', 0.00, 'Luxury', true, '{
  "comfortableSeat": {"show": true},
  "food": {"show": false, "exclusive": true},
  "personalItem": {"show": true},
  "seatSelection": {"show": true},
  "flexibility": {"show": true},
  "changes": {"show": true},
  "alcohol": {"show": true}
}'),