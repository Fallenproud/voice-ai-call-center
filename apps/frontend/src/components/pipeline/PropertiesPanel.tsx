'use client'

import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, newData: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose
}) => {
  const [localData, setLocalData] = useState(node.data);

  useEffect(() => {
    setLocalData(node.data);
  }, [node]);

  const handleUpdate = (field: string, value: unknown) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    onUpdateNode(node.id, newData);
  };

  const handleConfigUpdate = (configField: string, value: unknown) => {
    const currentConfig = localData.config || {};
    const newConfig = { ...currentConfig, [configField]: value };
    const newData = { ...localData, config: newConfig };
    setLocalData(newData);
    onUpdateNode(node.id, newData);
  };

  const getConfigValue = (key: string): string => {
    const config = localData.config as Record<string, unknown> | undefined;
    return String(config?.[key] || '');
  };

  const renderTypeSpecificFields = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Trigger Type
              </label>
              <select
                value={String(localData.triggerType || 'call_received')}
                onChange={(e) => handleUpdate('triggerType', e.target.value)}
                className="velora-input"
              >
                <option value="call_received">Call Received</option>
                <option value="schedule">Scheduled</option>
                <option value="webhook">Webhook</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            {localData.triggerType === 'schedule' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Schedule Pattern
                </label>
                <input
                  type="text"
                  placeholder="0 9 * * 1-5"
                  value={getConfigValue('schedule')}
                  onChange={(e) => handleConfigUpdate('schedule', e.target.value)}
                  className="velora-input font-mono"
                />
                <p className="text-xs text-text-muted mt-1">Cron expression format</p>
              </div>
            )}
            
            {localData.triggerType === 'webhook' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/webhook"
                  value={getConfigValue('webhookUrl')}
                  onChange={(e) => handleConfigUpdate('webhookUrl', e.target.value)}
                  className="velora-input"
                />
              </div>
            )}
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                AI Type
              </label>
              <select
                value={String(localData.aiType || 'classification')}
                onChange={(e) => handleUpdate('aiType', e.target.value)}
                className="velora-input"
              >
                <option value="classification">Classification</option>
                <option value="sentiment_analysis">Sentiment Analysis</option>
                <option value="text_generation">Text Generation</option>
                <option value="entity_extraction">Entity Extraction</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Model
              </label>
              <select
                value={getConfigValue('model') || 'gpt-3.5-turbo'}
                onChange={(e) => handleConfigUpdate('model', e.target.value)}
                className="velora-input"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude 3</option>
                <option value="local-llm">Local LLM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Prompt
              </label>
              <textarea
                rows={4}
                placeholder="Enter your AI prompt here..."
                value={getConfigValue('prompt')}
                onChange={(e) => handleConfigUpdate('prompt', e.target.value)}
                className="velora-input"
              />
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Operation Type
              </label>
              <select
                value={String(localData.dataType || 'transform')}
                onChange={(e) => handleUpdate('dataType', e.target.value)}
                className="velora-input"
              >
                <option value="transform">Transform</option>
                <option value="filter">Filter</option>
                <option value="aggregate">Aggregate</option>
                <option value="extract">Extract</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Operation
              </label>
              <input
                type="text"
                placeholder="e.g., extract, map, reduce"
                value={getConfigValue('operation')}
                onChange={(e) => handleConfigUpdate('operation', e.target.value)}
                className="velora-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Target Fields
              </label>
              <input
                type="text"
                placeholder="field1, field2, field3"
                value={Array.isArray(localData.config) ? '' : String((localData.config as Record<string, unknown>)?.fields || '').replace(/,/g, ', ')}
                onChange={(e) => handleConfigUpdate('fields', e.target.value.split(',').map(f => f.trim()))}
                className="velora-input"
              />
              <p className="text-xs text-text-muted mt-1">Comma-separated field names</p>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Method
              </label>
              <select
                value={getConfigValue('method') || 'GET'}
                onChange={(e) => handleConfigUpdate('method', e.target.value)}
                className="velora-input"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                URL
              </label>
              <input
                type="url"
                placeholder="https://api.example.com/endpoint"
                value={getConfigValue('url')}
                onChange={(e) => handleConfigUpdate('url', e.target.value)}
                className="velora-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Headers
              </label>
              <textarea
                rows={3}
                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                value={JSON.stringify((localData.config as Record<string, unknown>)?.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    handleConfigUpdate('headers', headers);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                className="velora-input font-mono text-sm"
              />
              <p className="text-xs text-text-muted mt-1">JSON format</p>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Action Type
              </label>
              <select
                value={String(localData.actionType || 'notify')}
                onChange={(e) => handleUpdate('actionType', e.target.value)}
                className="velora-input"
              >
                <option value="notify">Notification</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="webhook">Webhook</option>
                <option value="database">Database</option>
                <option value="file">File Output</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Recipient
              </label>
              <input
                type="text"
                placeholder="user@example.com or +1234567890"
                value={getConfigValue('recipient')}
                onChange={(e) => handleConfigUpdate('recipient', e.target.value)}
                className="velora-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Message Template
              </label>
              <textarea
                rows={4}
                placeholder="Your message template here..."
                value={getConfigValue('message')}
                onChange={(e) => handleConfigUpdate('message', e.target.value)}
                className="velora-input"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-text-muted text-sm">No specific configuration available.</p>;
    }
  };

  return (
    <div className="w-80 bg-surface border-l border-surface-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-surface-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary font-jakarta">
            Node Properties
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-text-muted mt-1">
          Configure the selected node
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
            Basic Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Label
              </label>
              <input
                type="text"
                value={String(localData.label || '')}
                onChange={(e) => handleUpdate('label', e.target.value)}
                className="velora-input"
                placeholder="Node label"
              />
            </div>
          </div>
        </div>

        {/* Type Specific Configuration */}
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">
            Configuration
          </h4>
          {renderTypeSpecificFields()}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-surface-border">
        <div className="space-y-3">
          <button
            onClick={() => onDeleteNode(node.id)}
            className="w-full velora-button-secondary text-error hover:bg-error/10"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Node
          </button>
          
          <div className="text-xs text-text-muted text-center">
            <p>Node ID: {node.id}</p>
            <p>Type: {node.type}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;