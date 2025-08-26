'use client'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface TriggerNodeProps {
  data: {
    label: string;
    triggerType?: string;
    executing?: boolean;
    config?: Record<string, unknown>;
  };
  selected?: boolean;
}

const TriggerNode: React.FC<TriggerNodeProps> = ({ data, selected }) => {
  const { label, triggerType = 'call_received', executing = false } = data;

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'call_received':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'schedule':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'webhook':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
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
        : 'border-success/50 bg-surface hover:border-success'
      }
      ${executing ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${executing ? 'bg-success text-white animate-pulse' : 'bg-success/20 text-success'}
        `}>
          {getTriggerIcon(triggerType)}
        </div>
        <div>
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-xs text-text-muted capitalize">{triggerType.replace('_', ' ')}</div>
        </div>
      </div>
      
      {executing && (
        <div className="mt-2 text-xs text-success">
          ● Executing...
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-success border-2 border-white"
      />
    </div>
  );
};

export default TriggerNode;