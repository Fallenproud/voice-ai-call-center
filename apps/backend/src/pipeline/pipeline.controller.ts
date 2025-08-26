import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PipelineService } from './pipeline.service';
import { LicenseGuard, RequireFeature, RequireLicenseType } from '../licensing/license.guard';

@ApiTags('pipeline')
@Controller('pipeline')
@UseGuards(LicenseGuard)
export class PipelineController {
  constructor(private readonly pipelineService: PipelineService) {}

  @Get()
  @RequireFeature('basic_pipelines')
  async getAllPipelines() {
    return this.pipelineService.getAllPipelines();
  }

  @Post()
  @RequireFeature('basic_pipelines')
  async createPipeline(@Body() data: any) {
    return this.pipelineService.createPipeline(data);
  }

  @Post(':id/execute')
  @RequireFeature('basic_pipelines')
  async executePipeline(@Param('id') id: string, @Body() input: any) {
    return this.pipelineService.executePipeline(id, input);
  }

  @Post('advanced')
  @RequireFeature('advanced_pipelines')
  @RequireLicenseType('enterprise')
  async createAdvancedPipeline(@Body() data: any) {
    return this.pipelineService.createPipeline({ ...data, type: 'advanced' });
  }
}