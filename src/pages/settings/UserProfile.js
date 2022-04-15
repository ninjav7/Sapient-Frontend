import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
} from '../../services/Network';
import axios from 'axios';

const UserProfile = () => {
    const [buildingId, setBuildingId] = useState(1);
    const [buildingData, setBuildingData] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [generalDateTimeData, setGeneralDateTimeData] = useState({});
    const [checked, setChecked] = useState(true);
    const [generalOperatingData, setGeneralOperatingData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [value, onChange] = useState('10:00');

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col md={8} className="header-container">
                    <div>
                        <span className="heading-style" style={{ marginLeft: '20px' }}>
                            Michael Scott
                        </span>
                        <p style={{ marginLeft: '20px' }} className="emailId-style">
                            mscott@dundermifflin.com
                        </p>
                    </div>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold cancel-btn-style"
                                onClick={() => {}}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold ml-2"
                                onClick={() => {}}>
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

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="buildingName"
                                                id="buildingName"
                                                placeholder="Enter First Name"
                                                className="single-line-style font-weight-bold"
                                                value="Michael"
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Last Name</h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="buildingName"
                                                id="buildingName"
                                                placeholder="Enter Last Name"
                                                className="single-line-style font-weight-bold"
                                                value="Scott"
                                            />
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Email Address</h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="buildingName"
                                                id="buildingName"
                                                placeholder="Enter Email"
                                                className="single-line-style font-weight-bold"
                                                value="mscott@dundermifflin.com"
                                            />
                                        </div>
                                    </FormGroup>
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

export default UserProfile;
