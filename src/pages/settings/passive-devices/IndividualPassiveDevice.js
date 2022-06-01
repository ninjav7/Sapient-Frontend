import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
    FormGroup,
    Label,
} from 'reactstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import DeviceChartModel from '../DeviceChartModel';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl, generalPassiveDevices, getLocation, createDevice } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import Modal from 'react-bootstrap/Modal';
import './style.css';

const SelectBreakerModel = ({
    showBreaker,
    handleBreakerClose,
    breakers,
    panels,
    currentRecord,
    setCurrentRecord,
    sensors,
    setSensors,
    currentIndex,
    setCurrentIndex,
}) => {
    const saveToSensorArray = () => {
        let currentArray = sensors;
        currentArray[currentIndex] = currentRecord;
        setSensors(currentArray);
    };

    const handleSensorChange = (key, value) => {
        let obj = Object.assign({}, currentRecord);
        obj[key] = value;
        setCurrentRecord(obj);
    };

    return (
        <>
            <Modal show={showBreaker} onHide={handleBreakerClose} size={'md'} centered>
                <Modal.Header>
                    <Modal.Title>Select Breaker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Panel</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                defaultValue={currentRecord.panel_name}
                                onChange={(e) => {
                                    handleSensorChange('panel_name', e.target.value);
                                }}>
                                <option selected>Select Panel</option>
                                {panels.map((record) => {
                                    return <option value={record.panel_id}>{record.panel_name}</option>;
                                })}
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Breaker</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                defaultValue={currentRecord.breaker_name}
                                onChange={(e) => {
                                    handleSensorChange('breaker_name', e.target.value);
                                }}>
                                <option selected>Select Breaker</option>
                                {breakers.map((record) => {
                                    return <option value={record.breaker_id}>{record.breaker_name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleBreakerClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleBreakerClose();
                            saveToSensorArray();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const IndividualPassiveDevice = () => {
    const { deviceId } = useParams();
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);
    const handleChartShow = () => setShowChart(true);
    // Select Breaker states
    const [showBreaker, setShowBreaker] = useState(false);
    const handleBreakerClose = () => setShowBreaker(false);
    const handleBreakerShow = () => setShowBreaker(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [pageRefresh, setPageRefresh] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [passiveData, setPassiveData] = useState({});
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'passive',
    });
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [currentRecord, setCurrentRecord] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const [sensors, setSensors] = useState([
        {
            breaker_name: 'Breaker 1',
            panel_name: 'Panel 1',
            equipment_name: 'AHU 1',
        },
        {
            breaker_name: 'Breaker 2',
            panel_name: 'Panel 2',
            equipment_name: 'AHU 2',
        },
        {
            breaker_name: '',
            panel_name: '',
            equipment_name: '',
        },
    ]);

    const [breakers, setBreakers] = useState([
        {
            breaker_name: 'Breaker 1',
            breaker_id: 'Breaker 1',
        },
        {
            breaker_name: 'Breaker 2',
            breaker_id: 'Breaker 2',
        },
        {
            breaker_name: 'Breaker 3',
            breaker_id: 'Breaker 3',
        },
    ]);

    const [panels, setPanels] = useState([
        {
            panel_name: 'Panel 1',
            panel_id: 'Panel 1',
        },
        {
            panel_name: 'Panel 2',
            panel_id: 'Panel 2',
        },
        {
            panel_name: 'Panel 3',
            panel_id: 'Panel 3',
        },
    ]);

    useEffect(() => {
        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                await axios.get(`${BaseUrl}${generalPassiveDevices}`, { headers }).then((res) => {
                    let response = res.data;
                    let data = response.filter((record) => record.device_id === deviceId);
                    setPassiveData(data[0]);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Passive device');
            }
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                // await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    setLocationData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchPassiveDeviceData();
        fetchLocationData();
    }, [pageRefresh, deviceId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Passive Devices',
                        path: '/settings/passive-devices',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        console.log('sensors => ', sensors);
        console.log('currentRecord => ', currentRecord);
    });

    return (
        <>
            <div>
                <div>
                    <div className="single-passive-container">
                        <div className="passive-page-header">
                            <div>
                                <div className="mb-1">
                                    <span className="passive-device-style">Passive Device</span>
                                </div>
                                <div>
                                    <span className="passive-device-name mr-3">{passiveData.identifier}</span>
                                    <span className="passive-sensor-count">{passiveData.sensor_number} Sensors</span>
                                </div>
                            </div>
                            <div>
                                <Link to="/settings/passive-devices">
                                    <button type="button" className="btn btn-default passive-cancel-style">
                                        Cancel
                                    </button>
                                </Link>
                                <button type="button" className="btn btn-primary passive-save-style ml-2">
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 single-passive-tabs-style">
                            <span className="mr-3 single-passive-tab-active">Configure</span>
                            <span className="mr-3 single-passive-tab">History</span>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <h5 className="device-title">Device Details</h5>
                            <div className="mt-2">
                                <div>
                                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                        <Form.Label className="device-label-style">Installed Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Identifier"
                                            className="passive-location-style"
                                            value={passiveData.location}
                                        />
                                        <Form.Label className="device-sub-label-style mt-1">
                                            Location this device is installed in.
                                        </Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="single-passive-grid">
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Identifier
                                        </h6>
                                        <h6 className="passive-device-value">{passiveData.identifier}</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Model
                                        </h6>
                                        <h6 className="passive-device-value">{passiveData.model}</h6>
                                    </div>
                                </div>
                                <div className="single-passive-grid">
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Firmware Version
                                        </h6>
                                        <h6 className="passive-device-value">v1.2</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Version
                                        </h6>
                                        <h6 className="passive-device-value">v2</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <h5 className="device-title">Sensors ({passiveData.sensor_number})</h5>
                            <div className="mt-2">
                                <div>
                                    <div className="search-container">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                        <input
                                            className="search-box ml-2"
                                            type="search"
                                            name="search"
                                            placeholder="Search..."
                                        />
                                    </div>
                                </div>
                            </div>
                            {sensors.map((record, index) => {
                                return (
                                    <>
                                        {record.breaker_name === '' ? (
                                            <div className="sensor-container-style-notAttached mt-3">
                                                <div className="sensor-data-style">
                                                    <span className="sensor-data-no">{index + 1}</span>
                                                    <span className="sensor-data-title">Not Attached</span>
                                                </div>
                                                <div className="sensor-data-style-right">
                                                    <button
                                                        type="button"
                                                        className="btn btn-default passive-edit-style"
                                                        onClick={() => {
                                                            handleBreakerShow();
                                                            setCurrentRecord(record);
                                                            setCurrentIndex(index);
                                                        }}>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="sensor-container-style mt-3">
                                                <div className="sensor-data-style">
                                                    <span className="sensor-data-no">{index + 1}</span>
                                                    <span className="sensor-data-title">
                                                        {record.panel_name}, {record.breaker_name}
                                                    </span>
                                                    <span className="sensor-data-device">{record.equipment_name}</span>
                                                </div>
                                                <div className="sensor-data-style-right">
                                                    <FontAwesomeIcon
                                                        icon={faChartMixed}
                                                        size="md"
                                                        onClick={() => {
                                                            handleChartShow();
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-default passive-edit-style"
                                                        onClick={() => {
                                                            handleBreakerShow();
                                                            setCurrentRecord(record);
                                                            setCurrentIndex(index);
                                                        }}>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}

                            {/* <div className="sensor-container-style mt-3">
                                <div className="sensor-data-style">
                                    <span className="sensor-data-no">2</span>
                                    <span className="sensor-data-title">Panel 1, Breaker 3</span>
                                    <span className="sensor-data-device">AHU 2</span>
                                </div>
                                <div className="sensor-data-style-right">
                                    <FontAwesomeIcon icon={faChartMixed} size="md" />
                                    <button type="button" className="btn btn-default passive-edit-style">
                                        Edit
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            <DeviceChartModel showChart={showChart} handleChartClose={handleChartClose} />
            <SelectBreakerModel
                showBreaker={showBreaker}
                handleBreakerClose={handleBreakerClose}
                breakers={breakers}
                panels={panels}
                sensors={sensors}
                setSensors={setSensors}
                currentRecord={currentRecord}
                setCurrentRecord={setCurrentRecord}
                currentIndex={currentIndex}
            />
        </>
    );
};

export default IndividualPassiveDevice;
