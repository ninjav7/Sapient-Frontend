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
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalActiveDevices } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import './style.css';

const UserTable = ({ userData }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Building Access</th>
                            <th>Email</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <Link to="/settings/user-profile">
                                            <a className="buildings-name">{record.name}</a>
                                        </Link>
                                    </th>
                                    <td className="font-weight-bold">{record.emailId}</td>
                                    <td className="font-weight-bold">{record.lastActive}</td>
                                    <td className="font-weight-bold">{record.buildingAccess}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Users = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [buildingId, setBuildingId] = useState(1);
    const [userData, setUserData] = useState([
        {
            name: 'Michael Scott',
            buildingAccess: 'All Buildings',
            emailId: 'manager@dundermifflin.com',
            lastActive: 'Today',
        },
        {
            name: 'Jim Halpert',
            buildingAccess: '2 Buildings',
            emailId: 'jhalpert@dundermifflin.com',
            lastActive: '4 days ago',
        },
        {
            name: 'Dwight Schrute',
            buildingAccess: '3 Buildings',
            emailId: 'dschrute@dundermifflin.com',
            lastActive: '10 mins ago',
        },
    ]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Users
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add User
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
            </Row>

            <Row>
                <Col lg={8}>
                    <UserTable userData={userData} />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        className="font-weight-bold"
                                        autoFocus
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        className="font-weight-bold"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter Email" className="font-weight-bold" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Role</Form.Label>
                            <Input type="select" name="select" id="exampleSelect" className="font-weight-bold">
                                <option selected>Member</option>
                                <option>Phoenix Baker</option>
                                <option>Olivia Rhye</option>
                                <option>Lana Steiner</option>
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Add User
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Users;
