import { Pool } from 'pg';
import crypto from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

interface License {
  id: string;
  license_key: string;
  license_key_hash: string;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  type: 'trial' | 'standard' | 'enterprise';
  max_agents: number;
  max_calls_per_month: number;
  features: string[];
  issued_at: Date;
  expires_at: Date | null;
  activated_at: Date | null;
  activation_count: number;
  max_activations: number;
  company_name?: string;
  contact_email?: string;
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

interface LicenseActivation {
  id: string;
  license_id: string;
  machine_fingerprint: string;
  activation_ip: string;
  user_agent: string;
  activated_at: Date;
  last_heartbeat: Date;
  status: 'active' | 'inactive';
}

export class LicenseModel {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.LICENSE_DB_URL || process.env.DATABASE_URL,
    });
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      // Create licenses table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS licenses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          license_key VARCHAR(255) UNIQUE NOT NULL,
          license_key_hash VARCHAR(255) UNIQUE NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          type VARCHAR(20) DEFAULT 'trial',
          max_agents INTEGER DEFAULT 5,
          max_calls_per_month INTEGER DEFAULT 1000,
          features JSONB DEFAULT '[]',
          issued_at TIMESTAMP DEFAULT NOW(),
          expires_at TIMESTAMP NULL,
          activated_at TIMESTAMP NULL,
          activation_count INTEGER DEFAULT 0,
          max_activations INTEGER DEFAULT 3,
          company_name VARCHAR(255) NULL,
          contact_email VARCHAR(255) NULL,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create license activations table
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS license_activations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
          machine_fingerprint VARCHAR(255) NOT NULL,
          activation_ip INET NOT NULL,
          user_agent TEXT,
          activated_at TIMESTAMP DEFAULT NOW(),
          last_heartbeat TIMESTAMP DEFAULT NOW(),
          status VARCHAR(20) DEFAULT 'active',
          UNIQUE(license_id, machine_fingerprint)
        )
      `);

      // Create indexes
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_licenses_key_hash ON licenses(license_key_hash)');
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status)');
      await this.pool.query('CREATE INDEX IF NOT EXISTS idx_activations_license_id ON license_activations(license_id)');

    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  // Generate a new license key
  generateLicenseKey(type: string = 'standard'): string {
    const prefix = type.substring(0, 3).toUpperCase();
    const segments = [];
    
    for (let i = 0; i < 4; i++) {
      const segment = Math.random().toString(36).substring(2, 8).toUpperCase();
      segments.push(segment);
    }
    
    return `${prefix}-${segments.join('-')}`;
  }

  // Hash license key for secure storage
  private hashLicenseKey(key: string): string {
    return crypto.SHA256(key + process.env.LICENSE_SECRET).toString();
  }

  // Create a new license
  async createLicense(data: Partial<License>): Promise<License> {
    const licenseKey = data.license_key || this.generateLicenseKey(data.type);
    const licenseKeyHash = this.hashLicenseKey(licenseKey);
    
    const features = data.features || this.getDefaultFeatures(data.type || 'trial');
    const expiresAt = data.expires_at || this.getDefaultExpiration(data.type || 'trial');

    const query = `
      INSERT INTO licenses (
        license_key, license_key_hash, type, max_agents, max_calls_per_month,
        features, expires_at, max_activations, company_name, contact_email, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      licenseKey,
      licenseKeyHash,
      data.type || 'trial',
      data.max_agents || this.getDefaultMaxAgents(data.type || 'trial'),
      data.max_calls_per_month || this.getDefaultMaxCalls(data.type || 'trial'),
      JSON.stringify(features),
      expiresAt,
      data.max_activations || 3,
      data.company_name,
      data.contact_email,
      JSON.stringify(data.metadata || {})
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Verify and activate license
  async activateLicense(
    licenseKey: string, 
    machineFingerprint: string, 
    activationIP: string, 
    userAgent: string
  ): Promise<{ success: boolean; license?: License; error?: string }> {
    try {
      const licenseKeyHash = this.hashLicenseKey(licenseKey);

      // Find license
      const licenseResult = await this.pool.query(
        'SELECT * FROM licenses WHERE license_key_hash = $1',
        [licenseKeyHash]
      );

      if (licenseResult.rows.length === 0) {
        return { success: false, error: 'Invalid license key' };
      }

      const license = licenseResult.rows[0];

      // Check license status
      if (license.status === 'revoked') {
        return { success: false, error: 'License has been revoked' };
      }

      if (license.status === 'expired') {
        return { success: false, error: 'License has expired' };
      }

      // Check expiration
      if (license.expires_at && new Date(license.expires_at) < new Date()) {
        await this.pool.query(
          'UPDATE licenses SET status = $1, updated_at = NOW() WHERE id = $2',
          ['expired', license.id]
        );
        return { success: false, error: 'License has expired' };
      }

      // Check existing activations
      const activationResult = await this.pool.query(
        'SELECT * FROM license_activations WHERE license_id = $1',
        [license.id]
      );

      // Check if already activated on this machine
      const existingActivation = activationResult.rows.find(
        a => a.machine_fingerprint === machineFingerprint
      );

      if (existingActivation) {
        // Update heartbeat
        await this.pool.query(
          'UPDATE license_activations SET last_heartbeat = NOW(), status = $1 WHERE id = $2',
          ['active', existingActivation.id]
        );
        return { success: true, license };
      }

      // Check activation limit
      const activeActivations = activationResult.rows.filter(a => a.status === 'active');
      if (activeActivations.length >= license.max_activations) {
        return { success: false, error: 'Maximum number of activations exceeded' };
      }

      // Create new activation
      await this.pool.query(`
        INSERT INTO license_activations (
          license_id, machine_fingerprint, activation_ip, user_agent
        ) VALUES ($1, $2, $3, $4)
      `, [license.id, machineFingerprint, activationIP, userAgent]);

      // Update license
      await this.pool.query(`
        UPDATE licenses SET 
          status = 'active',
          activated_at = COALESCE(activated_at, NOW()),
          activation_count = activation_count + 1,
          updated_at = NOW()
        WHERE id = $1
      `, [license.id]);

      // Get updated license
      const updatedResult = await this.pool.query(
        'SELECT * FROM licenses WHERE id = $1',
        [license.id]
      );

      return { success: true, license: updatedResult.rows[0] };

    } catch (error) {
      console.error('License activation error:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Validate existing license
  async validateLicense(
    licenseKey: string, 
    machineFingerprint: string
  ): Promise<{ valid: boolean; license?: License; error?: string }> {
    try {
      const licenseKeyHash = this.hashLicenseKey(licenseKey);

      const result = await this.pool.query(`
        SELECT l.*, la.last_heartbeat, la.status as activation_status
        FROM licenses l
        LEFT JOIN license_activations la ON l.id = la.license_id 
          AND la.machine_fingerprint = $2
        WHERE l.license_key_hash = $1
      `, [licenseKeyHash, machineFingerprint]);

      if (result.rows.length === 0) {
        return { valid: false, error: 'Invalid license key' };
      }

      const license = result.rows[0];

      // Check license status
      if (license.status !== 'active') {
        return { valid: false, error: `License is ${license.status}` };
      }

      // Check expiration
      if (license.expires_at && new Date(license.expires_at) < new Date()) {
        return { valid: false, error: 'License has expired' };
      }

      // Check if activated on this machine
      if (!license.activation_status || license.activation_status !== 'active') {
        return { valid: false, error: 'License not activated on this machine' };
      }

      // Update heartbeat
      await this.pool.query(
        'UPDATE license_activations SET last_heartbeat = NOW() WHERE license_id = $1 AND machine_fingerprint = $2',
        [license.id, machineFingerprint]
      );

      return { valid: true, license };

    } catch (error) {
      console.error('License validation error:', error);
      return { valid: false, error: 'Internal server error' };
    }
  }

  // Helper methods for default values
  private getDefaultFeatures(type: string): string[] {
    const features = {
      trial: ['basic_calls', 'basic_analytics'],
      standard: ['basic_calls', 'basic_analytics', 'call_recording', 'basic_pipelines'],
      enterprise: ['basic_calls', 'advanced_analytics', 'call_recording', 'advanced_pipelines', 'integrations', 'custom_branding', 'priority_support']
    };
    return features[type as keyof typeof features] || features.trial;
  }

  private getDefaultExpiration(type: string): Date | null {
    if (type === 'trial') {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 14); // 14 day trial
      return expiry;
    }
    return null; // No expiration for paid licenses
  }

  private getDefaultMaxAgents(type: string): number {
    const limits = { trial: 2, standard: 10, enterprise: 100 };
    return limits[type as keyof typeof limits] || 2;
  }

  private getDefaultMaxCalls(type: string): number {
    const limits = { trial: 100, standard: 5000, enterprise: 50000 };
    return limits[type as keyof typeof limits] || 100;
  }
}

export default LicenseModel;