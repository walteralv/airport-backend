import { PartialType } from '@nestjs/swagger';
import { CreateFlightFareDto } from './create-flight-fare.dto';

export class UpdateFlightFareDto extends PartialType(CreateFlightFareDto) {}
