import React, { useState } from 'react';
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

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChevronDown } from 'react-feather';
import './style.css';
import { TagsInput } from 'react-tag-input-component';

const ModalEquipment = ({ show, equipData, close }) => {
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

const BuildingTable = () => {
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

    const [selected, setSelected] = useState(['papaya']);

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
                            {records.map((record, index) => {
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => {
                                            setEquipData(record);
                                            Toggle();
                                        }}>
                                        <td className="text-center">
                                            <div>
                                                {record.status === 'available' && (
                                                    <div className="icon-bg-styling">
                                                        <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-weight-bold">{record.name}</td>
                                        <td className="font-weight-bold">{record.equipType}</td>
                                        <td>{record.location}</td>
                                        <td>
                                            {
                                                <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                    {record.tags}
                                                </div>
                                            }
                                        </td>
                                        <td>{record.sensorNo}</td>
                                        <td>{record.lastData}</td>
                                        <td className="font-weight-bold">{record.deviceId}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
            <div>
                <ModalEquipment show={modal} equipData={equipData} close={Toggle} />
            </div>
        </>
    );
};

const Equipment = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Equipment
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                <i className="uil uil-plus mr-1"></i>Add Equipment
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={12}>
                    <div style={{ marginLeft: '25px' }}>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <input type="text" className="search-style" placeholder="Search..." />
                        </div>

                        {/* <div class="input-group">
                            <input
                                class="form-control border-end-0 border rounded-pill"
                                type="text"
                                value="search"
                                id="example-search-input"
                            />
                            <span class="input-group-append">
                                <button
                                    class="btn btn-outline-secondary bg-white border-start-0 border rounded-pill ms-n3"
                                    type="button">
                                    <i class="fa fa-search"></i>
                                </button>
                            </span>
                        </div> */}

                        {/* <div className="input-group" style={{ display: 'inline-block' }}>
                            <input type="text" className="form-control search-input" placeholder="Search..." />
                            <span className="uil uil-search icon-search"></span>
                            <div className="input-group-append"></div>
                        </div> */}

                        <div className="btn-group" role="group" aria-label="Basic example">
                            <div>
                                <button type="button" className="btn btn-white d-inline">
                                    All Statuses
                                </button>

                                <button type="button" className="btn btn-white d-inline">
                                    {/* <Wifi className="icon-sm" /> */}
                                    {/* Online */}
                                    <i className="uil uil-wifi mr-1"></i>Online
                                </button>

                                <button type="button" className="btn btn-white d-inline">
                                    {/* <WifiOff className="icon-sm" /> */}
                                    {/* Offline */}
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
                                <DropdownItem>Olivia Rhye</DropdownItem>
                                <DropdownItem>Lana Steiner</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <BuildingTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Equipment;
