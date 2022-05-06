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
import { Search } from 'react-feather';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalActiveDevices } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import './style.css';

const RuleTable = ({ ruleData }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Days</th>
                            <th>Socket Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ruleData.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="font-weight-bold panel-name">
                                        <a href="#">{record.name}</a>
                                    </td>
                                    {/* <td>{record.name}</td> */}
                                    <td className="font-weight-bold">{record.description}</td>
                                    <td className="font-weight-bold">{record.days}</td>
                                    <td className="font-weight-bold">{record.socketCount}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const PlugRules = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [buildingId, setBuildingId] = useState(1);
    const [ruleData, setRuleData] = useState([
        {
            name: '8am-6pm M-F',
            description: '-',
            days: 'Weekdays',
            socketCount: 15,
        },
        {
            name: 'Workstations 7am-5pm',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: 'Refrigerators',
            description: '-',
            days: 'All Days',
            socketCount: 25,
        },
        {
            name: '9am-7pm',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: 'Ice/Water Machines',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
        {
            name: '8am-9pm M-F',
            description: '-',
            days: 'Weekdays',
            socketCount: 25,
        },
    ]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Plug Rules',
                        path: '/control/plug-rules',
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
                        Plug Rules
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Rule
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
                    <RuleTable ruleData={ruleData} />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Rule</Modal.Title>
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

export default PlugRules;
