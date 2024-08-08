// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

// Función para determinar el tipo de asiento (sin cambios)
function getSeatType(row: number) {
  if (row <= 8) return 'ADELANTE';
  if (row === 9 || row === 10) return 'EMERGENCIA';
  return 'STANDAR';
}

// Función para generar una fecha aleatoria en un rango
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function main() {
  // Crear aeropuertos (expandido a 20)
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
    {
      name: 'Aeropuerto Internacional Comandante FAP Germán Arias Graziani',
      city: 'Huaraz',
      country: 'Perú',
      IATA_code: 'ATA',
      ICAO_code: 'SPHZ',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Coronel FAP Alfredo Mendívil Duarte',
      city: 'Ayacucho',
      country: 'Perú',
      IATA_code: 'AYP',
      ICAO_code: 'SPHO',
      status: 'active',
    },
    {
      name: 'Aeropuerto Internacional Padre Aldamiz',
      city: 'Puerto Maldonado',
      country: 'Perú',
      IATA_code: 'PEM',
      ICAO_code: 'SPTU',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Andahuaylas',
      city: 'Andahuaylas',
      country: 'Perú',
      IATA_code: 'ANS',
      ICAO_code: 'SPHA',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Atalaya',
      city: 'Atalaya',
      country: 'Perú',
      IATA_code: 'ALD',
      ICAO_code: 'SPAY',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Chachapoyas',
      city: 'Chachapoyas',
      country: 'Perú',
      IATA_code: 'CHH',
      ICAO_code: 'SPPY',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Huánuco',
      city: 'Huánuco',
      country: 'Perú',
      IATA_code: 'HUU',
      ICAO_code: 'SPNC',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Jauja',
      city: 'Jauja',
      country: 'Perú',
      IATA_code: 'JAU',
      ICAO_code: 'SPJJ',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Tingo María',
      city: 'Tingo María',
      country: 'Perú',
      IATA_code: 'TGI',
      ICAO_code: 'SPGM',
      status: 'active',
    },
    {
      name: 'Aeropuerto de Tumbes',
      city: 'Tumbes',
      country: 'Perú',
      IATA_code: 'TBP',
      ICAO_code: 'SPME',
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
      fare_type: 'Flexible',
      description: 'Tarifa económica con flexibilidad',
      cabin_id: 'FLX',
      cabin_label: 'Económica Flexible',
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

  // Crear opciones de equipaje
  console.log('Iniciando la creación de opciones de equipaje...');
  const baggageOptions = [
    { type: 'Equipaje de mano', price: 0 },
    { type: 'Maleta 23kg', price: 30 },
    { type: 'Maleta adicional 23kg', price: 50 },
    { type: 'Equipaje deportivo', price: 60 },
    { type: 'Mascota en cabina', price: 70 },
  ];

  for (const option of baggageOptions) {
    await prisma.baggageOption.create({ data: option });
  }
  console.log('Opciones de equipaje creadas exitosamente.');

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

  const oneWayFlights = 100;
  const roundTripFlights = 50;

  const today = new Date();
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysBefore = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  console.log('Iniciando la creación de vuelos...');

  async function createFlight(
    isPast: boolean = false,
    isReturn: boolean = false,
  ) {
    const originId = Math.floor(Math.random() * 20) + 1;
    let destinationId;
    do {
      destinationId = Math.floor(Math.random() * 20) + 1;
    } while (destinationId === originId);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const equipment = equipments[Math.floor(Math.random() * equipments.length)];

    let departureDate;
    if (isPast) {
      departureDate = randomDate(thirtyDaysBefore, today);
    } else {
      departureDate = randomDate(today, sevenDaysLater);
    }

    // Asegurar una duración mínima de 45 minutos
    const minDuration = 45;
    const maxAdditionalDuration = 4 * 60; // 4 horas adicionales máximo
    const flightDuration =
      minDuration + Math.floor(Math.random() * maxAdditionalDuration);

    const arrivalDate = new Date(
      departureDate.getTime() + flightDuration * 60 * 1000,
    );

    const flight = {
      flight_number: `PE${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      airline,
      origin_airport_id: isReturn ? destinationId : originId,
      destination_airport_id: isReturn ? originId : destinationId,
      departure_time: departureDate,
      arrival_time: arrivalDate,
      stopOvers: Math.random() < 0.1 ? 1 : 0,
      duration: flightDuration,
      status: isPast ? 'completed' : 'scheduled',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const createdFlight = await prisma.flight.create({ data: flight });
    console.log(
      `Vuelo ${isReturn ? 'de vuelta' : 'de ida'} ${createdFlight.flight_number} creado. Duración: ${flightDuration} minutos.`,
    );

    // Crear tarifas de vuelo para cada vuelo
    const economyPrice = Math.floor(Math.random() * (200 - 50) + 50);
    const flexiblePrice = economyPrice * 1.3;
    const businessPrice = Math.floor(Math.random() * (500 - 200) + 200);

    const flightFares = [
      {
        flight_id: createdFlight.flight_id,
        fare_id: 1,
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
        fare_id: 2,
        price: flexiblePrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: flexiblePrice.toFixed(2),
        lowest_price_difference: flexiblePrice - economyPrice,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
      {
        flight_id: createdFlight.flight_id,
        fare_id: 3,
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
          available: isPast ? Math.random() > Math.random() * 0.6 + 0.3 : true, // 30% - 90% de asientos ocupados para vuelos pasados
          price: row <= 3 ? businessPrice : economyPrice,
        };
        await prisma.seat.create({ data: seat });
      }
    }
    console.log(
      `Asientos creados para el vuelo ${createdFlight.flight_number}.`,
    );

    return createdFlight;
  }

  // Crear vuelos de ida (pasados y futuros)
  for (let i = 0; i < oneWayFlights / 2; i++) {
    await createFlight(true); // Vuelo pasado de ida
    await createFlight(false); // Vuelo futuro de ida
  }

  // Crear vuelos de ida y vuelta (pasados y futuros)
  for (let i = 0; i < roundTripFlights; i++) {
    const isPast = i < roundTripFlights / 2;
    const outboundFlight = await createFlight(isPast);
    const returnFlight = await createFlight(isPast, true);
    console.log(
      `Vuelo de ida y vuelta creado: ${outboundFlight.flight_number} - ${returnFlight.flight_number}`,
    );
  }

  console.log('Vuelos creados exitosamente.');

  console.log('Iniciando la creación de vuelos de ida y vuelta...');
  for (let i = 0; i < roundTripFlights; i++) {
    const outboundFlight = await createFlight();
    const returnFlight = await createFlight(true);
    console.log(
      `Vuelo de ida y vuelta creado: ${outboundFlight.flight_number} - ${returnFlight.flight_number}`,
    );
  }
  console.log('Vuelos de ida y vuelta creados exitosamente.');

  async function createDelayedFlight() {
    const originId = Math.floor(Math.random() * 20) + 1;
    let destinationId;
    do {
      destinationId = Math.floor(Math.random() * 20) + 1;
    } while (destinationId === originId);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const equipment = equipments[Math.floor(Math.random() * equipments.length)];

    const scheduledDepartureDate = randomDate(today, sevenDaysLater);
    const delay = Math.floor(Math.random() * 120) + 30; // Retraso entre 30 y 150 minutos
    const actualDepartureDate = new Date(
      scheduledDepartureDate.getTime() + delay * 60 * 1000,
    );

    // Asegurar una duración mínima de 45 minutos
    const minDuration = 45;
    const maxAdditionalDuration = 4 * 60; // 4 horas adicionales máximo
    const flightDuration =
      minDuration + Math.floor(Math.random() * maxAdditionalDuration);

    const arrivalDate = new Date(
      actualDepartureDate.getTime() + flightDuration * 60 * 1000,
    );

    const flight = {
      flight_number: `PE${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      airline,
      origin_airport_id: originId,
      destination_airport_id: destinationId,
      departure_time: scheduledDepartureDate,
      arrival_time: arrivalDate,
      stopOvers: Math.random() < 0.1 ? 1 : 0,
      duration: flightDuration,
      status: 'Delayed',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const createdFlight = await prisma.flight.create({ data: flight });
    console.log(
      `Vuelo retrasado ${createdFlight.flight_number} creado. Retraso de ${delay} minutos. Duración: ${flightDuration} minutos.`,
    );

    // Crear tarifas de vuelo para cada vuelo
    const economyPrice = Math.floor(Math.random() * (200 - 50) + 50);
    const flexiblePrice = economyPrice * 1.3;
    const businessPrice = Math.floor(Math.random() * (500 - 200) + 200);

    const flightFares = [
      {
        flight_id: createdFlight.flight_id,
        fare_id: 1,
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
        fare_id: 2,
        price: flexiblePrice,
        currency: 'USD',
        display_currency: 'USD',
        display_amount: flexiblePrice.toFixed(2),
        lowest_price_difference: flexiblePrice - economyPrice,
        lowest_price_brand: airline,
        available: true,
        attributes: {},
      },
      {
        flight_id: createdFlight.flight_id,
        fare_id: 3,
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
          available: Math.random() > 0.7, // 70% de probabilidad de que el asiento esté ocupado
          price: row <= 3 ? businessPrice : economyPrice,
        };
        await prisma.seat.create({ data: seat });
      }
    }
    console.log(
      `Asientos creados para el vuelo ${createdFlight.flight_number}.`,
    );

    return createdFlight;
  }

  async function createCancelledFlight() {
    const originId = Math.floor(Math.random() * 20) + 1;
    let destinationId;
    do {
      destinationId = Math.floor(Math.random() * 20) + 1;
    } while (destinationId === originId);

    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const equipment = equipments[Math.floor(Math.random() * equipments.length)];

    const departureDate = randomDate(today, sevenDaysLater);

    const flight = {
      flight_number: `PE${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      airline,
      origin_airport_id: originId,
      destination_airport_id: destinationId,
      departure_time: departureDate,
      arrival_time: departureDate, // Mismo tiempo que la salida ya que está cancelado
      stopOvers: 0,
      duration: 0,
      status: 'Cancelled',
      equipment,
      aircraft_lease_text: `Operated by ${airline}`,
    };

    const createdFlight = await prisma.flight.create({ data: flight });
    console.log(`Vuelo cancelado ${createdFlight.flight_number} creado.`);

    // No es necesario crear tarifas ni asientos para vuelos cancelados

    return createdFlight;
  }

  // Crear vuelos retrasados
  console.log('Iniciando la creación de vuelos retrasados...');
  for (let i = 0; i < 50; i++) {
    await createDelayedFlight();
  }
  console.log('Vuelos retrasados creados exitosamente.');

  // Crear vuelos cancelados
  console.log('Iniciando la creación de vuelos cancelados...');
  for (let i = 0; i < 15; i++) {
    await createCancelledFlight();
  }
  console.log('Vuelos cancelados creados exitosamente.');

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
