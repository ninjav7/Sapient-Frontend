import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { Cookies } from 'react-cookie';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { UserStore } from '../../store/UserStore';
import axios from 'axios';
import { BaseUrl, updateAccount } from '../../services/Network';
import './style.css';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';

const AccountSettings = () => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');

    const accountName = UserStore.useState((s) => s.accountName);
    const [name, setName] = useState(accountName);
    const [userPermission] = useAtom(userPermissionData);

    const updateAccountName = async () => {
        const accountName = name.trim();

        if (accountName === userdata.name) {
            return;
        }

        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        const accountData = {
            name: accountName,
        };

        await axios.patch(`${BaseUrl}${updateAccount}`, accountData, { headers }).then((res) => {
            let response = res.data;
            if (response.success) {
                localStorage.setItem('accountName', accountName);
                UserStore.update((s) => {
                    s.accountName = accountName;
                });
            }
        });
    };

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
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        localStorage.setItem('accountName', userdata.name);
        UserStore.update((s) => {
            s.accountName = userdata.name;
        });
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <span className="heading-style">General Account Settings</span>
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
                                            {userPermission?.user_role === 'admin' ? (
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Account Name"
                                                    className="single-line-style font-weight-bold"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    onBlur={updateAccountName}
                                                />
                                            ) : (
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Account Name"
                                                    className="single-line-style font-weight-bold"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    onBlur={updateAccountName}
                                                    disabled={
                                                        !userPermission?.permissions?.permissions
                                                            ?.account_general_permission?.edit
                                                    }
                                                />
                                            )}
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
