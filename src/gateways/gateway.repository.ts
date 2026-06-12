import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Gateway } from './entities/gateway.entity';
import { FilterGatewayDto } from './dto/filter-gateway.dto';

@Injectable()
export class GatewayRepository extends Repository<Gateway> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Gateway, dataSource.createEntityManager());
  }

  async findAllWithFilters(filters: FilterGatewayDto): Promise<Gateway[]> {
    const qb = this.createQueryBuilder('gateway').leftJoinAndSelect(
      'gateway.paymentMethods',
      'paymentMethods',
    );

    if (filters.name) {
      qb.andWhere('LOWER(gateway.name) LIKE :name', {
        name: `%${filters.name.toLowerCase()}%`,
      });
    }

    if (filters.status) {
      qb.andWhere('gateway.status = :status', { status: filters.status });
    }

    if (filters.type) {
      qb.andWhere('gateway.type = :type', { type: filters.type });
    }

    return qb.orderBy('gateway.createdAt', 'DESC').getMany();
  }

  async findOneWithMethods(id: string): Promise<Gateway | null> {
    return this.createQueryBuilder('gateway')
      .leftJoinAndSelect('gateway.paymentMethods', 'paymentMethods')
      .where('gateway.id = :id', { id })
      .getOne();
  }
}
