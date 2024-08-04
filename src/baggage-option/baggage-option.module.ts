import { Module } from '@nestjs/common';
import { BaggageOptionService } from './baggage-option.service';
import { BaggageOptionController } from './baggage-option.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BaggageOptionController],
  providers: [BaggageOptionService],
})
export class BaggageOptionModule {}
