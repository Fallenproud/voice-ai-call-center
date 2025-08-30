'use client'

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CallsTable from '@/components/dashboard/CallsTable';
import CallPreviewCard from '@/components/dashboard/CallPreviewCard';

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

export default function Home() {
  const [selectedCall, setSelectedCall] = useState<Call | undefined>();

  const handleCallSelect = (call: Call) => {
    setSelectedCall(call);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="velora-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient font-jakarta mb-2">
                Welcome to Velora Voice™
              </h1>
              <p className="text-text-muted">
                Enterprise AI Call Center Dashboard - Monitor, manage, and optimize your call operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">127</div>
                <div className="text-xs text-text-muted">Total Calls</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-xs text-text-muted">Active Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-xs text-text-muted">In Queue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="velora-card p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold font-jakarta mb-2 text-gradient">
              AI Voice Demo
            </h2>
            <p className="text-text-muted mb-6">
              Experience the power of Velora Voice™ AI technology
            </p>
            
            <div className="flex justify-center space-x-4">
              {/* Audio Demo Button */}
              <button 
                onClick={() => {
                  const audio = new Audio('/velora-ai.wav');
                  audio.play().catch(e => console.log('Audio playback failed:', e));
                }}
                className="velora-button-primary px-6 py-3 text-lg font-semibold flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.5 21H4a1 1 0 01-1-1v-5.5m0 0V8a1 1 0 011-1h4.5m0 13.5V19a1 1 0 001-1v-4.5m0 0V8a1 1 0 011-1h4.5" />
                </svg>
                <span>Play AI Voice Demo</span>
              </button>

              {/* Pipeline Demo Button */}
              <button 
                onClick={() => window.location.href = '/pipeline'}
                className="velora-button-secondary px-6 py-3 text-lg font-semibold flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Try Pipeline Builder</span>
              </button>

              {/* License Demo Button */}
              <button 
                onClick={() => window.location.href = '/activate'}
                className="bg-gradient-to-r from-accent to-primary text-white px-6 py-3 text-lg font-semibold rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Test License System</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calls Table - Takes 2 columns */}
          <div className="xl:col-span-2">
            <CallsTable onCallSelect={handleCallSelect} />
          </div>
          
          {/* Call Preview - Takes 1 column */}
          <div className="xl:col-span-1">
            <CallPreviewCard call={selectedCall} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="velora-card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">98.5%</p>
                <p className="text-sm text-text-muted">Answer Rate</p>
              </div>
            </div>
          </div>

          <div className="velora-card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">2:34</p>
                <p className="text-sm text-text-muted">Avg Duration</p>
              </div>
            </div>
          </div>

          <div className="velora-card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">8</p>
                <p className="text-sm text-text-muted">Active Agents</p>
              </div>
            </div>
          </div>

          <div className="velora-card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">4.8</p>
                <p className="text-sm text-text-muted">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
