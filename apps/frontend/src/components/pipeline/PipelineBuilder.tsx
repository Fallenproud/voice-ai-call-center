'use client'

import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from '../nodes/TriggerNode';
import AINode from '../nodes/AINode';
import DataNode from '../nodes/DataNode';
import APINode from '../nodes/APINode';
import ActionNode from '../nodes/ActionNode';
import NodePanel from './NodePanel';
import PropertiesPanel from './PropertiesPanel';

interface PipelineBuilderProps {
  pipelineId?: string | null;
  onBack: () => void;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Call Received',
      triggerType: 'call_received',
      config: {}
    },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  trigger: TriggerNode,
  ai: AINode,
  data: DataNode,
  api: APINode,
  action: ActionNode,
};

const PipelineBuilder: React.FC<PipelineBuilderProps> = ({ onBack }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [pipelineName, setPipelineName] = useState('Untitled Pipeline');
  const [isExecuting, setIsExecuting] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const addNode = useCallback((nodeType: string) => {
    const newId = `${nodes.length + 1}`;
    const newNode: Node = {
      id: newId,
      type: nodeType,
      position: { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 400 + 100 
      },
      data: getDefaultNodeData(nodeType),
    };
    
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  const updateNodeData = useCallback((nodeId: string, newData: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId 
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [setNodes]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  }, [setNodes, setEdges, selectedNode]);

  const executePipeline = useCallback(async () => {
    setIsExecuting(true);
    
    // Simulate pipeline execution
    try {
      // Add visual feedback
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, executing: true }
        }))
      );

      // Simulate async execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset execution state
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, executing: false, lastExecuted: new Date().toISOString() }
        }))
      );

      // Show success notification
      alert('Pipeline executed successfully!');
    } catch (error) {
      console.error('Pipeline execution failed:', error);
      alert('Pipeline execution failed. Please check the configuration.');
    } finally {
      setIsExecuting(false);
    }
  }, [setNodes]);

  const savePipeline = useCallback(async () => {
    const pipelineData = {
      name: pipelineName,
      nodes: nodes,
      edges: edges,
      updated_at: new Date().toISOString()
    };

    try {
      // TODO: Implement API call to save pipeline
      console.log('Saving pipeline:', pipelineData);
      alert('Pipeline saved successfully!');
    } catch (error) {
      console.error('Failed to save pipeline:', error);
      alert('Failed to save pipeline. Please try again.');
    }
  }, [pipelineName, nodes, edges]);

  const miniMapStyle = {
    height: 120,
    backgroundColor: '#1A1A1C',
    border: '1px solid #3F3F46',
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-surface-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div>
              <input
                type="text"
                value={pipelineName}
                onChange={(e) => setPipelineName(e.target.value)}
                className="text-xl font-bold bg-transparent border-none outline-none text-text-primary focus:bg-surface-hover px-2 py-1 rounded"
              />
              <p className="text-sm text-text-muted">
                {nodes.length} nodes, {edges.length} connections
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={executePipeline}
              disabled={isExecuting || nodes.length === 0}
              className="velora-button-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Executing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Test Run
                </>
              )}
            </button>

            <button
              onClick={savePipeline}
              className="velora-button-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Save Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Node Panel */}
        <NodePanel onAddNode={addNode} />

        {/* Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Controls 
              className="bg-surface border border-surface-border"
              showInteractive={false}
            />
            <MiniMap 
              style={miniMapStyle}
              zoomable
              pannable
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="#3F3F46"
            />
          </ReactFlow>

          {/* Overlay for empty state */}
          {nodes.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center max-w-md">
                <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Start Building Your Pipeline</h3>
                <p className="text-text-muted">
                  Drag nodes from the panel on the left to add them to your pipeline. Connect them to define the flow.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <PropertiesPanel
            node={selectedNode}
            onUpdateNode={updateNodeData}
            onDeleteNode={deleteNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};

function getDefaultNodeData(nodeType: string) {
  const defaults = {
    trigger: {
      label: 'New Trigger',
      triggerType: 'call_received',
      config: {}
    },
    ai: {
      label: 'AI Processing',
      aiType: 'classification',
      config: {
        model: 'gpt-3.5-turbo',
        prompt: 'Analyze the input and provide insights'
      }
    },
    data: {
      label: 'Data Processing',
      dataType: 'transform',
      config: {
        operation: 'extract',
        fields: []
      }
    },
    api: {
      label: 'API Call',
      apiType: 'rest',
      config: {
        method: 'GET',
        url: '',
        headers: {}
      }
    },
    action: {
      label: 'Action',
      actionType: 'notify',
      config: {
        recipient: '',
        message: ''
      }
    }
  };

  return defaults[nodeType as keyof typeof defaults] || { label: 'New Node', config: {} };
}

export default PipelineBuilder;