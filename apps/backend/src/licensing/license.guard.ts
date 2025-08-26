import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LicensingService } from './licensing.service';

// Decorator to require specific features
export const RequireFeature = (feature: string) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('required_feature', feature, descriptor.value);
    } else {
      Reflect.defineMetadata('required_feature', feature, target);
    }
  };
};

// Decorator to require specific license type
export const RequireLicenseType = (type: 'trial' | 'standard' | 'enterprise') => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('required_license_type', type, descriptor.value);
    } else {
      Reflect.defineMetadata('required_license_type', type, target);
    }
  };
};

// Decorator to skip license check
export const SkipLicenseCheck = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata('skip_license_check', true, descriptor.value);
    } else {
      Reflect.defineMetadata('skip_license_check', true, target);
    }
  };
};

@Injectable()
export class LicenseGuard implements CanActivate {
  private readonly logger = new Logger(LicenseGuard.name);

  constructor(
    private readonly licensingService: LicensingService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const controller = context.getClass();

    // Check if license check should be skipped
    const skipCheck = this.reflector.get<boolean>('skip_license_check', handler) ||
                     this.reflector.get<boolean>('skip_license_check', controller);

    if (skipCheck) {
      this.logger.debug('Skipping license check for this endpoint');
      return true;
    }

    // Get required feature and license type
    const requiredFeature = this.reflector.get<string>('required_feature', handler) ||
                           this.reflector.get<string>('required_feature', controller);

    const requiredLicenseType = this.reflector.get<'trial' | 'standard' | 'enterprise'>(
      'required_license_type', handler
    ) || this.reflector.get<'trial' | 'standard' | 'enterprise'>('required_license_type', controller);

    // Validate license
    const validationResult = await this.licensingService.validateLicense();
    
    if (!validationResult.valid) {
      this.logger.warn(`License validation failed: ${validationResult.error}`);
      throw new UnauthorizedException({
        message: 'Valid license required',
        error: validationResult.error,
        code: 'LICENSE_INVALID'
      });
    }

    const license = validationResult.license!;

    // Check license status
    if (license.status !== 'active') {
      this.logger.warn(`License not active: ${license.status}`);
      throw new UnauthorizedException({
        message: 'Active license required',
        error: `License is ${license.status}`,
        code: 'LICENSE_NOT_ACTIVE'
      });
    }

    // Check expiration
    if (this.licensingService.isLicenseExpired()) {
      this.logger.warn('License has expired');
      throw new UnauthorizedException({
        message: 'License has expired',
        error: 'Please renew your license',
        code: 'LICENSE_EXPIRED'
      });
    }

    // Check required feature
    if (requiredFeature && !this.licensingService.hasFeature(requiredFeature)) {
      this.logger.warn(`Required feature not available: ${requiredFeature}`);
      throw new UnauthorizedException({
        message: 'Feature not available in your license',
        error: `Required feature: ${requiredFeature}`,
        code: 'FEATURE_NOT_AVAILABLE',
        required_feature: requiredFeature,
        available_features: license.features
      });
    }

    // Check required license type
    if (requiredLicenseType) {
      const licenseTypeHierarchy = {
        trial: 0,
        standard: 1,
        enterprise: 2
      };

      const currentLevel = licenseTypeHierarchy[license.type];
      const requiredLevel = licenseTypeHierarchy[requiredLicenseType];

      if (currentLevel < requiredLevel) {
        this.logger.warn(`Insufficient license type: ${license.type} < ${requiredLicenseType}`);
        throw new UnauthorizedException({
          message: 'Higher license tier required',
          error: `Required: ${requiredLicenseType}, Current: ${license.type}`,
          code: 'INSUFFICIENT_LICENSE_TYPE',
          current_type: license.type,
          required_type: requiredLicenseType
        });
      }
    }

    // Add license info to request context
    const request = context.switchToHttp().getRequest();
    request.license = license;
    request.licensing = {
      hasFeature: (feature: string) => this.licensingService.hasFeature(feature),
      canUseAgents: (count: number) => this.licensingService.canUseAgents(count),
      canMakeCalls: (count: number) => this.licensingService.canMakeCalls(count),
    };

    this.logger.debug(`License check passed for ${license.type} license`);
    return true;
  }
}

// Global license guard decorator
export const LicenseProtected = () => {
  return (target: any) => {
    // This will be applied at the controller level
    Reflect.defineMetadata('license_protected', true, target);
  };
};