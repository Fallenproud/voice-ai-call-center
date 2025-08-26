import { Router, Request, Response } from 'express';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';
import { LicenseModel } from '../models/license';
import { generateMachineFingerprint } from '../utils/fingerprint';

const router = Router();
const licenseModel = new LicenseModel();

// Rate limiting for activation endpoints
const activationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many activation attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schemas
const activationSchema = Joi.object({
  license_key: Joi.string().required().pattern(/^[A-Z]{3}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/),
  machine_fingerprint: Joi.string().optional(),
  system_info: Joi.object({
    os: Joi.string(),
    hostname: Joi.string(),
    cpu: Joi.string(),
    memory: Joi.number(),
    network_interfaces: Joi.array()
  }).optional()
});

const validationSchema = Joi.object({
  license_key: Joi.string().required(),
  machine_fingerprint: Joi.string().optional()
});

const licenseCreationSchema = Joi.object({
  type: Joi.string().valid('trial', 'standard', 'enterprise').default('trial'),
  max_agents: Joi.number().min(1).max(1000).optional(),
  max_calls_per_month: Joi.number().min(1).optional(),
  features: Joi.array().items(Joi.string()).optional(),
  expires_at: Joi.date().optional(),
  max_activations: Joi.number().min(1).max(100).default(3),
  company_name: Joi.string().max(255).optional(),
  contact_email: Joi.string().email().optional(),
  metadata: Joi.object().optional()
});

// POST /api/license/activate - Activate a license
router.post('/activate', activationLimiter, async (req: Request, res: Response) => {
  try {
    const { error, value } = activationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { license_key, machine_fingerprint, system_info } = value;
    
    // Generate machine fingerprint if not provided
    const fingerprint = machine_fingerprint || generateMachineFingerprint(system_info, req);
    
    const activationIP = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    const result = await licenseModel.activateLicense(
      license_key,
      fingerprint,
      activationIP,
      userAgent
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    const { license } = result;
    
    // Return activation success with license details (exclude sensitive data)
    res.json({
      success: true,
      message: 'License activated successfully',
      license: {
        id: license!.id,
        type: license!.type,
        status: license!.status,
        max_agents: license!.max_agents,
        max_calls_per_month: license!.max_calls_per_month,
        features: typeof license!.features === 'string' ? JSON.parse(license!.features) : license!.features,
        expires_at: license!.expires_at,
        activated_at: license!.activated_at,
        company_name: license!.company_name
      },
      machine_fingerprint: fingerprint
    });

  } catch (error) {
    console.error('License activation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/license/validate - Validate an existing license
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { error, value } = validationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        valid: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const { license_key, machine_fingerprint } = value;
    
    // Generate machine fingerprint if not provided
    const fingerprint = machine_fingerprint || generateMachineFingerprint(undefined, req);

    const result = await licenseModel.validateLicense(license_key, fingerprint);

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.error
      });
    }

    const { license } = result;

    res.json({
      valid: true,
      license: {
        id: license!.id,
        type: license!.type,
        status: license!.status,
        max_agents: license!.max_agents,
        max_calls_per_month: license!.max_calls_per_month,
        features: typeof license!.features === 'string' ? JSON.parse(license!.features) : license!.features,
        expires_at: license!.expires_at,
        activated_at: license!.activated_at,
        company_name: license!.company_name
      }
    });

  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/license/create - Create a new license (admin only)
router.post('/create', async (req: Request, res: Response) => {
  try {
    // TODO: Add admin authentication middleware
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { error, value } = licenseCreationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const license = await licenseModel.createLicense(value);

    res.json({
      success: true,
      message: 'License created successfully',
      license: {
        id: license.id,
        license_key: license.license_key, // Only return key on creation
        type: license.type,
        status: license.status,
        max_agents: license.max_agents,
        max_calls_per_month: license.max_calls_per_month,
        features: typeof license.features === 'string' ? JSON.parse(license.features) : license.features,
        expires_at: license.expires_at,
        max_activations: license.max_activations,
        company_name: license.company_name,
        contact_email: license.contact_email,
        created_at: license.created_at
      }
    });

  } catch (error) {
    console.error('License creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/license/info/:licenseKey - Get license information (without activation)
router.get('/info/:licenseKey', async (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.params;
    
    if (!licenseKey.match(/^[A-Z]{3}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid license key format'
      });
    }

    // For security, we'll use a simulated info response
    // In a real implementation, you might query basic info without sensitive data
    res.json({
      success: true,
      info: {
        format_valid: true,
        type: licenseKey.startsWith('TRI') ? 'trial' : 
              licenseKey.startsWith('STA') ? 'standard' : 'enterprise',
        // Don't expose actual license details without activation
      }
    });

  } catch (error) {
    console.error('License info error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/license/heartbeat - License heartbeat (keep-alive)
router.post('/heartbeat', async (req: Request, res: Response) => {
  try {
    const { license_key, machine_fingerprint } = req.body;
    
    if (!license_key || !machine_fingerprint) {
      return res.status(400).json({
        success: false,
        error: 'License key and machine fingerprint required'
      });
    }

    const result = await licenseModel.validateLicense(license_key, machine_fingerprint);
    
    res.json({
      success: result.valid,
      valid: result.valid,
      error: result.error
    });

  } catch (error) {
    console.error('License heartbeat error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export { router as licenseRoutes };