import React, { useState, useMemo, useEffect } from 'react';
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
} from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalActiveDevices, getLocation, createDevice } from '../../../services/Network';
import { ChevronDown } from 'react-feather';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../store/BuildingStore';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Pagination from 'react-bootstrap/Pagination';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';

const ActiveDevicesTable = ({
    deviceData,
    isDeviceProcessing,
    setIsDeviceProcessing,
    nextPageData,
    previousPageData,
    paginationData,
    pageSize,
    setPageSize,
    selectedOptions,
}) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            {selectedOptions.some((record) => record.value === 'status') && <th>Status</th>}
                            {selectedOptions.some((record) => record.value === 'identifier') && (
                                <th>Identifier (MAC)</th>
                            )}
                            {selectedOptions.some((record) => record.value === 'model') && <th>Model</th>}
                            {selectedOptions.some((record) => record.value === 'location') && <th>Location</th>}
                            {selectedOptions.some((record) => record.value === 'description') && <th>Device Type</th>}
                            {selectedOptions.some((record) => record.value === 'sensors') && <th>Sensors</th>}
                            {selectedOptions.some((record) => record.value === 'firmware-version') && (
                                <th>Firmware Version</th>
                            )}
                            {selectedOptions.some((record) => record.value === 'hardware-version') && (
                                <th>Hardware Version</th>
                            )}
                        </tr>
                    </thead>
                    {isDeviceProcessing ? (
                        <tbody>
                            <SkeletonTheme color="#202020" height={35}>
                                <tr>
                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                    
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {deviceData.map((record, index) => {
                                return (
                                    <tr key={index}>
                                        {selectedOptions.some((record) => record.value === 'status') && (
                                            <td scope="row" className="text-center">
                                                {record.status === 'Online' && (
                                                    <div className="icon-bg-styling">
                                                        <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                    </div>
                                                )}
                                                {record.status === 'Offline' && (
                                                    <div className="icon-bg-styling-slash">
                                                        <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                    </div>
                                                )}
                                            </td>
                                        )}

                                        <Link
                                            to={{
                                                pathname: `/settings/active-devices/single/${record.equipments_id}`,
                                            }}>
                                            {selectedOptions.some((record) => record.value === 'identifier') && (
                                                <td className="font-weight-bold panel-name">{record.identifier}</td>
                                            )}
                                        </Link>
                                        {selectedOptions.some((record) => record.value === 'model') && (
                                            <td>{record.model}</td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'location') && (
                                            <td>{record.location}</td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'description') && (
                                            <th>{record.description}</th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'sensors') && (
                                            <td>{record.sensor_number}</td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'firmware-version') && (
                                            <td>{record.firmware_version === null ? '-' : record.firmware_version}</td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'hardware-version') && (
                                            <td>{record.hardware_version === null ? '-' : record.hardware_version}</td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </Table>

                <div className="page-button-style ml-2">
                    <div>
                        <button
                            type="button"
                            className="btn btn-md btn-light font-weight-bold mt-4 mr-2"
                            onClick={() => {
                                previousPageData(paginationData.pagination.previous);
                            }}>
                            Previous
                        </button>
                        <button
                            type="button"
                            className="btn btn-md btn-light font-weight-bold mt-4"
                            onClick={() => {
                                nextPageData(paginationData.pagination.next);
                            }}>
                            Next
                        </button>
                    </div>
                    <div>
                        <select
                            value={pageSize}
                            className="btn btn-md btn-light font-weight-bold mt-4"
                            onChange={(e) => {
                                setPageSize(parseInt(e.target.value));
                            }}>
                            {[10, 25, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize} className="align-options-center">
                                    Show {pageSize} devices
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

const ActiveDevices = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const tableColumnOptions = [
        { label: 'Status', value: 'status' },
        { label: 'Identifier (MAC)', value: 'identifier' },
        { label: 'Model', value: 'model' },
        { label: 'Location', value: 'location' },
        { label: 'Device Type', value: 'description' },
        { label: 'Sensors', value: 'sensors' },
        { label: 'Firmware Version', value: 'firmware-version' },
        { label: 'Hardware Version', value: 'hardware-version' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    // Modal states
    const [selectedTab, setSelectedTab] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);

    const [pageRequest, setPageRequest] = useState('');

    const [activeDeviceModal, setActiveDeviceModal] = useState([
        {
            value: 'KP115',
            label: 'KP115',
        },
        {
            value: 'HS300',
            label: 'HS300',
        },
    ]);

    const [activeDeviceData, setActiveDeviceData] = useState([]);
    const [paginationData, setPaginationData] = useState({});

    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'active',
    });

    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createDeviceData);
        obj[key] = value;
        setCreateDeviceData(obj);
    };

    const saveDeviceData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsProcessing(true);

            axios
                .post(`${BaseUrl}${createDevice}`, createDeviceData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
            setPageRefresh(!pageRefresh);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Active device data');
        }
    };

    const nextPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setActiveDeviceData(response.data);
                console.log(response.data);
                setPaginationData(res.data);

                let onlineData = [];
                let offlineData = [];

                response.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch all Active Devices');
        }
    };

    const previousPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setActiveDeviceData(response.data);
                setPaginationData(res.data);

                let onlineData = [];
                let offlineData = [];

                response.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch all Active Devices');
        }
    };

    useEffect(() => {
        const fetchActiveDeviceData = async () => {
            try {
                setIsDeviceProcessing(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setActiveDeviceData(response.data);
                    console.log(response.data);
                    const sampleData = response.data;
                    console.log('sampleData => ', sampleData);
                    setPaginationData(res.data);

                    let onlineData = [];
                    let offlineData = [];

                    response.forEach((record) => {
                        record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                    });

                    setOnlineDeviceData(onlineData);
                    setOfflineDeviceData(offlineData);
                    setIsDeviceProcessing(false);
                });
            } catch (error) {
                console.log(error);
                setIsDeviceProcessing(false);
                console.log('Failed to fetch all Active Devices');
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
                    setLocationData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchActiveDeviceData();
        fetchLocationData();
    }, [bldgId, pageRefresh]);

    useEffect(() => {
        const fetchActiveDeviceData = async () => {
            try {
                setIsDeviceProcessing(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setActiveDeviceData(response.data);
                    const sampleData = response.data;
                    console.log('sampleData => ', sampleData);
                    setPaginationData(res.data);

                    let onlineData = [];
                    let offlineData = [];

                    response.data.forEach((record) => {
                        record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                    });

                    setOnlineDeviceData(onlineData);
                    setOfflineDeviceData(offlineData);
                });
                setIsDeviceProcessing(false);
            } catch (error) {
                console.log(error);
                setIsDeviceProcessing(false);
                console.log('Failed to fetch all Active Devices');
            }
        };
        fetchActiveDeviceData();
    }, [pageSize]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Active Devices',
                        path: '/settings/active-devices',
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

        let arr = [
            { label: 'Status', value: 'status' },
            { label: 'Identifier (MAC)', value: 'identifier' },
            { label: 'Model', value: 'model' },
            { label: 'Location', value: 'location' },
            { label: 'Device Type', value: 'description' },
            { label: 'Sensors', value: 'sensors' },
            { label: 'Firmware Version', value: 'firmware-version' },
            { label: 'Hardware Version', value: 'hardware-version' },
        ];
        setSelectedOptions(arr);
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Active Devices
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        {/* <div className="mr-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold">
                                Attach Kasa Account
                            </button>
                        </div> */}
                        <div className="mr-2">
                        <Link
                                 to={{
                                    pathname: `/settings/active-devices/provision`,
                                }}>

                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Device(s)
                            </button>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <span class="input-group-text border-0" id="search-addon">
                            <Search className="icon-sm" />
                        </span>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="btn-group ml-2" role="group" aria-label="Basic example">
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
                                <i className="uil uil-wifi mr-1"></i>Online
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
                                <i className="uil uil-wifi-slash mr-1"></i>Offline
                            </button>
                        </div>
                    </div>

                    <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button>

                    {/* ---------------------------------------------------------------------- */}

                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={10}>
                    {selectedTab === 0 && (
                        <ActiveDevicesTable
                            deviceData={activeDeviceData}
                            setPageRequest={setPageRequest}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            selectedOptions={selectedOptions}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                        />
                    )}
                    {selectedTab === 1 && (
                        <ActiveDevicesTable
                            deviceData={onlineDeviceData}
                            setPageRequest={setPageRequest}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            selectedOptions={selectedOptions}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                        />
                    )}
                    {selectedTab === 2 && (
                        <ActiveDevicesTable
                            deviceData={offlineDeviceData}
                            setPageRequest={setPageRequest}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            selectedOptions={selectedOptions}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                        />
                    )}
                </Col>
            </Row>

            
        </React.Fragment>
    );
};

export default ActiveDevices;
