import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link, useParams, useHistory } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import {
    BaseUrl,
    getLocation,
    generalPanels,
    generalPassiveDevices,
    getBreakers,
    updatePanel,
    createBreaker,
    generalEquipments,
    listSensor,
} from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../../store/ComponentStore';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges } from 'react-flow-renderer';
import BreakerLink from './BreakerLinkForDistribution';
import BreakerLinkForDisconnect from './BreakerLinkForDisconnect';
import BreakersComponent from './BreakerFlowForDistribution';
import DisconnectedBreakerComponent from './BreakerFlowForDisconnect';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';
import './panel-style.css';

// Added Node and Egde types
const nodeTypes = {
    breakerComponent: BreakersComponent,
    disconnectedBreakerComponent: DisconnectedBreakerComponent,
};

const edgeTypes = {
    breakerLink: BreakerLink,
    disconnectBreakerLink: BreakerLinkForDisconnect,
};

const EditBreakerPanel = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const history = useHistory();

    const { panelId } = useParams();

    const { v4: uuidv4 } = require('uuid');
    const generateBreakerLinkId = () => uuidv4();

    // Main Breaker Modal
    const [showMain, setShowMain] = useState(false);
    const handleMainClose = () => setShowMain(false);
    const handleMainShow = () => setShowMain(true);

    const [equipmentData, setEquipmentData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const isBreakerApiTrigerred = LoadingStore.useState((s) => s.isBreakerDataFetched);

    const [isProcessing, setIsProcessing] = useState(false);

    const [panel, setPanel] = useState({});
    const [breakersData, setBreakersData] = useState([]);
    const [isBreakerDataFetched, setBreakerDataFetched] = useState(false);

    const [fetchedPanelResponse, setFetchedPanelResponse] = useState({});
    const [panelDataFetched, setIsPanelDataFetched] = useState(false);

    const [panelConfig, setPanelConfig] = useState({
        voltage: '',
        phase_config: 1,
        rated_amps: 0,
    });

    const [normalCount, setNormalCount] = useState(4);
    const [normalStruct, setNormalStruct] = useState([]);

    const [disconnectBreakerCount, setDisconnectBreakerCount] = useState(3);
    const [disconnectBreakerConfig, setDisconnectBreakerConfig] = useState([]);

    const [locationDataList, setLocationDataList] = useState([]);

    const panelType = [
        {
            name: 'Distribution',
            value: 'distribution',
        },
        {
            name: 'Disconnect',
            value: 'disconnect',
        },
    ];

    const disconnectBreaker = [
        {
            name: '1',
            value: 1,
        },
        {
            name: '2',
            value: 2,
        },
        {
            name: '3',
            value: 3,
        },
    ];

    const [activePanelType, setActivePanelType] = useState('distribution');
    const [panelsDataList, setPanelsDataList] = useState([]);

    const [isEditable, setIsEditable] = useState(true);

    const [dynamicDistributeHeight, setDynamicDistributeHeight] = useState(300);
    const [dynamicDisconnectHeight, setDynamicDisconnectHeight] = useState(300);

    const [reactFlowDistributeStyle, setReactFlowDistributeStyle] = useState({
        background: '#fafbfc',
        height: `${dynamicDistributeHeight}px`,
    });

    const [reactFlowDisconnectStyle, setReactFlowDisconnectStyle] = useState({
        background: '#fafbfc',
        height: `${dynamicDisconnectHeight}px`,
    });

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panel);
        obj[key] = value;
        setPanel(obj);
    };

    const handlePanelConfigChange = (key, value) => {
        let obj = Object.assign({}, panelConfig);
        if (key === 'rated_amps') {
            value = parseInt(value);
        }
        if (value === 'Select Volts') {
            value = '';
        }
        obj[key] = value;
        setPanelConfig(obj);
    };

    const updateChangesToPanel = () => {
        let obj = {
            ...panel,
            ...panelConfig,
        };
        setPanel(obj);
    };

    const addBreakersToList = (newBreakerIndex) => {
        let newBreakerList = normalStruct;
        let obj = {
            name: `Breaker ${newBreakerIndex}`,
            breaker_number: parseInt(newBreakerIndex),
            phase_configuration: 0,
            rated_amps: 0,
            voltage: '',
            equipment_link: [],
            sensor_id: '',
            device_id: '',
        };

        if (panel.voltage === '120/240') {
            obj.voltage = '120';
            obj.phase_configuration = 1;
        }

        if (panel.voltage === '208/120') {
            obj.voltage = '120';
            obj.phase_configuration = 1;
        }

        if (panel.voltage === '480') {
            obj.voltage = '277';
            obj.phase_configuration = 1;
        }

        if (panel.voltage === '600') {
            obj.voltage = '347';
            obj.phase_configuration = 1;
        }

        newBreakerList.push(obj);
        setNormalStruct(newBreakerList);
    };

    const removeBreakersFromList = () => {
        let currentBreakerList = normalStruct;
        currentBreakerList.splice(-1);
        setNormalStruct(currentBreakerList);
    };

    const handleDisconnectBreakers = (previousBreakerCount, newBreakerCount) => {
        let newBreakersArray = disconnectBreakerConfig;
        if (newBreakerCount === 1) {
            let arr = [];
            arr.push(newBreakersArray[0]);
            setDisconnectBreakerConfig(arr);
        }
        if (newBreakerCount === 2) {
            let obj = {
                name: 'Breaker 2',
                breaker_number: 2,
                phase_configuration: 2,
                rated_amps: 0,
                voltage: '120',
                equipment_link: [],
                sensor_id: '',
                device_id: '',
            };
            if (previousBreakerCount === 1) {
                newBreakersArray.push(obj);
                setDisconnectBreakerConfig(newBreakersArray);
            }
            if (previousBreakerCount === 3) {
                newBreakersArray.splice(-1);
                setDisconnectBreakerConfig(newBreakersArray);
            }
        }
        if (newBreakerCount === 3) {
            let obj = {
                name: 'Breaker 2',
                breaker_number: 3,
                phase_configuration: 2,
                rated_amps: 0,
                voltage: '120',
                equipment_link: [],
                sensor_id: '',
                device_id: '',
            };
            if (previousBreakerCount === 1) {
                let obj1 = obj;
                let obj2 = obj;
                obj1.name = 'Breaker 2';
                obj2.name = 'Breaker 3';
                obj1.breaker_number = 2;
                obj2.breaker_number = 3;
                newBreakersArray.push(obj1);
                newBreakersArray.push(obj2);
                setDisconnectBreakerConfig(newBreakersArray);
            }
            if (previousBreakerCount === 2) {
                newBreakersArray.push(obj);
                setDisconnectBreakerConfig(newBreakersArray);
            }
        }
    };

    // For Distributed
    const [distributedBreakersNodes, setDistributedBreakersNodes] = useState([]);
    const [distributedBreakersEdges, setDistributedBreakersEdges] = useState([]);

    // For Disconnected
    const [disconnectedBreakersNodes, setDisconnectedBreakersNodes] = useState([]);
    const [disconnectedBreakersEdges, setDisconnectedBreakersEdges] = useState([]);

    // For Distributed
    const onNodesChange = useCallback(
        (changes) => setDistributedBreakersNodes((ns) => applyNodeChanges(changes, ns)),
        []
    );
    const onEdgesChange = useCallback(
        (changes) => setDistributedBreakersEdges((es) => applyEdgeChanges(changes, es)),
        []
    );
    const onConnect = useCallback((connection) => setDistributedBreakersEdges((eds) => addEdge(connection, eds)));

    // For Disconnected
    const onNodesChangeForDisconnect = useCallback(
        (changes) => setDisconnectedBreakersNodes((ns) => applyNodeChanges(changes, ns)),
        []
    );
    const onEdgesChangeForDisconnect = useCallback(
        (changes) => setDisconnectedBreakersEdges((es) => applyEdgeChanges(changes, es)),
        []
    );
    const onConnectForDisconnect = useCallback((connection) =>
        setDisconnectedBreakersEdges((eds) => addEdge(connection, eds))
    );

    // Get co-rodinates for Distributed Breakers
    const getYaxisCordinates = (index) => {
        let num = index;
        let value = 100;

        if (num === 1 || num === 2) {
            return value;
        }
        if (num % 2 === 0) {
            return (num / 2) * value;
        }
        if (num % 2 !== 0) {
            return ((num + 1) / 2) * value;
        }
    };

    const getDiscYaxisCordinates = (index) => {
        if (index === 1) {
            return 25;
        }
        if (index === 2) {
            return 125;
        }
        if (index === 3) {
            return 225;
        }
    };

    // Compare Panel Objs to Enable Save Button
    const comparePanelData = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const savePanelData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let panelObj = {
                name: panel.panel_name,
                parent_panel: panel.parent_id,
                space_id: panel.location_id,
            };

            setIsProcessing(true);
            let params = `?panel_id=${panelId}`;
            await axios
                .patch(`${BaseUrl}${updatePanel}${params}`, panelObj, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                });
            setIsProcessing(false);

            history.push({
                pathname: `/settings/panels`,
            });
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to update Panel');
        }
    };

    const getTargetBreakerId = (targetBreakerNo) => {
        let targetObj = breakersData?.find((obj) => obj?.breaker_number === targetBreakerNo);
        return targetObj?.id;
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Edit Panel',
                        path: '/settings/panels/create-panel',
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setReactFlowDisconnectStyle({ ...reactFlowDisconnectStyle, height: `${dynamicDisconnectHeight}px` });
    }, [dynamicDisconnectHeight]);

    useEffect(() => {
        setReactFlowDistributeStyle({ ...reactFlowDistributeStyle, height: `${dynamicDistributeHeight}px` });
    }, [dynamicDistributeHeight]);

    useEffect(() => {
        setDynamicDistributeHeight((breakersData?.length / 2) * 115);
        setDynamicDisconnectHeight(breakersData?.length * 100);
    }, [breakersData]);

    useEffect(() => {
        if (!isBreakerApiTrigerred) {
            return;
        }
        const fetchBreakersData = async () => {
            try {
                setBreakerDataFetched(true);

                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?panel_id=${panelId}`;

                await axios.get(`${BaseUrl}${getBreakers}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    setBreakersData(response);
                    setBreakerDataFetched(false);
                    LoadingStore.update((s) => {
                        s.isBreakerDataFetched = false;
                    });
                });
            } catch (error) {
                console.log(error);
                setBreakerDataFetched(false);
                LoadingStore.update((s) => {
                    s.isBreakerDataFetched = false;
                });
                console.log('Failed to fetch Breakers Data List');
            }
        };
        const fetchEquipmentData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&occupancy_filter=true`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    let responseData = res.data.data;
                    let equipArray = [];
                    responseData.forEach((record) => {
                        if (record.equipments_name === '') {
                            return;
                        }
                        let obj = {
                            label: record.equipments_name,
                            value: record.equipments_id,
                            breakerId: record.breaker_id,
                        };
                        equipArray.push(obj);
                    });
                    setEquipmentData(equipArray);
                    BreakersStore.update((s) => {
                        s.equipmentData = equipArray;
                    });
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Equipments Data');
            }
        };
        fetchBreakersData();
        fetchEquipmentData();
    }, [isBreakerApiTrigerred]);

    useEffect(() => {
        const fetchSinglePanelData = async () => {
            try {
                setIsPanelDataFetched(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&panel_id=${panelId}`;
                await axios.get(`${BaseUrl}${generalPanels}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setActivePanelType(response.panel_type);
                    setNormalCount(response.breakers);
                    setPanel(response);
                    BreakersStore.update((s) => {
                        s.panelData = response;
                    });
                    setFetchedPanelResponse(response);
                    setIsPanelDataFetched(false);
                });
            } catch (error) {
                setIsPanelDataFetched(false);
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };

        const fetchBreakersData = async () => {
            try {
                setBreakerDataFetched(true);

                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?panel_id=${panelId}`;

                await axios.get(`${BaseUrl}${getBreakers}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    setBreakersData(response);
                    setBreakerDataFetched(false);
                    LoadingStore.update((s) => {
                        s.isBreakerDataFetched = false;
                    });
                });
            } catch (error) {
                console.log(error);
                setBreakerDataFetched(false);
                console.log('Failed to fetch Breakers Data List');
            }
        };

        const fetchPanelsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalPanels}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setPanelsDataList(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };

        const fetchEquipmentData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&occupancy_filter=true`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    let responseData = res.data.data;
                    let equipArray = [];
                    responseData.forEach((record) => {
                        if (record.equipments_name === '') {
                            return;
                        }
                        let obj = {
                            label: record.equipments_name,
                            value: record.equipments_id,
                            breakerId: record.breaker_id,
                        };
                        equipArray.push(obj);
                    });
                    setEquipmentData(equipArray);
                    BreakersStore.update((s) => {
                        s.equipmentData = equipArray;
                    });
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Equipments Data');
            }
        };

        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&page_size=100&page_no=1`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let responseData = res.data.data;
                    let newArray = [];
                    responseData.forEach((record) => {
                        let obj = {
                            label: record.identifier,
                            value: record.equipments_id,
                        };
                        newArray.push(obj);
                    });
                    setPassiveDeviceData(newArray);
                    BreakersStore.update((s) => {
                        s.passiveDeviceData = newArray;
                    });
                    BreakersStore.update((s) => {
                        s.totalPassiveDeviceCount = res?.data?.total_data;
                    });
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Passive devices');
            }
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let requestedBldgId;
                if (bldgId === null || bldgId === 1) {
                    requestedBldgId = localStorage.getItem('buildingId');
                } else {
                    requestedBldgId = bldgId;
                }
                await axios.get(`${BaseUrl}${getLocation}/${requestedBldgId}`, { headers }).then((res) => {
                    setLocationDataList(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchSinglePanelData();
        fetchBreakersData();
        fetchPanelsData();
        fetchPassiveDeviceData();
        fetchLocationData();
        fetchEquipmentData();
    }, [panelId]);

    useEffect(() => {
        if (breakersData.length === 0) {
            return;
        }

        let distributedBreakerArray = [];
        let disconnectBreakerArray = [];

        // If Breakers are of Disconnected Panels
        breakersData.forEach((record) => {
            let obj = {
                id: record.id,
                type: 'disconnectedBreakerComponent',
                sourcePosition: 'right',
                targetPosition: 'left',
                data: {
                    name: record.name,
                    breaker_number: record.breaker_number,
                    phase_configuration: record.phase_configuration,
                    rated_amps: record.rated_amps,
                    voltage: record.voltage,
                    equipment_link: record.equipment_link,
                    sensor_id: record.sensor_link,
                    device_id: record.device_link,
                    breakerType: record.breaker_type,
                    parentBreaker: record.parent_breaker,
                    isLinked: record.is_linked,
                },
                position: { x: 250, y: getDiscYaxisCordinates(record.breaker_number) },
                draggable: false,
            };
            disconnectBreakerArray.push(obj);
        });

        // If Breakers are of Distributed Panels
        breakersData.forEach((record) => {
            let obj = {
                id: record.id,
                type: 'breakerComponent',
                targetPosition: record.breaker_number % 2 === 0 ? 'right' : 'left',
                sourcePosition: record.breaker_number % 2 === 0 ? 'left' : 'right',
                data: {
                    name: record.name,
                    breaker_number: record.breaker_number,
                    phase_configuration: record.phase_configuration,
                    rated_amps: record.rated_amps,
                    voltage: record.voltage,
                    equipment_link: record.equipment_link,
                    sensor_id: record.sensor_link,
                    device_id: record.device_link,
                    breakerType: record.breaker_type,
                    parentBreaker: record.parent_breaker,
                    isLinked: record.is_linked,
                },
                position: {
                    x: record.breaker_number % 2 === 0 ? 475 : 50,
                    y: getYaxisCordinates(record.breaker_number),
                },
                draggable: false,
            };

            distributedBreakerArray.push(obj);
        });

        setDistributedBreakersNodes(distributedBreakerArray);
        setDisconnectedBreakersNodes(disconnectBreakerArray);

        BreakersStore.update((s) => {
            s.distributedBreakersData = distributedBreakerArray;
        });
        BreakersStore.update((s) => {
            s.disconnectedBreakersData = disconnectBreakerArray;
        });

        // Setup Linking between Breakers
        let breakerLinks = [];
        let disconnectBreakerLinks = [];

        breakersData.forEach((record) => {
            if (record.breaker_number + 2 > breakersData.length) {
                return;
            }
            let obj = {
                id: generateBreakerLinkId(),
                source: record.id,
                target: getTargetBreakerId(record?.breaker_number + 2),
                type: 'breakerLink',
            };
            breakerLinks.push(obj);
        });

        breakersData.forEach((record) => {
            if (record.breaker_number + 1 > breakersData.length) {
                return;
            }
            let obj = {
                id: generateBreakerLinkId(),
                source: record.id,
                target: getTargetBreakerId(record?.breaker_number + 1),
                type: 'disconnectBreakerLink',
            };
            disconnectBreakerLinks.push(obj);
        });

        setDistributedBreakersEdges(breakerLinks);
        setDisconnectedBreakersEdges(disconnectBreakerLinks);

        BreakersStore.update((s) => {
            s.breakerLinkData = breakerLinks;
        });
        BreakersStore.update((s) => {
            s.disconnectBreakerLinkData = disconnectBreakerLinks;
        });
    }, [breakersData]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container ml-2" xl={10}>
                    <span className="heading-style">Edit Panel</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        {panelDataFetched ? (
                            <Skeleton count={1} height={40} width={150} />
                        ) : (
                            <div className="ml-2">
                                <Link to="/settings/panels">
                                    <button type="button" className="btn btn-md btn-light font-weight-bold mr-2">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    disabled={comparePanelData(panel, fetchedPanelResponse)}
                                    onClick={() => {
                                        savePanelData();
                                    }}>
                                    {isProcessing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
            <Row style={{ marginLeft: '20px' }}>
                <Col xl={10}>
                    <div className="panel-first-row-style mt-4">
                        <FormGroup>
                            <Label for="panelName" className="card-title">
                                Name
                            </Label>
                            {panelDataFetched ? (
                                <Form>
                                    <Skeleton count={1} height={40} width={250} />
                                </Form>
                            ) : (
                                <Input
                                    type="text"
                                    name="panelName"
                                    id="panelName"
                                    placeholder="Panel Name"
                                    onChange={(e) => {
                                        handleChange('panel_name', e.target.value);
                                    }}
                                    className="font-weight-bold"
                                    value={panel.panel_name}
                                />
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Parent Panel
                            </Label>
                            {panelDataFetched ? (
                                <Form>
                                    <Skeleton count={1} height={40} width={250} />
                                </Form>
                            ) : (
                                <Input
                                    type="select"
                                    name="state"
                                    id="userState"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        handleChange('parent_id', e.target.value);
                                    }}
                                    value={panel.parent_id}>
                                    <option>None</option>
                                    {panelsDataList.map((record) => {
                                        if (record.panel_id === panelId) {
                                            return;
                                        }
                                        return <option value={record.panel_id}>{record.panel_name}</option>;
                                    })}
                                </Input>
                            )}
                        </FormGroup>

                        <FormGroup>
                            <Label for="location" className="card-title">
                                Location
                            </Label>
                            {panelDataFetched ? (
                                <Form>
                                    <Skeleton count={1} height={40} width={250} />
                                </Form>
                            ) : (
                                <Input
                                    type="select"
                                    name="state"
                                    id="userState"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        if (e.target.value === 'Select Location') {
                                            return;
                                        }
                                        handleChange('location_id', e.target.value);
                                    }}
                                    value={panel.location_id}>
                                    <option>Select Location</option>
                                    {locationDataList.map((record) => {
                                        return <option value={record.location_id}>{record.location_name}</option>;
                                    })}
                                </Input>
                            )}
                        </FormGroup>
                    </div>
                </Col>
            </Row>

            <Row style={{ marginLeft: '20px', marginBottom: '25vh' }}>
                <Col xl={10}>
                    <div className="panel-container-style mt-4">
                        <Row className="panel-header-styling ml-1 mr-1">
                            <div className="panel-header-filter">
                                <div>
                                    <FormGroup className="form-group row m-4 width-custom-style">
                                        <Label for="panelName" className="card-title">
                                            Type
                                        </Label>
                                        {panelDataFetched ? (
                                            <Form>
                                                <Skeleton count={1} height={40} width={150} />
                                            </Form>
                                        ) : (
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="fields-disabled-style"
                                                onChange={(e) => {
                                                    setActivePanelType(e.target.value);
                                                }}
                                                disabled={true}
                                                value={panel.panel_type}>
                                                {panelType.map((record) => {
                                                    return <option value={record.value}>{record.name}</option>;
                                                })}
                                            </Input>
                                        )}
                                    </FormGroup>
                                </div>
                                <div>
                                    <FormGroup className="form-group row m-4 width-custom-style">
                                        <Label for="panelName" className="card-title">
                                            Number of Breakers
                                        </Label>
                                        {panelDataFetched ? (
                                            <Form>
                                                <Skeleton count={1} height={40} width={150} />
                                            </Form>
                                        ) : (
                                            <>
                                                {activePanelType === 'distribution' ? (
                                                    <Input
                                                        type="number"
                                                        name="breakers"
                                                        id="breakers"
                                                        value={panel.breakers}
                                                        onChange={(e) => {
                                                            if (normalCount > parseInt(e.target.value)) {
                                                                removeBreakersFromList();
                                                            }
                                                            if (normalCount < parseInt(e.target.value)) {
                                                                addBreakersToList(e.target.value);
                                                            }
                                                            setNormalCount(parseInt(e.target.value));
                                                        }}
                                                        className="breaker-no-width fields-disabled-style"
                                                        disabled={true}
                                                    />
                                                ) : (
                                                    <Input
                                                        type="select"
                                                        name="state"
                                                        id="userState"
                                                        className="font-weight-bold breaker-no-width fields-disabled-style"
                                                        value={panel.breakers}
                                                        onChange={(e) => {
                                                            handleDisconnectBreakers(
                                                                disconnectBreakerCount,
                                                                parseInt(e.target.value)
                                                            );
                                                            setDisconnectBreakerCount(parseInt(e.target.value));
                                                        }}
                                                        disabled={true}>
                                                        {disconnectBreaker.map((record) => {
                                                            return <option value={record.value}>{record.name}</option>;
                                                        })}
                                                    </Input>
                                                )}
                                            </>
                                        )}
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="float-right m-4">
                                {panelDataFetched ? (
                                    <Form>
                                        <Skeleton count={1} height={40} width={150} />
                                    </Form>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-md btn-secondary font-weight-bold"
                                        onClick={() => {
                                            setIsEditable(!isEditable);
                                            BreakersStore.update((s) => {
                                                s.isEditable = !isEditable;
                                            });
                                        }}>
                                        {isEditable ? 'Done Editing' : 'Edit Layout'}
                                    </button>
                                )}
                            </div>
                        </Row>

                        {isBreakerDataFetched && (
                            <Row>
                                <div
                                    style={{ width: '50%', height: '30vh', position: 'relative' }}
                                    className="breaker-loader-styling">
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                    <Skeleton count={1} height={50} width={200} />
                                </div>
                            </Row>
                        )}

                        {activePanelType === 'distribution' && !isBreakerDataFetched && !panelDataFetched && (
                            <>
                                <Row className="main-breaker-styling mb-0">
                                    <div className="breaker-container">
                                        <div className="breaker-style">
                                            <div className="breaker-content-middle">
                                                <div className="breaker-index font-weight-bold">M</div>
                                            </div>
                                            <div className="breaker-content-middle">
                                                <div className="dot-status"></div>
                                            </div>
                                            <div className="breaker-content-middle">
                                                <div className="breaker-content">
                                                    <span>{panel.voltage === '' ? '' : `${panel.rated_amps}A`}</span>
                                                    <span>
                                                        {panel.voltage === '' && ''}
                                                        {panel.voltage === '120/240' && '240V'}
                                                        {panel.voltage === '208/120' && '120V'}
                                                        {panel.voltage === '480' && '480V'}
                                                        {panel.voltage === '600' && '600V'}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* <div
                                            className="breaker-content-middle"
                                            onClick={() => {
                                                handleMainShow();
                                            }}>
                                            <div className="edit-icon-bg-styling mr-2">
                                                <i className="uil uil-pen"></i>
                                            </div>
                                            <span className="font-weight-bold edit-btn-styling">Edit</span>
                                        </div> */}
                                        </div>
                                    </div>
                                </Row>

                                {!panelDataFetched && (
                                    <div className="row m-4">
                                        {isEditable && (
                                            <ReactFlow
                                                nodes={distributedBreakersNodes}
                                                edges={distributedBreakersEdges}
                                                onNodesChange={onNodesChange}
                                                onEdgesChange={onEdgesChange}
                                                onConnect={onConnect}
                                                nodeTypes={nodeTypes}
                                                edgeTypes={edgeTypes}
                                                style={reactFlowDistributeStyle}
                                                zoomOnScroll={false}
                                                panOnScroll={false}
                                                preventScrolling={false}
                                                onPaneScroll={false}
                                                panOnDrag={false}
                                            />
                                        )}
                                        {!isEditable && (
                                            <ReactFlow
                                                nodes={distributedBreakersNodes}
                                                onNodesChange={onNodesChange}
                                                onEdgesChange={onEdgesChange}
                                                onConnect={onConnect}
                                                nodeTypes={nodeTypes}
                                                edgeTypes={edgeTypes}
                                                style={reactFlowDistributeStyle}
                                                zoomOnScroll={false}
                                                panOnScroll={false}
                                                preventScrolling={false}
                                                onPaneScroll={false}
                                                panOnDrag={false}
                                            />
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {activePanelType === 'disconnect' && !isBreakerDataFetched && !panelDataFetched && (
                            <div className="row m-4">
                                <ReactFlow
                                    nodes={disconnectedBreakersNodes}
                                    edges={disconnectedBreakersEdges}
                                    onNodesChange={onNodesChangeForDisconnect}
                                    onEdgesChange={onEdgesChangeForDisconnect}
                                    onConnect={onConnectForDisconnect}
                                    nodeTypes={nodeTypes}
                                    edgeTypes={edgeTypes}
                                    style={reactFlowDisconnectStyle}
                                    zoomOnScroll={false}
                                    panOnScroll={false}
                                    preventScrolling={false}
                                    onPaneScroll={false}
                                    panOnDrag={false}
                                />
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            <Modal show={showMain} onHide={handleMainClose} centered backdrop="static" keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="edit-panel-title ml-2 mb-0">Edit Panel Input</h5>
                        <p className="edit-panel-subtitle ml-2">{panel.name}</p>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Rated Amps</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Amps"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handlePanelConfigChange('rated_amps', e.target.value);
                                }}
                                defaultValue={panelConfig.rated_amps === null ? 200 : panelConfig.rated_amps}
                                value={panelConfig.rated_amps === null ? 200 : panelConfig.rated_amps}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Volts</Form.Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold selection-volts-style"
                                placeholder="Select Volts"
                                onChange={(e) => {
                                    handlePanelConfigChange('voltage', e.target.value);
                                }}
                                value={panelConfig.voltage}>
                                <option>Select Volts</option>
                                <option value="120/240">120/240</option>
                                <option value="208/120">208/120</option>
                                <option value="480">480</option>
                                <option value="600">600</option>
                            </Input>
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleMainClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            updateChangesToPanel();
                            handleMainClose();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default EditBreakerPanel;
