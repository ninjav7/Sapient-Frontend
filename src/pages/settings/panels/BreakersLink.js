import React from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';

const initialNodes = [
    {
        id: 'horizontal-1',
        sourcePosition: 'right',
        type: 'input',
        data: { label: 'Input' },
        position: { x: 0, y: 80 },
    },
    {
        id: 'horizontal-2',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node A' },
        position: { x: 250, y: 0 },
    },
    {
        id: 'horizontal-3',
        sourcePosition: 'right',
        targetPosition: 'left',
        data: { label: 'Node B' },
        position: { x: 250, y: 160 },
    },
];

const initialEdges = [
    {
        id: 'horizontal-e1-2',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-2',
        animated: true,
    },
    {
        id: 'horizontal-e1-3',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-3',
        animated: true,
    },
];

const BreakersLink = () => {
    const [nodes, _, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = (params) => setEdges((els) => addEdge(params, els));

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"></ReactFlow>
    );
};

export default BreakersLink;
