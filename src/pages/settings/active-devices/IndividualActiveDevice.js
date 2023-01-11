import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
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
import { Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import SocketLogo from '../../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../../assets/images/active-devices/Union.svg';
import Skeleton from 'react-loading-skeleton';
import { DateRangeStore } from '../../../store/DateRangeStore';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';
import { apiRequestBody } from '../../../helpers/helpers';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import '../passive-devices/styles.scss';
import Brick from '../../../sharedComponents/brick';
import { getLocationData } from '../passive-devices/services';
import Select from '../../../sharedComponents/form/select';
import { ReactComponent as SearchSVG } from '../../../assets/icon/search.svg';
import { ReactComponent as ChartSVG } from '../../../assets/icon/chart.svg';

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
    const [isProcessing, setIsProcessing] = useState(false);

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

    const fetchLocationData = async () => {
        setIsLocationFetched(true);
        await getLocationData(`/${bldgId}`)
            .then((res) => {
                let response = res?.data;
                response.sort((a, b) => {
                    return a.location_name.localeCompare(b.location_name);
                });
                let locationList = [];
                response.forEach((el) => {
                    let obj = {
                        label: el?.location_name,
                        value: el?.location_id,
                    };
                    locationList.push(obj);
                });
                setLocationData(locationList);
                setIsLocationFetched(false);
            })
            .catch(() => {
                setIsLocationFetched(false);
            });
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
                            NulledData.push({ x: new Date(ele?.time_stamp).getTime(), y: null });
                        } else {
                            if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                NulledData.push({
                                    x: new Date(ele.time_stamp).getTime(),
                                    y: ele.consumption / UNIT_DIVIDER,
                                });
                            } else {
                                NulledData.push({ x: new Date(ele.time_stamp).getTime(), y: ele.consumption });
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

    const redirectToActivePage = () => {
        history.push({ pathname: `/settings/active-devices` });
    };

    const updateActiveDeviceData = async () => {
        if (activeData.equipments_id) {
            try {
                setIsProcessing(true);
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
                        redirectToActivePage();
                        setIsProcessing(false);
                    });
            } catch (error) {
                setIsProcessing(false);
            }
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="passive-header-wrapper d-flex justify-content-between">
                        <div className="d-flex flex-column">
                            <Typography.Subheader size={Typography.Sizes.sm} className="font-weight-bold">
                                Active Device
                            </Typography.Subheader>
                            <div className="d-flex">
                                <Typography.Header size={Typography.Sizes.md} className="mr-2">
                                    {activeData?.model === 'KP115' && 'Smart Mini Plug'}
                                    {activeData?.model === 'HS300' && 'Power Strip'}
                                </Typography.Header>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className="d-flex align-items-center mt-1">
                                    {activeData?.identifier}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={redirectToActivePage}
                                />
                            </div>
                            <div>
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
                                    <Button
                                        label={isProcessing ? 'Saving' : 'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        onClick={updateActiveDeviceData}
                                        className="ml-2"
                                        disabled={
                                            activeLocationId === 'Select location' ||
                                            isProcessing ||
                                            activeLocationId === activeData?.location_id
                                                ? true
                                                : false
                                        }
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="passive-container">
                <Col lg={4}>
                    <Typography.Subheader size={Typography.Sizes.md}>Device Details</Typography.Subheader>

                    <Brick sizeInRem={1.5} />

                    <div>
                        <Typography.Subheader size={Typography.Sizes.sm}>Installed Location</Typography.Subheader>
                        <Brick sizeInRem={0.25} />
                        {isLocationFetched || isProcessing ? (
                            <Skeleton count={1} height={35} />
                        ) : (
                            <Select
                                placeholder="Select Location"
                                options={locationData}
                                currentValue={locationData.filter((option) => option.value === activeLocationId)}
                                onChange={(e) => setActiveLocationId(e.value)}
                                isSearchable={true}
                                disabled={
                                    !(
                                        userPermission?.user_role === 'admin' ||
                                        userPermission?.permissions?.permissions?.advanced_passive_device_permission
                                            ?.edit
                                    )
                                }
                            />
                        )}
                        <Brick sizeInRem={0.25} />
                        <Typography.Body size={Typography.Sizes.sm}>Location this device is installed.</Typography.Body>
                    </div>

                    <Brick sizeInRem={1.5} />

                    <div className="device-container">
                        <div>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Identifier</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {activeData?.identifier}
                                </Typography.Subheader>
                            </div>
                            <Brick sizeInRem={1} />
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Firmware Version</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>v1.2</Typography.Subheader>
                            </div>
                        </div>

                        <div>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Device Model</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {activeData?.model}
                                </Typography.Subheader>
                            </div>
                            <Brick sizeInRem={1} />
                            <div>
                                <Typography.Subheader size={Typography.Sizes.sm}>Device Version</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Subheader size={Typography.Sizes.md}>v2</Typography.Subheader>
                            </div>
                        </div>
                    </div>

                    <Brick sizeInRem={1.5} />

                    <div className="equip-socket-container">
                        <div className="sockets-slots-container">
                            {sensors.map((record, index) => {
                                return (
                                    <>
                                        {record.status && (
                                            <div>
                                                <div className="power-off-style-equip">
                                                    <FontAwesomeIcon icon={faPowerOff} size="lg" color="#3C6DF5" />
                                                </div>
                                                {record.equipment_type_id === '' ? (
                                                    <div className="socket-rect">
                                                        <img src={SocketLogo} alt="Socket" />
                                                    </div>
                                                ) : (
                                                    <div className="online-socket-container-equip">
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

                                        {!record.status && (
                                            <div>
                                                <div className="power-off-style-equip">
                                                    <FontAwesomeIcon icon={faPowerOff} size="lg" color="#EAECF0" />
                                                </div>
                                                {record.equipment_type_id === '' ? (
                                                    <div className="socket-rect">
                                                        <img src={SocketLogo} alt="Socket" />
                                                    </div>
                                                ) : (
                                                    <div className="online-socket-container-equip">
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
                </Col>

                <Col lg={8}>
                    <Typography.Subheader
                        size={Typography.Sizes.md}>{`Sockets (${sensors.length})`}</Typography.Subheader>
                    <Brick sizeInRem={0.5} />
                    <div className="active-sensor-header">
                        <div className="search-container mr-2">
                            <SearchSVG className="mb-1" />
                            <input
                                className="search-box ml-2"
                                type="search"
                                name="search"
                                placeholder="Search"
                                // value={searchSensor}
                                // onChange={handleSearchChange}
                            />
                        </div>
                    </div>

                    <Brick sizeInRem={0.25} />

                    {isFetchingSensorData ? (
                        <div>
                            <Skeleton count={8} height={40} />
                        </div>
                    ) : (
                        <>
                            {sensors.map((record, index) => {
                                return (
                                    <>
                                        <Brick sizeInRem={0.75} />

                                        <div
                                            className={`d-flex justify-content-between sensor-container ${
                                                record?.equipment_id === '' && record?.breaker_id === ''
                                                    ? 'sensor-unattach'
                                                    : ''
                                            }`}>
                                            <div className="d-flex align-items-center mouse-pointer">
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className="sensor-index mr-4">
                                                    {index + 1}
                                                </Typography.Subheader>
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className={`mr-4 ${
                                                        record?.equipment_id === '' && record?.breaker_id === ''
                                                            ? 'sensor-index'
                                                            : ''
                                                    }`}>
                                                    {record?.equipment_type_name && record?.equipment_type_name === ''
                                                        ? 'No Equipment'
                                                        : record?.equipment_type_name}
                                                </Typography.Subheader>
                                                {record?.equipment_id && (
                                                    <Typography.Subheader
                                                        size={Typography.Sizes.md}
                                                        className="sensor-equip typography-wrapper link">
                                                        {record?.equipment}
                                                    </Typography.Subheader>
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <ChartSVG
                                                    onClick={() => handleChartShow(record?.id)}
                                                    className="mouse-pointer"
                                                />
                                                {/* Planned to enable commented code in Future [Panel-Breaker Edit code] */}
                                                {/* <button
                                                            type="button"
                                                            className="btn btn-default passive-edit-style"
                                                            onClick={() => {
                                                                setEditSenorModelRefresh(true);
                                                                setCurrentSensorObj(record);
                                                                openEditSensorPanelModel();
                                                            }}>
                                                            Edit
                                                        </button> */}
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </>
                    )}
                </Col>
            </Row>

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

            <Modal show={showEquipment} onHide={handleEquipmentClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Socket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            {/* <Select
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
                            /> */}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button variant="light" onClick={handleEquipmentClose}>
                        Cancel
                    </button>
                    <button
                        variant="primary"
                        onClick={() => {
                            handleEquipmentClose();
                            linkSensorToEquipment(selectedSensorId, selectedEquipTypeId, newEquipTypeID);
                        }}>
                        Update Socket
                    </button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default IndividualActiveDevice;
