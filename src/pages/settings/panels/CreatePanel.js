import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import {
    BaseUrl,
    getLocation,
    generalPanels,
    generalPassiveDevices,
    createPanel,
    createBreaker,
    generalEquipments,
    listSensor,
} from '../../../services/Network';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';
import { MultiSelect } from 'react-multi-select-component';
import { ComponentStore } from '../../../store/ComponentStore';
import '../style.css';
import './panel-style.css';

const CreatePanel = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const { v4: uuidv4 } = require('uuid');
    const generateBreakerLinkId = () => uuidv4();

    // Edit Breaker Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    // Main Breaker Modal
    const [showMain, setShowMain] = useState(false);
    const handleMainClose = () => setShowMain(false);
    const handleMainShow = () => setShowMain(true);

    const [updateData, setUpdateData] = useState({});
    const [equipmentData, setEquipmentData] = useState([]);
    const [sensorData, setSensorData] = useState([]);

    const [currentBreakerObj, setCurrentBreakerObj] = useState({});
    const [currentBreakerIndex, setCurrentBreakerIndex] = useState(0);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedPanelId, setGeneratedPanelId] = useState('');

    const [panel, setPanel] = useState({
        name: 'Panel Name',
        parent_panel: '',
        device_id: '',
        space_id: '',
        voltage: '',
        phase_config: 1,
        rated_amps: 0,
        breaker_count: 48,
    });

    const [panelConfig, setPanelConfig] = useState({
        voltage: '',
        phase_config: 1,
        rated_amps: 0,
    });

    const [normalStruct, setNormalStruct] = useState([]);

    const [normalCount, setNormalCount] = useState(10);
    const [disconnectBreakerCount, setDisconnectBreakerCount] = useState(3);
    const [locationData, setLocationData] = useState([]);

    const [panelType, setPanelType] = useState([
        {
            name: 'Distribution',
            value: 'distribution',
        },
        {
            name: 'Disconnect',
            value: 'disconnect',
        },
    ]);

    const [disconnectBreaker, setDisconnectBreaker] = useState([
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
    ]);

    const [breakerLevel, setBreakerLevel] = useState([
        {
            name: 'Single-Breaker',
            value: 'single-breaker',
        },
        {
            name: 'Double-Breaker',
            value: 'double-breaker',
        },
        {
            name: 'Triple-Breaker',
            value: 'triple-breaker',
        },
    ]);

    const [currentBreakerLevel, setCurrentBreakerLevel] = useState('single-breaker');

    const [activeLinkedBreakers, setActiveLinkedBreakers] = useState([
        [1, 3],
        [2, 4, 6],
        [5, 7, 9],
    ]);
    const [doubleLinkedBreaker, setDoubleLinkedBreaker] = useState([]);
    const [tripleLinkedBreaker, setTripleLinkedBreaker] = useState([]);

    const [activePanelType, setActivePanelType] = useState('distribution');
    const [generalPanelData, setGeneralPanelData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [currentEquipIds, setCurrentEquipIds] = useState([]);

    const [isEditing, setIsEditing] = useState(true);

    const [normalData, setNormalData] = useState({
        related_amps: 200,
    });
    const [normalDataIndex, setNormalDataIndex] = useState(0);

    const [selectedEquipOptions, setSelectedEquipOptions] = useState([]);

    const getBreakerId = () => uuidv4();

    const [main, setMain] = useState({
        phase: 1,
        voltage: '',
        amps: '200',
        equipment_name: '',
        uniqueId: getBreakerId(),
        parentId: '',
        breakerNo: 0,
        type: 'main-breaker',
    });

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panel);
        if (key === 'breaker_count') {
            value = parseInt(value);
        }
        if (key === 'rated_amps') {
            value = parseInt(value);
        }
        obj[key] = value;
        setPanel(obj);
    };

    const handleCurrentLinkedBreaker = (currentIndex) => {
        console.log('SSR newArray => ', currentIndex + 1);

        let linkedBreakers = activeLinkedBreakers;
        let newArray = linkedBreakers.filter((arrayElement) => {
            return arrayElement[0] === currentIndex + 1;
        });

        if (newArray.length === 0) {
            setCurrentBreakerLevel('single-breaker');
            setDoubleLinkedBreaker([]);
            setTripleLinkedBreaker([]);
            return;
        }

        if (newArray[0].length === 2) {
            setDoubleLinkedBreaker(newArray);
            setTripleLinkedBreaker([]);
            setCurrentBreakerLevel('double-breaker');
            return;
        }

        if (newArray[0].length === 3) {
            setTripleLinkedBreaker(newArray);
            setDoubleLinkedBreaker([]);
            setCurrentBreakerLevel('triple-breaker');
            return;
        }
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

    const handleBreakerConfigChange = (key, value) => {
        let obj = Object.assign({}, currentBreakerObj);
        if (key === 'rated_amps') {
            value = parseInt(value);
        }
        if (key === 'phase_configuration') {
            value = parseInt(value);
        }
        if (key === 'equipment_link') {
            let arr = [];
            arr.push(value);
            value = arr;
        }
        if (value === 'Select Volts') {
            value = '';
        }
        obj[key] = value;
        setCurrentBreakerObj(obj);
    };

    const addNormalSingleData = () => {
        if (normalDataIndex !== -1) {
            let newArray = normalStruct;
            newArray[normalDataIndex] = normalData;
            setNormalStruct(newArray);
        } else {
            let obj = normalData;
            obj.parentId = obj.uniqueId;
            setMain(obj);
        }
    };

    const updateSingleBreakerData = () => {
        let newArray = normalStruct;
        newArray[currentBreakerIndex] = currentBreakerObj;
        setNormalStruct(newArray);
    };

    const updateDoubleBreakerData = (firstBreakerIndex, secondBreakerIndex) => {
        let linkId = generateBreakerLinkId();
        let newArray = normalStruct;

        let firstBreakerObj = Object.assign({}, currentBreakerObj);
        let secondBreakerObj = Object.assign({}, currentBreakerObj);

        firstBreakerObj.breaker_number = firstBreakerIndex;
        secondBreakerObj.breaker_number = secondBreakerIndex;

        firstBreakerObj.link_id = linkId;
        secondBreakerObj.link_id = linkId;

        firstBreakerObj.link_type = 'linked';
        secondBreakerObj.link_type = 'linked';

        newArray[firstBreakerIndex - 1] = firstBreakerObj;
        newArray[secondBreakerIndex - 1] = secondBreakerObj;
        setNormalStruct(newArray);
    };

    const updateTripleBreakerData = (firstBreakerIndex, secondBreakerIndex, thirdBreakerIndex) => {
        let newArray = normalStruct;

        let firstBreakerObj = Object.assign({}, currentBreakerObj);
        let secondBreakerObj = Object.assign({}, currentBreakerObj);
        let thirdBreakerObj = Object.assign({}, currentBreakerObj);

        firstBreakerObj.breaker_number = firstBreakerIndex;
        secondBreakerObj.breaker_number = secondBreakerIndex;
        thirdBreakerObj.breaker_number = thirdBreakerIndex;

        secondBreakerObj.sensor_id = firstBreakerObj.sensor_id1;
        secondBreakerObj.device_id = firstBreakerObj.device_id1;
        thirdBreakerObj.sensor_id = firstBreakerObj.sensor_id2;
        thirdBreakerObj.device_id = firstBreakerObj.device_id2;

        firstBreakerObj.link_type = 'linked';
        secondBreakerObj.link_type = 'linked';
        thirdBreakerObj.link_type = 'linked';

        firstBreakerObj.phase_configuration = 3;
        secondBreakerObj.phase_configuration = 3;
        thirdBreakerObj.phase_configuration = 3;

        delete firstBreakerObj.sensor_id1;
        delete firstBreakerObj.device_id1;
        delete secondBreakerObj.device_id1;
        delete secondBreakerObj.device_id1;
        delete thirdBreakerObj.device_id1;
        delete thirdBreakerObj.device_id1;

        delete firstBreakerObj.sensor_id2;
        delete firstBreakerObj.device_id2;
        delete secondBreakerObj.device_id2;
        delete secondBreakerObj.device_id2;
        delete thirdBreakerObj.device_id2;
        delete thirdBreakerObj.device_id2;

        let linkId = generateBreakerLinkId();
        firstBreakerObj.link_id = linkId;
        secondBreakerObj.link_id = linkId;
        thirdBreakerObj.link_id = linkId;

        newArray[firstBreakerIndex - 1] = firstBreakerObj;
        newArray[secondBreakerIndex - 1] = secondBreakerObj;
        newArray[thirdBreakerIndex - 1] = thirdBreakerObj;
        setNormalStruct(newArray);
    };

    const saveNormalDataToPanel = () => {
        let obj = Object.assign({}, panel);
        let newArray = normalStruct;
        newArray.push(main);
        obj['breakers'] = newArray;
        obj['breaker_count'] = normalCount;
        setPanel(obj);
    };

    const handleNormalChange = (key, value) => {
        if (value === 'Select Volts') {
            value = '';
        }
        let obj = Object.assign({}, normalData);
        obj[key] = value;
        setNormalData(obj);
    };

    const updateChangesToPanel = () => {
        let obj = {
            ...panel,
            ...panelConfig,
        };
        mainVoltageChange(obj.voltage === 'Select Volts' ? '' : obj.voltage);
        setPanel(obj);
    };

    const savePanelData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let newPanel = Object.assign({}, panel);
            newPanel.breaker_count = normalCount;

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${createPanel}`, newPanel, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    setGeneratedPanelId(response.id);
                });

            // setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to save Panel');
        }
    };

    const mainVoltageChange = (voltageValue) => {
        let newArray = normalStruct;

        if (currentBreakerLevel === 'single-breaker') {
            newArray.forEach((obj) => {
                if (voltageValue === '120/240') {
                    obj.voltage = '120';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === '208/120') {
                    obj.voltage = '120';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === '480') {
                    obj.voltage = '277';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === '600') {
                    obj.voltage = '347';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === 'Select Volts') {
                    obj.voltage = '';
                    obj.phase_configuration = 1;
                }
            });
        }

        if (currentBreakerLevel === 'double-breaker') {
            newArray.forEach((obj) => {
                if (voltageValue === '120/240') {
                    obj.voltage = '240';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === '208/120') {
                    obj.voltage = '208';
                    obj.phase_configuration = 1;
                }
                if (voltageValue === '480') {
                    obj.voltage = '480';
                    obj.phase_configuration = 1;
                }
                // if (voltageValue === '600') {
                //     obj.voltage = '347';
                //     obj.phase_configuration = 1;
                // }
                if (voltageValue === 'Select Volts') {
                    obj.voltage = '';
                    obj.phase_configuration = 1;
                }
            });
        }

        if (currentBreakerLevel === 'triple-breaker') {
            newArray.forEach((obj) => {
                // if (voltageValue === '120/240') {
                //     obj.voltage = '120';
                //     obj.phase_configuration = 1;
                // }
                if (voltageValue === '208/120') {
                    obj.voltage = '208';
                    obj.phase_configuration = 3;
                }
                if (voltageValue === '480') {
                    obj.voltage = '480';
                    obj.phase_configuration = 3;
                }
                if (voltageValue === '600') {
                    obj.voltage = '600';
                    obj.phase_configuration = 3;
                }
                if (voltageValue === 'Select Volts') {
                    obj.voltage = '';
                    obj.phase_configuration = 1;
                }
            });
        }

        setNormalStruct(newArray);
    };

    const fetchDeviceSensorData = async (deviceId) => {
        try {
            if (deviceId === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                console.log('Sensor Data Response => ', response);
                setSensorData(response);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Sensor Data');
        }
    };

    const addSelectedBreakerEquip = (equipId) => {
        let newArray = [];
        newArray.push(equipId);
        setCurrentEquipIds(newArray);
    };

    useEffect(() => {
        if (generatedPanelId === '') {
            return;
        }
        const saveBreakersData = async (panelID) => {
            try {
                let header = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let newBreakerArray = [];
                normalStruct.forEach((breaker) => {
                    breaker.voltage = parseInt(breaker.voltage);
                    newBreakerArray.push(breaker);
                });

                // setIsProcessing(true);
                let params = `?panel_id=${panelID}`;
                await axios
                    .post(`${BaseUrl}${createBreaker}${params}`, newBreakerArray, {
                        headers: header,
                    })
                    .then((res) => {
                        console.log(res.data);
                    });

                setIsProcessing(false);
            } catch (error) {
                setIsProcessing(false);
                alert('Failed to save Breakers');
            }
        };
        saveBreakersData(generatedPanelId);
    }, [generatedPanelId]);

    useEffect(() => {
        let newBreakers = [];
        for (let index = 1; index <= normalCount; index++) {
            // let newId = getBreakerId();
            let obj = {
                name: '',
                breaker_number: index,
                phase_configuration: 0,
                rated_amps: 0,
                voltage: '',
                link_type: 'unlinked',
                link_id: '',
                equipment_link: [],
                sensor_id: '',
                device_id: '',
            };
            newBreakers.push(obj);
        }
        setNormalStruct(newBreakers);
    }, [normalCount]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Create Panel',
                        path: '/settings/panels/createPanel',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    // useEffect(() => {
    //     let obj = Object.assign({}, currentBreakerObj);

    //     let arr = [];
    //     selectedEquipOptions.forEach((option) => {
    //         arr.push(option.value);
    //     });

    //     obj['equipment_link'] = arr;
    //     setCurrentBreakerObj(obj);
    // }, [selectedEquipOptions]);

    useEffect(() => {
        const fetchEquipmentData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    let responseData = res.data;
                    // let equipArray = [];
                    // responseData.forEach((record) => {
                    //     let obj = {
                    //         label: record.equipments_name,
                    //         value: record.equipments_id,
                    //     };
                    //     equipArray.push(obj);
                    // });
                    // setEquipmentData(equipArray);
                    setEquipmentData(responseData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Equipments Data');
            }
        };

        const fetchLocationData = async () => {
            try {
                if (bldgId) {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        // 'user-auth': '628f3144b712934f578be895',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                        setLocationData(res.data);
                    });
                }
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        const fetchPanelsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${generalPanels}`, { headers }).then((res) => {
                    setGeneralPanelData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };

        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                // let params = `?page_size=${pageSize}&page_no=${pageNo}`;
                let params = `?page_size=10&page_no=1`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let data = res.data;
                    setPassiveDeviceData(data.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Passive devices');
            }
        };

        fetchLocationData();
        fetchPanelsData();
        fetchPassiveDeviceData();
        fetchEquipmentData();
    }, [bldgId]);

    useEffect(() => {
        // console.log('Troubleshoot activeLinkedBreakers => ', activeLinkedBreakers);
        // console.log('Troubleshoot currentBreakerLevel => ', currentBreakerLevel);
        // console.log('Troubleshoot doubleLinkedBreaker => ', doubleLinkedBreaker);
        // console.log('Troubleshoot tripleLinkedBreaker => ', tripleLinkedBreaker);
        console.log('Troubleshoot normalStruct => ', normalStruct);
        console.log('Troubleshoot panel => ', panel);
        // console.log('Troubleshoot currentBreakerObj => ', currentBreakerObj);
    });

    return (
        <React.Fragment>
            <Row className="page-title" style={{ marginLeft: '20px' }}>
                <Col className="header-container" xl={10}>
                    <span className="heading-style">New Panel</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="ml-2">
                            <Link to="/settings/panels">
                                <button type="button" className="btn btn-md btn-light font-weight-bold mr-2">
                                    Cancel
                                </button>
                            </Link>
                            {/* <Link to="/settings/panels"> */}
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                // disabled={isProcessing}
                                disabled={panel.voltage === '' ? true : false}
                                onClick={() => {
                                    savePanelData();
                                    // saveBreakersData();
                                }}>
                                {isProcessing ? 'Saving...' : 'Save'}
                            </button>
                            {/* </Link> */}
                        </div>
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
                            <Input
                                type="text"
                                name="panelName"
                                id="panelName"
                                placeholder="Panel Name"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                className="font-weight-bold"
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Parent Panel
                            </Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('parent_panel', e.target.value);
                                }}>
                                <option>None</option>
                                {generalPanelData.map((record) => {
                                    return <option value={record.panel_id}>{record.panel_name}</option>;
                                })}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="location" className="card-title">
                                Location
                            </Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option>Select Location</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </FormGroup>
                    </div>
                </Col>
            </Row>

            <Row style={{ marginLeft: '20px' }}>
                <Col xl={10}>
                    <div className="panel-container-style mt-4">
                        <Row className="panel-header-styling ml-1 mr-1">
                            <div className="panel-header-filter">
                                <div>
                                    <FormGroup className="form-group row m-4">
                                        <Label for="panelName" className="card-title">
                                            Type
                                        </Label>
                                        <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                setActivePanelType(e.target.value);
                                            }}>
                                            {panelType.map((record) => {
                                                return <option value={record.value}>{record.name}</option>;
                                            })}
                                        </Input>
                                    </FormGroup>
                                </div>
                                <div>
                                    <FormGroup className="form-group row m-4 width-custom-style">
                                        <Label for="panelName" className="card-title">
                                            Number of Breakers
                                        </Label>
                                        {activePanelType === 'distribution' ? (
                                            <Input
                                                type="number"
                                                name="breakers"
                                                id="breakers"
                                                value={normalCount}
                                                onChange={(e) => {
                                                    setNormalCount(parseInt(e.target.value));
                                                }}
                                                className="breaker-no-width font-weight-bold"
                                            />
                                        ) : (
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-no-width"
                                                defaultValue={disconnectBreakerCount}
                                                onChange={(e) => {
                                                    setDisconnectBreakerCount(e.target.value);
                                                }}>
                                                {disconnectBreaker.map((record) => {
                                                    return <option value={record.value}>{record.name}</option>;
                                                })}
                                            </Input>
                                        )}
                                    </FormGroup>
                                </div>
                                {/* <div>
                                    <FormGroup className="form-group row m-4 width-custom-style">
                                        <Label for="panelName" className="card-title">
                                            Breaker Level
                                        </Label>

                                        <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-lvl-width"
                                            value={currentBreakerLevel}
                                            onChange={(e) => {
                                                setCurrentBreakerLevel(e.target.value);
                                            }}>
                                            {breakerLevel.map((record) => {
                                                return <option value={record.value}>{record.name}</option>;
                                            })}
                                        </Input>
                                    </FormGroup>
                                </div> */}
                            </div>
                            <div className="float-right m-4">
                                <button
                                    type="button"
                                    className="btn btn-md btn-secondary font-weight-bold"
                                    onClick={() => {
                                        setIsEditing(!isEditing);
                                        saveNormalDataToPanel();
                                    }}>
                                    {isEditing ? 'Done' : 'Edit'}
                                </button>
                            </div>
                        </Row>

                        {activePanelType === 'distribution' && (
                            <>
                                <Row className="main-breaker-styling">
                                    <FormGroup className="form-group row m-4">
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
                                                        <span>
                                                            {panel.voltage === '' ? '' : `${panel.rated_amps}A`}
                                                        </span>
                                                        <span>
                                                            {panel.voltage === '' && ''}
                                                            {panel.voltage === '120/240' && '240V'}
                                                            {panel.voltage === '208/120' && '120V'}
                                                            {panel.voltage === '480' && '480V'}
                                                            {panel.voltage === '600' && '600V'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div
                                                    className="breaker-content-middle"
                                                    onClick={() => {
                                                        handleMainShow();
                                                    }}>
                                                    <div className="edit-icon-bg-styling mr-2">
                                                        <i className="uil uil-pen"></i>
                                                    </div>
                                                    <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Row>

                                <Row>
                                    <Col lg={12}>
                                        <div>
                                            <div className="grid-style-6">
                                                {normalStruct.map((element, index) => {
                                                    return (
                                                        <>
                                                            <FormGroup className="form-group row m-2 ml-4">
                                                                <div className="breaker-container">
                                                                    <div className="sub-breaker-style">
                                                                        <div className="breaker-content-middle">
                                                                            <div className="breaker-index">
                                                                                {element.breaker_number}
                                                                            </div>
                                                                        </div>
                                                                        <div className="breaker-content-middle">
                                                                            <div className="dot-status"></div>
                                                                        </div>
                                                                        <div className="breaker-content-middle">
                                                                            <div className="breaker-content">
                                                                                <span>
                                                                                    {element.rated_amps === 0
                                                                                        ? ''
                                                                                        : `${element.rated_amps}A`}
                                                                                </span>
                                                                                <span>
                                                                                    {element.voltage === ''
                                                                                        ? ''
                                                                                        : `${element.voltage}V`}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        {!(element.equipment_link.length === 0) ? (
                                                                            <>
                                                                                {/* <div> */}
                                                                                {/* <h6 className="ml-4 mb-3 breaker-equip-name">
                                                                                        {element.equipment_link[0]}
                                                                                    </h6> */}
                                                                                {/* </div> */}
                                                                                {!(
                                                                                    (currentBreakerLevel ===
                                                                                        'triple-breaker' &&
                                                                                        panel.voltage === '120/240') ||
                                                                                    (currentBreakerLevel ===
                                                                                        'double-breaker' &&
                                                                                        panel.voltage === '600')
                                                                                ) && (
                                                                                    <div
                                                                                        className="breaker-content-middle"
                                                                                        onClick={() => {
                                                                                            setCurrentBreakerObj(
                                                                                                element
                                                                                            );
                                                                                            setCurrentBreakerIndex(
                                                                                                index
                                                                                            );
                                                                                            setCurrentEquipIds(
                                                                                                element.equipment_link
                                                                                            );
                                                                                            handleCurrentLinkedBreaker(
                                                                                                index
                                                                                            );
                                                                                            // if (
                                                                                            //     !(
                                                                                            //         currentBreakerLevel ===
                                                                                            //             'triple-breaker' &&
                                                                                            //         panel.voltage ===
                                                                                            //             '120/240'
                                                                                            //     ) ||
                                                                                            //     (currentBreakerLevel ===
                                                                                            //         'double-breaker' &&
                                                                                            //         panel.voltage ===
                                                                                            //             '600')
                                                                                            // ) {
                                                                                            handleEditBreakerShow();
                                                                                            // }
                                                                                        }}>
                                                                                        <div className="edit-icon-bg-styling mr-2">
                                                                                            <i className="uil uil-pen"></i>
                                                                                        </div>
                                                                                        <span className="font-weight-bold edit-btn-styling">
                                                                                            Edit
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {!(
                                                                                    (currentBreakerLevel ===
                                                                                        'triple-breaker' &&
                                                                                        panel.voltage === '120/240') ||
                                                                                    (currentBreakerLevel ===
                                                                                        'double-breaker' &&
                                                                                        panel.voltage === '600')
                                                                                ) && (
                                                                                    <div
                                                                                        className="breaker-content-middle"
                                                                                        onClick={() => {
                                                                                            setCurrentBreakerObj(
                                                                                                element
                                                                                            );
                                                                                            setCurrentBreakerIndex(
                                                                                                index
                                                                                            );
                                                                                            setCurrentEquipIds(
                                                                                                element.equipment_link
                                                                                            );
                                                                                            handleCurrentLinkedBreaker(
                                                                                                index
                                                                                            );
                                                                                            // if (
                                                                                            //     !(
                                                                                            //         currentBreakerLevel ===
                                                                                            //             'triple-breaker' &&
                                                                                            //         panel.voltage ===
                                                                                            //             '120/240'
                                                                                            //     ) ||
                                                                                            //     (currentBreakerLevel ===
                                                                                            //         'double-breaker' &&
                                                                                            //         panel.voltage ===
                                                                                            //             '600')
                                                                                            // ) {
                                                                                            handleEditBreakerShow();
                                                                                            // }
                                                                                        }}>
                                                                                        <div className="edit-icon-bg-styling mr-2">
                                                                                            <i className="uil uil-pen"></i>
                                                                                        </div>
                                                                                        <span className="font-weight-bold edit-btn-styling">
                                                                                            Edit
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </FormGroup>
                                                        </>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {activePanelType === 'disconnect' && (
                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <FormGroup className="form-group row m-2 ml-4">
                                            <div className="disconnect-breaker-container">
                                                {/* Breaker Online & Single Breaker */}
                                                <div className="sub-breaker-style-no-device">
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-index">1</div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="dot-status"></div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-content">
                                                            <span>80A</span>
                                                            <span>240V</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="breaker-content-middle"
                                                        // onClick={() => {
                                                        //     handleBreakerShow();
                                                        // }}
                                                    >
                                                        <div className="edit-icon-bg-styling mr-2">
                                                            <i className="uil uil-pen"></i>
                                                        </div>
                                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                    </div>
                                                </div>

                                                {/* Breaker Online & Double Breaker */}
                                                {/* <div className="sub-breaker-style-double-breaker">
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-index">1</div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="dot-status"></div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-content">
                                                            <span>80A</span>
                                                            <span>240V</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="breaker-content-middle"
                                                        // onClick={() => {
                                                        //     handleBreakerShow();
                                                        // }}
                                                    >
                                                        <div className="edit-icon-bg-styling mr-2">
                                                            <i className="uil uil-pen"></i>
                                                        </div>
                                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                    </div>
                                                </div> */}

                                                {/* Breaker Online & Triple Breaker */}
                                                <div className="sub-breaker-style-no-device">
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-index">1</div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="dot-status"></div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-content">
                                                            <span>80A</span>
                                                            <span>240V</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="breaker-content-middle"
                                                        // onClick={() => {
                                                        //     handleBreakerShow();
                                                        // }}
                                                    >
                                                        <div className="edit-icon-bg-styling mr-2">
                                                            <i className="uil uil-pen"></i>
                                                        </div>
                                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                    </div>
                                                </div>

                                                {/* Breaker Partial */}
                                                {/* <div className="sub-breaker-style-partial">
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-index">1</div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="dot-status"></div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-content">
                                                            <span>80A</span>
                                                            <span>240V</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="breaker-content-middle"
                                                        onClick={() => {
                                                            handleBreakerShow();
                                                        }}>
                                                        <div className="edit-icon-bg-styling mr-2">
                                                            <i className="uil uil-pen"></i>
                                                        </div>
                                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                    </div>
                                                </div> */}

                                                {/* Offline 1 */}
                                                {/* <div className="sub-breaker-style-offline">
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-index">1</div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="dot-status"></div>
                                                    </div>
                                                    <div className="breaker-content-middle">
                                                        <div className="breaker-content">
                                                            <span>80A</span>
                                                            <span>240V</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="breaker-content-middle"
                                                        onClick={() => {
                                                            handleBreakerShow();
                                                        }}>
                                                        <div className="edit-icon-bg-styling mr-2">
                                                            <i className="uil uil-pen"></i>
                                                        </div>
                                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
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
                            <Form.Label className="font-weight-bold">Rated Apms</Form.Label>
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

            <Modal show={showEditBreaker} onHide={handleEditBreakerClose} centered backdrop="static" keyboard={false}>
                {!(currentBreakerLevel === 'triple-breaker') ? (
                    // For Single & Double Breaker
                    <>
                        <div className="mt-4 ml-4 mb-0">
                            <Modal.Title className="edit-breaker-title mb-0">
                                {currentBreakerLevel === 'single-breaker' ? 'Edit Breaker' : 'Edit Linked Breaker'}
                            </Modal.Title>
                            <Modal.Title className="edit-breaker-no mt-0">
                                {currentBreakerLevel === 'single-breaker' &&
                                    `Breaker ${currentBreakerObj.breaker_number}`}
                                {currentBreakerLevel === 'double-breaker' &&
                                    `Breaker ${doubleLinkedBreaker[0].map((number) => ` ${number}`)}`}
                            </Modal.Title>
                        </div>
                        <Modal.Body>
                            <Form>
                                <div className="panel-model-row-style ml-2 mr-2">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Phase</Form.Label>
                                        <Input
                                            type="number"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Phase"
                                            onChange={(e) => {
                                                handleBreakerConfigChange('phase_configuration', e.target.value);
                                            }}
                                            value={currentBreakerObj.phase_configuration}
                                            disabled={true}></Input>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Apms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Amps"
                                            className="font-weight-bold"
                                            value={currentBreakerObj.rated_amps}
                                            onChange={(e) => {
                                                handleBreakerConfigChange('rated_amps', e.target.value);
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Volts</Form.Label>
                                        <Input
                                            type="number"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Volts"
                                            onChange={(e) => {
                                                handleBreakerConfigChange('voltage', e.target.value);
                                            }}
                                            value={currentBreakerObj.voltage}
                                            disabled={true}></Input>
                                    </Form.Group>
                                </div>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <>
                                    {currentBreakerLevel === 'single-breaker' && (
                                        <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                            Breaker {currentBreakerObj.breaker_number}
                                        </div>
                                    )}

                                    {currentBreakerLevel === 'double-breaker' && (
                                        <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                            Breaker {doubleLinkedBreaker[0][0]} & {doubleLinkedBreaker[0][1]}
                                        </div>
                                    )}

                                    <div className="panel-edit-grid ml-2 mr-2">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Device ID</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Device"
                                                onChange={(e) => {
                                                    fetchDeviceSensorData(e.target.value);
                                                    handleBreakerConfigChange('device_id', e.target.value);
                                                }}
                                                value={currentBreakerObj.device_id}>
                                                <option>Select Device</option>
                                                {passiveDeviceData.map((record) => {
                                                    return (
                                                        <option value={record.equipments_id}>
                                                            {record.identifier}
                                                        </option>
                                                    );
                                                })}
                                            </Input>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sensor #</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Sensor"
                                                onChange={(e) => {
                                                    handleBreakerConfigChange('sensor_id', e.target.value);
                                                }}
                                                value={currentBreakerObj.sensor_id}>
                                                <option>Select Sensor</option>
                                                {sensorData.map((record) => {
                                                    return <option value={record.id}>{record.name}</option>;
                                                })}
                                            </Input>
                                        </Form.Group>
                                    </div>
                                </>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Equipment</Form.Label>
                                    <Input
                                        type="select"
                                        name="state"
                                        id="userState"
                                        className="font-weight-bold breaker-phase-selection"
                                        placeholder="Select Equipment"
                                        onChange={(e) => {
                                            addSelectedBreakerEquip(e.target.value);
                                            handleBreakerConfigChange('equipment_link', e.target.value);
                                        }}
                                        value={currentEquipIds[0]}>
                                        <option>Select Equipment</option>
                                        {equipmentData.map((record) => {
                                            return (
                                                <option value={record.equipments_id}>{record.equipments_name}</option>
                                            );
                                        })}
                                    </Input>
                                    {/* <MultiSelect
                                        options={equipmentData}
                                        value={selectedEquipOptions}
                                        onChange={setSelectedEquipOptions}
                                        labelledBy="Columns"
                                        hasSelectAll={false}
                                    /> */}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    </>
                ) : (
                    // For Triple Breaker
                    <>
                        <div className="mt-4 ml-4 mb-0">
                            <Modal.Title className="edit-breaker-title mb-0">Edit Linked Breaker</Modal.Title>
                            <Modal.Title className="edit-breaker-no mt-0">
                                {currentBreakerLevel === 'triple-breaker' &&
                                    `Breaker ${tripleLinkedBreaker[0].map((number) => ` ${number}`)}`}
                            </Modal.Title>
                        </div>
                        <Modal.Body>
                            <Form>
                                <div className="panel-model-row-style ml-2 mr-2">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Phase</Form.Label>
                                        {/* <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Phase"
                                            onChange={(e) => {
                                                handleBreakerConfigChange('phase_configuration', e.target.value);
                                            }}
                                            value={currentBreakerObj.phase_configuration}
                                            disabled={true}>
                                            <option>Select Phase</option>
                                            <option value="3">3</option>
                                            <option value="1">1</option>
                                        </Input> */}
                                        <Input
                                            type="number"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Phase"
                                            onChange={(e) => {
                                                handleBreakerConfigChange('phase_configuration', e.target.value);
                                            }}
                                            value={3}
                                            disabled={true}></Input>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Apms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Amps"
                                            className="font-weight-bold"
                                            value={currentBreakerObj.rated_amps}
                                            onChange={(e) => {
                                                handleBreakerConfigChange('rated_amps', e.target.value);
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Volts</Form.Label>

                                        <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Volts"
                                            onChange={(e) => {
                                                handleBreakerConfigChange('voltage', e.target.value);
                                            }}
                                            value={currentBreakerObj.voltage}
                                            disabled={true}>
                                            <option>Select Volts</option>
                                            <option value="120">120</option>
                                            <option value="208">208</option>
                                            <option value="277">277</option>
                                            <option value="347">347</option>
                                        </Input>
                                    </Form.Group>
                                </div>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <>
                                    <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                        Breaker {tripleLinkedBreaker[0][0]}
                                    </div>
                                    <div className="panel-edit-grid ml-2 mr-2">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Device ID</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Device"
                                                onChange={(e) => {
                                                    fetchDeviceSensorData(e.target.value);
                                                    handleBreakerConfigChange('device_id', e.target.value);
                                                }}
                                                value={currentBreakerObj.device_id}>
                                                <option>Select Device</option>
                                                {passiveDeviceData.map((record) => {
                                                    return (
                                                        <option value={record.equipments_id}>
                                                            {record.identifier}
                                                        </option>
                                                    );
                                                })}
                                            </Input>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sensor #</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Sensor"
                                                onChange={(e) => {
                                                    handleBreakerConfigChange('sensor_id', e.target.value);
                                                }}
                                                value={currentBreakerObj.sensor_id}>
                                                <option>Select Sensor</option>
                                                {sensorData.map((record) => {
                                                    return <option value={record.id}>{record.name}</option>;
                                                })}
                                            </Input>
                                        </Form.Group>
                                    </div>

                                    <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                        Breaker {tripleLinkedBreaker[0][1]}
                                    </div>
                                    <div className="panel-edit-grid ml-2 mr-2">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Device ID</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Device"
                                                onChange={(e) => {
                                                    fetchDeviceSensorData(e.target.value);
                                                    handleBreakerConfigChange('device_id1', e.target.value);
                                                }}
                                                value={currentBreakerObj.device_id1}>
                                                <option>Select Device</option>
                                                {passiveDeviceData.map((record) => {
                                                    return (
                                                        <option value={record.equipments_id}>
                                                            {record.identifier}
                                                        </option>
                                                    );
                                                })}
                                            </Input>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sensor #</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Sensor"
                                                onChange={(e) => {
                                                    handleBreakerConfigChange('sensor_id1', e.target.value);
                                                }}
                                                value={currentBreakerObj.sensor_id1}>
                                                <option>Select Sensor</option>
                                                {sensorData.map((record) => {
                                                    return <option value={record.id}>{record.name}</option>;
                                                })}
                                            </Input>
                                        </Form.Group>
                                    </div>

                                    <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                        Breaker {tripleLinkedBreaker[0][2]}
                                    </div>
                                    <div className="panel-edit-grid ml-2 mr-2">
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Device ID</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Device"
                                                onChange={(e) => {
                                                    fetchDeviceSensorData(e.target.value);
                                                    handleBreakerConfigChange('device_id2', e.target.value);
                                                }}
                                                value={currentBreakerObj.device_id2}>
                                                <option>Select Device</option>
                                                {passiveDeviceData.map((record) => {
                                                    return (
                                                        <option value={record.equipments_id}>
                                                            {record.identifier}
                                                        </option>
                                                    );
                                                })}
                                            </Input>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sensor #</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Sensor"
                                                onChange={(e) => {
                                                    handleBreakerConfigChange('sensor_id2', e.target.value);
                                                }}
                                                value={currentBreakerObj.sensor_id2}>
                                                <option>Select Sensor</option>
                                                {sensorData.map((record) => {
                                                    return <option value={record.id}>{record.name}</option>;
                                                })}
                                            </Input>
                                        </Form.Group>
                                    </div>
                                </>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Equipment</Form.Label>
                                    <Input
                                        type="select"
                                        name="state"
                                        id="userState"
                                        className="font-weight-bold breaker-phase-selection"
                                        placeholder="Select Equipment"
                                        onChange={(e) => {
                                            addSelectedBreakerEquip(e.target.value);
                                            handleBreakerConfigChange('equipment_link', e.target.value);
                                        }}
                                        value={currentEquipIds[0]}>
                                        <option>Select Equipment</option>
                                        {equipmentData.map((record) => {
                                            return (
                                                <option value={record.equipments_id}>{record.equipments_name}</option>
                                            );
                                        })}
                                    </Input>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                    </>
                )}

                <Modal.Footer>
                    <Button variant="light" onClick={handleEditBreakerClose}>
                        Cancel
                    </Button>
                    {currentBreakerLevel === 'single-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateSingleBreakerData();
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )}

                    {currentBreakerLevel === 'double-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateDoubleBreakerData(doubleLinkedBreaker[0][0], doubleLinkedBreaker[0][1]);
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )}

                    {currentBreakerLevel === 'triple-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateTripleBreakerData(
                                    tripleLinkedBreaker[0][0],
                                    tripleLinkedBreaker[0][1],
                                    tripleLinkedBreaker[0][2]
                                );
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default CreatePanel;
