/*
  Warnings:

  - A unique constraint covering the columns `[passport_number]` on the table `Passenger` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Passenger_passport_number_key" ON "Passenger"("passport_number");
