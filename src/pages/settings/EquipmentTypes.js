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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { ComponentStore } from '../../store/ComponentStore';
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

const EquipmentTable = ({ equipmentTypeData }) => {
    const records = [
        {
            name: 'Air Handling Unit',
            status: 'Sapient',
            enduse_category: 'HVAC',
            equipment_count: 11,
        },
        {
            name: 'Laptop',
            status: 'Sapient',
            enduse_category: 'Plug',
            equipment_count: 452,
        },
        {
            name: 'Custom Equipment',
            status: 'Custom',
            enduse_category: 'HVAC',
            equipment_count: 138,
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
                                <th>Name</th>
                                <th>Status</th>
                                <th>End Use Category</th>
                                <th>Equipment Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipmentTypeData.map((record, index) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => {
                                            setEquipData(record);
                                            Toggle();
                                        }}>
                                        <td className="equip-type-style">
                                            {record.equipment_type ? record.equipment_type : '-'}
                                        </td>
                                        <td>{record.status ? record.status : '-'}</td>
                                        <td>{record.end_use_name ? record.end_use_name : '-'}</td>
                                        <td>{record.equipment_count ? record.equipment_count : '-'}</td>
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

const EquipmentTypes = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentTypeData, setGeneralEquipmentTypeData] = useState([]);
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
            console.log('Failed to create Passive device data');
        }
    };

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
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const fetchEquipTypeData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${equipmentType}`, { headers }).then((res) => {
                    // console.log('setGeneralEquipmentTypeData => ', res.data);
                    setGeneralEquipmentTypeData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Equipment Type Data');
            }
        };

        fetchEquipTypeData();
    }, [bldgId]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Equipment Types
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Equipment Type
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div className="search-container ml-4">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={7}>
                    <EquipmentTable equipmentTypeData={generalEquipmentTypeData} />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>End Use</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Select End Use"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('identifier', e.target.value);
                                }}
                            />
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

export default EquipmentTypes;
