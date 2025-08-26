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
