import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GatewayType, GatewayStatus } from '../entities/gateway.entity';
import { CreatePaymentMethodDto } from './create-payment-method.dto';

export class CreateGatewayDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  name: string;

  @IsEnum(GatewayType, {
    message: `El tipo debe ser uno de: ${Object.values(GatewayType).join(', ')}`,
  })
  type: GatewayType;

  @IsEnum(GatewayStatus, {
    message: `El estado debe ser uno de: ${Object.values(GatewayStatus).join(', ')}`,
  })
  status: GatewayStatus;

  @IsString()
  @IsNotEmpty({ message: 'El país es requerido' })
  @Length(2, 3, { message: 'El país debe ser un código ISO de 2 o 3 letras' })
  country: string;

  @IsNumber({}, { message: 'La tarifa de comisión debe ser un número' })
  @Min(0, { message: 'La tarifa de comisión mínimo es 0' })
  @Max(100, { message: 'La tarifa de comisión máximo es 100' })
  commissionRate: number;

  @IsArray({ message: 'Los métodos de pago deben ser un arreglo' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 método de pago' })
  @ArrayMaxSize(5, { message: 'No puede incluir más de 5 métodos de pago' })
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentMethodDto)
  paymentMethods: CreatePaymentMethodDto[];
}
