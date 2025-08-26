import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { LicenseGuard, RequireFeature } from '../licensing/license.guard';

@ApiTags('calls')
@Controller('calls')
@UseGuards(LicenseGuard)
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Get()
  @RequireFeature('basic_calls')
  async getAllCalls() {
    return this.callsService.getAllCalls();
  }

  @Get(':id')
  @RequireFeature('basic_calls')
  async getCallById(@Param('id') id: string) {
    return this.callsService.getCallById(id);
  }

  @Post()
  @RequireFeature('basic_calls')
  async createCall(@Body() data: any) {
    return this.callsService.createCall(data);
  }
}