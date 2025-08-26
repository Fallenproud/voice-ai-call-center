'use client'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface APINodeProps {
  data: {
    label: string;
    apiType?: string;
    executing?: boolean;
    config?: {
      method?: string;
      url?: string;
      headers?: Record<string, string>;
    };
  };
  selected?: boolean;
}

const APINode: React.FC<APINodeProps> = ({ data, selected }) => {
  const { label, apiType = 'rest', executing = false, config = {} } = data;

  const getAPIIcon = (type: string) => {
    switch (type) {
      case 'rest':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        );
      case 'graphql':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
    }
  };

  const getMethodColor = (method?: string) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'text-success';
      case 'POST':
        return 'text-primary';
      case 'PUT':
        return 'text-warning';
      case 'DELETE':
        return 'text-error';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-200 min-w-[200px]
      ${selected 
        ? 'border-primary shadow-glow bg-gradient-surface' 
        : 'border-info/50 bg-surface hover:border-info'
      }
      ${executing ? 'animate-pulse' : ''}
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-info border-2 border-white"
      />

      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${executing ? 'bg-info text-white animate-pulse' : 'bg-info/20 text-info'}
        `}>
          {getAPIIcon(apiType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-xs text-text-muted capitalize">{apiType.replace('_', ' ')}</div>
          {config.method && (
            <div className={`text-xs font-mono font-semibold mt-1 ${getMethodColor(config.method)}`}>
              {config.method.toUpperCase()}
            </div>
          )}
        </div>
      </div>
      
      {executing && (
        <div className="mt-2 text-xs text-info">
          ● Making API call...
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-info border-2 border-white"
      />
    </div>
  );
};

export default APINode;