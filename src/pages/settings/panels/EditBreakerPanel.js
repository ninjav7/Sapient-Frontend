import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Input } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useAtom } from 'jotai';
import { useParams, useHistory } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import ReactFlow, { addEdge, applyNodeChanges, applyEdgeChanges } from 'react-flow-renderer';
import BreakerLink from './BreakerLinkForDistribution';
import BreakerLinkForDisconnect from './BreakerLinkForDisconnect';
import BreakersComponent from './BreakerFlowForDistribution';
import BreakerConfiguration from './BreakerConfiguration';
import DisconnectedBreakerComponent from './BreakerFlowForDisconnect';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { comparePanelData, panelType } from './utils';
import { userPermissionData } from '../../../store/globalState';
import DeletePanel from './DeletePanel';
import {
    deleteCurrentPanel,
    getBreakersList,
    getEquipmentsList,
    getLocationData,
    getPanelsList,
    getPassiveDeviceList,
    resetAllBreakers,
    updatePanelDetails,
} from './services';
import UnlinkAllBreakers from './UnlinkAllBreakers';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';
import './styles.scss';
import './panel-style.css';

// Added Node and Egde types
const nodeTypes = {
    breakerComponent: BreakerConfiguration,
    disconnectedBreakerComponent: DisconnectedBreakerComponent,
};

const edgeTypes = {
    breakerLink: BreakerLink,
    disconnectBreakerLink: BreakerLinkForDisconnect,
};

const EditBreakerPanel = () => {
    const history = useHistory();
    const [userPermission] = useAtom(userPermissionData);

    const { panelId } = useParams();

    // Main Breaker Modal
    const [showMain, setShowMain] = useState(false);
    const handleMainClose = () => setShowMain(false);
    const handleMainShow = () => setShowMain(true);

    // Unlink Alert Modal
    const [showUnlinkAlert, setShowUnlinkAlert] = useState(false);
    const handleUnlinkAlertClose = () => setShowUnlinkAlert(false);
    const handleUnlinkAlertShow = () => setShowUnlinkAlert(true);

    // Delete Panel Modal
    const [showDeletePanelAlert, setShowDeletePanelAlert] = useState(false);
    const handleDeletePanelAlertClose = () => setShowDeletePanelAlert(false);
    const handleDeletePanelAlertShow = () => setShowDeletePanelAlert(true);

    const [equipmentData, setEquipmentData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const isBreakerApiTrigerred = LoadingStore.useState((s) => s.isBreakerDataFetched);
    const isEditable = BreakersStore.useState((s) => s.isEditable);
    const isLoading = LoadingStore.useState((s) => s.isLoading);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const [parentPanel, setParentPanel] = useState([]);
    const [location, setLocation] = useState([]);

    const addPanelData = () => {
        panelsDataList.map((item) => {
            setParentPanel((el) => [...el, { value: `${item?.panel_id}`, label: `${item?.panel_name}` }]);
        });
    };

    const addLocationData = () => {
        locationDataList.map((item) => {
            setLocation((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    useEffect(() => {
        if (panelsDataList) {
            addPanelData();
        }
    }, [panelsDataList]);

    useEffect(() => {
        if (locationDataList) {
            addLocationData();
        }
    }, [locationDataList]);

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

    const getTargetBreakerId = (targetBreakerNo) => {
        let targetObj = breakersData?.find((obj) => obj?.breaker_number === targetBreakerNo);
        return targetObj?.id;
    };

    const triggerBreakerAPI = () => {
        LoadingStore.update((s) => {
            s.isBreakerDataFetched = true;
        });
    };

    const onCancelClick = () => {
        history.push({
            pathname: `/settings/panels`,
        });
    };

    const savePanelData = async () => {
        setIsProcessing(true);
        const params = `?panel_id=${panelId}`;
        const panelObj = {
            name: panel?.panel_name,
            parent_panel: panel?.parent_id,
            space_id: panel?.location_id,
        };
        await updatePanelDetails(params, panelObj)
            .then((res) => {
                setIsProcessing(false);
                history.push({
                    pathname: `/settings/panels`,
                });
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    const unLinkAllBreakers = async () => {
        setIsResetting(true);
        const params = `?panel_id=${panelId}`;
        const payload = { panel_id: panelId };
        await resetAllBreakers(params, payload)
            .then((res) => {
                setIsResetting(false);
                window.scrollTo(0, 0);
                handleUnlinkAlertClose();
                triggerBreakerAPI();
            })
            .catch(() => {
                setIsResetting(false);
            });
    };

    const deletePanel = async () => {
        setIsDeleting(true);
        const params = `?panel_id=${panelId}`;
        await deleteCurrentPanel(params)
            .then((res) => {
                setIsDeleting(false);
                handleDeletePanelAlertClose();
                history.push({
                    pathname: `/settings/panels`,
                });
            })
            .catch(() => {
                setIsDeleting(false);
            });
    };

    const fetchBreakersData = async (panel_id, bldg_id) => {
        setBreakerDataFetched(true);
        LoadingStore.update((s) => {
            s.isLoading = true;
        });
        const params = `?panel_id=${panel_id}&building_id=${bldg_id}`;
        await getBreakersList(params)
            .then((res) => {
                const response = res?.data?.data;
                setBreakersData(response);
                setBreakerDataFetched(false);
                LoadingStore.update((s) => {
                    s.isBreakerDataFetched = false;
                    s.isLoading = false;
                });
            })
            .catch(() => {
                setBreakerDataFetched(false);
                LoadingStore.update((s) => {
                    s.isBreakerDataFetched = false;
                    s.isLoading = false;
                });
            });
    };

    const fetchEquipmentData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}&occupancy_filter=true`;
        await getEquipmentsList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const equipArray = [];
                responseData.forEach((record) => {
                    if (record.equipments_name === '') {
                        return;
                    }
                    const obj = {
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
            })
            .catch(() => {});
    };

    const fetchSinglePanelData = async (panel_id, bldg_id) => {
        setIsPanelDataFetched(true);
        const params = `?building_id=${bldg_id}&panel_id=${panel_id}`;
        await getPanelsList(params)
            .then((res) => {
                const response = res?.data;
                setActivePanelType(response?.panel_type);
                setNormalCount(response?.breakers);
                setPanel(response);
                BreakersStore.update((s) => {
                    s.panelData = response;
                });
                setFetchedPanelResponse(response);
                setIsPanelDataFetched(false);
            })
            .catch(() => {
                setIsPanelDataFetched(false);
            });
    };

    const fetchPanelsData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}`;
        await getPanelsList(params)
            .then((res) => {
                let response = res?.data?.data;
                setPanelsDataList(response);
            })
            .catch(() => {});
    };

    const fetchPassiveDeviceData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}&page_no=1&page_size=150`;
        await getPassiveDeviceList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const newArray = [];
                responseData.forEach((record) => {
                    const obj = {
                        label: record?.identifier,
                        value: record?.equipments_id,
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
            })
            .catch(() => {});
    };

    const fetchLocationData = async (bldg_id) => {
        const params = `/${bldg_id}`;
        await getLocationData(params)
            .then((res) => {
                const responseData = res?.data;
                responseData.length === 0 ? setLocationDataList([]) : setLocationDataList(responseData);
            })
            .catch(() => {});
    };

    useEffect(() => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Panels',
                    path: '/settings/panels',
                    active: false,
                },
                {
                    label: panel?.panel_name,
                    path: '/settings/panels/edit-panel',
                    active: true,
                },
            ];
            bs.items = newList;
        });
    }, [panel]);

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

        fetchBreakersData(panelId, bldgId);
        fetchEquipmentData(bldgId);
    }, [isBreakerApiTrigerred]);

    useEffect(() => {
        fetchSinglePanelData(panelId, bldgId);
        fetchBreakersData(panelId, bldgId);
        fetchEquipmentData(bldgId);
        fetchPanelsData(bldgId);
        fetchPassiveDeviceData(bldgId);
        fetchLocationData(bldgId);
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
                    device_name: record.device_name,
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
                    device_name: record.device_name,
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
                id: `breaker-${record?.breaker_number}`,
                source: record?.id,
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
                id: `breaker-${record?.breaker_number}`,
                source: record?.id,
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

    useEffect(() => {
        const pageDefaultGlobalState = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Panels',
                        path: '/settings/panels',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
            BreakersStore.update((bs) => {
                bs.isEditable = false;
            });
            window.scrollTo(0, 0);
        };
        pageDefaultGlobalState();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Edit Panel</Typography.Header>
                        </div>
                        {panelDataFetched ? (
                            <Skeleton count={1} height={35} width={135} />
                        ) : (
                            <div className="d-flex">
                                <div>
                                    <Button
                                        label="Cancel"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                        onClick={onCancelClick}
                                    />
                                </div>
                                <div>
                                    {userPermission?.user_role === 'admin' ||
                                    userPermission?.permissions?.permissions?.building_panels_permission?.edit ? (
                                        <Button
                                            label={isProcessing ? 'Saving' : 'Save'}
                                            size={Button.Sizes.md}
                                            type={Button.Type.primary}
                                            onClick={savePanelData}
                                            className="ml-2"
                                            disabled={comparePanelData(panel, fetchedPanelResponse)}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={11}>
                    <div className="edit-panel-custom-grid">
                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Name</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {panelDataFetched ? (
                                <Skeleton count={1} height={35} width={250} />
                            ) : (
                                <InputTooltip
                                    placeholder="Enter Panel Name"
                                    onChange={(e) => {
                                        handleChange('panel_name', e.target.value);
                                    }}
                                    labelSize={Typography.Sizes.md}
                                    value={panel?.panel_name}
                                    disabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>

                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Parent Panel</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {panelDataFetched ? (
                                <Skeleton count={1} height={35} width={250} />
                            ) : (
                                <Select
                                    placeholder="Select Parent Panel"
                                    options={parentPanel}
                                    currentValue={parentPanel.filter((option) => option.value === panel?.parent_id)}
                                    onChange={(e) => {
                                        handleChange('parent_id', e.value);
                                    }}
                                    isSearchable={true}
                                    disabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>

                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Location</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {panelDataFetched ? (
                                <Skeleton count={1} height={35} width={475} />
                            ) : (
                                <Select
                                    placeholder="Select Location"
                                    options={location}
                                    currentValue={location.filter((option) => option.value === panel?.location_id)}
                                    onChange={(e) => {
                                        handleChange('location_id', e.value);
                                    }}
                                    isSearchable={true}
                                    disabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={11}>
                    <div className="panel-container-style">
                        <Brick sizeInRem={2} />

                        <div className="d-flex justify-content-between pl-4 pr-4">
                            {isEditable ? (
                                <div className="d-flex">
                                    <div className="mr-2">
                                        <Typography.Body size={Typography.Sizes.md}>Types</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        {panelDataFetched ? (
                                            <Skeleton count={1} height={35} width={125} />
                                        ) : (
                                            <Select
                                                placeholder="Select Panel Types"
                                                options={panelType}
                                                currentValue={panelType.filter(
                                                    (option) => option.value === panel?.panel_type
                                                )}
                                                onChange={(e) => {
                                                    setActivePanelType(e.target.value);
                                                }}
                                                isSearchable={true}
                                                disabled={true}
                                            />
                                        )}
                                    </div>
                                    <div className="ml-2">
                                        <Typography.Body size={Typography.Sizes.md}>Number of Breakers</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        {panelDataFetched || isLoading ? (
                                            <Skeleton count={1} height={35} width={225} />
                                        ) : (
                                            <InputTooltip
                                                type="number"
                                                placeholder="Enter Breakers"
                                                onChange={(e) => {
                                                    if (normalCount > parseInt(e.target.value)) {
                                                        removeBreakersFromList();
                                                    }
                                                    if (normalCount < parseInt(e.target.value)) {
                                                        addBreakersToList(e.target.value);
                                                    }
                                                    setNormalCount(parseInt(e.target.value));
                                                }}
                                                labelSize={Typography.Sizes.md}
                                                value={breakersData?.length}
                                                disabled
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center">
                                    {panelDataFetched || isLoading ? (
                                        <Skeleton count={1} height={35} width={225} />
                                    ) : (
                                        <Typography.Header
                                            size={
                                                Typography.Sizes.md
                                            }>{`${breakersData?.length} Breakers`}</Typography.Header>
                                    )}
                                </div>
                            )}
                            <div>
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.building_panels_permission?.edit ? (
                                    <Button
                                        label={isEditable ? 'Done Editing' : 'Edit Layout'}
                                        size={Button.Sizes.lg}
                                        type={isEditable ? Button.Type.secondary : Button.Type.secondaryGrey}
                                        className="w-100"
                                        onClick={() => {
                                            BreakersStore.update((s) => {
                                                s.isEditable = !isEditable;
                                            });
                                        }}
                                    />
                                ) : null}
                            </div>
                        </div>

                        <Brick sizeInRem={2.5} />

                        {isLoading && (
                            <Row>
                                <div className="breaker-loader-styling w-50 position-relative">
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

                        {activePanelType === 'distribution' && !isLoading && !panelDataFetched && (
                            <>
                                <Row className="main-breaker-styling">
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
                                    </div>
                                )}
                            </>
                        )}

                        {activePanelType === 'disconnect' && !isLoading && !panelDataFetched && (
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

                        {isEditable && (
                            <UnlinkAllBreakers
                                isResetting={isResetting}
                                isLoading={isLoading}
                                showUnlinkAlert={showUnlinkAlert}
                                handleUnlinkAlertShow={handleUnlinkAlertShow}
                                handleUnlinkAlertClose={handleUnlinkAlertClose}
                                unLinkAllBreakers={unLinkAllBreakers}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            {isEditable && <Brick sizeInRem={2} />}

            {isEditable && (
                <DeletePanel
                    isDeleting={isDeleting}
                    isLoading={isLoading}
                    showDeletePanelAlert={showDeletePanelAlert}
                    handleDeletePanelAlertShow={handleDeletePanelAlertShow}
                    handleDeletePanelAlertClose={handleDeletePanelAlertClose}
                    deletePanel={deletePanel}
                />
            )}

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
                    <button variant="light" onClick={handleMainClose}>
                        Cancel
                    </button>
                    <button
                        variant="primary"
                        onClick={() => {
                            updateChangesToPanel();
                            handleMainClose();
                        }}>
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default EditBreakerPanel;
