import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Table, Button } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, listUsers, addUser, addMemberUser, getMemberUser } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import './style.css';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import debounce from 'lodash.debounce';
import Typography from '../../sharedComponents/typography';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';

const UserTable = ({ userData, isUserDataFetched, dataFetched }) => {
    const [userPermission] = useAtom(userPermissionData);

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
                            </tr>
                        </SkeletonTheme>
                    </tbody>
                ) : (
                    <tbody>
                        {userData.map((record, index) => {
                            return (
                                <tr className="mouse-pointer">
                                    <td className="font-weight-bold panel-name">
                                        {userPermission?.user_role === 'admin' ||
                                        userPermission?.permissions?.permissions?.account_user_permission?.edit ? (
                                            <Link to={`/settings/user-profile/single/${record?._id}`}>
                                                <a>
                                                    {record?.first_name
                                                        ? record?.first_name + ' ' + record?.last_name
                                                        : record?.name}
                                                </a>
                                            </Link>
                                        ) : (
                                            <>
                                                <a>
                                                    {record?.first_name
                                                        ? record?.first_name + ' ' + record?.last_name
                                                        : record?.name}
                                                </a>
                                            </>
                                        )}
                                    </td>
                                    <td className="">{record?.building_access?.length === 0 ? '-' : '-'}</td>
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
        </Card>
    );
};

const Users = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [userPermission] = useAtom(userPermissionData);

    const [formValidation, setFormValidation] = useState(false);

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [isProcessing, setIsProcessing] = useState(false);
    const [isUserDataFetched, setIsUserDataFetched] = useState(false);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generatedUserId, setGeneratedUserId] = useState('');

    const [userData, setUserData] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const [userSearchInfo, setUserSearchInfo] = useState('');

    const [userObj, setUserObj] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    // setFormValidation
    useEffect(() => {
        if (
            userObj.first_name.length > 0 &&
            userObj.last_name.length > 0 &&
            userObj.email.length > 0 &&
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userObj.email)
        ) {
            setFormValidation(true);
        }
    }, [userObj]);

    useEffect(() => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userObj.email)) {
            setFormValidation(false);
        }
    }, [userObj]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userObj);
        obj[key] = value;
        setUserObj(obj);
    };

    const getUsersList = async () => {
        try {
            setIsUserDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?user_info=${userSearchInfo}`;
            await axios.get(`${BaseUrl}${getMemberUser}${params}`, { headers }).then((res) => {
                let response = res.data;
                setUserData(response.data);
                setDataFetched(true);
            });
            setIsUserDataFetched(false);
        } catch (error) {
            setDataFetched(true);
            setIsUserDataFetched(false);
        }
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
                .post(`${BaseUrl}${addMemberUser}`, userData, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    setGeneratedUserId(response.id);
                    getUsersList();
                });
            setIsProcessing(false);
            handleClose();
        } catch (error) {
            setIsProcessing(false);
        }
    };

    const debouncedFetchData = debounce(() => {
        getUsersList();
    }, 1000);

    useEffect(() => {
        debouncedFetchData();
    }, [bldgId, userSearchInfo]);

    useEffect(() => {
        if (generatedUserId === '') {
            return;
        }
        getUsersList();
    }, [generatedUserId]);

    const createUserMember = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.post(`${BaseUrl}${addMemberUser}`, { headers }).then((res) => {});
    };

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Users</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_user_permission?.create ? (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        handleShow();
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>Add User
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
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
                                    value={userSearchInfo}
                                    onChange={(e) => {
                                        setUserSearchInfo(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12} className="mt-4">
                    <UserTable userData={userData} isUserDataFetched={isUserDataFetched} dataFetched={dataFetched} />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body className="add-user-model">
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
                            <Form.Label>User Role</Form.Label>
                            <Form.Control
                                type="text"
                                className="font-weight-bold"
                                // onChange={(e) => {
                                //     // handleChange('email', e.target.value);
                                // }}
                                // value={userObj.email}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
                        <Button
                            style={{ width: '50%', backgroundColor: '#fff', border: '1px solid black', color: '#000' }}
                            onClick={() => {
                                handleClose();
                                setFormValidation(false);
                            }}>
                            Cancel
                        </Button>
                        <Button
                            style={{ width: '50%', backgroundColor: '#444CE7', border: 'none' }}
                            variant="primary"
                            disabled={!formValidation}
                            onClick={() => {
                                saveUserData();
                            }}>
                            {isProcessing ? 'Adding User...' : 'Add User'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Users;
