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
import { ReactComponent as ChartSVG } from '../../../assets/icon/chart.svg';
import { ReactComponent as SearchSVG } from '../../../assets/icon/search.svg';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import Brick from '../../../sharedComponents/brick';
import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';
import { Badge } from '../../../sharedComponents/badge';
import { DangerZone } from '../../../sharedComponents/dangerZone';

const Sensors = (props) => {
    const { data, userPermission, handleChartShow, fetchPassiveDeviceSensorData } = props;

    return (
        <>
            {data.map((record, index) => {
                return (
                    <div key={index}>
                        <Brick sizeInRem={0.75} />

                        <div
                            className={`d-flex justify-content-between sensor-container ${
                                record?.sensor_name === '' ? 'sensor-unattach' : ''
                            }`}>
                            <div className="d-flex align-items-center mouse-pointer">
                                <Typography.Subheader size={Typography.Sizes.md} className="sensor-index mr-4">
                                    {record?.id}
                                </Typography.Subheader>

                                {record?.sensor_name === '' ? (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4 sensor-index">
                                        Not Attached
                                    </Typography.Subheader>
                                ) : (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4">
                                        {record?.sensor_name}
                                    </Typography.Subheader>
                                )}

                                {record?.sensor_badge !== '' && (
                                    <Badge
                                        text={record?.sensor_badge}
                                        className="utility-meter-badge font-weight-bold"
                                        typographyClassName="utility-meter-badge"
                                    />
                                )}
                            </div>
                            <div className="d-flex align-items-center">
                                <Button
                                    className="breaker-action-btn"
                                    onClick={() => handleChartShow(record?.id)}
                                    type={Button.Type.secondaryGrey}
                                    label=""
                                    icon={<ChartSVG width={16} />}
                                />
                                <Button
                                    className="breaker-action-btn ml-2"
                                    // onClick={openModal}
                                    type={Button.Type.secondaryGrey}
                                    label=""
                                    icon={<PenSVG width={15} />}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

const DeviceHeader = (props) => {
    const { utilityMeterObj, userPermission, redirectToMainPage } = props;

    return (
        <div className="passive-header-wrapper d-flex justify-content-between">
            <div className="d-flex flex-column justify-content-between">
                <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray500 }}>
                    Utility Metering Device
                </Typography.Subheader>
                <div className="d-flex align-items-center">
                    <Typography.Header size={Typography.Sizes.md} className="mr-2">
                        {utilityMeterObj?.device_id}
                    </Typography.Header>
                    {utilityMeterObj?.sensors && (
                        <Typography.Subheader size={Typography.Sizes.md} className="d-flex align-items-center mt-1">
                            {`${utilityMeterObj?.sensors.length} Pulse Counters`}
                        </Typography.Subheader>
                    )}
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
    const { utilityMeterObj, userPermission } = props;

    return (
        <>
            {utilityMeterObj?.sensors && (
                <Typography.Subheader size={Typography.Sizes.md}>
                    {`Sensors (${utilityMeterObj?.sensors.length})`}
                </Typography.Subheader>
            )}
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
                data={utilityMeterObj?.sensors ? utilityMeterObj?.sensors : []}
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
                    <DeviceSensors utilityMeterObj={utilityMeterObj} />
                </Col>
            </Row>

            <Row style={{ padding: '2rem' }}>
                <Col lg={12}>
                    <DangerZone
                        title="Danger Zone"
                        labelButton="Delete Utility Meter"
                        iconButton={<DeleteSVG />}
                        onClickButton={() => {}}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default IndividualUtilityMeter;
