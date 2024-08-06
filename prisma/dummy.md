### 1. Ranking de aeropuertos por número de vuelos

Esta consulta rankea los aeropuertos según la cantidad de vuelos que despegan desde ellos.

```sql
SELECT 
  a.airport_id, 
  a.name AS airport_name,
  COUNT(f.flight_id) AS num_flights,
  RANK() OVER (ORDER BY COUNT(f.flight_id) DESC) AS rank
FROM 
  "Airport" a
JOIN 
  "Flight" f ON a.airport_id = f.origin_airport_id
GROUP BY 
  a.airport_id, a.name;
```

### 2. Comparar tiempos promedio de llegada de aerolíneas

Esta consulta calcula el tiempo promedio de llegada para cada aerolínea y luego lo compara utilizando funciones de ventana.

```sql
SELECT 
  f.airline, 
  AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600) AS avg_duration_hours,
  AVG(AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600)) OVER () AS overall_avg_duration_hours,
  AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600) - AVG(AVG(EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600)) OVER () AS difference_from_avg
FROM 
  "Flight" f
GROUP BY 
  f.airline;
```

### 3. Identificar los vuelos más largos y más cortos por aerolínea

Esta consulta identifica el vuelo más largo y más corto por aerolínea.

```sql
WITH ranked_flights AS (
  SELECT 
    f.airline,
    f.flight_id,
    f.flight_number,
    EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) / 3600 AS duration_hours,
    RANK() OVER (PARTITION BY f.airline ORDER BY EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) DESC) AS rank_desc,
    RANK() OVER (PARTITION BY f.airline ORDER BY EXTRACT(EPOCH FROM (f.arrival_time - f.departure_time)) ASC) AS rank_asc,
    f.origin_airport_id,
    f.destination_airport_id
  FROM 
    "Flight" f
)
SELECT
  rf.airline,
  rf.flight_id,
  rf.flight_number,
  rf.duration_hours,
  rf.rank_desc,
  rf.rank_asc,
  orig_airport.name AS origin_airport_name,
  dest_airport.name AS destination_airport_name
FROM
  ranked_flights rf
JOIN
  "Airport" orig_airport ON rf.origin_airport_id = orig_airport.airport_id
JOIN
  "Airport" dest_airport ON rf.destination_airport_id = dest_airport.airport_id
WHERE 
  rf.rank_desc = 1
  OR rf.rank_asc = 1;
```

### 4. Total de pasajeros por vuelo y comparación con el promedio

Esta consulta calcula el total de pasajeros por vuelo y compara cada uno con el promedio de todos los vuelos.

```sql
SELECT 
  f.flight_id,
  f.flight_number,
  COUNT(bd.passenger_id) AS total_passengers,
  AVG(COUNT(bd.passenger_id)) OVER () AS avg_passengers,
  COUNT(bd.passenger_id) - AVG(COUNT(bd.passenger_id)) OVER () AS difference_from_avg
FROM 
  "Flight" f
JOIN 
  "BookingDetail" bd ON f.flight_id = bd.flight_id
GROUP BY 
  f.flight_id
ORDER BY
  difference_from_avg DESC;
```

### 5. Promedio de vuelos por día

Esta consulta calcula el promedio móvil de vuelos por día en los últimos 7 días.

```sql
SELECT 
  departure_time::date AS departure_date,
  COUNT(flight_id) AS num_flights,
  AVG(COUNT(flight_id)) OVER (ORDER BY departure_time::date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg_7_days
FROM
  "Flight" 
GROUP BY 
  departure_date
ORDER BY 
  departure_date;
```

### 6. Tasa de ocupación de asientos por vuelo

Esta consulta calcula la tasa de ocupación de asientos para cada vuelo.

```sql
SELECT 
  f.flight_id,
  f.flight_number,
  SUM(CASE WHEN s.available = false THEN 1 ELSE 0 END) * 1.0 / COUNT(s.seat_id) AS seat_occupancy_rate
FROM 
  "Flight" f
JOIN 
  "Seat" s ON f.flight_id = s.flight_id
GROUP BY 
  f.flight_id;
```

### 7. Tiempo promedio de layover para vuelos con escalas

Esta consulta calcula el tiempo promedio de layover para vuelos con escalas.

```sql
SELECT 
  f.flight_id,
  f.flight_number,
  f."stopOvers",
  orig_airport.name AS origin_airport_name,
  dest_airport.name AS destination_airport_name,
  AVG(s.layover_duration) AS avg_layover_duration_minutes
FROM 
  "Flight" f
JOIN 
  "StopOver" s ON f.flight_id = s.flight_id
JOIN 
  "Airport" orig_airport ON f.origin_airport_id = orig_airport.airport_id
JOIN 
  "Airport" dest_airport ON f.destination_airport_id = dest_airport.airport_id
GROUP BY 
  f.flight_id,
  f.flight_number,
  orig_airport.name,
  dest_airport.name;
```

### 8. Consultar el Ranking de vuelos con tarifas más bajas que el promedio
Esta consulta muestra los vuelos cuyos precios son menores al precio promedio de todos los vuelos y optiene su Ranking.

~~~sql
WITH AverageFlightPrice AS (
    SELECT
        AVG(ff.price) AS average_price
    FROM
        "FlightFare" ff
)
SELECT
    f.flight_number,
    f.airline,
    ff.price,
    afp.average_price,
    RANK() OVER (PARTITION BY f.flight_number ORDER BY ff.price DESC) AS rank_desc
FROM
    "Flight" f
    JOIN "FlightFare" ff ON f.flight_id = ff.flight_id
    CROSS JOIN AverageFlightPrice afp
WHERE
    ff.price < afp.average_price
ORDER BY
    ff.price DESC;
~~~

### 9. Consultar vuelos disponibles entre 2 fechas

Esta consulta muestra vuelos disponibles con los siguientes datos: aereopuerto de origen, aereopuerto de destino, fecha de ida, fecha de vuelta opcional, numero de pasajeros(por defecto es 1)
apareceran los vuelos disponibles(tando de ida y vuelta), tenemos que elegir un vuelo de ida y uno de vuelta, cada uno de estos vuelos tienen distintos precios, hora de ida, hora de llegada, duración.

~~~ts
  searchFlights({
    origin_airport_id: number,
    destination_airport_id: number,
    departure_date: string,
    return_date: string?,
    passengers: number},
  ) {
    const { origin_airport_id, destination_airport_id, departure_date, return_date } = searchFlightsDto;

    const outboundFlights = await this.prisma.flight.findMany({
      where: {
        origin_airport_id: Number(origin_airport_id),
        destination_airport_id: Number(destination_airport_id),
        departure_time: {
          gte: new Date(`${departure_date}T00:00:00.000Z`),
          lte: new Date(`${departure_date}T23:59:59.999Z`)
        }
      },
      include: {
        origin_airport: true,
        destination_airport: true,
        StopOvers: {
          include: {
            airport: true
          }
        },
        FlightFares: {
          include: {
            fare: true
          }
        }
      }
    });

    let returnFlights = [];
    if (return_date) {
      returnFlights = await this.prisma.flight.findMany({
        where: {
          origin_airport_id: Number(destination_airport_id),
          destination_airport_id: Number(origin_airport_id),
          departure_time: {
            gte: new Date(`${return_date}T00:00:00.000Z`),
            lte: new Date(`${return_date}T23:59:59.999Z`)
          }
        },
        include: {
          origin_airport: true,
          destination_airport: true,
          StopOvers: {
            include: {
              airport: true
            }
          },
          FlightFares: {
            include: {
              fare: true
            }
          }
        }
      });
    }

    return { outboundFlights, returnFlights };
  }
~~~

### 10. Consultar asientos en un vuelo

Esta consulta muestra los asientos, estos pueden ser de varios tipos como estandar, premium, etc. pueden tener distintos precios, tambien tienen que tener un estatus para saber si estan disponibles.

~~~ts
  async getSeatsByFlightId(flightId: number) {
    const seats = await this.prisma.seat.findMany({
      where: {
        flight_id: Number(flightId),
      },
      include: {
        flight: {
          include: {
            origin_airport: true,
            destination_airport: true,
          },
        },
      },
    });

    const zones = this.calculateZones(seats);

    const seatsData = seats.map(seat => ({
      seatNumber: seat.seat_number,
      class: seat.class,
      seatType: seat.seat_type,
      available: seat.available,
      price: {
        amount: seat.price,
        currency: 'USD',
      },
    }));

    return {
      seats: seatsData,
      zones: zones,
      fullSegment: false,
    };
  }

  private calculateZones(seats: any[]) {
    const zoneMap = {};

    seats.forEach(seat => {
      const zone = seat.class;
      if (!zoneMap[zone]) {
        zoneMap[zone] = {
          zoneCode: zone.toUpperCase().replace(' ', '_'),
          minPrice: {
            amount: seat.price,
            currency: 'USD',
          },
          availableZone: seat.available,
        };
      } else {
        if (seat.price < zoneMap[zone].minPrice.amount) {
          zoneMap[zone].minPrice.amount = seat.price;
        }
        if (seat.available) {
          zoneMap[zone].availableZone = true;
        }
      }
    });

    return Object.values(zoneMap);
  }
~~~

### 11. Consultar ranking de Paises con más vuelos

Esta consulta muesta el numero de vuelos de entrada, salida, total de vuelos, y los Rankea

~~~sql
WITH OriginFlightCounts AS (
    SELECT
        a.country,
        COUNT(f.flight_id) AS outbound_flights
    FROM
        "Flight" f
        JOIN "Airport" a ON f.origin_airport_id = a.airport_id
    GROUP BY
        a.country
),
DestinationFlightCounts AS (
    SELECT
        a.country,
        COUNT(f.flight_id) AS inbound_flights
    FROM
        "Flight" f
        JOIN "Airport" a ON f.destination_airport_id = a.airport_id
    GROUP BY
        a.country
),
TotalFlightCounts AS (
    SELECT
        o.country,
        COALESCE(o.outbound_flights, 0) AS outbound_flights,
        COALESCE(d.inbound_flights, 0) AS inbound_flights,
        COALESCE(o.outbound_flights, 0) + COALESCE(d.inbound_flights, 0) AS total_flights
    FROM
        OriginFlightCounts o
    FULL OUTER JOIN
        DestinationFlightCounts d ON o.country = d.country
),
RankedFlightCounts AS (
    SELECT
        country,
        outbound_flights,
        inbound_flights,
        total_flights,
        RANK() OVER (ORDER BY total_flights DESC, outbound_flights DESC, inbound_flights DESC) AS rank_desc
    FROM
        TotalFlightCounts
)
SELECT
    country,
    outbound_flights,
    inbound_flights,
    total_flights,
    rank_desc
FROM
    RankedFlightCounts
ORDER BY
    rank;
~~~

### 12. Consultar el estado de las resevas

Esta Consula Muesta el estado de las reservas, las agrupa y las cuenta

~~~sql
WITH BookingStatusCounts AS (
  SELECT
    status,
    COUNT(booking_id) AS count
  FROM
    "Booking"
  GROUP BY
    status
)
SELECT
  status,
  count
FROM
  BookingStatusCounts
ORDER BY
  count DESC;
~~~

### 13. Consultar la cantidad de vuelos semanales
Esta Consula Muesta la cantidad de vuelos semanales

~~~sql
WITH WeeklyFlights AS (
  SELECT
    DATE_TRUNC('week', f.departure_time) AS week_start
  FROM
    "Flight" f
),
WeeklyFlightsCount AS (
  SELECT
    week_start,
    COUNT(*) AS flight_count
  FROM
    WeeklyFlights
  GROUP BY
    week_start
  ORDER BY
    week_start
),
WeeklyFlightsWithEnd AS (
  SELECT
    week_start,
    LEAD(week_start) OVER (ORDER BY week_start) - INTERVAL '1 day' AS week_end,
    flight_count
  FROM
    WeeklyFlightsCount
)
SELECT
  week_start::date AS week_start,
  COALESCE(week_end::date, (week_start + INTERVAL '6 days')::date) AS week_end,
  flight_count
FROM
  WeeklyFlightsWithEnd
ORDER BY
  week_start;
~~~

### 14. Consulta para contar vuelos por estatus 
~~~sql
WITH FlightStatusCounts AS (
  SELECT
    f.status,
    COUNT(f.status) AS count
  FROM
    "Flight" f
  GROUP BY
    f.status
)
SELECT
  status,
  count
FROM
  FlightStatusCounts
ORDER BY
  count DESC;
~~~
