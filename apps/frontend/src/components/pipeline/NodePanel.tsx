'use client'

import React from 'react';

interface NodePanelProps {
  onAddNode: (nodeType: string) => void;
}

const NodePanel: React.FC<NodePanelProps> = ({ onAddNode }) => {
  const nodeCategories = [
    {
      title: 'Triggers',
      nodes: [
        {
          type: 'trigger',
          label: 'Call Trigger',
          description: 'Triggered when a call is received',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          ),
          color: 'success'
        }
      ]
    },
    {
      title: 'AI & Processing',
      nodes: [
        {
          type: 'ai',
          label: 'AI Analysis',
          description: 'AI-powered processing and analysis',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          ),
          color: 'primary'
        }
      ]
    },
    {
      title: 'Data Operations',
      nodes: [
        {
          type: 'data',
          label: 'Data Transform',
          description: 'Process and transform data',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          ),
          color: 'accent'
        }
      ]
    },
    {
      title: 'Integrations',
      nodes: [
        {
          type: 'api',
          label: 'API Call',
          description: 'Make HTTP/REST API calls',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          ),
          color: 'info'
        }
      ]
    },
    {
      title: 'Actions',
      nodes: [
        {
          type: 'action',
          label: 'Send Notification',
          description: 'Send notifications or alerts',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zm0 0H9a2 2 0 01-2-2V9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2z" />
            </svg>
          ),
          color: 'warning'
        }
      ]
    }
  ];

  const colorClasses = {
    success: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
    primary: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20',
    info: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
    warning: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  };

  return (
    <div className="w-64 bg-surface border-r border-surface-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-surface-border">
        <h3 className="text-lg font-semibold text-text-primary font-jakarta">
          Node Library
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Drag nodes onto the canvas to build your pipeline
        </p>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {nodeCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
              {category.title}
            </h4>
            <div className="space-y-2">
              {category.nodes.map((node, nodeIndex) => (
                <button
                  key={nodeIndex}
                  onClick={() => onAddNode(node.type)}
                  className={`
                    w-full p-3 rounded-lg border transition-all duration-200 text-left
                    ${colorClasses[node.color as keyof typeof colorClasses]}
                    hover:scale-105 hover:shadow-md
                  `}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', node.type);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {node.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">
                        {node.label}
                      </div>
                      <div className="text-xs opacity-80 truncate">
                        {node.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-surface-border">
        <div className="text-xs text-text-muted text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Tip:</span>
          </div>
          <p>
            Click to add nodes or drag them directly to the canvas
          </p>
        </div>
      </div>
    </div>
  );
};

export default NodePanel;