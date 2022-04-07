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
} from 'reactstrap';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChevronDown } from 'react-feather';
import './style.css';

const PassiveDevicesTable = () => {
    const records = [
        {
            status: 'available',
            identifierMAC: 12345676,
            model: 'PR55-4A',
            location: 'Floor 1 > Electrical Closet',
            sensors: '2/3',
        },
        {
            status: 'available',
            identifierMAC: 12342341,
            model: 'PR55-4A',
            location: 'Floor 1 > Electrical Closet',
            sensors: '3/3',
        },
    ];

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
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td scope="row" className="text-center">
                                        {record.status === 'available' && (
                                            <div className="icon-bg-styling">
                                                <i className="uil uil-wifi mr-1 icon-styling"></i>
                                            </div>
                                        )}
                                    </td>
                                    <td className="font-weight-bold panel-name">{record.identifierMAC}</td>
                                    <td>{record.model}</td>
                                    <td>{record.location}</td>
                                    <td>{record.sensors}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const PassiveDevices = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Passive Devices
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
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
                <Col xl={12}>
                    <div style={{ marginLeft: '25px' }}>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <input type="text" className="search-style" placeholder="Search..." autoFocus />
                        </div>

                        <div className="btn-group" role="group" aria-label="Basic example">
                            <div>
                                <button type="button" className="btn btn-white d-inline">
                                    All Statuses
                                </button>

                                <button type="button" className="btn btn-white d-inline">
                                    <i className="uil uil-wifi mr-1"></i>Online
                                </button>

                                <button type="button" className="btn btn-white d-inline">
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
                    <PassiveDevicesTable />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Utility Bill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Model</Form.Label>
                            <Input type="select" name="select" id="exampleSelect" className="font-weight-bold">
                                <option selected>Open this select menu</option>
                                <option>Office Building</option>
                                <option>Residential Building</option>
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Location</Form.Label>
                            <Input type="select" name="select" id="exampleSelect" className="font-weight-bold">
                                <option selected>Select Location</option>
                                <option>Office Building</option>
                                <option>Residential Building</option>
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default PassiveDevices;
