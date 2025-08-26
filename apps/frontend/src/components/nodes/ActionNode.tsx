'use client'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface ActionNodeProps {
  data: {
    label: string;
    actionType?: string;
    executing?: boolean;
    config?: {
      recipient?: string;
      message?: string;
    };
  };
  selected?: boolean;
}

const ActionNode: React.FC<ActionNodeProps> = ({ data, selected }) => {
  const { label, actionType = 'notify', executing = false, config = {} } = data;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'notify':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm0 0H9a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2z" />
          </svg>
        );
      case 'email':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'sms':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'webhook':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      case 'file':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-200 min-w-[180px]
      ${selected 
        ? 'border-primary shadow-glow bg-gradient-surface' 
        : 'border-warning/50 bg-surface hover:border-warning'
      }
      ${executing ? 'animate-pulse' : ''}
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-warning border-2 border-white"
      />

      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${executing ? 'bg-warning text-white animate-pulse' : 'bg-warning/20 text-warning'}
        `}>
          {getActionIcon(actionType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-xs text-text-muted capitalize">{actionType.replace('_', ' ')}</div>
          {config.recipient && (
            <div className="text-xs text-text-muted mt-1 truncate">To: {config.recipient}</div>
          )}
        </div>
      </div>
      
      {executing && (
        <div className="mt-2 text-xs text-warning">
          ● Executing action...
        </div>
      )}
    </div>
  );
};

export default ActionNode;