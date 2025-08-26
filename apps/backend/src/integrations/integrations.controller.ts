import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { LicenseGuard, RequireFeature, RequireLicenseType } from '../licensing/license.guard';

@ApiTags('integrations')
@Controller('integrations')
@UseGuards(LicenseGuard)
@RequireFeature('integrations')
@RequireLicenseType('enterprise')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  async getIntegrations() {
    return this.integrationsService.getIntegrations();
  }

  @Post('github')
  async connectGitHub(@Body() data: any) {
    return this.integrationsService.connectGitHub(data);
  }

  @Post('gitlab')
  async connectGitLab(@Body() data: any) {
    return this.integrationsService.connectGitLab(data);
  }

  @Post('bitbucket')
  async connectBitbucket(@Body() data: any) {
    return this.integrationsService.connectBitbucket(data);
  }
}