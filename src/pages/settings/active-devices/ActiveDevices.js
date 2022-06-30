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
import { Cookies } from 'react-cookie';
import './style.css';

const ActiveDevicesTable = ({ deviceData, setPageRequest, nextPageData, previousPageData, paginationData }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Identifier (MAC)</th>
                            <th>Model</th>
                            <th>Location</th>
                            <th>Sensors</th>
                            <th>Firmware Version</th>
                            <th>Hardware Version</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceData.map((record, index) => {
                            return (
                                <tr key={index}>
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
                                    <Link
                                        to={{
                                            pathname: `/settings/active-devices/single/${record.equipments_id}`,
                                        }}>
                                        <td className="font-weight-bold panel-name">{record.identifier}</td>
                                    </Link>
                                    <td>{record.model}</td>
                                    <td>{record.location}</td>
                                    <td>{record.sensor_number}</td>
                                    <td>{record.firmware_version}</td>
                                    <td>{record.hardware_version}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                {/* {!deviceData.length === 0 && (
                    <> */}
                <div className="page-button-style">
                    <button
                        type="button"
                        className="btn btn-md btn-light font-weight-bold mt-4"
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
                {/* </>
                )} */}
            </CardBody>
        </Card>
    );
};

const ActiveDevices = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    
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
    // const [activeDeviceData, setActiveDeviceData] = useState([
    //     {
    //         equipments_id: '629a250650044d23b0319bbd',
    //         status: 'Online',
    //         location: 'Hall > Ground Floor',
    //         sensor_number: '1/6',
    //         identifier: '10:27:F5:8F:8B:F3',
    //         model: 'HS300',
    //         firmware_version: null,
    //         hardware_version: '0',
    //     },
    // ]);
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'active',
    });

    const bldgId = BuildingStore.useState((s) => s.BldgId);

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
                // 'user-auth': '628f3144b712934f578be895',
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
            alert('Failed to create Active device data');
        }
    };

    const nextPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                // 'user-auth': '628f3144b712934f578be895',
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
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
        }
    };

    const previousPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                // 'user-auth': '628f3144b712934f578be895',
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
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
        }
    };

    useEffect(() => {
        const fetchActiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?page_size=${pageSize}&page_no=${pageNo}`;
                await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
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
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Active Devices');
            }
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
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
        };
        updateBreadcrumbStore();
    }, []);

    // useEffect(() => {
    //     const fetchActiveDeviceData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             let params = `?page_size=${pageNo}&page_no=${pageSize}`;
    //             await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
    //                 let data = res.data;
    //                 setActiveDeviceData(data);

    //                 let onlineData = [];
    //                 let offlineData = [];

    //                 data.forEach((record) => {
    //                     record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
    //                 });

    //                 setOnlineDeviceData(onlineData);
    //                 setOfflineDeviceData(offlineData);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Active Devices');
    //         }
    //     };
    //     fetchActiveDeviceData();
    // });

    // useEffect(() => {
    //     const fetchActiveDeviceData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             await axios.get(`${BaseUrl}${generalActiveDevices}`, { headers }).then((res) => {
    //                 setActiveDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Active Devices');
    //         }
    //     };

    //     const fetchOnlineDeviceData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             let params = `?stat=true`;
    //             await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
    //                 setOnlineDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Online Devices');
    //         }
    //     };

    //     const fetchOfflineDeviceData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             let params = `?stat=false`;
    //             await axios.get(`${BaseUrl}${generalActiveDevices}${params}`, { headers }).then((res) => {
    //                 setOfflineDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Offline Devices');
    //         }
    //     };

    //     const fetchLocationData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             // await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
    //             await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
    //                 setLocationData(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch Location Data');
    //         }
    //     };

    //     fetchActiveDeviceData();
    //     fetchOnlineDeviceData();
    //     fetchOfflineDeviceData();
    //     fetchLocationData();
    // }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Active Devices
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold">
                                Attach Kasa Account
                            </button>
                        </div>
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Device
                            </button>
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
                        />
                    )}
                    {selectedTab === 1 && (
                        <ActiveDevicesTable
                            deviceData={onlineDeviceData}
                            setPageRequest={setPageRequest}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                        />
                    )}
                    {selectedTab === 2 && (
                        <ActiveDevicesTable
                            deviceData={offlineDeviceData}
                            setPageRequest={setPageRequest}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                        />
                    )}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Active Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('mac_address', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Model</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('model', e.target.value);
                                }}>
                                <option selected>Select Model</option>
                                {activeDeviceModal.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Location</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option selected>Select Location</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            saveDeviceData();
                            handleClose();
                        }}
                        disabled={isProcessing}>
                        {isProcessing ? 'Adding...' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default ActiveDevices;
