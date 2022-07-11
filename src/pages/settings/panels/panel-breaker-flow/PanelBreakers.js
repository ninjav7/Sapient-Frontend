import React, { useState, useEffect, useCallback } from 'react';
import { Button } from 'reactstrap';
// import Button from '@material-ui/core/Button';
import elementsArr from './elements';
import { ContextMenu } from './contextMenu';
import './styles.css';
/**
 *    imported these two component ***********************
 */
import CustomEdge from './CustomEdge';
import CustomNodeSelector from './CustomNodeSelector';
/***************************************************** */

import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls } from 'react-flow-renderer';

import './index.css';

const initBgColor = '#1A192B';

const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [20, 20];

//added new onload function
const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
    console.log(reactFlowInstance.getElements());
};

// ************* added node types ********************
const edgeTypes = {
    customedge: CustomEdge,
};

const initialEdges = [
    {
        id: 'horizontal-e1-12',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-2',
        animated: false,
        label: 'Label 1',
    },
    {
        id: 'horizontal-e1-13',
        source: 'horizontal-1',
        type: 'smoothstep',
        target: 'horizontal-3',
        animated: false,
        label: 'Label 2',
    },
];

const nodeTypes = {
    customnode: CustomNodeSelector,
};
// **************************************
const PanelBreakers = () => {
    const [open, setOpen] = useState(false);
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState([]); // main data elements for save
    const [bgColor, setBgColor] = useState(initBgColor);
    const [nodeData, setnodeData] = useState(null);
    const [inputChange, setinputChange] = useState('');
    const [selectedElement, setselectedElement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [permission, setpermission] = useState(true);

    const updateNodedata = (text, node) => {
        const findElementindex = elements.findIndex((items) => items.id === node.id);
        if (findElementindex > -1 && elements[findElementindex]?.data?.label) {
            elements[findElementindex].data.label = text;
            setElements([...elements]);
        }
    };

    const onNodeDragStop = (event, node) => {
        const findElementindex = elements.findIndex((items) => items.id === node.id);
        if (findElementindex > -1) {
            elements[findElementindex] = node;
            setElements([...elements]);
        }
        console.log(node, elements);
    };

    const onElementClick = (event, node) => {
        handleClickOpen();
        setnodeData(node);
        const findElement = elements.find((items) => items.id === node.id);
        if (findElement) {
            setinputChange(findElement?.data?.label || findElement?.label);
        }
    };

    useEffect(() => {
        setElements(elementsArr);
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setElements([...elements]);
        setnodeData(null);
    };

    useEffect(() => {
        if (reactflowInstance && elements.length > 0) {
            reactflowInstance.fitView();
        }
    }, [reactflowInstance, elements.length]);

    const onElementsRemove = useCallback(
        (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els)),
        []
    );

    // chnaged label in data
    const onConnect = useCallback(
        (params) =>
            setElements((els) =>
                addEdge(
                    {
                        ...params,
                        id: `edge_${elements.length + 1}`,
                        animated: false,
                        type: 'customedge',
                        style: { stroke: '#fff' },
                        data: { type: 'edge', label: 'dhvsdhvd' },
                        arrowHeadType: 'arrowclosed',
                    },
                    els
                )
            ),
        []
    );

    const deleteNode = () => {
        setElements((elements) => elements.filter((element) => element.id != nodeData.id));
        setIsOpen(false);
    };

    let id = elements.length;
    const getId = () => `node_${id + 1}`;

    const handleSave = () => {
        const findIndex = elements.findIndex((items) => items.id === nodeData.id);
        if (nodeData?.data?.type === 'node') {
            if (findIndex > -1) {
                elements[findIndex].data.label = inputChange;
                elements[findIndex].position.x = elements[findIndex].position.x + 1;
                elements[findIndex].position.y = elements[findIndex].position.y + 1;
                setElements([...elements]);
            }
        } else if (nodeData?.data?.type === 'edge') {
            if (findIndex > -1) {
                elements[findIndex].label = inputChange;
                setElements([...elements]);
            }
        }
        handleClose();
        setinputChange('');
        setnodeData(null);
    };

    const createNew = () => {
        const newNode = {
            id: getId(),
            type: 'customnode',
            data: { label: 'An input node', type: 'node' },
            position: { x: 20, y: 20 },
            sourcePosition: 'right',
        };
        setElements((es) => es.concat(newNode));
    };

    useEffect(() => {
        if (nodeData) {
            setElements((els) =>
                els.map((el) => {
                    if (el.id === nodeData.id) {
                        // it's important that you create a new object here
                        // in order to notify react flow about the change
                        el.data = {
                            ...el.data,
                            label: inputChange,
                        };
                    }
                    return el;
                })
            );
        }
    }, [inputChange]);

    const onContextMenu = (e) => {
        e.preventDefault();
        setIsOpen(true);
        setPosition({ x: e.clientX - 20, y: e.clientY - 20 });
    };

    const handleSaveFlowData = () => {
        console.log(elements);
    };

    const handleMouseEnter = (e, node) => {
        console.log(node);
        setnodeData(node);
    };

    useEffect(() => {
        console.log('edgeTypes => ', edgeTypes);
    });

    return (
        <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
            {permission && (
                <>
                    <Button
                        onClick={createNew}
                        variant="contained"
                        color="secondary"
                        style={{ position: 'absolute', top: '0', zIndex: '100' }}>
                        Create Breaker
                    </Button>
                    <Button
                        onClick={handleSaveFlowData}
                        variant="contained"
                        color="primary"
                        style={{ position: 'absolute', top: '0', right: 0, zIndex: '100' }}>
                        Save
                    </Button>
                </>
            )}
            <ReactFlow
                elements={elements}
                // onElementClick={onElementClick}
                // onElementsRemove={onElementsRemove}
                onConnect={onConnect}
                // onNodeDragStop={onNodeDragStop}
                style={{ background: bgColor }}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
                onNodeContextMenu={onContextMenu}
                connectionLineStyle={connectionLineStyle}
                snapToGrid={true}
                snapGrid={snapGrid}
                maxZoom={2}
                defaultZoom={1.5}
                onNodeMouseEnter={handleMouseEnter}
                // edgeTypes={edgeTypes}
                edges={initialEdges}>
                {/* <ContextMenu
                    isOpen={isOpen}
                    position={position}
                    onMouseLeave={() => setIsOpen(false)}
                    actions={[{ label: 'Delete', effect: deleteNode }]}
                />
                <MiniMap
                    nodeStrokeColor={(n) => {
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'selectorNode') return bgColor;
                        if (n.type === 'output') return '#ff0072';
                    }}
                    nodeColor={(n) => {
                        if (n.type === 'selectorNode') return bgColor;
                        return '#fff';
                    }}
                /> */}
            </ReactFlow>
        </div>
    );
};

export default PanelBreakers;
