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
import { ReactComponent as SearchSVG } from '../../../assets/icon/search.svg';
import Brick from '../../../sharedComponents/brick';
import './styles.scss';
import Sensors from '../passive-devices/Sensors';

const DeviceHeader = (props) => {
    const { utilityMeterObj, userPermission, redirectToMainPage } = props;

    return (
        <div className="passive-header-wrapper d-flex justify-content-between">
            <div className="d-flex flex-column justify-content-between">
                <Typography.Subheader size={Typography.Sizes.sm} className="font-weight-bold">
                    Utility Meter
                </Typography.Subheader>
                <div className="d-flex align-items-center">
                    <Typography.Header size={Typography.Sizes.md} className="mr-2">
                        {utilityMeterObj?.device_id}
                    </Typography.Header>
                    <Typography.Subheader size={Typography.Sizes.md} className="d-flex align-items-center mt-1">
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
    );
};

const DeviceDetails = (props) => {
    const { utilityMeterObj } = props;

    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md}>Device Details</Typography.Subheader>
            <Brick sizeInRem={1} />
            <div className="device-detail-container">
                <div className="d-flex">
                    <div className="mr-3">
                        <Typography.Subheader size={Typography.Sizes.lg}>Model:</Typography.Subheader>
                    </div>
                    <div>
                        <Typography.Subheader size={Typography.Sizes.md}>
                            {utilityMeterObj?.model_name}
                        </Typography.Subheader>
                    </div>
                </div>
                <hr />
                <div className="device-detail-body">
                    <div>
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>Gateway</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>A8810</Typography.Subheader>
                        </div>
                        <Brick sizeInRem={1.5} />
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>Modbus Device Name</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>A8832</Typography.Subheader>
                        </div>
                    </div>

                    <div>
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>Device ID</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {utilityMeterObj?.device_id}
                            </Typography.Subheader>
                        </div>
                        <Brick sizeInRem={1.5} />
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>Modbus Address</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {utilityMeterObj?.modbus}
                            </Typography.Subheader>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const DeviceSensors = (props) => {
    const { userPermission } = props;

    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md}>{`Sensors (8)`}</Typography.Subheader>
            <Brick sizeInRem={0.5} />
            <div className="active-sensor-header">
                <div className="search-container mr-2">
                    <SearchSVG className="mb-1" />
                    <input
                        className="search-box ml-2"
                        type="search"
                        name="search"
                        placeholder="Search"
                        // value={searchSensor}
                        // onChange={handleSearchChange}
                    />
                </div>
            </div>

            <Brick sizeInRem={0.25} />

            <Sensors
                data={[]}
                userPermission={userPermission}
                handleChartShow={() => {}}
                fetchPassiveDeviceSensorData={() => {}}
            />
        </>
    );
};

const IndividualUtilityMeter = () => {
    const { bldgId, deviceId } = useParams();
    let history = useHistory();
    const [userPermission] = useAtom(userPermissionData);
    const utilityMetersDataList = UtilityMetersStore.useState((s) => s.utilityMetersList);
    const [utilityMeterObj, setUtilityMeterObj] = useState({});

    const redirectToMainPage = () => {
        history.push({ pathname: `/settings/utility-meters/${bldgId}` });
    };

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
                    <DeviceHeader
                        utilityMeterObj={utilityMeterObj}
                        userPermission={userPermission}
                        redirectToMainPage={redirectToMainPage}
                    />
                </Col>
            </Row>

            <Row className="passive-container">
                <Col lg={4}>
                    <DeviceDetails utilityMeterObj={utilityMeterObj} />
                </Col>

                <Col lg={8}>
                    <DeviceSensors />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default IndividualUtilityMeter;
