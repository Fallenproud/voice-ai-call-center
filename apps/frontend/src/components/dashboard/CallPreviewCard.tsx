'use client'

import React, { useState, useEffect } from 'react';

interface CallData {
  id: string;
  caller: string;
  number: string;
  status: 'active' | 'completed' | 'missed' | 'queued';
  duration: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  agent?: string;
  department: string;
  transcript?: string[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface CallPreviewCardProps {
  call?: CallData;
  className?: string;
}

const CallPreviewCard: React.FC<CallPreviewCardProps> = ({ call, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  // Generate animated waveform
  useEffect(() => {
    if (call?.status === 'active') {
      const interval = setInterval(() => {
        const bars = Array.from({ length: 20 }, () => Math.random() * 100);
        setWaveformBars(bars);
      }, 150);

      return () => clearInterval(interval);
    } else {
      // Static waveform for non-active calls
      setWaveformBars(Array.from({ length: 20 }, () => Math.random() * 60 + 20));
    }
  }, [call?.status]);

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'negative':
        return (
          <div className="w-5 h-5 bg-error/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 bg-warning/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
    }
  };

  const defaultCall: CallData = {
    id: 'demo',
    caller: 'Demo Call',
    number: '+1-555-DEMO',
    status: 'active',
    duration: '00:01:23',
    timestamp: new Date().toISOString(),
    priority: 'medium',
    agent: 'Sarah Johnson',
    department: 'Customer Service',
    transcript: [
      'Customer: Hi, I\'m calling about my recent order...',
      'Agent: Hello! I\'d be happy to help you with that. Can you provide your order number?',
      'Customer: Yes, it\'s ORDER-12345',
      'Agent: Thank you, let me look that up for you...'
    ],
    sentiment: 'positive'
  };

  const activeCall = call || defaultCall;

  if (!activeCall) {
    return (
      <div className={`velora-card ${className}`}>
        <div className="p-6 text-center">
          <svg className="w-12 h-12 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <h3 className="text-lg font-medium text-text-primary mb-2">No Active Call</h3>
          <p className="text-text-muted">Select a call from the table to preview details</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`velora-card ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {activeCall.caller.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{activeCall.caller}</h3>
              <p className="text-sm text-text-muted">{activeCall.number}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {getSentimentIcon(activeCall.sentiment)}
            <span className="text-sm text-text-muted capitalize">{activeCall.sentiment || 'neutral'}</span>
          </div>
        </div>

        {/* Call Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Duration:</span>
            <span className="ml-2 font-mono text-text-primary">{activeCall.duration}</span>
          </div>
          <div>
            <span className="text-text-muted">Department:</span>
            <span className="ml-2 text-text-primary">{activeCall.department}</span>
          </div>
          <div>
            <span className="text-text-muted">Agent:</span>
            <span className="ml-2 text-text-primary">{activeCall.agent || 'Unassigned'}</span>
          </div>
          <div>
            <span className="text-text-muted">Priority:</span>
            <span className={`ml-2 capitalize ${
              activeCall.priority === 'high' ? 'text-error' : 
              activeCall.priority === 'medium' ? 'text-warning' : 'text-info'
            }`}>
              {activeCall.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Audio Waveform */}
      <div className="p-6 border-b border-surface-border">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-text-primary">Audio Visualization</h4>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${activeCall.status === 'active' ? 'bg-success pulse-glow' : 'bg-text-muted'}`}></div>
            <span className="text-xs text-text-muted capitalize">{activeCall.status}</span>
          </div>
        </div>
        
        {/* Waveform Visualization */}
        <div className="flex items-end space-x-1 h-20 bg-surface-elevated rounded-lg p-4">
          {waveformBars.map((height, index) => (
            <div
              key={index}
              className={`
                w-2 bg-gradient-primary rounded-sm transition-all duration-150
                ${activeCall.status === 'active' ? 'wave-bar' : ''}
              `}
              style={{
                height: `${height}%`,
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-3 rounded-full transition-colors ${
              isRecording 
                ? 'bg-error text-white' 
                : 'bg-surface-elevated text-text-primary hover:bg-surface-hover'
            }`}
          >
            {isRecording ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="6"/>
              </svg>
            )}
          </button>
          
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Live Transcript */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-text-primary mb-4">Live Transcript</h4>
        <div className="bg-surface-elevated rounded-lg p-4 max-h-48 overflow-y-auto">
          {activeCall.transcript && activeCall.transcript.length > 0 ? (
            <div className="space-y-3">
              {activeCall.transcript.map((line, index) => {
                const isAgent = line.startsWith('Agent:');
                return (
                  <div key={index} className={`text-sm ${isAgent ? 'text-accent' : 'text-text-primary'}`}>
                    <span className="font-medium">
                      {line.split(':')[0]}:
                    </span>
                    <span className="ml-2">
                      {line.split(':').slice(1).join(':').trim()}
                    </span>
                  </div>
                );
              })}
              
              {activeCall.status === 'active' && (
                <div className="flex items-center space-x-2 text-text-muted">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm italic">Listening...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-8 h-8 text-text-muted mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-sm text-text-muted">No transcript available</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 mt-4">
          <button className="velora-button-primary flex-1">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {activeCall.status === 'active' ? 'End Call' : 'Call Back'}
          </button>
          
          <button className="velora-button-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallPreviewCard;