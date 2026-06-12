import { Injectable, NotFoundException } from '@nestjs/common';
import { GatewayRepository } from './gateway.repository';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { FilterGatewayDto } from './dto/filter-gateway.dto';
import { Gateway } from './entities/gateway.entity';

@Injectable()
export class GatewaysService {
  constructor(private readonly gatewayRepository: GatewayRepository) {}

  async findAll(filters: FilterGatewayDto): Promise<Gateway[]> {
    return this.gatewayRepository.findAllWithFilters(filters);
  }

  async findOne(id: string): Promise<Gateway> {
    const gateway = await this.gatewayRepository.findOneWithMethods(id);
    if (!gateway) {
      throw new NotFoundException(`Gateway con id "${id}" no encontrado`);
    }
    return gateway;
  }

  async create(dto: CreateGatewayDto): Promise<Gateway> {
    const gateway = this.gatewayRepository.create({
      name: dto.name,
      type: dto.type,
      status: dto.status,
      country: dto.country,
      commissionRate: dto.commissionRate,
      paymentMethods: dto.paymentMethods.map((pm) => ({
        name: pm.name,
        commissionRate: pm.commissionRate,
      })),
    });

    return this.gatewayRepository.save(gateway);
  }

  async update(id: string, dto: UpdateGatewayDto): Promise<Gateway> {
    const gateway = await this.findOne(id);

    if (dto.name !== undefined) gateway.name = dto.name;
    if (dto.type !== undefined) gateway.type = dto.type;
    if (dto.status !== undefined) gateway.status = dto.status;
    if (dto.country !== undefined) gateway.country = dto.country;
    if (dto.commissionRate !== undefined)
      gateway.commissionRate = dto.commissionRate;

    if (dto.paymentMethods !== undefined) {
      gateway.paymentMethods = dto.paymentMethods.map((pm) => ({
        name: pm.name,
        commissionRate: pm.commissionRate,
      })) as any;
    }

    return this.gatewayRepository.save(gateway);
  }

  async remove(id: string): Promise<void> {
    const gateway = await this.findOne(id);
    await this.gatewayRepository.remove(gateway);
  }
}
