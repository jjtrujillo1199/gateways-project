import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { FilterGatewayDto } from './dto/filter-gateway.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('gateways')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Get()
  async findAll(@Query() filters: FilterGatewayDto) {
    const data = await this.gatewaysService.findAll(filters);
    return {
      success: true,
      message: 'Gateways retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.gatewaysService.findOne(id);
    return {
      success: true,
      message: 'Gateway retrieved successfully',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGatewayDto) {
    const data = await this.gatewaysService.create(dto);
    return {
      success: true,
      message: 'Gateway created successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateGatewayDto) {
    const data = await this.gatewaysService.update(id, dto);
    return {
      success: true,
      message: 'Gateway updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.gatewaysService.remove(id);
    return {
      success: true,
      message: 'Gateway deleted successfully',
      data: null,
    };
  }
}
