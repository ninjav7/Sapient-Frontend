import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
} from '../../services/Network';
import axios from 'axios';

const AccountSettings = () => {
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Account Settings',
                        path: '/settings/account',
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
                    <span className="heading-style">
                        General Account Settings
                    </span>
                </Col>
            </Row>

            <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Account Details
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-3">
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Account Name</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                A human-friendly display name for this account
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="singleline-box-style">
                                            <Input
                                                type="text"
                                                name="buildingName"
                                                id="buildingName"
                                                placeholder="Enter Account Name"
                                                className="single-line-style font-weight-bold"
                                                // defaultValue='Nike'
                                                value="Nike"
                                            />
                                        </div>
                                    </FormGroup>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* <Row>
                <Col lg={8}>
                    <Card className="custom-card card-alignment">
                        <CardHeader>
                            <h5 className="header-title" style={{ margin: '2px' }}>
                                Power Preferences
                            </h5>
                        </CardHeader>
                        <CardBody>
                            <Form>
                                <div className="grid-style-3">
                                    <FormGroup>
                                        <div className="real-power-style">
                                            <h6 className="card-title">Show Real Power</h6>
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
                                            height={20}
                                            width={44}
                                        />
                                    </FormGroup>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row> */}
        </React.Fragment>
    );
};

export default AccountSettings;
