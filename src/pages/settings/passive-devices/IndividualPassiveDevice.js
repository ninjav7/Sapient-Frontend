import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import DeviceChartModel from '../../../pages/chartModal/DeviceChartModel';
import { Link, useParams, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import {
    BaseUrl,
    generalPassiveDevices,
    getLocation,
    sensorGraphData,
    listSensor,
    updateActivePassiveDevice,
} from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import EditSensorPanelModel from './EditSensorPanelModel';
import AddSensorPanelModel from './AddSensorPanelModel';
import { DateRangeStore } from '../../../store/DateRangeStore';
import './style.css';
import { apiRequestBody } from '../../../helpers/helpers';

const IndividualPassiveDevice = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    let history = useHistory();

    const { deviceId } = useParams();
    const [sensorId, setSensorId] = useState('');
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);

    // Select Breaker states
    const [showBreaker, setShowBreaker] = useState(false);
    const handleBreakerClose = () => setShowBreaker(false);
    const handleBreakerShow = () => setShowBreaker(true);

    // Edit Sensor Panel model state
    const [showEditSensorPanel, setShowEditSensorPanel] = useState(false);
    const closeEditSensorPanelModel = () => setShowEditSensorPanel(false);
    const openEditSensorPanelModel = () => setShowEditSensorPanel(true);

    const [passiveData, setPassiveData] = useState({});
    const [locationData, setLocationData] = useState([]);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const [currentRecord, setCurrentRecord] = useState({});
    const [sensorObj, setSensorObj] = useState({});
    const [currentSensorObj, setCurrentSensorObj] = useState({});
    const [editSenorModelRefresh, setEditSenorModelRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [equipmentId, setEquipmentId] = useState('');
    const [breakerId, setBreakerId] = useState('');
    const [sensors, setSensors] = useState([]);
    const [sensorData, setSensorData] = useState([]);

    const [isLocationFetched, setIsLocationFetched] = useState(true);
    const [activeLocationId, setActiveLocationId] = useState('');
    const [sensorAPIRefresh, setSensorAPIRefresh] = useState(false);
    const [isFetchingSensorData, setIsFetchingSensorData] = useState(true);

    const [seriesData, setSeriesData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);

    const [isSensorChartLoading, setIsSensorChartLoading] = useState(true);
    const CONVERSION_ALLOWED_UNITS = ['power'];

    const UNIT_DIVIDER = 1000;

    const [metric, setMetric] = useState([
        { value: 'minCurrentMilliAmps', label: 'Minimum Current (mA)', unit: 'mA' },
        { value: 'maxCurrentMilliAmps', label: 'Maximum Current (mA)', unit: 'mA' },
        { value: 'rmsCurrentMilliAmps', label: 'RMS Current (mA)', unit: 'mA' },
        { value: 'power', label: 'Power (W)', unit: 'W' },
    ]);

    const [selectedConsumption, setConsumption] = useState(metric[2].value);
    const [selectedUnit, setSelectedUnit] = useState(metric[2].unit);
    const [searchSensor, setSearchSensor] = useState('');

    const handleSearchChange = (e) => {
        setSearchSensor(e.target.value);
    };

    const filtered = !searchSensor
        ? sensors
        : sensors.filter((sensor) => {
              return (
                  sensor.name.toLowerCase().includes(searchSensor.toLowerCase()) ||
                  sensor.breaker_link.toLowerCase().includes(searchSensor.toLowerCase()) ||
                  sensor.equipment.toLowerCase().includes(searchSensor.toLowerCase())
              );
          });

    const handleChartShow = (id) => {
        setSensorId(id);
        let obj = sensors.find((o) => o.id === id);
        setSensorData(obj);
        fetchSensorGraphData(id);
        setShowChart(true);
    };

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

    const fetchSensorGraphData = async (id) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsSensorChartLoading(true);
            let params = `?sensor_id=${
                id === sensorId ? sensorId : id
            }&consumption=rmsCurrentMilliAmps&building_id=${bldgId}`;
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

                    let recordToInsert = {
                        data: data,
                        name: getRequiredConsumptionLabel(selectedConsumption),
                    };

                    try {
                        recordToInsert.data = recordToInsert.data.map((_data) => {
                            _data[0] = moment(new Date(_data[0])).tz(timeZone).format();
                            _data[0] = new Date(_data[0]);

                            if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                _data[1] = _data[1] / UNIT_DIVIDER;
                            }
                            return _data;
                        });
                    } catch (error) {}

                    exploreData.push(recordToInsert);
                    setDeviceData(exploreData);

                    setSeriesData([
                        {
                            data: exploreData[0].data,
                        },
                    ]);
                    setIsSensorChartLoading(false);
                });
        } catch (error) {
            setIsSensorChartLoading(false);
        }
    };

    const updateActiveDeviceData = async () => {
        if (passiveData?.equipments_id) {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${passiveData?.equipments_id}`;
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

    useEffect(() => {
        const fetchSinglePassiveDevice = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}&page_size=100&page_no=1&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let response = res.data.data[0];
                    setPassiveData(response);
                    setActiveLocationId(response.location_id);
                    localStorage.setItem('identifier', response.identifier);
                });
            } catch (error) {}
        };

        const fetchActiveDeviceSensorData = async () => {
            try {
                setIsFetchingSensorData(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}`;
                await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setSensors(response);
                });
                setIsFetchingSensorData(false);
            } catch (error) {
                setIsFetchingSensorData(false);
            }
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
                });
                setIsLocationFetched(false);
            } catch (error) {
                setIsLocationFetched(false);
            }
        };
        fetchSinglePassiveDevice();
        fetchActiveDeviceSensorData();
        fetchLocationData();
    }, [deviceId]);

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
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

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
                                    <span className="passive-device-name mr-3">{passiveData?.identifier}</span>
                                    <span className="passive-sensor-count">{sensors.length} Sensors</span>
                                </div>
                            </div>
                            <div>
                                <Link to="/settings/passive-devices">
                                    <button type="button" className="btn btn-default passive-cancel-style">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-primary passive-save-style ml-2"
                                    onClick={() => {
                                        updateActiveDeviceData();
                                        history.push('/settings/passive-devices');
                                    }}
                                    disabled={
                                        activeLocationId === 'Select location' ||
                                        activeLocationId === passiveData?.location_id
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

                                        {isLocationFetched ? (
                                            <Skeleton count={1} height={35} />
                                        ) : (
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
                                        <h6 className="passive-device-value">{passiveData?.identifier}</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Model
                                        </h6>
                                        <h6 className="passive-device-value">
                                            {passiveData?.model &&
                                                passiveData?.model.charAt(0).toUpperCase() +
                                                    passiveData?.model.slice(1)}
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
                                            value={searchSensor}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {isFetchingSensorData ? (
                                <div className="mt-4">
                                    <Skeleton count={8} height={40} />
                                </div>
                            ) : (
                                <>
                                    {filtered.map((record, index) => {
                                        return (
                                            <>
                                                {record.equipment_id === '' && record.breaker_id === '' ? (
                                                    <div className="sensor-container-style-notAttached mt-3">
                                                        <div className="sensor-data-style">
                                                            <span className="sensor-data-no">{record.index}</span>
                                                            <span className="sensor-data-title">Not Attached</span>
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
                                                            <button
                                                                type="button"
                                                                className="btn btn-default passive-edit-style"
                                                                onClick={() => {
                                                                    handleBreakerShow();
                                                                    setCurrentRecord(record);
                                                                    setCurrentIndex(index);
                                                                    setEquipmentId(record.equipment_id);
                                                                    setSensorObj(record);
                                                                    setBreakerId(record?.breaker_id);
                                                                }}>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="sensor-container-style mt-3">
                                                        <div className="sensor-data-style">
                                                            <span className="sensor-data-no">{record.index}</span>
                                                            <span className="sensor-data-title">
                                                                {record.breaker_link}
                                                            </span>
                                                            <span className="sensor-data-device">
                                                                {record.equipment}
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
                                                                    setEditSenorModelRefresh(true);
                                                                    setCurrentSensorObj(record);
                                                                    openEditSensorPanelModel();
                                                                }}>
                                                                Edit
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                </div>
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
                getRequiredConsumptionLabel={getRequiredConsumptionLabel}
                isSensorChartLoading={isSensorChartLoading}
                setIsSensorChartLoading={setIsSensorChartLoading}
                timeZone={timeZone}
                daysCount={daysCount}
                deviceType="passive"
            />

            <AddSensorPanelModel
                showBreaker={showBreaker}
                handleBreakerClose={handleBreakerClose}
                sensorObj={sensorObj}
                bldgId={bldgId}
                breakerId={breakerId}
            />

            <EditSensorPanelModel
                showEditSensorPanel={showEditSensorPanel}
                closeEditSensorPanelModel={closeEditSensorPanelModel}
                currentSensorObj={currentSensorObj}
                setCurrentSensorObj={setCurrentSensorObj}
                editSenorModelRefresh={editSenorModelRefresh}
                setEditSenorModelRefresh={setEditSenorModelRefresh}
                bldgId={bldgId}
            />
        </>
    );
};

export default IndividualPassiveDevice;
