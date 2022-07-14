import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import { ContextMenu } from './contextMenu';
import './styles.css';
import CustomEdge from './CustomEdge';
import CustomNodeSelector from './CustomNodeSelector';
import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls, Handle, Position } from 'react-flow-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faLinkHorizontal } from '@fortawesome/pro-regular-svg-icons';
import { ComponentStore } from '../../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';
import './index.css';

const initBgColor = 'grey';
const connectionLineStyle = { stroke: '#fff' };
const snapGrid = [20, 20];

// ************* initial elements & edges ********************
const initialElements = [
    {
        id: 'breaker-1',
        targetPosition: 'left',
        sourcePosition: 'right',
        type: 'breakerContainerLeft',
        data: { label: 'Breaker 1' },
        position: { x: 250, y: 60 },
        draggable: false,
    },
    {
        id: 'breaker-3',
        targetPosition: 'left',
        sourcePosition: 'right',
        type: 'breakerContainerLeft',
        data: { label: 'Breaker 3' },
        position: { x: 250, y: 140 },
        draggable: false,
    },
    {
        id: 'breaker-5',
        targetPosition: 'left',
        sourcePosition: 'right',
        type: 'breakerContainerLeft',
        data: { label: 'Breaker 5' },
        position: { x: 250, y: 220 },
        draggable: false,
    },
    {
        id: 'breaker-7',
        targetPosition: 'left',
        sourcePosition: 'right',
        type: 'breakerContainerLeft',
        data: { label: 'Breaker 7' },
        position: { x: 250, y: 300 },
        draggable: false,
    },
    {
        id: 'breaker-2',
        targetPosition: 'right',
        sourcePosition: 'left',
        data: { label: 'Breaker 2' },
        type: 'breakerContainerRight',
        position: { x: 700, y: 60 },
        draggable: false,
    },
    {
        id: 'breaker-4',
        targetPosition: 'right',
        sourcePosition: 'left',
        data: { label: 'Breaker 4' },
        type: 'breakerContainerRight',
        position: { x: 700, y: 140 },
        draggable: false,
    },
    {
        id: 'breaker-6',
        targetPosition: 'right',
        sourcePosition: 'left',
        data: { label: 'Breaker 6' },
        type: 'breakerContainerRight',
        position: { x: 700, y: 220 },
        draggable: false,
    },
    {
        id: 'breaker-8',
        targetPosition: 'right',
        sourcePosition: 'left',
        data: { label: 'Breaker 8' },
        type: 'breakerContainerRight',
        position: { x: 700, y: 300 },
        draggable: false,
    },
    {
        id: 'breakerslink-24',
        sourcePosition: 'left',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 1180, y: 120 },
        draggable: false,
    },
    {
        id: 'breakerslink-46',
        sourcePosition: 'left',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 1180, y: 200 },
        draggable: false,
    },
    {
        id: 'breakerslink-68',
        sourcePosition: 'left',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 1180, y: 280 },
        draggable: false,
    },
    {
        id: 'breakerslink-13',
        sourcePosition: 'right',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 200, y: 120 },
        draggable: false,
    },
    {
        id: 'breakerslink-35',
        sourcePosition: 'right',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 200, y: 200 },
        draggable: false,
    },
    {
        id: 'breakerslink-57',
        sourcePosition: 'right',
        type: 'breakerLink',
        data: { label: 'Link' },
        position: { x: 200, y: 280 },
        draggable: false,
    },
];

const initialEdges = [
    {
        id: 'link-e1-1',
        source: 'breakerslink-13',
        type: 'step',
        target: 'breaker-1',
        animated: false,
    },
    {
        id: 'link-e1-3',
        source: 'breakerslink-13',
        type: 'step',
        target: 'breaker-3',
        animated: false,
    },
];

// ************* breakers and link components ********************
const BreakersComponentLeft = () => {
    return (
        <>
            <Handle type="target" position="left" id="a" style={{ top: 20, background: '#555' }} />
            <Handle type="target" position="left" id="b" style={{ bottom: 30, top: 'auto', background: '#555' }} />
            <FormGroup className="form-group row m-1 mb-4">
                <div className="breaker-container">
                    <div className="sub-breaker-style">
                        <div className="breaker-content-middle">
                            <div className="breaker-index">1</div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="dot-status"></div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="breaker-content">
                                <span>100A</span>
                                <span>200V</span>
                            </div>
                        </div>
                        <div className="breaker-equipName-style">
                            <h6 className=" ml-3 breaker-equip-name">AHU1</h6>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="edit-icon-bg-styling mr-2">
                                <i className="uil uil-pen"></i>
                            </div>
                            <span className="font-weight-bold edit-btn-styling">Edit</span>
                        </div>
                    </div>
                </div>
            </FormGroup>
        </>
    );
};

const BreakersComponentRight = () => {
    return (
        <>
            <Handle type="target" position="right" id="a" style={{ top: 20, background: '#555' }} />
            <Handle type="target" position="right" id="b" style={{ bottom: 30, top: 'auto', background: '#555' }} />
            <FormGroup className="form-group row m-1 mb-4">
                <div className="breaker-container">
                    <div className="sub-breaker-style">
                        <div className="breaker-content-middle">
                            <div className="breaker-index">1</div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="dot-status"></div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="breaker-content">
                                <span>100A</span>
                                <span>200V</span>
                            </div>
                        </div>
                        <div className="breaker-equipName-style">
                            <h6 className=" ml-3 breaker-equip-name">AHU1</h6>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="edit-icon-bg-styling mr-2">
                                <i className="uil uil-pen"></i>
                            </div>
                            <span className="font-weight-bold edit-btn-styling">Edit</span>
                        </div>
                    </div>
                </div>
            </FormGroup>
        </>
    );
};

const BreakerLink = () => {
    return (
        <>
            <Handle type="source" position="top" id="a" />
            <Handle type="source" position="bottom" id="b" />
            <div className="breaker-link-container">
                {/* <Handle type="source" position={Position.Left} /> */}
                {/* <FontAwesomeIcon icon={faLinkHorizontal} color="#3C6DF5" size="md" /> */}
                <FontAwesomeIcon icon={faLinkHorizontalSlash} color="grey" size="md" />
            </div>
        </>
    );
};

//added new onload function
const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView();
    console.log(reactFlowInstance.getElements());
};

// ************* added node and egde types ********************
const nodeTypes = {
    customnode: CustomNodeSelector,
    breakerContainerRight: BreakersComponentRight,
    breakerContainerLeft: BreakersComponentLeft,
    breakerLink: BreakerLink,
};

const edgeTypes = {
    customedge: CustomEdge,
};

// ************* Main Panel-Breaker Component ********************
const PanelBreakers = () => {
    const [open, setOpen] = useState(false);
    const [reactflowInstance, setReactflowInstance] = useState(null);
    const [elements, setElements] = useState(initialElements);
    const [edges, setEdges] = useState(initialEdges);
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

    // changed label in data
    const onConnect = useCallback(
        (params) =>
            setElements((els) =>
                addEdge(
                    {
                        ...params,
                        id: `edge_${elements.length + 1}`,
                        animated: false,
                        // type: 'customedge',
                        type: 'step',
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

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Panel-Breakers',
                        path: '/settings/panels/panelBreakersFlow',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

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
                edges={edges}
                onConnect={onConnect}
                style={{ background: bgColor }}
                onLoad={onLoad}
                nodeTypes={nodeTypes}
                onNodeContextMenu={onContextMenu}
                connectionLineStyle={connectionLineStyle}
                snapToGrid={false}
                snapGrid={snapGrid}
                // maxZoom={2}
                // defaultZoom={2.5}
                onNodeMouseEnter={handleMouseEnter}
                // edgeTypes={edgeTypes}
                zoomOnScroll={false}
                panOnDrag={false}
                zoomOnDoubleClick={false}>
                {/* <ContextMenu
                    isOpen={isOpen}
                    position={position}
                    onMouseLeave={() => setIsOpen(false)}
                    actions={[{ label: 'Delete', effect: deleteNode }]}
                />*/}
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default PanelBreakers;
