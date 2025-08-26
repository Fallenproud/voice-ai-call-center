import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LicensingService, LicenseValidationResult } from './licensing.service';

class ActivateLicenseDto {
  license_key: string;
}

class ValidateLicenseDto {
  license_key?: string;
}

@ApiTags('licensing')
@Controller('licensing')
export class LicensingController {
  constructor(private readonly licensingService: LicensingService) {}

  @Post('activate')
  @ApiOperation({ summary: 'Activate a license key' })
  @ApiBody({ type: ActivateLicenseDto })
  @ApiResponse({ status: 200, description: 'License activated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid license key or activation failed' })
  async activateLicense(@Body() body: ActivateLicenseDto): Promise<LicenseValidationResult> {
    const { license_key } = body;
    
    if (!license_key) {
      throw new HttpException('License key is required', HttpStatus.BAD_REQUEST);
    }

    const result = await this.licensingService.activateLicense(license_key);
    
    if (!result.valid) {
      throw new HttpException(result.error || 'License activation failed', HttpStatus.BAD_REQUEST);
    }

    return result;
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a license key' })
  @ApiBody({ type: ValidateLicenseDto })
  @ApiResponse({ status: 200, description: 'License validation result' })
  async validateLicense(@Body() body: ValidateLicenseDto): Promise<LicenseValidationResult> {
    const result = await this.licensingService.validateLicense(body.license_key);
    return result;
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current license status' })
  @ApiResponse({ status: 200, description: 'Current license status' })
  async getLicenseStatus() {
    const currentLicense = this.licensingService.getCurrentLicense();
    const status = this.licensingService.getLicenseStatus();
    
    return {
      status,
      license: currentLicense ? {
        id: currentLicense.id,
        type: currentLicense.type,
        status: currentLicense.status,
        max_agents: currentLicense.max_agents,
        max_calls_per_month: currentLicense.max_calls_per_month,
        features: currentLicense.features,
        expires_at: currentLicense.expires_at,
        activated_at: currentLicense.activated_at,
        company_name: currentLicense.company_name,
      } : null,
      machine_fingerprint: this.licensingService.getMachineFingerprint(),
    };
  }

  @Get('features')
  @ApiOperation({ summary: 'Get available features for current license' })
  @ApiResponse({ status: 200, description: 'Available features' })
  async getFeatures() {
    const currentLicense = this.licensingService.getCurrentLicense();
    
    if (!currentLicense) {
      return {
        features: [],
        limits: {
          max_agents: 0,
          max_calls_per_month: 0,
        },
        status: 'no_license'
      };
    }

    return {
      features: currentLicense.features,
      limits: {
        max_agents: currentLicense.max_agents,
        max_calls_per_month: currentLicense.max_calls_per_month,
      },
      status: this.licensingService.getLicenseStatus(),
      type: currentLicense.type,
    };
  }

  @Post('heartbeat')
  @ApiOperation({ summary: 'Send license heartbeat' })
  @ApiResponse({ status: 200, description: 'Heartbeat sent successfully' })
  async sendHeartbeat() {
    const success = await this.licensingService.sendHeartbeat();
    
    return {
      success,
      message: success ? 'Heartbeat successful' : 'Heartbeat failed',
      timestamp: new Date().toISOString(),
    };
  }
}

export default LicensingController;