import crypto from 'crypto';
import { Request } from 'express';

interface SystemInfo {
  os?: string;
  hostname?: string;
  cpu?: string;
  memory?: number;
  network_interfaces?: any[];
}

export function generateMachineFingerprint(systemInfo?: SystemInfo, req?: Request): string {
  const components: string[] = [];

  // Use system info if provided
  if (systemInfo) {
    if (systemInfo.os) components.push(systemInfo.os);
    if (systemInfo.hostname) components.push(systemInfo.hostname);
    if (systemInfo.cpu) components.push(systemInfo.cpu);
    if (systemInfo.memory) components.push(systemInfo.memory.toString());
    if (systemInfo.network_interfaces) {
      // Use MAC addresses from network interfaces
      const macAddresses = systemInfo.network_interfaces
        .map((iface: any) => iface.mac || iface.address)
        .filter(Boolean)
        .sort();
      components.push(...macAddresses);
    }
  }

  // Fallback to request-based fingerprinting
  if (req && components.length === 0) {
    // Use headers that are relatively stable
    const userAgent = req.get('User-Agent') || '';
    const acceptLanguage = req.get('Accept-Language') || '';
    const acceptEncoding = req.get('Accept-Encoding') || '';
    const connection = req.get('Connection') || '';
    
    components.push(userAgent, acceptLanguage, acceptEncoding, connection);
    
    // Add IP address (but note this can change)
    const ip = req.ip || req.connection.remoteAddress || '';
    components.push(ip);
  }

  // If still no components, generate a random fingerprint
  if (components.length === 0) {
    components.push(
      Date.now().toString(),
      Math.random().toString(36),
      'fallback-fingerprint'
    );
  }

  // Create hash from components
  const data = components.join('|');
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  
  // Return a formatted fingerprint
  return `FP-${hash.substring(0, 8)}-${hash.substring(8, 16)}-${hash.substring(16, 24)}`;
}

export function validateFingerprint(fingerprint: string): boolean {
  // Check format: FP-XXXXXXXX-XXXXXXXX-XXXXXXXX
  const pattern = /^FP-[a-f0-9]{8}-[a-f0-9]{8}-[a-f0-9]{8}$/i;
  return pattern.test(fingerprint);
}

export function isValidLicenseKey(key: string): boolean {
  // Check format: ABC-XXXXXX-XXXXXX-XXXXXX-XXXXXX
  const pattern = /^[A-Z]{3}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/;
  return pattern.test(key);
}