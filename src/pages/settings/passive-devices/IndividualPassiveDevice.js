import React, { useState, useEffect } from 'react';
import { FormGroup } from 'reactstrap';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import DeviceChartModel from '../DeviceChartModel';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl, generalPassiveDevices, getLocation, createDevice } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import './style.css';

const IndividualPassiveDevice = () => {
    const { deviceId } = useParams();
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);
    const handleChartShow = () => setShowChart(true);

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
                            <div className="sensor-container-style mt-3">
                                <div className="sensor-data-style">
                                    <span className="sensor-data-no">1</span>
                                    <span className="sensor-data-title">Panel 1, Breaker 1</span>
                                    <span className="sensor-data-device">AHU 1</span>
                                </div>
                                <div className="sensor-data-style-right">
                                    <FontAwesomeIcon
                                        icon={faChartMixed}
                                        size="md"
                                        onClick={() => {
                                            handleChartShow();
                                        }}
                                    />
                                    <button type="button" className="btn btn-default passive-edit-style">
                                        Edit
                                    </button>
                                </div>
                            </div>
                            <div className="sensor-container-style mt-3">
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
                            </div>
                            <div className="sensor-container-style-notAttached mt-3">
                                <div className="sensor-data-style">
                                    <span className="sensor-data-no">3</span>
                                    <span className="sensor-data-title">Not Attached</span>
                                    {/* <span className="sensor-data-device">AHU 2</span> */}
                                </div>
                                <div className="sensor-data-style-right">
                                    {/* <FontAwesomeIcon icon={faChartMixed} size="md" /> */}
                                    <button type="button" className="btn btn-default passive-edit-style">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeviceChartModel showChart={showChart} handleChartClose={handleChartClose} />
        </>
    );
};

export default IndividualPassiveDevice;
