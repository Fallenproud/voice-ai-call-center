'use client'

import { useState, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PipelineBuilder from '@/components/pipeline/PipelineBuilder';
import PipelineList from '@/components/pipeline/PipelineList';

export default function PipelinePage() {
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  const handlePipelineSelect = useCallback((pipelineId: string) => {
    setSelectedPipeline(pipelineId);
    setShowBuilder(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setSelectedPipeline(null);
    setShowBuilder(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowBuilder(false);
    setSelectedPipeline(null);
  }, []);

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {!showBuilder ? (
          <PipelineList 
            onPipelineSelect={handlePipelineSelect}
            onCreateNew={handleCreateNew}
          />
        ) : (
          <PipelineBuilder
            pipelineId={selectedPipeline}
            onBack={handleBackToList}
          />
        )}
      </div>
    </DashboardLayout>
  );
}