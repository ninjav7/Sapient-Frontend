import React, { useState, useEffect } from 'react';
import { FormGroup } from 'reactstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import { faPowerOff } from '@fortawesome/pro-solid-svg-icons';
import DeviceChartModel from '../DeviceChartModel';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    BaseUrl,
    generalActiveDevices,
    getLocation,
    sensorGraphData,
    listSensor,
    equipmentType,
    linkActiveSensorToEquip,
    updateActivePassiveDevice,
} from '../../../services/Network';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../../utils/helper';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Modal from 'react-bootstrap/Modal';
import { Button, Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import SocketLogo from '../../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../../assets/images/active-devices/Union.svg';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';

const IndividualActiveDevice = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const { deviceId } = useParams();
    const [sensorId, setSensorId] = useState('');
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);

    // Equipment states
    const [showEquipment, setShowEquipment] = useState(false);
    const handleEquipmentClose = () => setShowEquipment(false);
    const handleEquipmentShow = () => setShowEquipment(true);

    // Edit states
    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [locationData, setLocationData] = useState([]);
    const [activeData, setActiveData] = useState({});
    const [activeLocationId, setActiveLocationId] = useState('');
    const [sensors, setSensors] = useState([]);
    const [sensorAPIRefresh, setSensorAPIRefresh] = useState(false);
    const [isFetchingSensorData, setIsFetchingSensorData] = useState(true);
    const [sensorData, setSensorData] = useState([]);
    const [equipmentTypeDevices, setEquipmentTypeDevices] = useState([]);
    const [sensorCount, setSensorCount] = useState(0);
    const [selectedEquipTypeId, setSelectedEquipTypeId] = useState('');
    const [selectedSensorId, setSelectedSensorId] = useState('');
    const [newEquipTypeID, setNewEquipTypeID] = useState('');

    const [updatedSensorData, setUpdatedSensorData] = useState({});

    const [breakerModal, setBreakerModal] = useState([
        {
            value: 'Breaker 1',
            label: 'Breaker 1',
        },
        {
            value: 'Breaker 2',
            label: 'Breaker 2',
        },
    ]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, updatedSensorData);
        obj[key] = value;
        setUpdatedSensorData(obj);
    };
    const handleChartShow = (id) => {
        // console.log('handleChartShow id => ', id);
        setSensorId(id);
        setShowChart(true);
        let obj = sensors.find((o) => o.id === id);
        setSensorData(obj);
        fetchSensorGraphData(id);
    };

    useEffect(() => {
        const fetchSingleActiveDevice = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}&page_size=100&page_no=1&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // setActiveData(response.data[0]);
                    // setActiveLocationId(response.data[0].location_id);
                    let deviceData = {
                        equipments_id: '62cd8c4325bb26b88e2da44d',
                        status: 'Online',
                        location_id: '62bc20c5f607beccf9c86a10',
                        location: 'Hall > Ground Floor',
                        sensor_number: '6',
                        identifier: '98:DA:C4:B3:2B:96',
                        model: 'HS300',
                        description: 'Wi-Fi Smart Power Strip',
                        firmware_version: '1.0.21 Build 210524 Rel.161309',
                        hardware_version: '1.0',
                    };
                    setActiveData(deviceData);
                    setActiveLocationId(deviceData.location_id);
                    console.log('ActiveDevice Data => ', response.data[0]);
                    localStorage.setItem('identifier', response.data[0].identifier);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device data');
            }
        };

        const fetchActiveDeviceSensorData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}`;
                await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // console.log('Sensor Data => ', response);
                    setSensors(response);
                    setIsFetchingSensorData(false);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device sensor data');
            }
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    let response = res.data;
                    setLocationData(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchSingleActiveDevice();
        fetchActiveDeviceSensorData();
        fetchLocationData();
    }, [deviceId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Active Devices',
                        path: '/settings/passive-devices',
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
        const fetchActiveDeviceSensorData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}`;
                await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setSensors(response);
                    setIsFetchingSensorData(false);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device sensor data');
            }
        };
        fetchActiveDeviceSensorData();
    }, [sensorAPIRefresh]);

    const fetchSensorGraphData = async (id) => {
        try {
            let endDate = new Date(); // today
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?sensor_id=${id === sensorId ? sensorId : id}&consumption=energy`;
            await axios
                .post(
                    `${BaseUrl}${sensorGraphData}${params}`,
                    {
                        date_from: dateFormatHandler(startDate),
                        date_to: dateFormatHandler(endDate),
                    },
                    { headers }
                )
                .then((res) => {
                    let response = res.data;
                    // console.log('Sensor Graph Data => ', response);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Sensor Graph data');
        }
    };

    const fetchEquipmentTypeData = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?end_use=Plug&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                let response = res.data;
                setEquipmentTypeDevices(response);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Equipment Type data');
        }
    };

    const linkSensorToEquipment = async (sensorId, currEquipId, newEquipID) => {
        if (currEquipId === newEquipID) {
            return;
        }
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setSensors([]);
            setIsFetchingSensorData(true);
            let params = `?sensor_id=${sensorId}&equipment_type_id=${newEquipID}`;
            await axios.post(`${BaseUrl}${linkActiveSensorToEquip}${params}`, {}, { headers }).then((res) => {
                setSensorAPIRefresh(!sensorAPIRefresh);
                console.log(res.data);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to link Sensor with Equipment');
        }
    };

    const updateActiveDeviceData = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${activeData.equipments_id}`;
            await axios
                .post(
                    `${BaseUrl}${updateActivePassiveDevice}${params}`,
                    {
                        location_id: activeLocationId,
                    },
                    { headers }
                )
                .then((res) => {
                    setSensorAPIRefresh(!sensorAPIRefresh);
                    console.log(res.data);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to link Sensor with Equipment');
        }
    };

    return (
        <>
            <div>
                <div>
                    <div className="single-passive-container">
                        <div className="passive-page-header">
                            <div>
                                <div className="mb-1">
                                    <span className="passive-device-style">Active Device</span>
                                </div>
                                <div>
                                    <span className="passive-device-name mr-3">{activeData.description}</span>
                                    <span className="passive-sensor-count">{activeData.identifier}</span>
                                </div>
                            </div>
                            <div>
                                <Link to="/settings/active-devices">
                                    <button type="button" className="btn btn-default passive-cancel-style">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-primary passive-save-style ml-2"
                                    onClick={() => {
                                        updateActiveDeviceData();
                                    }}
                                    disabled={
                                        activeLocationId === 'Select location' ||
                                        activeLocationId === activeData.location_id
                                            ? true
                                            : false
                                    }>
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
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                setActiveLocationId(e.target.value);
                                            }}
                                            value={activeLocationId}>
                                            <option>Select Location</option>
                                            {locationData.map((record, index) => {
                                                return (
                                                    <option value={record.location_id}>{record.location_name}</option>
                                                );
                                            })}
                                        </Input>
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
                                        <h6 className="passive-device-value">{activeData.identifier}</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Model
                                        </h6>
                                        <h6 className="passive-device-value">{activeData.model}</h6>
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
                            <h5 className="device-title">Sensors ({sensors.length})</h5>
                            <div className="mt-2">
                                <div className="active-sensor-header">
                                    <div className="search-container mr-2">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                        <input
                                            className="search-box ml-2"
                                            type="search"
                                            name="search"
                                            placeholder="Search..."
                                        />
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className={
                                                selectedTab === 0
                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                            }
                                            style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                            onClick={() => setSelectedTab(0)}>
                                            All Statuses
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                selectedTab === 1
                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                            }
                                            style={{ borderRadius: '0px' }}
                                            onClick={() => setSelectedTab(1)}>
                                            Healthy
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                selectedTab === 2
                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                            }
                                            style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                                            onClick={() => setSelectedTab(2)}>
                                            Partials
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                selectedTab === 3
                                                    ? 'btn btn-light d-offline custom-active-btn'
                                                    : 'btn btn-white d-inline custom-inactive-btn'
                                            }
                                            style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                                            onClick={() => setSelectedTab(3)}>
                                            No Data
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* <div className="socket-container">
                                <div className="mt-2 sockets-slots-container">
                                    {sensors.map((record, index) => {
                                        return (
                                            <>
                                                {record.sensor_type === 'active' && (
                                                    <div>
                                                        <div className="power-off-style">
                                                            <FontAwesomeIcon
                                                                icon={faPowerOff}
                                                                size="lg"
                                                                color="#3C6DF5"
                                                            />
                                                        </div>
                                                        {record.equipment_id === '' ? (
                                                            <div className="socket-rect">
                                                                <img src={SocketLogo} alt="Socket" />
                                                            </div>
                                                        ) : (
                                                            <div className="online-socket-container">
                                                                <img
                                                                    src={UnionLogo}
                                                                    alt="Union"
                                                                    className="union-icon-style"
                                                                    width="35vw"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {record.sensor_type === 'passive' && (
                                                    <div>
                                                        <div className="power-off-style">
                                                            <FontAwesomeIcon
                                                                icon={faPowerOff}
                                                                size="lg"
                                                                color="#EAECF0"
                                                            />
                                                        </div>
                                                        {record.equipment_id === '' ? (
                                                            <div className="socket-rect">
                                                                <img src={SocketLogo} alt="Socket" />
                                                            </div>
                                                        ) : (
                                                            <div className="online-socket-container">
                                                                <img
                                                                    src={UnionLogo}
                                                                    alt="Union"
                                                                    className="union-icon-style"
                                                                    width="35vw"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            </div> */}

                            {isFetchingSensorData ? (
                                <div className="mt-4">
                                    <Skeleton count={8} height={40} />
                                </div>
                            ) : (
                                <>
                                    {sensors.map((record, index) => {
                                        return (
                                            <div className="sensor-container-style mt-3">
                                                <div className="sensor-data-style">
                                                    <span className="sensor-data-no">{index + 1}</span>
                                                    <span className="sensor-data-title">
                                                        {record.equipment_type_name
                                                            ? record.equipment_type_name
                                                            : 'No Equipment'}
                                                        {record.equipment_id === '' ? (
                                                            ''
                                                        ) : (
                                                            <div className="ml-2 badge badge-soft-primary">
                                                                {record.equipment}
                                                            </div>
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="sensor-data-style-right">
                                                    <FontAwesomeIcon
                                                        icon={faChartMixed}
                                                        size="md"
                                                        onClick={() => {
                                                            handleChartShow(record.id);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-default passive-edit-style"
                                                        onClick={() => {
                                                            fetchEquipmentTypeData();
                                                            setSelectedEquipTypeId(record.equipment_type_id);
                                                            setNewEquipTypeID(record.equipment_type_id);
                                                            setSelectedSensorId(record.id);
                                                            handleEquipmentShow();
                                                        }}>
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeviceChartModel showChart={showChart} handleChartClose={handleChartClose} sensorData={sensorData} />

            <Modal show={showEdit} onHide={handleEditClose} centered>
                <Modal.Header>
                    <Modal.Title>Select Breaker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Panel</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Select Panel"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('panel', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Breaker</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('breaker', e.target.value);
                                }}>
                                <option selected>Select Breaker</option>
                                {breakerModal.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleEditClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleEditClose();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEquipment} onHide={handleEquipmentClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Socket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    setNewEquipTypeID(e.target.value);
                                }}
                                value={newEquipTypeID}>
                                <option selected>Select Equipment Type</option>
                                {equipmentTypeDevices.map((record) => {
                                    return <option value={record.equipment_id}>{record.equipment_type}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleEquipmentClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleEquipmentClose();
                            linkSensorToEquipment(selectedSensorId, selectedEquipTypeId, newEquipTypeID);
                        }}>
                        Update Socket
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default IndividualActiveDevice;
