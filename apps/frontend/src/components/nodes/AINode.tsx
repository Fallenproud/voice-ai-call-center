'use client'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface AINodeProps {
  data: {
    label: string;
    aiType?: string;
    executing?: boolean;
    config?: {
      model?: string;
      prompt?: string;
    };
  };
  selected?: boolean;
}

const AINode: React.FC<AINodeProps> = ({ data, selected }) => {
  const { label, aiType = 'classification', executing = false, config = {} } = data;

  const getAIIcon = (type: string) => {
    switch (type) {
      case 'classification':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m0 0V3a2 2 0 012-2h2a2 2 0 012 2v2" />
          </svg>
        );
      case 'sentiment_analysis':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'text_generation':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
    }
  };

  return (
    <div className={`
      px-4 py-3 shadow-lg rounded-lg border-2 transition-all duration-200 min-w-[200px]
      ${selected 
        ? 'border-primary shadow-glow bg-gradient-surface' 
        : 'border-primary/50 bg-surface hover:border-primary'
      }
      ${executing ? 'animate-pulse' : ''}
    `}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-white"
      />

      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${executing ? 'bg-primary text-white animate-pulse' : 'bg-primary/20 text-primary'}
        `}>
          {getAIIcon(aiType)}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-text-primary">{label}</div>
          <div className="text-xs text-text-muted capitalize">{aiType.replace('_', ' ')}</div>
          {config.model && (
            <div className="text-xs text-text-muted mt-1">Model: {config.model}</div>
          )}
        </div>
      </div>
      
      {executing && (
        <div className="mt-2 text-xs text-primary">
          ● Processing with AI...
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-white"
      />
    </div>
  );
};

export default AINode;