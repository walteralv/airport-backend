// src/stopover/dto/update-stopover.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateStopOverDto } from './create-stop-over.dto';

export class UpdateStopOverDto extends PartialType(CreateStopOverDto) {}
