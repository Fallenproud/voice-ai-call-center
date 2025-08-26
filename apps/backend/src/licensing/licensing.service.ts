import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import * as os from 'os';

export interface LicenseInfo {
  id: string;
  type: 'trial' | 'standard' | 'enterprise';
  status: 'active' | 'expired' | 'revoked';
  max_agents: number;
  max_calls_per_month: number;
  features: string[];
  expires_at?: string;
  activated_at: string;
  company_name?: string;
}

export interface LicenseValidationResult {
  valid: boolean;
  license?: LicenseInfo;
  error?: string;
}

@Injectable()
export class LicensingService {
  private readonly logger = new Logger(LicensingService.name);
  private licenseServerUrl: string;
  private currentLicense?: LicenseInfo;
  private machineFingerprint?: string;
  private licenseKey?: string;
  private validationCache = new Map<string, { result: LicenseValidationResult; timestamp: number }>();
  
  // Cache TTL: 5 minutes
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.licenseServerUrl = this.configService.get<string>('LICENSE_SERVER_URL') || 'http://localhost:3002';
    this.generateMachineFingerprint();
  }

  private generateMachineFingerprint(): void {
    try {
      const components = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.totalmem().toString(),
        JSON.stringify(os.cpus()[0]),
        // Get network interfaces MAC addresses
        ...Object.values(os.networkInterfaces())
          .flat()
          .filter(iface => iface && !iface.internal && iface.mac !== '00:00:00:00:00:00')
          .map(iface => iface!.mac)
          .slice(0, 3) // Limit to first 3 network interfaces
      ];

      const data = components.join('|');
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      this.machineFingerprint = `FP-${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}`;
      
      this.logger.debug(`Generated machine fingerprint: ${this.machineFingerprint}`);
    } catch (error) {
      this.logger.error('Failed to generate machine fingerprint:', error);
      // Fallback fingerprint
      this.machineFingerprint = `FP-${Date.now()}-${Math.random().toString(36).substring(7)}-fallback`;
    }
  }

  async activateLicense(licenseKey: string): Promise<LicenseValidationResult> {
    try {
      this.logger.log(`Attempting to activate license: ${licenseKey.substring(0, 8)}...`);

      const systemInfo = {
        os: `${os.platform()} ${os.release()}`,
        hostname: os.hostname(),
        cpu: os.cpus()[0]?.model || 'unknown',
        memory: os.totalmem(),
        network_interfaces: Object.values(os.networkInterfaces())
          .flat()
          .filter(iface => iface && !iface.internal)
          .map(iface => ({ mac: iface!.mac, family: iface!.family }))
      };

      const response = await firstValueFrom(
        this.httpService.post(`${this.licenseServerUrl}/api/license/activate`, {
          license_key: licenseKey,
          machine_fingerprint: this.machineFingerprint,
          system_info: systemInfo,
        })
      );

      const responseData = response.data as any;
      
      if (responseData.success) {
        this.currentLicense = responseData.license;
        this.licenseKey = licenseKey;
        this.machineFingerprint = responseData.machine_fingerprint;
        
        // Cache the result
        this.cacheValidationResult(licenseKey, { valid: true, license: this.currentLicense });
        
        this.logger.log(`License activated successfully: ${this.currentLicense.type}`);
        return { valid: true, license: this.currentLicense };
      } else {
        this.logger.error(`License activation failed: ${responseData.error}`);
        return { valid: false, error: responseData.error };
      }

    } catch (error) {
      this.logger.error('License activation error:', error);
      if (error.response) {
        return { valid: false, error: error.response.data?.error || 'License server error' };
      }
      return { valid: false, error: 'Unable to connect to license server' };
    }
  }

  async validateLicense(licenseKey?: string): Promise<LicenseValidationResult> {
    const keyToValidate = licenseKey || this.licenseKey;
    
    if (!keyToValidate) {
      return { valid: false, error: 'No license key provided' };
    }

    // Check cache first
    const cached = this.getCachedValidation(keyToValidate);
    if (cached) {
      this.logger.debug('Using cached license validation result');
      return cached;
    }

    try {
      this.logger.debug(`Validating license: ${keyToValidate.substring(0, 8)}...`);

      const response = await firstValueFrom(
        this.httpService.post(`${this.licenseServerUrl}/api/license/validate`, {
          license_key: keyToValidate,
          machine_fingerprint: this.machineFingerprint,
        })
      );

      const responseData = response.data as any;
      
      if (responseData.valid) {
        const result = { valid: true, license: responseData.license };
        this.currentLicense = responseData.license;
        this.licenseKey = keyToValidate;
        
        // Cache the result
        this.cacheValidationResult(keyToValidate, result);
        
        this.logger.debug(`License validation successful: ${this.currentLicense.type}`);
        return result;
      } else {
        const result = { valid: false, error: responseData.error };
        this.cacheValidationResult(keyToValidate, result);
        return result;
      }

    } catch (error) {
      this.logger.error('License validation error:', error);
      const result = { valid: false, error: 'Unable to validate license' };
      
      // Cache negative results for a shorter time (1 minute)
      this.cacheValidationResult(keyToValidate, result, 60 * 1000);
      
      return result;
    }
  }

  async sendHeartbeat(): Promise<boolean> {
    if (!this.licenseKey || !this.machineFingerprint) {
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.licenseServerUrl}/api/license/heartbeat`, {
          license_key: this.licenseKey,
          machine_fingerprint: this.machineFingerprint,
        })
      );

      const responseData = response.data as any;
      return responseData.success;
    } catch (error) {
      this.logger.error('License heartbeat failed:', error);
      return false;
    }
  }

  private cacheValidationResult(key: string, result: LicenseValidationResult, ttl?: number): void {
    this.validationCache.set(key, {
      result,
      timestamp: Date.now() + (ttl || this.CACHE_TTL),
    });
  }

  private getCachedValidation(key: string): LicenseValidationResult | null {
    const cached = this.validationCache.get(key);
    if (cached && cached.timestamp > Date.now()) {
      return cached.result;
    }
    
    // Remove expired cache entry
    if (cached) {
      this.validationCache.delete(key);
    }
    
    return null;
  }

  getCurrentLicense(): LicenseInfo | undefined {
    return this.currentLicense;
  }

  getMachineFingerprint(): string | undefined {
    return this.machineFingerprint;
  }

  hasFeature(feature: string): boolean {
    if (!this.currentLicense) {
      return false;
    }
    return this.currentLicense.features.includes(feature);
  }

  canUseAgents(requestedAgents: number): boolean {
    if (!this.currentLicense) {
      return false;
    }
    return requestedAgents <= this.currentLicense.max_agents;
  }

  canMakeCalls(callsThisMonth: number): boolean {
    if (!this.currentLicense) {
      return false;
    }
    return callsThisMonth < this.currentLicense.max_calls_per_month;
  }

  isLicenseExpired(): boolean {
    if (!this.currentLicense || !this.currentLicense.expires_at) {
      return false; // No expiration or no license
    }
    return new Date(this.currentLicense.expires_at) < new Date();
  }

  getLicenseStatus(): 'valid' | 'invalid' | 'expired' | 'unknown' {
    if (!this.currentLicense) {
      return 'unknown';
    }

    if (this.currentLicense.status !== 'active') {
      return 'invalid';
    }

    if (this.isLicenseExpired()) {
      return 'expired';
    }

    return 'valid';
  }

  // Initialize heartbeat interval
  startHeartbeat(intervalMs = 5 * 60 * 1000): void {
    setInterval(async () => {
      if (this.licenseKey) {
        const success = await this.sendHeartbeat();
        if (!success) {
          this.logger.warn('License heartbeat failed - license may be invalid');
        }
      }
    }, intervalMs);
  }
}

export default LicensingService;