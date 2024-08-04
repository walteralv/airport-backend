import { PartialType } from '@nestjs/swagger';
import { CreateBookingDetailDto } from './create-booking-detail.dto';

export class UpdateBookingDetailDto extends PartialType(CreateBookingDetailDto) {}
