'use client'

import React, { useState, useEffect } from 'react';

interface Call {
  id: string;
  caller: string;
  number: string;
  status: 'active' | 'completed' | 'missed' | 'queued';
  duration: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  agent?: string;
  department: string;
}

interface CallsTableProps {
  className?: string;
  onCallSelect?: (call: Call) => void;
}

const CallsTable: React.FC<CallsTableProps> = ({ className = '', onCallSelect }) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockCalls: Call[] = [
      {
        id: '1',
        caller: 'John Smith',
        number: '+1-555-0123',
        status: 'active',
        duration: '00:02:34',
        timestamp: '2024-01-15 10:30:00',
        priority: 'high',
        agent: 'Sarah Johnson',
        department: 'Customer Service'
      },
      {
        id: '2',
        caller: 'Emily Davis',
        number: '+1-555-0456',
        status: 'queued',
        duration: '00:00:00',
        timestamp: '2024-01-15 10:32:15',
        priority: 'medium',
        department: 'Technical Support'
      },
      {
        id: '3',
        caller: 'Michael Brown',
        number: '+1-555-0789',
        status: 'completed',
        duration: '00:05:42',
        timestamp: '2024-01-15 10:25:30',
        priority: 'low',
        agent: 'Mike Wilson',
        department: 'Sales'
      },
      {
        id: '4',
        caller: 'Lisa Wilson',
        number: '+1-555-0321',
        status: 'active',
        duration: '00:01:12',
        timestamp: '2024-01-15 10:31:45',
        priority: 'high',
        agent: 'Tom Anderson',
        department: 'Customer Service'
      },
      {
        id: '5',
        caller: 'Robert Johnson',
        number: '+1-555-0654',
        status: 'missed',
        duration: '00:00:00',
        timestamp: '2024-01-15 10:28:20',
        priority: 'medium',
        department: 'Technical Support'
      }
    ];

    setCalls(mockCalls);
  }, []);

  const getStatusBadge = (status: Call['status']) => {
    const statusClasses = {
      active: 'bg-success text-white',
      completed: 'bg-accent text-white',
      missed: 'bg-error text-white',
      queued: 'bg-warning text-white'
    };

    const statusIcons = {
      active: (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="3"/>
        </svg>
      ),
      completed: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      missed: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      queued: (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: Call['priority']) => {
    const priorityClasses = {
      high: 'bg-error/20 text-error border-error/30',
      medium: 'bg-warning/20 text-warning border-warning/30',
      low: 'bg-info/20 text-info border-info/30'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${priorityClasses[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const filteredCalls = filterStatus === 'all' 
    ? calls 
    : calls.filter(call => call.status === filterStatus);

  const handleCallClick = (call: Call) => {
    setSelectedCall(call.id);
    onCallSelect?.(call);
  };

  return (
    <div className={`velora-card ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary font-jakarta">Active Calls</h2>
            <p className="text-sm text-text-muted mt-1">Monitor and manage incoming calls in real-time</p>
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-3">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="velora-input py-2 text-sm"
            >
              <option value="all">All Calls</option>
              <option value="active">Active</option>
              <option value="queued">Queued</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
            
            <button className="velora-button-secondary py-2 px-3 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-elevated border-b border-surface-border">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Caller</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Duration</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Priority</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Agent</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Department</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-text-muted uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {filteredCalls.map((call) => (
              <tr 
                key={call.id}
                onClick={() => handleCallClick(call)}
                className={`
                  hover:bg-surface-hover transition-colors cursor-pointer
                  ${selectedCall === call.id ? 'bg-surface-active' : ''}
                `}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-semibold">
                        {call.caller.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{call.caller}</div>
                      <div className="text-sm text-text-muted">{call.number}</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(call.status)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-text-primary">{call.duration}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  {getPriorityBadge(call.priority)}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">
                    {call.agent || (
                      <span className="text-text-muted italic">Unassigned</span>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-primary">{call.department}</div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-text-muted">
                    {new Date(call.timestamp).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filteredCalls.length === 0 && (
        <div className="p-12 text-center">
          <svg className="w-12 h-12 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <h3 className="text-lg font-medium text-text-primary mb-2">No calls found</h3>
          <p className="text-text-muted">There are no calls matching your current filter.</p>
        </div>
      )}
    </div>
  );
};

export default CallsTable;