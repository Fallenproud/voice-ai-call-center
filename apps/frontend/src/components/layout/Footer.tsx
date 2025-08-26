'use client'

import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-surface border-t border-surface-border ${className}`}>
      <div className="flex items-center justify-between h-12 px-6">
        {/* Left side - Status */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full pulse-glow"></div>
            <span className="text-text-muted">Connected</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-text-muted">Last sync: 2 min ago</span>
          </div>

          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-text-muted">Active calls: 3</span>
          </div>
        </div>

        {/* Right side - Info */}
        <div className="flex items-center space-x-6 text-sm text-text-muted">
          <span>Version 1.0.0</span>
          
          <div className="flex items-center space-x-1">
            <span>©</span>
            <span className="text-gradient font-semibold">Velora Voice™</span>
          </div>

          {/* System Resources */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1 bg-surface-border rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-success"></div>
              </div>
              <span className="text-xs">CPU: 75%</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1 bg-surface-border rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-accent"></div>
              </div>
              <span className="text-xs">Memory: 50%</span>
            </div>
          </div>

          {/* License Status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs">Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;