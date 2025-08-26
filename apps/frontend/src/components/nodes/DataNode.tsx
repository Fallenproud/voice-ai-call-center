'use client'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface DataNodeProps {
  data: {
    label: string;
    dataType?: string;
    executing?: boolean;
    config?: {
      operation?: string;
      fields?: string[];
    };
  };
  selected?: boolean;
}

const DataNode: React.FC<DataNodeProps> = ({ data, selected }) => {
  const { label, dataType = 'transform', executing = false, config = {} } = data;

  const getDataIcon = (type: string) => {
    switch (type) {
      case 'transform':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        );
      case 'filter':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        );
      case 'aggregate':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'extract':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-200 min-w-[200px]
      ${selected 
        ? 'border-primary shadow-glow bg-gradient-surface' 
        : 'border-accent/50 bg-surface hover:border-accent'
      }
      ${executing ? 'animate-pulse' : ''}
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-accent border-2 border-white"
      />

      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${executing ? 'bg-accent text-white animate-pulse' : 'bg-accent/20 text-accent'}
        `}>
          {getDataIcon(dataType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-xs text-text-muted capitalize">{dataType.replace('_', ' ')}</div>
          {config.operation && (
            <div className="text-xs text-text-muted mt-1">Op: {config.operation}</div>
          )}
        </div>
      </div>
      
      {executing && (
        <div className="mt-2 text-xs text-accent">
          ● Processing data...
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-accent border-2 border-white"
      />
    </div>
  );
};

export default DataNode;