import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './style.css';

import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import { BaseUrl, getSingleUserDetail, updateSingleUserDetail } from '../../services/Network';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

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

    console.log('user_id', userId);

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

    const getSingleUserDetailFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .get(`${BaseUrl}${getSingleUserDetail}?member_user_id=${userId}`, { headers: header })
            .then((res) => {
                setUserDetail(res?.data?.data);
            });
    };

    // ! Update User API
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
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold cancel-btn-style"
                                onClick={() => {}}>
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
                                    <div className="user-role-style">
                                        <h6 className="card-title admin-text-style">Account Administrator</h6>
                                        <span className="view-role-style">View Role</span>
                                    </div>

                                    <Input
                                        type="select"
                                        name="select"
                                        id="exampleSelect"
                                        className="font-weight-bold user-role-textbox">
                                        <option selected>All Buildings</option>
                                    </Input>
                                </FormGroup>
                                <hr />
                                <button
                                    type="button"
                                    className="btn btn-md btn-light font-weight-bold cancel-btn-style mr-1"
                                    onClick={() => {}}>
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
        </React.Fragment>
    );
};

export default UserProfileNew;
