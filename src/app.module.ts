import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GatewaysModule } from './gateways/gateways.module';
import { Gateway } from './gateways/entities/gateway.entity';
import { PaymentMethod } from './gateways/entities/payment-method.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: 'gateway.db',
      autoSave: true,
      synchronize: true,
      logging: false,
      entities: [Gateway, PaymentMethod],
    }),
    AuthModule,
    GatewaysModule,
  ],
})
export class AppModule {}
