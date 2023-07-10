import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import { UserStore } from '../../../store/UserStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { userPermissionData } from '../../../store/globalState';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import { ReactComponent as ChartSVG } from '../../../assets/icon/chart.svg';
import { ReactComponent as SearchSVG } from '../../../assets/icon/search.svg';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import Brick from '../../../sharedComponents/brick';
import colorPalette from '../../../assets/scss/_colors.scss';
import { Badge } from '../../../sharedComponents/badge';
import { DangerZone } from '../../../sharedComponents/dangerZone';
import { deleteUtilityMeterData, getSingleUtilityMeter } from './services';
import { convertToMac } from './utils';
import './styles.scss';

const DeleteUtility = (props) => {
    const { utilityMeterObj, redirectToMainPage } = props;

    const [showDeleteModal, setShowDelete] = useState(false);
    const closeDeleteAlert = () => setShowDelete(false);
    const showDeleteAlert = () => setShowDelete(true);

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteUtilityMeter = async (id) => {
        setIsDeleting(true);
        const params = `?device_id=${id}`;

        await deleteUtilityMeterData(params)
            .then((res) => {
                const response = res?.data;
                setIsDeleting(false);
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                    redirectToMainPage();
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to delete Utility Meter.'
                            : 'Unable to delete Utility Meter due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                closeDeleteAlert();
            })
            .catch(() => {
                closeDeleteAlert();
                setIsDeleting(false);
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to delete Utility Meter.';
                    s.notificationType = 'error';
                });
            });
    };

    return (
        <>
            <Row style={{ padding: '2rem' }}>
                <Col lg={12}>
                    <DangerZone
                        title="Danger Zone"
                        labelButton="Delete Utility Meter"
                        iconButton={<DeleteSVG />}
                        onClickButton={showDeleteAlert}
                    />
                </Col>
            </Row>
            <Modal show={showDeleteModal} onHide={closeDeleteAlert} centered backdrop="static" keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Delete Utility Meter</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        Are you sure you want to delete the Utility Meter?
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={closeDeleteAlert}
                    />
                    <Button
                        label={isDeleting ? 'Deleting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        disabled={isDeleting}
                        onClick={() => {
                            deleteUtilityMeter(utilityMeterObj?.id);
                        }}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

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
                                record?.device_id ? '' : 'sensor-unattach'
                            }`}>
                            <div className="d-flex align-items-center mouse-pointer">
                                <Typography.Subheader size={Typography.Sizes.md} className="sensor-index mr-4">
                                    {record?.sensor_name}
                                </Typography.Subheader>

                                {record?.device_id ? (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4">
                                        {record?.device_id}
                                    </Typography.Subheader>
                                ) : (
                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4 sensor-index">
                                        Not Attached
                                    </Typography.Subheader>
                                )}

                                {record?.sensor_badge !== '' && record?.device_id && (
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
                        {utilityMeterObj?.mac_address && convertToMac(utilityMeterObj?.mac_address)}
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
                        <Typography.Subheader size={Typography.Sizes.md}>{utilityMeterObj?.model}</Typography.Subheader>
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
                                {utilityMeterObj?.mac_address && convertToMac(utilityMeterObj?.mac_address)}
                            </Typography.Subheader>
                        </div>
                        <Brick sizeInRem={1.5} />
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>Modbus Address</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {utilityMeterObj?.modbus_address}
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
    const history = useHistory();
    const { bldgId, deviceId } = useParams();
    const [userPermission] = useAtom(userPermissionData);
    const [utilityMeterObj, setUtilityMeterObj] = useState({});

    const redirectToMainPage = () => {
        history.push({ pathname: `/settings/utility-meters/${bldgId}` });
    };

    const fetchUtilityMeter = async (bldg_id, device_id) => {
        await getSingleUtilityMeter(bldg_id, device_id)
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data.length === 1) {
                    setUtilityMeterObj(response?.data[0]);
                }
            })
            .catch(() => {});
    };

    const updateBreadcrumbStore = (device_name) => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Utility Meters',
                    path: `/settings/utility-meters/${bldgId}`,
                    active: false,
                },
            ];
            if (device_name) {
                newList.push({
                    label: device_name,
                    path: '/settings/utility-meters/single',
                    active: true,
                });
            }
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    useEffect(() => {
        if (deviceId) fetchUtilityMeter(bldgId, deviceId);
    }, [deviceId]);

    useEffect(() => {
        if (utilityMeterObj?.id) updateBreadcrumbStore(utilityMeterObj?.mac_address);
    }, [utilityMeterObj]);

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

            {(userPermission?.user_role === 'admin' ||
                userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit) && (
                <DeleteUtility utilityMeterObj={utilityMeterObj} redirectToMainPage={redirectToMainPage} />
            )}
        </React.Fragment>
    );
};

export default IndividualUtilityMeter;
