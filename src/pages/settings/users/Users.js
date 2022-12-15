import React, { useState, useEffect } from 'react';
import { Row, Col, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, addMemberUser, getMemberUser, vendorPermissions } from '../../../services/Network';
import { inviteMemberUser, fetchMemberUserList, updateVendorPermissions } from './service';
import { BuildingStore } from '../../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import '../style.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import debounce from 'lodash.debounce';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import moment from 'moment';
import colorPalette from '../../../assets/scss/_colors.scss';
import { faCircleCheck, faClockFour, faBan } from '@fortawesome/pro-thin-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

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
    const [rolesData, setRolesData] = useState([]);

    const [userObj, setUserObj] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Users',
                        path: '/settings/users/users',
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
            let params = '?request_type=invite';
            await axios
                .post(`${BaseUrl}${addMemberUser}${params}`, userData, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
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

    const fetchRoles = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios.post(`${BaseUrl}${vendorPermissions}`, {}, { headers }).then((res) => {
                let response = res.data;
                setRolesData(response.data);
            });
        } catch (error) {}
    };

    useEffect(() => {
        fetchRoles();
    }, []);
    useEffect(() => {
        debouncedFetchData();
    }, [bldgId, userSearchInfo]);

    useEffect(() => {
        if (generatedUserId === '') {
            return;
        }
        getUsersList();
    }, [generatedUserId]);

    const currentRow = () => {
        return userData;
    };
    const renderName = (row) => {
        return (
            <>
                {userPermission?.user_role === 'admin' ||
                userPermission?.permissions?.permissions?.account_user_permission?.edit ? (
                    <Link to={`/settings/users/user-profile/single/${row?._id}`}>
                        <a>{row?.first_name ? row?.first_name + ' ' + row?.last_name : row?.name}</a>
                    </Link>
                ) : (
                    <>
                        <a>{row?.first_name ? row?.first_name + ' ' + row?.last_name : row?.name}</a>
                    </>
                )}
            </>
        );
    };

    const renderRole = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.sm}>
                {row?.role === '' ? '-' : row?.permissions[0].permission_name}
            </Typography.Body>
        );
    };

    const renderStatus = (row) => {
        if (row?.is_verified === false) {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <FontAwesomeIcon icon={faClockFour} size="lg" style={{ color: colorPalette.warning700 }} />
                    Pending
                </Typography.Subheader>
            );
        } else {
            if (row?.is_active === false) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex inactive-container justify-content-center"
                        style={{ color: colorPalette.primaryGray800 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.primaryGray800 }} />
                        Inactive
                    </Typography.Subheader>
                );
            } else if (row?.is_active === true) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: colorPalette.success700 }} />
                        Active
                    </Typography.Subheader>
                );
            }
        }
    };

    const renderEmail = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row?.email === '' ? '-' : row?.email}</Typography.Body>;
    };

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    const renderLastActive = (row) => {
        let dt = '';
        if (isValidDate(new Date(row?.last_login))) {
            let last_dt = new Date(row?.last_login);
            dt = moment(last_dt).format(`MMM D 'YY @ hh:mm A`);
        } else {
            dt = row?.last_login;
        }
        return <Typography.Body size={Typography.Sizes.sm}>{dt}</Typography.Body>;
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
                                <Button
                                    label="Add User"
                                    size={Button.Sizes.lg}
                                    type={Button.Type.primary}
                                    icon={
                                        <FontAwesomeIcon
                                            icon={faPlus}
                                            size="lg"
                                            style={{ color: colorPalette.baseWhite }}
                                        />
                                    }
                                    iconAlignment={Button.IconAlignment.left}
                                    onClick={() => {
                                        handleShow();
                                    }}
                                />
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12} className="mt-4">
                    <DataTableWidget
                        isLoading={isUserDataFetched}
                        isLoadingComponent={<SkeletonLoading />}
                        id="users"
                        buttonGroupFilterOptions={[]}
                        onSearch={setUserSearchInfo}
                        onStatus={[]}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        headers={[
                            {
                                name: 'Name',
                                accessor: 'name',
                                callbackValue: renderName,
                            },
                            {
                                name: 'Email',
                                accessor: 'email',
                                callbackValue: renderEmail,
                            },
                            {
                                name: 'Role',
                                accessor: 'role',
                                callbackValue: renderRole,
                            },
                            {
                                name: 'status',
                                accessor: 'status',
                                callbackValue: renderStatus,
                            },
                            {
                                name: 'Last Active',
                                accessor: 'last_active',
                                callbackValue: renderLastActive,
                            },
                        ]}
                        totalCount={(() => {
                            return 0;
                        })()}
                    />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Typography.Header size={Typography.Sizes.sm}>Add User</Typography.Header>
                </Modal.Header>
                <Modal.Body className="add-user-model">
                    <Form autoComplete="off">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Typography.Subheader className="mb-1">First Name</Typography.Subheader>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter First Name"
                                        onChange={(e) => {
                                            handleChange('first_name', e.target.value);
                                        }}
                                        value={userObj.first_name}
                                        autoFocus
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Typography.Subheader className="mb-1">Last Name</Typography.Subheader>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Last Name"
                                        onChange={(e) => {
                                            handleChange('last_name', e.target.value);
                                        }}
                                        value={userObj.last_name}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Typography.Subheader className="mb-1">Email Address</Typography.Subheader>
                            <Form.Control
                                type="text"
                                placeholder="Enter Email"
                                onChange={(e) => {
                                    handleChange('email', e.target.value);
                                }}
                                value={userObj.email}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Typography.Subheader className="mb-1">User Role</Typography.Subheader>
                            <Input
                                type="select"
                                name="select"
                                id="roles"
                                contentEditable="false"
                                required
                                onChange={(e) => {
                                    handleChange('role', e.target.value);
                                }}
                                value={userObj?.role}>
                                <option selected>Select Role</option>
                                {rolesData?.map((record) => {
                                    return <option value={record?.id}>{record?.name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: 'flex', width: '100%', gap: '1.25rem' }}>
                        <Button
                            label="Cancle"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="d-flex align-items-center button-container"
                            onClick={() => {
                                handleClose();
                                setFormValidation(false);
                            }}
                        />
                        <Button
                            label={isProcessing ? 'Adding User...' : 'Add & Invite User'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            className="d-flex align-items-center button-container"
                            onClick={() => {
                                setIsProcessing(true);
                                saveUserData();
                            }}
                        />
                    </div>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Users;
