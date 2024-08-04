import { Module } from '@nestjs/common';
import { FareService } from './fare.service';
import { FareController } from './fare.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FareController],
  providers: [FareService],
})
export class FareModule {}
