import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import { faPowerOff } from '@fortawesome/pro-solid-svg-icons';
import DeviceChartModel from '../../../pages/chartModal/DeviceChartModel';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
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
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Modal from 'react-bootstrap/Modal';
import { Button, Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import SocketLogo from '../../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../../assets/images/active-devices/Union.svg';
import Skeleton from 'react-loading-skeleton';
import { DateRangeStore } from '../../../store/DateRangeStore';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';
import Select from 'react-select';
import { apiRequestBody } from '../../../helpers/helpers';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';

const IndividualActiveDevice = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [userPermission] = useAtom(userPermissionData);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    let history = useHistory();

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

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const [locationData, setLocationData] = useState([]);
    const [isLocationFetched, setIsLocationFetched] = useState(true);
    const [activeData, setActiveData] = useState({});
    const [activeLocationId, setActiveLocationId] = useState('');
    const [sensors, setSensors] = useState([]);
    const [sensorAPIRefresh, setSensorAPIRefresh] = useState(false);
    const [isFetchingSensorData, setIsFetchingSensorData] = useState(true);
    const [isSensorChartLoading, setIsSensorChartLoading] = useState(true);
    const [sensorData, setSensorData] = useState({});
    const [equipmentTypeDevices, setEquipmentTypeDevices] = useState([]);
    const [sensorCount, setSensorCount] = useState(0);
    const [selectedEquipTypeId, setSelectedEquipTypeId] = useState('');
    const [selectedSensorId, setSelectedSensorId] = useState('');
    const [newEquipTypeID, setNewEquipTypeID] = useState('');
    const [newEquipTypeValue, setNewEquipTypeValue] = useState([]);

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

    // locationData
    const [locationDataNow, setLocationDataNow] = useState([]);
    // equipmentTypeDevices
    const [equipmentTypeDataNow, setEqupimentTypeDataNow] = useState([]);

    const addLocationType = () => {
        locationData.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    const addEquipmentType = () => {
        equipmentTypeDevices.map((item) => {
            setEqupimentTypeDataNow((el) => [
                ...el,
                { value: `${item?.equipment_id}`, label: `${item?.equipment_type}` },
            ]);
        });
    };

    useEffect(() => {
        if (locationData) {
            addLocationType();
        }
    }, [locationData]);

    useEffect(() => {
        if (equipmentTypeDevices) {
            addEquipmentType();
        }
    }, [equipmentTypeDevices]);

    const [seriesData, setSeriesData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);

    const CONVERSION_ALLOWED_UNITS = ['power'];

    const UNIT_DIVIDER = 1000;

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy Consumed (Wh)', unit: 'Wh', Consumption: 'Energy Consumption' },
        {
            value: 'totalconsumedenergy',
            label: 'Total Consumed Energy (Wh)',
            unit: 'Wh',
            Consumption: 'Total Consumed Energy',
        },
        { value: 'mV', label: 'Voltage (mV)', unit: 'mV', Consumption: 'Voltage' },
        { value: 'mAh', label: 'Current (mA)', unit: 'mA', Consumption: 'Current' },
        { value: 'power', label: 'Real Power (W)', unit: 'W', Consumption: 'Real Power' },
    ]);

    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);

    const getRequiredConsumptionLabel = (value) => {
        let label = '';

        metric.map((m) => {
            if (m.value === value) {
                label = m.label;
            }

            return m;
        });

        return label;
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, updatedSensorData);
        obj[key] = value;
        setUpdatedSensorData(obj);
    };

    const handleChartShow = (id) => {
        setSensorId(id);
        let obj = sensors.find((o) => o.id === id);
        setSensorData(obj);
        fetchSensorGraphData(id);
        setShowChart(true);
    };

    useEffect(() => {
        if (showChart) {
            return;
        }
        setConsumption('energy');
    }, [showChart]);

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
                    let response = res.data.data[0];
                    setActiveData(response);
                    setActiveLocationId(response.location_id);
                    localStorage.setItem('identifier', response.identifier);
                });
            } catch (error) {}
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
                    setSensors(response);
                    setIsFetchingSensorData(false);
                });
            } catch (error) {}
        };

        const fetchLocationData = async () => {
            try {
                setIsLocationFetched(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    let response = res.data;

                    response.sort((a, b) => {
                        return a.location_name.localeCompare(b.location_name);
                    });

                    setLocationData(response);
                    setIsLocationFetched(false);
                });
            } catch (error) {
                setIsLocationFetched(false);
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
                        path: '/settings/active-devices',
                        active: false,
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
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Active Devices',
                    path: '/settings/active-devices',
                    active: false,
                },
                {
                    label: activeData?.identifier,
                    path: '/settings/active-devices/single',
                    active: true,
                },
            ];
            bs.items = newList;
        });
    }, [activeData]);

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
                setIsFetchingSensorData(false);
            }
        };
        fetchActiveDeviceSensorData();
    }, [sensorAPIRefresh]);

    const fetchSensorGraphData = async (id) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsSensorChartLoading(true);
            let params = `?sensor_id=${id === sensorId ? sensorId : id}&consumption=energy&building_id=${bldgId}`;
            await axios
                .post(`${BaseUrl}${sensorGraphData}${params}`, apiRequestBody(startDate, endDate, timeZone), {
                    headers,
                })
                .then((res) => {
                    setDeviceData([]);
                    setSeriesData([]);

                    let response = res.data;

                    let data = response;

                    let exploreData = [];

                    let NulledData = [];
                    data.map((ele) => {
                        if (ele?.consumption === '') {
                            NulledData.push({ x: moment.utc(new Date(ele?.time_stamp)), y: null });
                        } else {
                            if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                NulledData.push({
                                    x: moment.utc(new Date(ele.time_stamp)),
                                    y: ele.consumption / UNIT_DIVIDER,
                                });
                            } else {
                                NulledData.push({ x: new Date(ele.time).getTime(), y: ele.consumption });
                            }
                        }
                    });
                    let recordToInsert = {
                        data: NulledData,
                        name: getRequiredConsumptionLabel(selectedConsumption),
                    };
                    setDeviceData([recordToInsert]);
                    setIsSensorChartLoading(false);
                });
        } catch (error) {
            setIsSensorChartLoading(false);
        }
    };

    const fetchEquipmentTypeData = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?end_use=Plug&building_id=${bldgId}&page_size=1000&page_no=1`;
            await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                let response = res.data.data;
                response.sort((a, b) => {
                    return a.equipment_type.localeCompare(b.equipment_type);
                });
                setEquipmentTypeDevices(response);
            });
        } catch (error) {}
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
            });
        } catch (error) {}
    };

    const updateActiveDeviceData = async () => {
        if (activeData.equipments_id) {
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
                    });
            } catch (error) {}
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
                                    <span className="passive-device-name">
                                        {activeData?.description ? activeData?.description : ''}
                                    </span>
                                    <span className="passive-sensor-count">
                                        {activeData?.identifier ? activeData?.identifier : ''}
                                    </span>
                                </div>
                            </div>
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
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
                                            history.push('/settings/active-devices');
                                        }}
                                        disabled={
                                            activeLocationId === 'Select location' ||
                                            activeLocationId === activeData?.location_id
                                                ? true
                                                : false
                                        }>
                                        Save
                                    </button>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="mt-2 single-passive-tabs-style">
                            <span className="mr-3 single-passive-tab-active">Configure</span>
                            {/* Commented for future use as part of PLT-533  */}
                            {/* <span className="mr-3 single-passive-tab">History</span> */}
                        </div>
                    </div>
                </div>

                {/* <div className="container"> */}
                <div className="row mt-4">
                    <div className="col-4">
                        <h5 className="device-title">Device Details</h5>
                        <div className="mt-4">
                            <div>
                                <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                    <Form.Label className="device-label-style">Installed Location</Form.Label>
                                    {isLocationFetched ? (
                                        <Skeleton count={1} height={35} />
                                    ) : (
                                        <>
                                            {userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.advanced_passive_device_permission
                                                ?.edit ? (
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
                                                            <option value={record?.location_id}>
                                                                {record?.location_name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    placeholder="No Location Added"
                                                    className="font-weight-bold"
                                                    defaultValue={activeData?.location ? activeData?.location : ''}
                                                    disabled
                                                />
                                            )}
                                        </>
                                    )}

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
                                    <h6 className="passive-device-value">
                                        {activeData?.identifier ? activeData?.identifier : ''}
                                    </h6>
                                </div>
                                <div>
                                    <h6 className="device-label-style" htmlFor="customSwitches">
                                        Device Model
                                    </h6>
                                    <h6 className="passive-device-value">
                                        {activeData?.model ? activeData?.model : ''}
                                    </h6>
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
                            </div>
                        </div>

                        <div className="socket-container">
                            <div className="mt-2 sockets-slots-container">
                                {sensors.map((record, index) => {
                                    return (
                                        <>
                                            {record?.status && (
                                                <div>
                                                    <div className="power-off-style">
                                                        <FontAwesomeIcon icon={faPowerOff} size="lg" color="#3C6DF5" />
                                                    </div>
                                                    {record?.equipment_type_id === '' ? (
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

                                            {!record?.status && (
                                                <div>
                                                    <div className="power-off-style">
                                                        <FontAwesomeIcon icon={faPowerOff} size="lg" color="#EAECF0" />
                                                    </div>
                                                    {record?.equipment_type_id === '' ? (
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
                        </div>

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
                                                <span className="sensor-data-no">{record.index}</span>
                                                <span className="sensor-data-title">
                                                    {record?.equipment_type_name
                                                        ? record?.equipment_type_name
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
                                                    className="mouse-pointer"
                                                />
                                                <Button
                                                    type="button"
                                                    className="btn btn-default passive-edit-style"
                                                    onClick={() => {
                                                        fetchEquipmentTypeData();
                                                        setSelectedEquipTypeId(record.equipment_type_id);
                                                        setNewEquipTypeID(record.equipment_type_id);
                                                        setNewEquipTypeValue(record.equipment_type);
                                                        setSelectedSensorId(record.id);
                                                        handleEquipmentShow();
                                                    }}>
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>
                {/* </div> */}
            </div>

            <DeviceChartModel
                showChart={showChart}
                handleChartClose={handleChartClose}
                sensorData={sensorData}
                seriesData={seriesData}
                setSeriesData={setSeriesData}
                deviceData={deviceData}
                setDeviceData={setDeviceData}
                CONVERSION_ALLOWED_UNITS={CONVERSION_ALLOWED_UNITS}
                UNIT_DIVIDER={UNIT_DIVIDER}
                metric={metric}
                setMetric={setMetric}
                selectedConsumption={selectedConsumption}
                setConsumption={setConsumption}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                selectedConsumptionLabel={selectedConsumptionLabel}
                setSelectedConsumptionLabel={setSelectedConsumptionLabel}
                getRequiredConsumptionLabel={getRequiredConsumptionLabel}
                isSensorChartLoading={isSensorChartLoading}
                setIsSensorChartLoading={setIsSensorChartLoading}
                timeZone={timeZone}
                daysCount={daysCount}
                deviceType="active"
            />

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
                            <Select
                                id="exampleSelect"
                                placeholder="Select Equipment Type"
                                name="select"
                                isSearchable={true}
                                options={equipmentTypeDataNow}
                                defaultValue={newEquipTypeValue}
                                onChange={(e) => {
                                    setNewEquipTypeID(e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
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
