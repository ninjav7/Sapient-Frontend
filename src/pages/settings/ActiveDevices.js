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
    Label,
} from 'reactstrap';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import { Search } from 'react-feather';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalActiveDevices } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import './style.css';

const ActiveDevicesTable = ({ activeDeviceData }) => {
    const records = [
        {
            status: 'available',
            identifierMAC: 'D8:07:B6:88:D8:3B',
            model: 'KP115',
            location: 'Floor 1 > 252',
            sensors: '1/1',
            firmwareVersion: 'v1.1',
            hardwareVersion: 'v1',
        },
        {
            status: 'available',
            identifierMAC: 'D8:07:B6:88:D9:4A',
            model: 'HS300',
            location: 'Floor 1 > 253',
            sensors: '2/6',
            firmwareVersion: 'v1.2',
            hardwareVersion: 'v2',
        },
    ];

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
                        {activeDeviceData.map((record, index) => {
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
                                    <td className="font-weight-bold panel-name">{record.identifier}</td>
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
            </CardBody>
        </Card>
    );
};

const ActiveDevices = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [buildingId, setBuildingId] = useState(1);
    const [activeDeviceData, setActiveDeviceData] = useState([]);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(`${BaseUrl}${generalActiveDevices}/${buildingId}`, {}, { headers })
            .then((res) => {
                setActiveDeviceData(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
    }, []);

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

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Active Devices
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold">
                                Attach Kasa Account
                            </button>
                        </div>
                        <div className="float-right ml-2">
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
                                className="btn btn-white d-inline"
                                style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}>
                                All Statuses
                            </button>

                            <button type="button" className="btn btn-white d-inline" style={{ borderRadius: '0px' }}>
                                <i className="uil uil-wifi mr-1"></i>Online
                            </button>

                            <button
                                type="button"
                                className="btn btn-white d-inline"
                                style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}>
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
                <Col lg={12}>
                    <ActiveDevicesTable activeDeviceData={activeDeviceData} />
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

export default ActiveDevices;
