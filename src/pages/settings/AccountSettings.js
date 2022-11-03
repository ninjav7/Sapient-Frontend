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
import { accountId } from '../../store/globalState';

const AccountSettings = () => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');

    const accountName = UserStore.useState((s) => s.accountName);
    const [name, setName] = useState(accountName);
    const [accoutnIdData, setAccoutnIdData] = useAtom(accountId);
    const [userPermission] = useAtom(userPermissionData);

    let entryPoint=""
    useEffect(()=>{
        entryPoint="entered"
    },[])
    const updateAccountName = async () => {
        localStorage.removeItem('accountName');
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        const accountData = {
            account_id: accoutnIdData,
        };

        await axios.patch(`${BaseUrl}${updateAccount}`, accountData, { headers }).then((res) => {
            let response = res.data.data;
            console.log(response.account_id)
            localStorage.setItem('accountName', accoutnIdData);
            setAccoutnIdData(response.account_id);
            setInputValidation(false);
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
        if(entryPoint==="entered"){
        console.log("User update");
        let usr_acc=localStorage.getItem('accountName');
        //localStorage.setItem('accountName', usr_acc);
        UserStore.update((s) => {
            s.accountName = usr_acc;
        });
    }
    }, [userdata]);

    useEffect(() => {
        setAccoutnIdData(localStorage.getItem('accountName'));
    }, []);

    const [inputValidation, setInputValidation] = useState(false);

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="heading-style">General Account Settings</span>
                    {userPermission?.user_role === 'admin' ||
                    userPermission?.permissions?.permissions?.account_general_permission?.edit ? (
                        <div>
                            <button
                                onClick={() => {
                                    setAccoutnIdData(localStorage.getItem('accountName'));
                                    setInputValidation(false);
                                }}
                                type="button"
                                className="btn btn-default buildings-cancel-style"
                                disabled={!inputValidation}>
                                Cancel
                            </button>

                            <button
                                onClick={(e) => {
                                    updateAccountName();
                                }}
                                type="button"
                                className="btn btn-primary buildings-save-style ml-3"
                                disabled={!inputValidation}>
                                Save
                            </button>
                        </div>
                    ) : (
                        ''
                    )}
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
                                            {userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.account_general_permission
                                                ?.edit ? (
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Account Name"
                                                    className="single-line-style font-weight-bold"
                                                    value={accoutnIdData}
                                                    onChange={(e) => {
                                                        setAccoutnIdData(e.target.value);
                                                        setInputValidation(true);
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    type="text"
                                                    name="buildingName"
                                                    id="buildingName"
                                                    placeholder="Enter Account Name"
                                                    className="single-line-style font-weight-bold"
                                                    style={{ cursor: 'not-allowed' }}
                                                    value={accoutnIdData}
                                                    disabled={true}
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
