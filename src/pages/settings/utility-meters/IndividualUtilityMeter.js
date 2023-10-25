import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
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
import {
    deleteUtilityMeterData,
    getSingleUtilityMeter,
    getUtilitySensorsList,
    updateUtilityMeterServices,
} from './services';
import { UTILITY_MONITOR, convertToAlphaNumeric, convertToMac } from './utils';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import DeleteModal from './AlertModals';
import EditUtilitySensor from './EditUtilitySensor';
import { getLocationData } from '../passive-devices/services';
import { convertNullToSingleQuotes, formatSensorList } from './helper';
import './styles.scss';

const DeleteUtility = (props) => {
    const { utilityMeterObj, redirectToMainPage } = props;

    const [deleteId, setDeleteId] = useState(null);

    const [showDeleteModal, setShowDelete] = useState(false);
    const closeDeleteAlert = () => setShowDelete(false);
    const showDeleteAlert = () => setShowDelete(true);

    const [isDeleting, setIsDeleting] = useState(false);

    const deleteUtilityMeter = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const params = `?device_id=${deleteId}`;

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
                            ? 'Unable to delete Utility Monitor.'
                            : 'Unable to delete Utility Monitor due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                closeDeleteAlert();
                setDeleteId(null);
            })
            .catch(() => {
                closeDeleteAlert();
                setDeleteId(null);
                setIsDeleting(false);
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to delete Utility Monitor.';
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
                        labelButton="Delete Utility Monitor"
                        iconButton={<DeleteSVG />}
                        onClickButton={() => {
                            setDeleteId(utilityMeterObj?.id);
                            showDeleteAlert();
                        }}
                    />
                </Col>
            </Row>
            <DeleteModal
                showModal={showDeleteModal}
                closeModal={closeDeleteAlert}
                onDeleteClick={deleteUtilityMeter}
                onDeleting={isDeleting}
            />
        </>
    );
};

const Sensors = (props) => {
    const { data, fetchLocationsList, bldgId, setLocationsList, utilityMeterObj } = props;

    const [editModal, setEditModal] = useState(false);
    const closeEditModal = () => setEditModal(false);
    const showEditModal = () => setEditModal(true);

    const [activeTab, setActiveTab] = useState('configure');
    const [selectedSensorObj, setSelectedSensorObj] = useState(null);

    const handleModalOpen = (record, type) => {
        const convertedObj = convertNullToSingleQuotes(record);
        setSelectedSensorObj(convertedObj);
        setActiveTab(type);
        showEditModal();
    };

    useEffect(() => {
        if (editModal) fetchLocationsList(bldgId);

        if (!editModal) {
            setActiveTab('configure');
            setSelectedSensorObj(null);
            setLocationsList([]);
        }
    }, [editModal]);

    return (
        <>
            {data.map((record, index) => {
                const sensorNo = index + 1;
                const sensorData = formatSensorList(record);
                const isPulseWeightVisible =
                    utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER && record?.pulse_weight;
                const isSensorConfigured =
                    record?.utility_provider || record?.utility_meter_serial_number || record?.pulse_weight;
                const isSensorAttached =
                    record?.utility_provider || record?.utility_meter_serial_number || record?.pulse_weight;
                const locationName = record?.service_location ? record?.service_location_name : `Building Meter`;

                return (
                    <div key={record?.id}>
                        <Brick sizeInRem={0.75} />

                        <div
                            className={`d-flex justify-content-between sensor-container ${
                                isSensorAttached ? '' : 'sensor-unattach'
                            }`}>
                            <div className="d-flex align-items-center mouse-pointer">
                                <Typography.Subheader size={Typography.Sizes.md} className="sensor-index mr-4">
                                    {sensorNo}
                                </Typography.Subheader>

                                {utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER ? (
                                    <>
                                        {isSensorConfigured ? (
                                            <>
                                                {sensorData !== '' && (
                                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4">
                                                        {sensorData}
                                                    </Typography.Subheader>
                                                )}
                                            </>
                                        ) : (
                                            <Typography.Subheader
                                                size={Typography.Sizes.md}
                                                className="mr-4 sensor-index">
                                                {`Not Attached`}
                                            </Typography.Subheader>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {isSensorConfigured && (
                                            <>
                                                {sensorData !== '' && (
                                                    <Typography.Subheader size={Typography.Sizes.md} className="mr-4">
                                                        {sensorData}
                                                    </Typography.Subheader>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}

                                {isPulseWeightVisible && (
                                    <Badge
                                        text={`${record?.pulse_weight} Pulse Weight`}
                                        className="utility-monitors-badge font-weight-bold"
                                        typographyClassName="utility-monitors-badge"
                                    />
                                )}
                            </div>
                            <div className="d-flex align-items-center">
                                {utilityMeterObj?.device_type === UTILITY_MONITOR.PULSE_COUNTER ? (
                                    <>
                                        {isPulseWeightVisible && (
                                            <Badge text={`${locationName}`} className="font-weight-bold mr-2" />
                                        )}
                                    </>
                                ) : (
                                    <Badge text={`${locationName}`} className="font-weight-bold mr-2" />
                                )}

                                <Button
                                    className="breaker-action-btn"
                                    onClick={() => handleModalOpen(record, 'metrics')}
                                    type={Button.Type.secondaryGrey}
                                    label=""
                                    icon={<ChartSVG width={16} />}
                                />
                                <Button
                                    className="breaker-action-btn ml-2"
                                    onClick={() => handleModalOpen(record, 'configure')}
                                    type={Button.Type.secondaryGrey}
                                    label=""
                                    icon={<PenSVG width={15} />}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Sensor Modal */}
            <EditUtilitySensor
                showModal={editModal}
                closeModal={closeEditModal}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                selectedSensorObj={selectedSensorObj}
                {...props}
            />
        </>
    );
};

const DeviceHeader = (props) => {
    const { utilityMeterObj, userPermission, redirectToMainPage } = props;

    return (
        <div className="passive-header-wrapper d-flex justify-content-between">
            <div className="d-flex flex-column justify-content-between">
                <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray500 }}>
                    Utility Monitoring Device
                </Typography.Subheader>
                <div className="d-flex align-items-center">
                    <Typography.Header size={Typography.Sizes.md} className="mr-2">
                        {utilityMeterObj?.mac_address && convertToMac(utilityMeterObj?.mac_address)}
                    </Typography.Header>
                    {utilityMeterObj?.model && (
                        <Typography.Subheader size={Typography.Sizes.md} className="d-flex align-items-center mt-1">
                            {utilityMeterObj?.model.includes('Shadow')
                                ? `Shadow Meter`
                                : `${utilityMeterObj?.sensor_count} Pulse Counters`}
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
                        label="Close"
                        size={Button.Sizes.md}
                        type={Button.Type.secondaryGrey}
                        onClick={redirectToMainPage}
                    />
                </div>
            </div>
        </div>
    );
};

const EditUtilityMeter = (props) => {
    const { editUtilityModal, handleModalClose, utilityMeterObj, fetchUtilityMeter, bldgId } = props;

    const defaultError = {
        mac_address: null,
        modbus_address: null,
    };

    const [meterObj, setMeterObj] = useState({});
    const [isUpdating, setUpdating] = useState(false);
    const [utilityError, setUtilityError] = useState(defaultError);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, meterObj);

        if (key === 'mac_address') {
            let formattedValue = convertToAlphaNumeric(value);
            if (formattedValue.length > 12) return;
            formattedValue = formattedValue.replace(/..\B/g, '$&:');
            obj[key] = formattedValue;
        } else {
            obj[key] = value;
        }

        setMeterObj(obj);
    };

    const updateUtilityMeter = async (device_id, bldg_id) => {
        let alertObj = Object.assign({}, utilityError);

        let formattedDeviceId = convertToAlphaNumeric(meterObj?.mac_address);
        if (formattedDeviceId.length < 12) {
            alertObj.mac_address = 'Please enter 12 digit Device ID.';
        }
        if (meterObj?.modbus_address.length === 0) {
            alertObj.modbus_address = 'Please enter Modbus. It cannot be empty.';
        }

        setUtilityError(alertObj);

        if (!alertObj.mac_address && !alertObj.modbus_address) {
            setUpdating(true);

            const params = `?device_id=${device_id}`;

            const reqObj = {
                deviceIdentifier: meterObj?.mac_address,
                modbus_address: meterObj?.modbus_address,
            };

            await updateUtilityMeterServices(params, reqObj)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message;
                            s.notificationType = 'success';
                        });
                        fetchUtilityMeter(bldg_id, device_id);
                        handleModalClose();
                    } else {
                        if (!response?.success && response?.message.includes('identifier already exists')) {
                            alertObj.mac_address = 'Device ID with given name already exists.';
                            setUtilityError(alertObj);
                        } else {
                            UserStore.update((s) => {
                                s.showNotification = true;
                                s.notificationMessage = response?.message
                                    ? response?.message
                                    : res
                                    ? 'Unable to update Utility Monitor.'
                                    : 'Unable to update Utility Monitor due to Internal Server Error!.';
                                s.notificationType = 'error';
                            });
                        }
                    }
                    setUpdating(false);
                })
                .catch((e) => {
                    setUpdating(false);
                    handleModalClose();
                });
        }
    };

    useEffect(() => {
        if (editUtilityModal && utilityMeterObj?.id) {
            let obj = Object.assign({}, utilityMeterObj);
            obj.mac_address = convertToMac(obj.mac_address);
            setMeterObj(obj);
        }
    }, [editUtilityModal]);

    return (
        <Modal show={editUtilityModal} onHide={handleModalClose} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Edit Utility Monitor</Typography.Header>

                <Brick sizeInRem={2} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        Device ID
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter Device ID"
                        onChange={(e) => {
                            handleChange('mac_address', e.target.value.trim().toUpperCase());
                            setUtilityError({ ...utilityError, mac_address: null });
                        }}
                        error={utilityError?.mac_address}
                        labelSize={Typography.Sizes.md}
                        value={meterObj?.mac_address}
                    />
                    <Brick sizeInRem={0.25} />
                    {!utilityError.mac_address && (
                        <Typography.Body size={Typography.Sizes.sm}>Enter MAC address of A8810.</Typography.Body>
                    )}
                </div>

                <Brick sizeInRem={1.25} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        Modbus Address
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter Modbus Address"
                        type="number"
                        onChange={(e) => {
                            if (e.target.value < 0) return;
                            handleChange('modbus_address', e.target.value);
                            setUtilityError({ ...utilityError, modbus: null });
                        }}
                        error={utilityError?.modbus_address}
                        labelSize={Typography.Sizes.md}
                        value={meterObj?.modbus_address}
                        inputClassName={'custom-input-field'}
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            setUtilityError(defaultError);
                            handleModalClose();
                            setMeterObj({});
                        }}
                    />

                    <Button
                        label={isUpdating ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isUpdating}
                        onClick={() => {
                            updateUtilityMeter(utilityMeterObj?.id, bldgId);
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export const DeviceDetails = (props) => {
    const { utilityMeterObj, userPermission } = props;

    const [editUtilityModal, setEditUtilityModal] = useState(false);
    const handleModalOpen = () => setEditUtilityModal(true);
    const handleModalClose = () => setEditUtilityModal(false);

    return (
        <>
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
                <div className="d-flex justify-content-between">
                    <div>
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>{`Gateway`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>{`A8810`}</Typography.Subheader>
                        </div>
                        <Brick sizeInRem={1.5} />
                        <div>
                            <Typography.Subheader
                                size={Typography.Sizes.sm}>{`Modbus Device Name`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            {utilityMeterObj?.model && (
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {utilityMeterObj?.model.includes('Shadow')
                                        ? `Shark` + utilityMeterObj?.model.split(`Sapient Shadow `)[1]
                                        : `A8832`}
                                </Typography.Subheader>
                            )}
                        </div>
                    </div>

                    <div>
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>{`Device ID`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {utilityMeterObj?.mac_address && convertToMac(utilityMeterObj?.mac_address)}
                            </Typography.Subheader>
                        </div>
                        <Brick sizeInRem={1.5} />
                        <div>
                            <Typography.Subheader size={Typography.Sizes.sm}>{`Modbus Address`}</Typography.Subheader>
                            <Brick sizeInRem={0.25} />
                            <Typography.Subheader size={Typography.Sizes.md}>
                                {utilityMeterObj?.modbus_address}
                            </Typography.Subheader>
                        </div>
                    </div>

                    {userPermission?.user_role === 'admin' ||
                    userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ? (
                        <div
                            className="d-flex justify-content-between align-items-start mouse-pointer"
                            onClick={handleModalOpen}>
                            <PenSVG className="mr-1" style={{ marginTop: '0.1rem' }} />
                            <Typography.Subheader size={Typography.Sizes.sm}>Edit</Typography.Subheader>
                        </div>
                    ) : null}
                </div>
            </div>
            <EditUtilityMeter editUtilityModal={editUtilityModal} handleModalClose={handleModalClose} {...props} />
        </>
    );
};

const DeviceSensors = (props) => {
    const { sensorsList, isFetchingSensors } = props;

    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md}>
                {`Sensors ${sensorsList ? `(${sensorsList.length})` : ''}`}
            </Typography.Subheader>

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

            {isFetchingSensors ? (
                <div className="mt-2">
                    <Skeleton
                        baseColor={colorPalette.primaryGray150}
                        highlightColor={colorPalette.baseBackground}
                        count={8}
                        height={40}
                    />
                </div>
            ) : (
                <Sensors data={sensorsList} {...props} />
            )}
        </>
    );
};

const IndividualUtilityMeter = () => {
    const history = useHistory();
    const { bldgId, deviceId } = useParams();

    const [userPermission] = useAtom(userPermissionData);

    const [utilityMeterObj, setUtilityMeterObj] = useState({});
    const [sensorsList, setSensorsList] = useState([]);
    const [locationsList, setLocationsList] = useState([]);

    const [isFetchingSensors, setFetchingSensors] = useState(false);
    const [isFetchingLocations, setFetchingLocations] = useState(false);

    const redirectToMainPage = () => {
        history.push({ pathname: `/settings/utility-monitors/${bldgId}` });
    };

    const fetchUtilityMeter = async (bldg_id, device_id) => {
        setUtilityMeterObj({});
        await getSingleUtilityMeter(bldg_id, device_id)
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data.length === 1) {
                    setUtilityMeterObj(response?.data[0]);
                }
            })
            .catch(() => {});
    };

    const fetchLocationsList = async (bldg_id) => {
        setFetchingLocations(true);
        const response = await getLocationData(`/${bldg_id}`);
        if (response?.data.length === 0) {
            setLocationsList([]);
            return;
        }
        let data = [];
        response.data.sort((a, b) => {
            return a.location_name.localeCompare(b.location_name);
        });
        response.data.forEach((record) => {
            data.push({
                label: record?.location_name,
                value: record?.location_id,
            });
        });
        setLocationsList(data);
        setFetchingLocations(false);
    };

    const fetchUtilityMeterSensors = async (bldg_id, device_id) => {
        setSensorsList([]);
        setFetchingSensors(true);
        await getUtilitySensorsList(bldg_id, device_id)
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data) {
                    const newMappedData = response?.data.map((el) => {
                        return {
                            ...el,
                            building_meter: el?.building_meter ?? false,
                        };
                    });
                    setSensorsList(newMappedData);
                }
                setFetchingSensors(false);
            })
            .catch(() => {
                setFetchingSensors(false);
            });
    };

    const updateBreadcrumbStore = (device_name) => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Utility Monitors',
                    path: `/settings/utility-monitors/${bldgId}`,
                    active: false,
                },
            ];
            if (device_name) {
                newList.push({
                    label: device_name,
                    path: '/settings/utility-monitors/single',
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
        if (deviceId) {
            fetchUtilityMeter(bldgId, deviceId);
            fetchUtilityMeterSensors(bldgId, deviceId);
        }
    }, [deviceId]);

    useEffect(() => {
        if (utilityMeterObj?.id) updateBreadcrumbStore(convertToMac(utilityMeterObj?.mac_address));
    }, [utilityMeterObj]);

    useEffect(() => {
        window.scrollTo(0, 0);
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
                    <Typography.Subheader size={Typography.Sizes.md}>{`Device Details`}</Typography.Subheader>
                    <Brick sizeInRem={1} />
                    <DeviceDetails
                        bldgId={bldgId}
                        utilityMeterObj={utilityMeterObj}
                        userPermission={userPermission}
                        fetchUtilityMeter={fetchUtilityMeter}
                    />
                </Col>

                <Col lg={8}>
                    <DeviceSensors
                        bldgId={bldgId}
                        deviceId={deviceId}
                        utilityMeterObj={utilityMeterObj}
                        sensorsList={sensorsList}
                        locationsList={locationsList}
                        setLocationsList={setLocationsList}
                        fetchLocationsList={fetchLocationsList}
                        fetchUtilityMeterSensors={fetchUtilityMeterSensors}
                        isFetchingSensors={isFetchingSensors}
                        isFetchingLocations={isFetchingLocations}
                    />
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
