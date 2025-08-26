'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivatePage() {
  const [licenseKey, setLicenseKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const formatLicenseKey = (value: string) => {
    // Remove any existing hyphens and convert to uppercase
    const cleanValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // Format as XXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX
    const segments = [];
    if (cleanValue.length > 0) segments.push(cleanValue.substring(0, 3));
    if (cleanValue.length > 3) segments.push(cleanValue.substring(3, 9));
    if (cleanValue.length > 9) segments.push(cleanValue.substring(9, 15));
    if (cleanValue.length > 15) segments.push(cleanValue.substring(15, 21));
    if (cleanValue.length > 21) segments.push(cleanValue.substring(21, 27));
    
    return segments.join('-');
  };

  const handleLicenseKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseKey(e.target.value);
    setLicenseKey(formatted);
    setError('');
  };

  const validateLicenseFormat = (key: string): boolean => {
    const pattern = /^[A-Z]{3}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/;
    return pattern.test(key);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLicenseFormat(licenseKey)) {
      setError('Please enter a valid license key format (XXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call backend API to activate license
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/licensing/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ license_key: licenseKey }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setSuccess(true);
        
        // Store license info in localStorage for demo purposes
        // In production, this should be handled more securely
        localStorage.setItem('velora_license', JSON.stringify({
          key: licenseKey,
          license: data.license,
          activated_at: new Date().toISOString()
        }));

        // Redirect to dashboard after success
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'License activation failed');
      }
    } catch {
      setError('Unable to connect to license server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoLicense = () => {
    // Generate a demo license key for testing
    const demoKey = 'DEM-VELORA-DEMO01-TEST02-SAMPLE';
    setLicenseKey(demoKey);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="velora-card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">License Activated!</h1>
          <p className="text-text-muted mb-4">
            Your Velora Voice™ license has been successfully activated.
          </p>
          <p className="text-sm text-text-muted">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="velora-card max-w-md w-full p-8">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold font-jakarta">V</span>
          </div>
          <h1 className="text-2xl font-bold text-gradient font-jakarta mb-2">
            Velora Voice™
          </h1>
          <p className="text-text-muted">License Activation Required</p>
        </div>

        {/* Activation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="licenseKey" className="block text-sm font-medium text-text-primary mb-2">
              License Key
            </label>
            <input
              type="text"
              id="licenseKey"
              value={licenseKey}
              onChange={handleLicenseKeyChange}
              placeholder="XXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX"
              className="velora-input font-mono text-lg tracking-wider"
              maxLength={29} // XXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX = 29 chars
              required
            />
            <p className="text-xs text-text-muted mt-2">
              Enter your 27-character license key exactly as provided
            </p>
          </div>

          {error && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !validateLicenseFormat(licenseKey)}
            className="velora-button-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Activating...
              </span>
            ) : (
              'Activate License'
            )}
          </button>
        </form>

        {/* Demo License */}
        <div className="mt-8 pt-6 border-t border-surface-border">
          <div className="text-center">
            <p className="text-sm text-text-muted mb-3">
              Want to try the demo?
            </p>
            <button
              type="button"
              onClick={generateDemoLicense}
              className="velora-button-secondary text-sm"
            >
              Generate Demo License
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="mt-6 pt-6 border-t border-surface-border">
          <div className="text-center text-sm text-text-muted">
            <p>Need help? Contact support at</p>
            <a href="mailto:support@velora.com" className="text-primary hover:underline">
              support@velora.com
            </a>
          </div>
        </div>

        {/* License Info */}
        <div className="mt-6 p-4 bg-surface-elevated rounded-lg">
          <h3 className="text-sm font-semibold text-text-primary mb-2">License Types:</h3>
          <div className="space-y-2 text-xs text-text-muted">
            <div className="flex justify-between">
              <span>Trial (TRI-...):</span>
              <span>14 days, 2 agents, basic features</span>
            </div>
            <div className="flex justify-between">
              <span>Standard (STA-...):</span>
              <span>10 agents, core features</span>
            </div>
            <div className="flex justify-between">
              <span>Enterprise (ENT-...):</span>
              <span>100 agents, all features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}