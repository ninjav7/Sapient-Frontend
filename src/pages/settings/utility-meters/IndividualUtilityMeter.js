import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { UtilityMetersStore } from '../../../store/UtilityMetersStore';
import { userPermissionData } from '../../../store/globalState';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';

const IndividualUtilityMeter = () => {
    const { bldgId, deviceId } = useParams();
    let history = useHistory();
    const [userPermission] = useAtom(userPermissionData);
    const utilityMetersDataList = UtilityMetersStore.useState((s) => s.utilityMetersList);
    const [utilityMeterObj, setUtilityMeterObj] = useState({});

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Utility Meters',
                    path: `/settings/utility-meters/${bldgId}`,
                    active: false,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    const redirectToMainPage = () => {
        history.push({ pathname: `/settings/utility-meters/${bldgId}` });
    };

    useEffect(() => {
        if (!deviceId || utilityMetersDataList.length === 0) return;
        const obj = utilityMetersDataList.find((el) => el?.id === deviceId);
        setUtilityMeterObj(obj);
    }, [deviceId]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="passive-header-wrapper d-flex justify-content-between">
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm} className="font-weight-bold">
                                Utility Meter
                            </Typography.Subheader>
                            <div className="d-flex align-items-center">
                                <Typography.Header size={Typography.Sizes.md} className="mr-2">
                                    {utilityMeterObj?.device_id}
                                </Typography.Header>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className="d-flex align-items-center mt-1">
                                    {`8 Sensors`}
                                </Typography.Subheader>
                            </div>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                className="mouse-pointer typography-wrapper active-tab-style">
                                Configure
                            </Typography.Subheader>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={redirectToMainPage}
                                />
                            </div>
                            <div>
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
                                    <Button
                                        // label={isProcessing ? 'Saving' : 'Save'}
                                        label={'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        // onClick={updatePassiveDeviceData}
                                        className="ml-2"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default IndividualUtilityMeter;
