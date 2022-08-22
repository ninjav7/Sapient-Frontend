import React, { useState, useEffect, useCallback } from 'react';
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
import moment from 'moment';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, listUsers, addUser } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './style.css';

const UserTable = ({ userData, isUserDataFetched }) => {
    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Users',
                        path: '/settings/users',
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

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Building Access</th>
                            <th>Email</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    {isUserDataFetched ? (
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
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {userData.map((record, index) => {
                                return (
                                    <tr className="mouse-pointer">
                                        <td className="font-weight-bold panel-name">
                                            <Link
                                                to={{
                                                    pathname: `/settings/user-profile/${record?.user_id}`,
                                                }}>
                                                <a>{record?.name === '' ? '-' : record?.name}</a>
                                            </Link>
                                        </td>
                                        <td className="">{record?.building_access.length === 0 ? '-' : ''}</td>
                                        <td className="">{record?.email === '' ? '-' : record?.email}</td>
                                        <td className="font-weight-bold">
                                            {record?.last_active === '' ? '-' : moment(record?.last_active).fromNow()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
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

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [isProcessing, setIsProcessing] = useState(false);
    const [isUserDataFetched, setIsUserDataFetched] = useState(false);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generatedUserId, setGeneratedUserId] = useState('');

    const [userData, setUserData] = useState([]);

    const [userObj, setUserObj] = useState({
        is_active: true,
        first_name: '',
        last_name: '',
        email: '',
        user_role_id: '',
    });

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userObj);
        obj[key] = value;
        setUserObj(obj);
    };

    const saveUserData = async () => {
        try {
            setIsProcessing(true);

            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let userData = Object.assign({}, userObj);

            await axios
                .post(`${BaseUrl}${addUser}`, userData, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    setGeneratedUserId(response.id);
                });
            setIsProcessing(false);
            handleClose();
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to Create Panel');
        }
    };

    const getUsersList = async () => {
        try {
            setIsUserDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?ordered_by=name&sort_by=ace`;
            await axios.get(`${BaseUrl}${listUsers}${params}`, { headers }).then((res) => {
                let response = res.data;
                setUserData(response.data);
            });
            setIsUserDataFetched(false);
        } catch (error) {
            console.log(error);
            setIsUserDataFetched(false);
            console.log('Failed to fetch End Use Data');
        }
    };

    useEffect(() => {
        getUsersList();
    }, [bldgId]);

    useEffect(() => {
        if (generatedUserId === '') {
            return;
        }
        getUsersList();
    }, [generatedUserId]);

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <span className="heading-style">Users</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
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

            <Row className="mt-2 ml-2">
                <Col xl={3}>
                    <div className="">
                        <div className="active-sensor-header">
                            <div className="search-container mr-2">
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                <input
                                    className="search-box ml-2"
                                    type="search"
                                    name="search"
                                    placeholder="Search..."
                                    // value={searchSensor}
                                    // onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <UserTable userData={userData} isUserDataFetched={isUserDataFetched} />
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
                                        onChange={(e) => {
                                            handleChange('first_name', e.target.value);
                                        }}
                                        value={userObj.first_name}
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
                                        onChange={(e) => {
                                            handleChange('last_name', e.target.value);
                                        }}
                                        value={userObj.last_name}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Email"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('email', e.target.value);
                                }}
                                value={userObj.email}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Role</Form.Label>
                            <Input type="select" name="select" id="exampleSelect" className="font-weight-bold" disabled>
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
                    <Button
                        variant="primary"
                        onClick={() => {
                            saveUserData();
                        }}>
                        {isProcessing ? 'Adding User...' : 'Add User'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Users;
