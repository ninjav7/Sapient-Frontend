import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, FormGroup, Label, Input, CardHeader, Button } from 'reactstrap';
import Switch from 'react-switch';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './style.css';

import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import Select from 'react-select';
import {
    assignUser,
    BaseUrl,
    getPermissionRole,
    getSingleUserDetail,
    updateSingleUserDetail,
} from '../../services/Network';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import { buildingData } from '../../store/globalState';

const UserProfileNew = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [checked, setChecked] = useState(true);
    const [userDetail, setUserDetail] = useState();

    const [updateUserDetail, setUpdateUserDetail] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    const { userId } = useParams();

    const [userPermissionList, setUserPermissionList] = useState();

    console.log('userPermissionList', userPermissionList);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'User Profile',
                        path: '/energy/portfolio/overview',
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

    // TODO:
    const getSingleUserDetailFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .get(`${BaseUrl}${getSingleUserDetail}?member_user_id=${userId}`, { headers: header })
            .then((res) => {
                setUserDetail(res?.data?.data?.user_details);
                setUserPermissionList(res?.data?.data?.user_permissions);
            });
    };

    const updateSingleUserDetailFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .patch(`${BaseUrl}${updateSingleUserDetail}?member_user_id=${userId}`, updateUserDetail, {
                headers: header,
            })
            .then((res) => {
                setUserDetail(res?.data?.data);
            });
    };

    useEffect(() => {
        if (userId) {
            getSingleUserDetailFunc();
        }
    }, [userId]);

    useEffect(() => {
        if (userDetail) {
            setUpdateUserDetail({
                first_name: userDetail?.first_name,
                last_name: userDetail?.last_name,
                email: userDetail?.email,
            });
        }
    }, [userDetail]);

    console.log('updateUserDetail', updateUserDetail);

    const [roleDataList, setRoleDataList] = useState();

    const [locationDataNow, setLocationDataNow] = useState([]);

    const addLocationType = () => {
        roleDataList.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?._id}`, label: `${item?.name}` }]);
        });
    };

    useEffect(() => {
        if (roleDataList) {
            addLocationType();
        }
    }, [roleDataList]);

    const [buildingListData] = useAtom(buildingData);
    const [allBuildings, setAllBuildings] = useState([]);

    const getPermissionRoleFunc = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios.get(`${BaseUrl}${getPermissionRole}`, { headers: header }).then((res) => {
                setRoleDataList(res.data.data);
                return buildingListData?.map((item) => {
                    setAllBuildings((el) => [...el, item?.building_id]);
                });
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPermissionRoleFunc();
    }, [buildingListData]);

    console.log('allBuildings', allBuildings);

    const [permissionValue, setPermissionValue] = useState('');
    const [show, setShow] = useState(false);

    console.log('buildingListData', buildingListData);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const assignUserRoleFunc = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            // const params = userId;
            await axios
                .post(
                    `${BaseUrl}${assignUser}?member_user_id=${userId}`,
                    {
                        permission_role: permissionValue,
                        buildings: allBuildings,
                    },
                    { headers: header }
                )
                .then((res) => {
                    getSingleUserDetailFunc();
                    setShow(false);
                });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={8} className="header-container">
                    <div>
                        {updateUserDetail?.first_name?.length === 0 ? (
                            <>
                                <Skeleton count={2} height={20} width={300} />
                            </>
                        ) : (
                            <>
                                <span className="heading-style ml-4">
                                    {updateUserDetail?.first_name} {updateUserDetail?.last_name}
                                </span>
                                <p className="emailId-style ml-4">{updateUserDetail?.email}</p>
                            </>
                        )}
                    </div>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold cancel-btn-style">
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold ml-2"
                                onClick={updateSingleUserDetailFunc}>
                                Save
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                User Details
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-3">
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Active</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Only active users can sign in
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <Switch
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            width={44}
                                            height={24}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <div>
                                            <h6 className="card-title">First Name</h6>
                                        </div>
                                    </FormGroup>
                                    {updateUserDetail?.first_name?.length === 0 ? (
                                        <Skeleton count={1} height={40} width={350} />
                                    ) : (
                                        <FormGroup>
                                            <div className="singleline-box-style">
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter First Name"
                                                    className="single-line-style font-weight-bold"
                                                    onChange={(e) => {
                                                        setUpdateUserDetail({
                                                            ...updateUserDetail,
                                                            first_name: e.target.value,
                                                        });
                                                    }}
                                                    value={updateUserDetail?.first_name}
                                                />
                                            </div>
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Last Name</h6>
                                        </div>
                                    </FormGroup>
                                    {updateUserDetail?.last_name?.length === 0 ? (
                                        <Skeleton count={1} height={40} width={350} />
                                    ) : (
                                        <FormGroup>
                                            <div className="singleline-box-style">
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Last Name"
                                                    className="single-line-style font-weight-bold"
                                                    value={updateUserDetail?.last_name}
                                                    onChange={(e) => {
                                                        setUpdateUserDetail({
                                                            ...updateUserDetail,
                                                            last_name: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </FormGroup>
                                    )}

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Email Address</h6>
                                        </div>
                                    </FormGroup>
                                    {updateUserDetail?.email?.length === 0 ? (
                                        <Skeleton count={1} height={40} width={350} />
                                    ) : (
                                        <FormGroup>
                                            <div className="singleline-box-style">
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Email"
                                                    className="single-line-style font-weight-bold"
                                                    value={updateUserDetail?.email}
                                                    onChange={(e) => {
                                                        setUpdateUserDetail({
                                                            ...updateUserDetail,
                                                            email: e.target.value,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </FormGroup>
                                    )}
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                User Roles
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                                    {userPermissionList?.map((item) => {
                                        return (
                                            <>
                                                <div className="user-role-style" style={{ marginTop: '15px' }}>
                                                    <h6 className="card-title admin-text-style">
                                                        {item?.permissions?.[0]?.permission_name}
                                                    </h6>
                                                    <Link
                                                        to={`/settings/roles/${item?.permissions?.[0]?.permission_id}`}>
                                                        <span className="view-role-style">View Role</span>
                                                    </Link>
                                                </div>
                                                <Input
                                                    type="select"
                                                    name="select"
                                                    id="exampleSelect"
                                                    className="font-weight-bold user-role-textbox">
                                                    <option selected>All Buildings</option>
                                                    {item?.building_access?.map((item) => {
                                                        return (
                                                            <option value={item?.building_id}>
                                                                {item?.building_name}
                                                            </option>
                                                        );
                                                    })}
                                                </Input>
                                            </>
                                        );
                                    })}
                                </FormGroup>
                                <hr />
                                <button
                                    type="button"
                                    className="btn btn-md btn-light font-weight-bold cancel-btn-style mr-1"
                                    onClick={() => {
                                        handleShow();
                                    }}>
                                    <i className="uil uil-plus mr-2" />
                                    Add Role
                                </button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Danger Zone
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <FormGroup>
                                    <button
                                        type="button"
                                        className="btn btn-md btn-danger font-weight-bold trash-button-style">
                                        <i className="uil uil-trash mr-2"></i>Delete Building
                                    </button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Role</Form.Label>
                                    <Select
                                        id="exampleSelect"
                                        placeholder="Select Role"
                                        name="select"
                                        isSearchable={true}
                                        defaultValue={'Select Role'}
                                        options={locationDataNow}
                                        onChange={(e) => {
                                            setPermissionValue(e.value);
                                        }}
                                        className="font-weight-bold"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', width: '100%', flexWrap: 'nowrap' }}>
                    <Button variant="light" style={{ width: '50%' }} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button style={{ width: '50%' }} variant="primary" onClick={assignUserRoleFunc}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default UserProfileNew;
