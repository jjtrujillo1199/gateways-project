import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del método de pago es requerido' })
  name: string;

  @IsNumber({}, { message: 'commissionRate debe ser un número' })
  @Min(0, { message: 'commissionRate mínimo es 0' })
  @Max(100, { message: 'commissionRate máximo es 100' })
  commissionRate: number;
}
