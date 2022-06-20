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
} from 'reactstrap';
import axios from 'axios';
import { BaseUrl, generalEquipments, getLocation, equipmentType, createEquipment } from '../../services/Network';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChevronDown, Search } from 'react-feather';
import './style.css';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { Cookies } from 'react-cookie';

const SingleEquipmentModal = ({ show, equipData, close }) => {
    return (
        <>
            {show ? (
                <Modal show={show} onHide={close} dialogClassName="modal-container-style" centered>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>
                                <h6 className="text-muted">{`Floor 1 > 252 > Desktop PC`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={10}>
                                <div>
                                    <span className="heading-style">{equipData.equipType}</span>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <div className="float-right">
                                    <button type="button" className="btn btn-md btn-light font-weight-bold mr-4">
                                        Turn Off
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className="mt-2 modal-tabs-style">
                                    <span className="mr-3">Metrics</span>
                                    <span className="mr-3 tab-styling">Configure</span>
                                    <span className="mr-3">History</span>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Body>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col lg={12}>
                                        <h4>Equipment Details</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Equipment Name"
                                                className="font-weight-bold"
                                                defaultValue="Name"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Type</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold">
                                                <option selected>Desktop PC</option>
                                                <option>Refigerator</option>
                                            </Input>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Identifier"
                                                className="font-weight-bold"
                                                value="Floor 1, 252"
                                            />
                                            <Form.Label>Location this equipment is installed in.</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Applied Rule</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold">
                                                <option selected>Desktop PC</option>
                                                <option>Refigerator</option>
                                            </Input>
                                            <Form.Label>
                                                The rule applied to this equipment to control when it is on.
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        {/* <TagsInput
                                            value={selected}
                                            onChange={setSelected}
                                            name="fruits"
                                            placeHolder="enter fruits"
                                        /> */}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Notes</Form.Label>
                                            <Input
                                                type="textarea"
                                                name="text"
                                                id="exampleText"
                                                rows="3"
                                                placeholder="Enter a Note..."
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className="modal-right-container">
                                    <div className="modal-right-pic"></div>
                                    <div className="modal-right-card mt-2">
                                        <span className="modal-right-card-title">Power Strip Socket 2</span>
                                        <button
                                            type="button"
                                            class="btn btn-light btn-md font-weight-bold float-right mr-2">
                                            View Devices
                                        </button>
                                    </div>
                                    <div className="mt-4 modal-right-group">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    MAC Address
                                                </h6>
                                                <h6 className="card-title">AA:AA:AA:AA:AA:AA:AA</h6>
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Device type
                                                </h6>
                                                <h6 className="card-title">HS300</h6>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Installed at
                                            </h6>
                                            <h6 className="card-title">{`Floor 1 -> Room 253`}</h6>
                                        </div>
                                    </FormGroup>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            ) : null}
        </>
    );
};

const EquipmentTable = ({ equipmentData }) => {
    const records = [
        {
            status: 'available',
            name: '-',
            equipType: 'Desktop PC',
            location: 'Floor 1 > 252',
            tags: 'FINANCE',
            sensorNo: 2,
            lastData: '5 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
        {
            status: 'available',
            name: '-',
            equipType: 'Refrigerator',
            location: 'Floor 1 > W Kitchen',
            tags: 'None',
            sensorNo: '2',
            lastData: '2 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
        {
            status: 'available',
            name: 'AHU 1',
            equipType: 'AHU',
            location: 'Floor 1 > Mech.',
            tags: 'None',
            sensorNo: '1,2',
            lastData: '2 min ago',
            deviceId: 'D8:07:B6:88:D8:3B',
        },
    ];

    const [modal, setModal] = useState(false);
    const Toggle = () => setModal(!modal);
    const [equipData, setEquipData] = useState(null);

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered table-hover">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Equipment Type</th>
                                <th>Location</th>
                                <th>Tags</th>
                                <th>Sensor Number</th>
                                <th>Last Data</th>
                                <th>Device ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipmentData.map((record, index) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => {
                                            setEquipData(record);
                                            Toggle();
                                        }}>
                                        <td className="text-center">
                                            <div>
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
                                            </div>
                                        </td>
                                        <td className="font-weight-bold">
                                            {!(record.equipments_name === null) ? record.equipments_name : '-'}
                                        </td>
                                        <td className="font-weight-bold">{record.equipments_type}</td>
                                        <td>{record.location}</td>
                                        <td>
                                            {
                                                <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                    {record.tags.length === 0 ? 'None' : record.tags[0]}
                                                </div>
                                            }
                                        </td>
                                        <td>{record.sensor_number}</td>
                                        <td>{record.last_data === '' ? '-' : record.last_data}</td>
                                        <td className="font-weight-bold">{record.device_id}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
            <div>
                <SingleEquipmentModal show={modal} equipData={equipData} close={Toggle} />
            </div>
        </>
    );
};

const Equipment = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentData, setGeneralEquipmentData] = useState([]);
    const [onlineEquipData, setOnlineEquipData] = useState([]);
    const [offlineEquipData, setOfflineEquipData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [createEqipmentData, setCreateEqipmentData] = useState({});
    const [locationData, setLocationData] = useState([]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEqipmentData);
        obj[key] = value;
        setCreateEqipmentData(obj);
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
                .post(`${BaseUrl}${createEquipment}`, createEqipmentData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to create Passive device data');
        }
    };

    useEffect(() => {
        const fetchEquipmentData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    let responseData = res.data;
                    setGeneralEquipmentData(responseData);
                    let onlineEquip = [];
                    let offlineEquip = [];
                    responseData.forEach((record) => {
                        if (record.status === 'Online') {
                            onlineEquip.push(record);
                        }
                        if (record.status === 'Offline') {
                            offlineEquip.push(record);
                        }
                    });
                    setOnlineEquipData(onlineEquip);
                    setOfflineEquipData(offlineEquip);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Equipments Data');
            }
        };

        const fetchOnlineEquipData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?stat=true&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    setOnlineEquipData(res.data);
                    console.log(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch online Equipments Data');
            }
        };

        const fetchOfflineEquipData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?stat=false&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    setOfflineEquipData(res.data);
                    console.log(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch offline Equipments Data');
            }
        };

        const fetchEquipTypeData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${equipmentType}`, { headers }).then((res) => {
                    setEquipmentTypeData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Equipment Type Data');
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
                // await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    setLocationData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchEquipmentData();
        // fetchOnlineEquipData();
        // fetchOfflineEquipData();
        fetchEquipTypeData();
        fetchLocationData();
    }, [bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment',
                        path: '/settings/equipment',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    // useEffect(() => {
    //     console.log('createEqipmentData => ', createEqipmentData);
    // });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Equipment
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Equipment
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
                    <UncontrolledDropdown className="d-inline float-right mr-3">
                        <DropdownToggle color="white">
                            Columns
                            <i className="icon">
                                <ChevronDown></ChevronDown>
                            </i>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Phoenix Baker</DropdownItem>
                            <DropdownItem>Olivia Rhye</DropdownItem>
                            <DropdownItem>Lana Steiner</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Col>
            </Row>

            <Row>
                <Col lg={11}>
                    {selectedTab === 0 && <EquipmentTable equipmentData={generalEquipmentData} />}
                    {selectedTab === 1 && <EquipmentTable equipmentData={onlineEquipData} />}
                    {selectedTab === 2 && <EquipmentTable equipmentData={offlineEquipData} />}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('identifier', e.target.value);
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('equipment_type', e.target.value);
                                }}>
                                <option selected>Select Model</option>
                                {equipmentTypeData.map((record) => {
                                    return <option value={record.equipment_id}>{record.equipment_type}</option>;
                                })}
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Location</Form.Label>
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

export default Equipment;
