import { Module } from '@nestjs/common';
import { StopOverService } from './stop-over.service';
import { StopOverController } from './stop-over.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StopOverController],
  providers: [StopOverService],
})
export class StopOverModule {}
