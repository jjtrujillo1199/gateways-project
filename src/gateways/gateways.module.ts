import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GatewaysController } from './gateways.controller';
import { GatewaysService } from './gateways.service';
import { GatewayRepository } from './gateway.repository';
import { Gateway } from './entities/gateway.entity';
import { PaymentMethod } from './entities/payment-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gateway, PaymentMethod])],
  controllers: [GatewaysController],
  providers: [GatewaysService, GatewayRepository],
})
export class GatewaysModule {}
