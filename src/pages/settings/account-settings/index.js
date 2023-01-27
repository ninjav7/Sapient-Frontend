import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import { Cookies } from 'react-cookie';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BuildingStore } from '../../../store/BuildingStore';
import { UserStore } from '../../../store/UserStore';
import { updateVendorName } from './services';
import '../style.css';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import colorPalette from '../../../assets/scss/_colors.scss';
import Brick from '../../../sharedComponents/brick';

const AccountSettings = () => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');

    const vendorName = UserStore.useState((s) => s.vendorName);
    const vendorId = UserStore.useState((s) => s.vendorId);
    const [vendorData, setVendorData] = useState(vendorName);
    const [userPermission] = useAtom(userPermissionData);

    let entryPoint = '';
    useEffect(() => {
        entryPoint = 'entered';
    }, []);

    const updateVendorNames = async () => {
        localStorage.removeItem('vendorName');
        const vendorNameData = {
            vendor_name: vendorData,
        };
        let params = `?vendor_id=${vendorId}`;
        await updateVendorName(params, vendorNameData)
            .then(async (res) => {
                let response = res.data.data;
                localStorage.setItem('vendorName', response?.vendor_name);
                setVendorData(response.vendor_name);
                setInputValidation(false);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Settings',
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

        const updateBuildingStore = () => {
            BuildingStore.update((s) => {
                s.BldgId = 'portfolio';
                s.BldgName = 'Portfolio';
                s.BldgTimeZone = '';
            });
        };

        updateBreadcrumbStore();
        updateBuildingStore();
    }, []);

    useEffect(() => {
        if (entryPoint === 'entered') {
            let usr_acc = localStorage.getItem('vendorName');
            UserStore.update((s) => {
                s.vendorName = usr_acc;
            });
        }
    }, [userdata]);

    useEffect(() => {
        setVendorData(localStorage.getItem('vendorName'));
    }, []);

    const [inputValidation, setInputValidation] = useState(false);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>General Account Settings</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.account_general_permission?.edit ? (
                            <div>
                                <div className="d-flex">
                                    <Button
                                        label="Cancel"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() => {
                                            setVendorData(localStorage.getItem('vendorName'));
                                            setInputValidation(false);
                                        }}
                                        disabled={!inputValidation}
                                    />
                                    <Button
                                        label={'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        onClick={(e) => {
                                            updateVendorNames();
                                        }}
                                        className="ml-2"
                                        disabled={!inputValidation}
                                    />
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Account Details
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>Account Name</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        A human-friendly display name for this account
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder="Enter Account Name"
                                        onChange={(e) => {
                                            setVendorData(e.target.value);
                                            setInputValidation(true);
                                        }}
                                        className="w-100"
                                        defaultValue={vendorName}
                                        style={
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.account_general_permission?.edit
                                                ? {}
                                                : { cursor: 'not-allowed' }
                                        }
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default AccountSettings;
