'use client'

import React, { useState, useEffect } from 'react';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'disabled';
  nodeCount: number;
  executionCount: number;
  lastModified: string;
  created: string;
}

interface PipelineListProps {
  onPipelineSelect: (pipelineId: string) => void;
  onCreateNew: () => void;
}

const PipelineList: React.FC<PipelineListProps> = ({ onPipelineSelect, onCreateNew }) => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockPipelines: Pipeline[] = [
      {
        id: '1',
        name: 'Customer Support Automation',
        description: 'Automated call routing and sentiment analysis for customer support calls',
        status: 'active',
        nodeCount: 8,
        executionCount: 1247,
        lastModified: '2024-01-15T10:30:00Z',
        created: '2024-01-10T08:00:00Z'
      },
      {
        id: '2',
        name: 'Sales Lead Qualification',
        description: 'AI-powered lead scoring and follow-up automation',
        status: 'active',
        nodeCount: 12,
        executionCount: 856,
        lastModified: '2024-01-14T16:20:00Z',
        created: '2024-01-08T14:30:00Z'
      },
      {
        id: '3',
        name: 'Quality Assurance Pipeline',
        description: 'Call recording analysis and quality scoring',
        status: 'draft',
        nodeCount: 6,
        executionCount: 0,
        lastModified: '2024-01-13T09:15:00Z',
        created: '2024-01-12T11:00:00Z'
      },
      {
        id: '4',
        name: 'Emergency Escalation',
        description: 'Urgent call detection and automatic escalation workflow',
        status: 'active',
        nodeCount: 5,
        executionCount: 34,
        lastModified: '2024-01-12T14:45:00Z',
        created: '2024-01-05T09:30:00Z'
      }
    ];

    setPipelines(mockPipelines);
  }, []);

  const getStatusBadge = (status: Pipeline['status']) => {
    const statusClasses = {
      active: 'bg-success/20 text-success border-success/30',
      draft: 'bg-warning/20 text-warning border-warning/30',
      disabled: 'bg-error/20 text-error border-error/30'
    };

    const statusIcons = {
      active: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3"/>
        </svg>
      ),
      draft: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      disabled: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L18.364 5.636" />
        </svg>
      )
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredPipelines = pipelines.filter(pipeline => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pipeline.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-surface-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary font-jakarta">
              Pipeline Manager
            </h1>
            <p className="text-text-muted mt-1">
              Create and manage your automation pipelines
            </p>
          </div>
          
          <button
            onClick={onCreateNew}
            className="velora-button-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Pipeline
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search pipelines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="velora-input pl-10"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="velora-input"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Pipeline Grid */}
      <div className="flex-1 overflow-auto p-6">
        {filteredPipelines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPipelines.map((pipeline) => (
              <div
                key={pipeline.id}
                onClick={() => onPipelineSelect(pipeline.id)}
                className="velora-card p-6 cursor-pointer transition-all duration-200 hover:scale-105"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
                      {pipeline.name}
                    </h3>
                    <p className="text-sm text-text-muted line-clamp-2 mb-3">
                      {pipeline.description}
                    </p>
                  </div>
                  {getStatusBadge(pipeline.status)}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <div className="text-2xl font-bold text-primary">{pipeline.nodeCount}</div>
                    <div className="text-xs text-text-muted">Nodes</div>
                  </div>
                  <div className="text-center p-3 bg-surface-elevated rounded-lg">
                    <div className="text-2xl font-bold text-accent">{pipeline.executionCount}</div>
                    <div className="text-xs text-text-muted">Executions</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(pipeline.lastModified).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle duplicate
                      }}
                      className="p-1 hover:bg-surface-hover rounded transition-colors"
                      title="Duplicate pipeline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle delete
                      }}
                      className="p-1 hover:bg-surface-hover rounded transition-colors text-error"
                      title="Delete pipeline"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No Pipelines Found</h3>
              <p className="text-text-muted mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No pipelines match your search criteria.' 
                  : 'Get started by creating your first automation pipeline.'
                }
              </p>
              <button
                onClick={onCreateNew}
                className="velora-button-primary"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Pipeline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineList;