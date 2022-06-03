import React, { useState, useEffect } from 'react';
import { FormGroup } from 'reactstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import DeviceChartModel from '../DeviceChartModel';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl, generalActiveDevices, getLocation, sensorGraphData } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import './style.css';

const IndividualActiveDevice = () => {
    const { deviceId } = useParams();
    const [sensorId, setSensorId] = useState('');
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);
    const handleChartShow = () => setShowChart(true);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [locationData, setLocationData] = useState([]);
    const [activeData, setActiveData] = useState({});
    const [sensors, setSensors] = useState([]);
    const [sensorCount, setSensorCount] = useState(0);

    useEffect(() => {
        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                await axios.get(`${BaseUrl}${generalActiveDevices}`, { headers }).then((res) => {
                    let response = res.data;

                    let data = response.filter((record) => record.equipments_id === deviceId);
                    let deviceData = data[0];

                    setActiveData(deviceData);
                    if (deviceData.sensors) {
                        let arr = deviceData.sensors;
                        setSensors(arr);
                    }
                    if (deviceData.sensor_number) {
                        let count = parseInt(deviceData.sensor_number.split('/')[0]);
                        setSensorCount(count);
                    }
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device data');
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
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const fetchSensorGraphData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                let params = `?sensor_id=${sensorId}`;
                await axios.post(`${BaseUrl}${sensorGraphData}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    console.log('Sensor Graph Data => ', response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Sensor Graph data');
            }
        };
        // fetchSensorGraphData();
    }, [sensorId]);

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
                                    <span className="passive-device-name mr-3">Power Strip</span>
                                    <span className="passive-sensor-count">{activeData.identifier}</span>
                                </div>
                            </div>
                            <div>
                                <Link to="/settings/active-devices">
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
                                            value={activeData.location}
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
                            {/* <h5 className="device-title">Sensors ({activeData.sensors.length})</h5> */}
                            <h5 className="device-title">Sensors (1)</h5>
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

                            <div className="mt-2 socket-image-container"></div>

                            {sensors.map((sensor, index) => {
                                return (
                                    <>
                                        {sensor.equipment_id === '' ? (
                                            <div className="sensor-container-style-notAttached mt-3">
                                                <div className="sensor-data-style">
                                                    <span className="sensor-data-no">{index + 1}</span>
                                                    <span className="sensor-data-title">No Equipment</span>
                                                </div>
                                                <div className="sensor-data-style-right">
                                                    <button
                                                        type="button"
                                                        className="btn btn-default passive-edit-style">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="sensor-container-style mt-3">
                                                <div className="sensor-data-style">
                                                    <span className="sensor-data-no">{index + 1}</span>
                                                    <span className="sensor-data-title">{sensor.equipment}</span>
                                                </div>
                                                <div className="sensor-data-style-right">
                                                    <FontAwesomeIcon
                                                        icon={faChartMixed}
                                                        size="md"
                                                        onClick={() => {
                                                            setSensorId(sensor.id);
                                                            handleChartShow();
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-default passive-edit-style">
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <DeviceChartModel showChart={showChart} handleChartClose={handleChartClose} />
        </>
    );
};

export default IndividualActiveDevice;
