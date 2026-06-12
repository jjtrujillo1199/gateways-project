import { IsOptional, IsString, IsEnum } from 'class-validator';
import { GatewayType, GatewayStatus } from '../entities/gateway.entity';

export class FilterGatewayDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(GatewayStatus)
  status?: GatewayStatus;

  @IsOptional()
  @IsEnum(GatewayType)
  type?: GatewayType;
}
