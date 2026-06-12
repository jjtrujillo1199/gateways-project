import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateGatewayDto } from './create-gateway.dto';
import { CreatePaymentMethodDto } from './create-payment-method.dto';

export class UpdateGatewayDto extends PartialType(CreateGatewayDto) {
  @IsOptional()
  @IsArray({ message: 'paymentMethods debe ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 método de pago' })
  @ArrayMaxSize(5, { message: 'No puede incluir más de 5 métodos de pago' })
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentMethodDto)
  paymentMethods?: CreatePaymentMethodDto[];
}
