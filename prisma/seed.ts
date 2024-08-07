// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

// Función para determinar el tipo de asiento
function getSeatType(row: number) {
  if (row <= 8) return 'ADELANTE';
  if (row === 9 || row === 10) return 'EMERGENCIA';
  return 'STANDAR';
}

async function main() {
  // Crear aeropuertos (expandido a 10)
  console.log('Iniciando la creación de aeropuertos...');
  const airports = [
    {
      name: 'Aeropuerto Internacional Jorge Chávez',
      city: 'Lima',
      country: 'Perú',
      IATA_code: 'LIM',
      ICAO_code: 'SPJC',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Alejandro Velasco Astete',
      city: 'Cusco',
      country: 'Perú',
      IATA_code: 'CUZ',
      ICAO_code: 'SPZO',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Alfredo Rodríguez Ballón',
      city: 'Arequipa',
      country: 'Perú',
      IATA_code: 'AQP',
      ICAO_code: 'SPQU',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Capitán FAP Carlos Martínez de Pinillos',
      city: 'Trujillo',
      country: 'Perú',
      IATA_code: 'TRU',
      ICAO_code: 'SPRU',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Coronel FAP Francisco Secada Vignetta',
      city: 'Iquitos',
      country: 'Perú',
      IATA_code: 'IQT',
      ICAO_code: 'SPQT',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Capitán FAP José A. Quiñones',
      city: 'Chiclayo',
      country: 'Perú',
      IATA_code: 'CIX',
      ICAO_code: 'SPHI',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Inca Manco Cápac',
      city: 'Juliaca',
      country: 'Perú',
      IATA_code: 'JUL',
      ICAO_code: 'SPJL',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Coronel FAP Carlos Ciriani Santa Rosa',
      city: 'Tacna',
      country: 'Perú',
      IATA_code: 'TCQ',
      ICAO_code: 'SPTN',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Capitán FAP David Abensur Rengifo',
      city: 'Pucallpa',
      country: 'Perú',
      IATA_code: 'PCL',
      ICAO_code: 'SPCL',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Capitán FAP Guillermo Concha Iberico',
      city: 'Piura',
      country: 'Perú',
      IATA_code: 'PIU',
      ICAO_code: 'SPUR',
      status: 'active',
    },
  ];

  for (const airport of airports) {
    await prisma.airport.create({ data: airport });
  }

  console.log('Aeropuertos creados exitosamente.');
  console.log('Iniciando la creación de tarifas...');

  // Crear tarifas
  const fares = [
    {
      fare_type: 'Economy',
      description: 'Tarifa económica estándar',
      cabin_id: 'ECO',
      cabin_label: 'Económica',
    },
    {
      fare_type: 'Business',
      description: 'Tarifa business con servicios premium',
      cabin_id: 'BUS',
      cabin_label: 'Ejecutiva',
    },
  ];

  for (const fare of fares) {
    await prisma.fare.create({ data: fare });
  }
  console.log('Tarifas creadas exitosamente.');

  // Crear vuelos y tarifas de vuelo
  const airlines = [
    'LATAM Perú',
    'Sky Airline Perú',
    'Viva Air Perú',
    'Avianca Perú',
  ];
  const equipments = [
    'Airbus A320',
    'Airbus A319',
    'Boeing 737',
    'Embraer E190',
  ];

  const oneWayFlights = 30;
  const roundTripFlights = 70;

  console.log('Iniciando la creación de vuelos de ida...');

  for (let i = 0; i < oneWayFlights; i++) {
    const originId = Math.floor(Math.random() * 10) + 1;
    let destinationId;
    do {
      destinationId = Math.floor(Math.random() * 10) + 1;
    } while (destinationId === originId);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const equipment = equipments[Math.floor(Math.random() * equipments.length)];

    const departureDate = new Date(2024, 7, 6 + Math.floor(Math.random() * 62));
    const arrivalDate = new Date(
      departureDate.getTime() +
        (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000,
    );

    const flight = {
      flight_number: `PE${String(i + 1).padStart(3, '0')}`,
      airline,
      origin_airport_id: originId,
      destination_airport_id: destinationId,
      departure_time: departureDate,
      arrival_time: arrivalDate,
      stopOvers: Math.random() < 0.2 ? 1 : 0,
      duration: (arrivalDate.getTime() - departureDate.getTime()) / (60 * 1000),
      status: 'scheduled',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const createdFlight = await prisma.flight.create({ data: flight });
    console.log(`Vuelo de ida ${createdFlight.flight_number} creado.`);

    // Crear tarifas de vuelo para cada vuelo
    const economyPrice = Math.floor(Math.random() * (200 - 50) + 50);
    const businessPrice = Math.floor(Math.random() * (500 - 200) + 200);

    const flightFares = [
      {
        flight_id: createdFlight.flight_id,
        fare_id: 1, // Economy
        price: economyPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: economyPrice.toFixed(2),
        lowest_price_difference: 0,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
      {
        flight_id: createdFlight.flight_id,
        fare_id: 2, // Business
        price: businessPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: businessPrice.toFixed(2),
        lowest_price_difference: businessPrice - economyPrice,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
    ];

    for (const flightFare of flightFares) {
      await prisma.flightFare.create({ data: flightFare });
    }

    console.log(
      `Creando asientos para el vuelo ${createdFlight.flight_number}...`,
    );
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let row = 1; row <= 20; row++) {
      for (const col of columns) {
        const seatNumber = `${col}${row}`;
        const seat = {
          flight_id: createdFlight.flight_id,
          seat_number: `${createdFlight.flight_id}-${seatNumber}`,
          class: row <= 3 ? 'Business' : 'Economy',
          seat_type: getSeatType(row),
          available: true,
          price: row <= 3 ? businessPrice : economyPrice,
        };
        await prisma.seat.create({ data: seat });
      }
    }
    console.log(
      `Asientos creados para el vuelo ${createdFlight.flight_number}.`,
    );
  }
  console.log('Vuelos de ida creados exitosamente.');

  console.log('Iniciando la creación de vuelos de ida y vuelta...');

  for (let i = 0; i < roundTripFlights; i++) {
    const originId = Math.floor(Math.random() * 10) + 1;
    let destinationId;
    do {
      destinationId = Math.floor(Math.random() * 10) + 1;
    } while (destinationId === originId);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const equipment = equipments[Math.floor(Math.random() * equipments.length)];

    const departureDate = new Date(2024, 7, 6 + Math.floor(Math.random() * 62));
    const arrivalDate = new Date(
      departureDate.getTime() +
        (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000,
    );

    const returnDepartureDate = new Date(
      arrivalDate.getTime() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 días después
    const returnArrivalDate = new Date(
      returnDepartureDate.getTime() +
        (Math.floor(Math.random() * 5) + 1) * 60 * 60 * 1000,
    );

    const flight = {
      flight_number: `PE${String(i + 1 + oneWayFlights).padStart(3, '0')}`,
      airline,
      origin_airport_id: originId,
      destination_airport_id: destinationId,
      departure_time: departureDate,
      arrival_time: arrivalDate,
      stopOvers: Math.random() < 0.2 ? 1 : 0,
      duration: (arrivalDate.getTime() - departureDate.getTime()) / (60 * 1000),
      status: 'scheduled',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const returnFlight = {
      flight_number: `PE${String(i + 1 + oneWayFlights + roundTripFlights).padStart(3, '0')}`,
      airline,
      origin_airport_id: destinationId,
      destination_airport_id: originId,
      departure_time: returnDepartureDate,
      arrival_time: returnArrivalDate,
      stopOvers: Math.random() < 0.2 ? 1 : 0,
      duration:
        (returnArrivalDate.getTime() - returnDepartureDate.getTime()) /
        (60 * 1000),
      status: 'scheduled',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const createdFlight = await prisma.flight.create({ data: flight });
    console.log(`Vuelo de ida ${createdFlight.flight_number} creado.`);
    const createdReturnFlight = await prisma.flight.create({
      data: returnFlight,
    });
    console.log(`Vuelo de vuelta ${createdReturnFlight.flight_number} creado.`);

    // Crear tarifas de vuelo para cada vuelo
    const economyPrice = Math.floor(Math.random() * (200 - 50) + 50);
    const businessPrice = Math.floor(Math.random() * (500 - 200) + 200);

    const flightFares = [
      {
        flight_id: createdFlight.flight_id,
        fare_id: 1, // Economy
        price: economyPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: economyPrice.toFixed(2),
        lowest_price_difference: 0,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
      {
        flight_id: createdFlight.flight_id,
        fare_id: 2, // Business
        price: businessPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: businessPrice.toFixed(2),
        lowest_price_difference: businessPrice - economyPrice,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
    ];

    const returnFlightFares = [
      {
        flight_id: createdReturnFlight.flight_id,
        fare_id: 1, // Economy
        price: economyPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: economyPrice.toFixed(2),
        lowest_price_difference: 0,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
      {
        flight_id: createdReturnFlight.flight_id,
        fare_id: 2, // Business
        price: businessPrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: businessPrice.toFixed(2),
        lowest_price_difference: businessPrice - economyPrice,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
    ];

    for (const flightFare of flightFares) {
      await prisma.flightFare.create({ data: flightFare });
    }

    for (const flightFare of returnFlightFares) {
      await prisma.flightFare.create({ data: flightFare });
    }

    console.log(
      `Creando asientos para el vuelo de ida ${createdFlight.flight_number}...`,
    );
    const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let row = 1; row <= 20; row++) {
      for (const col of columns) {
        const seatNumber = `${col}${row}`;
        const seat = {
          flight_id: createdFlight.flight_id,
          seat_number: `${createdFlight.flight_id}-${seatNumber}`,
          class: row <= 3 ? 'Business' : 'Economy',
          seat_type: getSeatType(row),
          available: true,
          price: row <= 3 ? businessPrice : economyPrice,
        };
        await prisma.seat.create({ data: seat });
      }
    }
    console.log(
      `Asientos creados para el vuelo de ida ${createdFlight.flight_number}.`,
    );

    console.log(
      `Creando asientos para el vuelo de vuelta ${createdReturnFlight.flight_number}...`,
    );
    for (let row = 1; row <= 20; row++) {
      for (const col of columns) {
        const seatNumber = `${col}${row}`;
        const seat = {
          flight_id: createdReturnFlight.flight_id,
          seat_number: `${createdReturnFlight.flight_id}-${seatNumber}`,
          class: row <= 3 ? 'Business' : 'Economy',
          seat_type: getSeatType(row),
          available: true,
          price: row <= 3 ? businessPrice : economyPrice,
        };
        await prisma.seat.create({ data: seat });
      }
    }
    console.log(
      `Asientos creados para el vuelo de vuelta ${createdReturnFlight.flight_number}.`,
    );
  }
  console.log('Vuelos de ida y vuelta creados exitosamente.');

  console.log('Iniciando la creación del usuario admin...');
  const adminUser = {
    username: 'admin',
    password_hash: await hash('admin123', 10),
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    role: 'admin',
  };

  await prisma.user.create({ data: adminUser });
  console.log('Usuario admin creado exitosamente.');

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
