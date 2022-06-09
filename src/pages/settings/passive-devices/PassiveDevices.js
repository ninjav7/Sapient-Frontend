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
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl, generalPassiveDevices, getLocation, createDevice, generalGateway } from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChevronDown, Search } from 'react-feather';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import './style.css';

const PassiveDevicesTable = ({ deviceData, nextPageData, previousPageData, paginationData }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Identifier</th>
                            <th>Model</th>
                            <th>Location</th>
                            <th>Sensors</th>
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
                                            pathname: `/settings/passive-devices/single/${record.equipments_id}`,
                                        }}>
                                        <td className="font-weight-bold panel-name">{record.identifier}</td>
                                    </Link>
                                    <td>{record.model}</td>
                                    <td>{record.location}</td>
                                    <td>{record.sensor_number}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
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
            </CardBody>
        </Card>
    );
};

const PassiveDevices = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [pageRefresh, setPageRefresh] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);

    const [passiveDeviceData, setPassiveDeviceData] = useState([]);

    const [passiveDeviceModel, setPassiveDeviceModel] = useState([
        {
            value: 'PR55-4A',
            label: 'PR55-4A',
        },
        {
            value: 'HYDRA-1',
            label: 'HYDRA-1',
        },
    ]);
    const [paginationData, setPaginationData] = useState({});
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [generalGatewayData, setGeneralGatewayData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'passive',
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
                'user-auth': '628f3144b712934f578be895',
            };
            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${createDevice}`, createDeviceData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setPageRefresh(!pageRefresh);

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to create Passive device data');
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
                'user-auth': '628f3144b712934f578be895',
            };
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(response.data);
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
                'user-auth': '628f3144b712934f578be895',
            };
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(response.data);
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

    
    // useEffect(() => {
    //     const fetchPassiveDeviceData = async () => {
    //         try {
    //             let headers = {
    //                 'Content-Type': 'application/json',
    //                 accept: 'application/json',
    //                 'user-auth': '628f3144b712934f578be895',
    //             };
    //             await axios.get(`${BaseUrl}${generalPassiveDevices}`, { headers }).then((res) => {
    //                 setPassiveDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Passive devices');
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
    //             await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
    //                 setOnlineDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch all Online devices');
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
    //             await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
    //                 setOfflineDeviceData(res.data);
    //                 console.log(res.data);
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             console.log('Failed to fetch Offline devices');
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

    //     fetchPassiveDeviceData();
    //     fetchOnlineDeviceData();
    //     fetchOfflineDeviceData();
    //     fetchLocationData();
    // }, []);

    useEffect(() => {
        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                let params = `?page_size=${pageSize}&page_no=${pageNo}`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let data = res.data;
                    console.log('Rai Passive Data => ', data);
                    setPassiveDeviceData(data.data);

                    let onlineData = [];
                    let offlineData = [];

                    data.forEach((record) => {
                        record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                    });

                    setOnlineDeviceData(onlineData);
                    setOfflineDeviceData(offlineData);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Passive devices');
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

        const fetchGatewayData = async () => {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'user-auth': '628f3144b712934f578be895',
            };
            let params = `?building_id=${bldgId}`;
            await axios
                .get(`${BaseUrl}${generalGateway}${params}`, {
                    headers: header,
                })
                .then((res) => {
                    setGeneralGatewayData(res.data);
                    console.log(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    console.log('Failed to fetch Gateway data');
                });
        };

        fetchPassiveDeviceData();
        fetchLocationData();
        fetchGatewayData();
    }, [pageRefresh, bldgId]);

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
        console.log('createDeviceData => ', createDeviceData);
    });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Passive Devices
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Passive Device
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
                    <UncontrolledDropdown className="d-inline float-right">
                        <DropdownToggle color="white">
                            Columns
                            <i className="icon">
                                <ChevronDown></ChevronDown>
                            </i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Phoenix Baker</DropdownItem>
                            <DropdownItem active={true} className="bg-primary">
                                Olivia Rhye
                            </DropdownItem>
                            <DropdownItem>Lana Steiner</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    {selectedTab === 0 && <PassiveDevicesTable deviceData={passiveDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}/>}
                    {selectedTab === 1 && <PassiveDevicesTable deviceData={onlineDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData} />}
                    {selectedTab === 2 && <PassiveDevicesTable deviceData={offlineDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData} />}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Create Passive Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>MAC Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter MAC Address"
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
                                {passiveDeviceModel.map((record) => {
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

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Gateway</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('gateway_id', e.target.value);
                                }}>
                                <option selected>Select Gateway</option>
                                {generalGatewayData.map((record) => {
                                    return <option value={record.equipments_id}>{record.model}</option>;
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

export default PassiveDevices;
