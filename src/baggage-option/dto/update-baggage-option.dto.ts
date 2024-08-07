import { PartialType } from '@nestjs/mapped-types';
import { CreateBaggageOptionDto } from './create-baggage-option.dto';

export class UpdateBaggageOptionDto extends PartialType(
  CreateBaggageOptionDto,
) {}
