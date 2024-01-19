import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';

import Target from './Target';
import Condition from './Condition';
import AlertPreview from './AlertPreview';
import NotificationMethod from './NotificationMethod';

import { UserStore } from '../../../store/UserStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as CheckMarkSVG } from '../../../assets/icon/check-mark.svg';

import { createAlertServiceAPI } from '../services';
import { getEquipmentsList } from '../../settings/panels/services';
import { fetchBuildingsList } from '../../../services/buildings';
import { getEquipTypeData } from '../../settings/equipment-type/services';
import { getAllBuildingTypes } from '../../settings/general-settings/services';

import { TARGET_TYPES, defaultAlertObj, defaultConditionObj, defaultNotificationObj } from '../constants';
import { capitalizeFirstLetter } from '../../../helpers/helpers';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const CreateAlertHeader = (props) => {
    const { activeTab, setActiveTab, isAlertConfigured = false, onAlertCreate } = props;

    const history = useHistory();

    return (
        <div className="add-alerts-container d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">{`Create New Alert`}</Typography.Header>
                <div className="d-flex" style={{ gap: '0.75rem' }}>
                    {activeTab === 0 ? (
                        <Button
                            label={'Cancel'}
                            size={Button.Sizes.md}
                            type={Button.Type.secondaryGrey}
                            onClick={() => {
                                history.push({ pathname: '/alerts/overview' });
                            }}
                        />
                    ) : (
                        <Button
                            label={'Back'}
                            size={Button.Sizes.md}
                            type={Button.Type.secondaryGrey}
                            onClick={() => setActiveTab(0)}
                        />
                    )}

                    {activeTab === 0 ? (
                        <Button
                            label={'Next'}
                            size={Button.Sizes.md}
                            type={Button.Type.primary}
                            onClick={() => setActiveTab(1)}
                            disabled={!isAlertConfigured}
                        />
                    ) : (
                        <Button
                            label={'Save'}
                            size={Button.Sizes.md}
                            type={Button.Type.primary}
                            onClick={onAlertCreate}
                        />
                    )}
                </div>
            </div>
            <div className="arrow-tabs-container d-flex align-items-center">
                <Typography.Body
                    className={`mouse-pointer ${activeTab === 0 ? `` : `text-muted`}`}
                    size={Typography.Sizes.lg}
                    style={{
                        color: activeTab === 0 ? colorPalette.baseBlack : colorPalette.primaryGray500,
                    }}>
                    {isAlertConfigured ? (
                        <>
                            <CheckMarkSVG className="mouse-pointer mr-2" width={15} height={15} />
                            <span className="active-header-style">{`Select Target and Condition`}</span>
                        </>
                    ) : (
                        `Select Target and Condition`
                    )}
                </Typography.Body>

                <div className="arrow-line-style"></div>

                <Typography.Body
                    className={`mouse-pointer ${activeTab === 1 ? `` : `text-muted`}`}
                    size={Typography.Sizes.lg}
                    style={{ color: activeTab === 1 ? colorPalette.primaryGray900 : colorPalette.primaryGray500 }}>
                    {`Add Notification Methods`}
                </Typography.Body>
            </div>
        </div>
    );
};

const RemoveAlert = () => {
    return (
        <Row>
            <Col lg={9}>
                <div className="custom-card">
                    <CardHeader>
                        <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                            {`Danger Zone`}
                        </Typography.Subheader>
                    </CardHeader>

                    <CardBody>
                        <Button
                            label="Remove Alert"
                            size={Button.Sizes.md}
                            type={Button.Type.primaryDistructive}
                            icon={<DeleteSVG />}
                            onClick={() => {
                                alert('Alert removed.');
                            }}
                        />
                    </CardBody>
                </div>
            </Col>
        </Row>
    );
};

const ConfigureAlerts = (props) => {
    const {
        alertObj = {},
        handleTargetChange,
        updateAlertForBuildingTypeData,
        updateAlertForEquipmentTypeData,
        setTypeSelectedLabel,
    } = props;

    const [isFetchingData, setFetching] = useState(false);
    const [isFetchingEquipments, setFetchingEquipments] = useState(false);

    const [buildingsList, setBuildingsList] = useState([]);
    const [originalBuildingsList, setOriginalBuildingsList] = useState([]);

    const [buildingTypeList, setBuildingTypeList] = useState([]);

    const [equipmentsList, setEquipmentsList] = useState([]);
    const [originalEquipmentsList, setOriginalEquipmentsList] = useState([]);

    const [equipmentTypeList, setEquipmentTypeList] = useState([]);

    const filteredBuildingsList = (newBldgTypeList = [], originalBldgList) => {
        let newBldgList = [];
        if (newBldgTypeList.length !== 0) {
            originalBldgList.forEach((bldgObj) => {
                const isExist = newBldgTypeList.some((bldgTypeObj) => bldgTypeObj?.value === bldgObj?.building_type_id);
                if (isExist) newBldgList.push(bldgObj);
            });
        }
        return newBldgList;
    };

    const renderTargetedBuildingsList = (alert_obj, buildingsList = []) => {
        const count = alert_obj?.target?.lists?.length ?? 0;
        const targetType = alert_obj?.target?.type;

        let label = '';

        if (count === 0) label = `No ${targetType} selected.`;
        else if (count === buildingsList.length) label = `All ${capitalizeFirstLetter(targetType)}s selected.`;
        else if (count === 1) label = alertObj.target.lists[0].label;
        else if (count > 1) label = `${count} ${targetType}s selected.`;

        return label;
    };

    const renderTargetTypeHeader = (alert_obj) => {
        let label = '';
        if (alert_obj?.target?.type === TARGET_TYPES.BUILDING) label = TARGET_TYPES.BUILDING;
        if (alert_obj?.target?.type === TARGET_TYPES.EQUIPMENT) label = TARGET_TYPES.EQUIPMENT;
        return label;
    };

    const handleEquipmentListChange = (originalEquipsList, equipTypeList, selectedBldgslist) => {
        const newMappedEquipList = [];

        originalEquipsList.forEach((el) => {
            const bldgExist = selectedBldgslist.some((item) => item?.value === el?.building_id);
            const equipTypeExist = equipTypeList.some((item) => item?.value === el?.equipments_type_id);
            if (bldgExist && equipTypeExist) newMappedEquipList.push(el);
        });

        handleTargetChange('lists', newMappedEquipList);
        setEquipmentsList(newMappedEquipList);
    };

    const fetchAllEquipmentsList = (bldgList = [], equipTypeList = []) => {
        if (!bldgList || bldgList.length === 0) return;

        setFetchingEquipments(true);
        let promisesList = [];

        bldgList.forEach((el) => {
            if (el?.value) promisesList.push(getEquipmentsList(`?building_id=${el?.value}`));
        });

        Promise.all(promisesList)
            .then((res) => {
                const response = res;
                let newMappedEquipmentList = [];
                let newMappedOriginalEquipmentList = [];

                response.forEach((record, index) => {
                    if (record?.status === 200) {
                        const responseData = record?.data?.data;

                        if (responseData) {
                            let newFilteredEquipmentsList = [];

                            responseData.forEach((el) => {
                                const mappedEquipObj = {
                                    label: el?.equipments_name,
                                    value: el?.equipments_id,
                                    building_id: buildingsList[index]?.value,
                                    equipments_type_id: el?.equipments_type_id,
                                };

                                newMappedOriginalEquipmentList.push(mappedEquipObj);

                                const matchedType = equipTypeList.find(
                                    (type) => type?.value === el?.equipments_type_id
                                );
                                if (matchedType?.value) {
                                    newFilteredEquipmentsList.push(mappedEquipObj);
                                }
                            });
                            newMappedEquipmentList = [...newMappedEquipmentList, ...newFilteredEquipmentsList];
                        }
                    }
                });

                let newFilteredList = [];

                newMappedOriginalEquipmentList.forEach((el) => {
                    const bldgExist = alertObj?.target?.buildingIDs.some((item) => item?.value === el?.building_id);
                    const equipTypeExist = alertObj?.target?.typesList.some(
                        (item) => item?.value === el?.equipments_type_id
                    );
                    if (bldgExist && equipTypeExist) newFilteredList.push(el);
                });

                setOriginalEquipmentsList(newMappedOriginalEquipmentList);
                if (alertObj?.target?.lists.length === 0) handleTargetChange('lists', newMappedEquipmentList);
                setEquipmentsList(newFilteredList);
            })
            .catch(() => {})
            .finally(() => {
                setFetchingEquipments(false);
            });
    };

    useEffect(() => {
        if (
            alertObj?.target?.type === TARGET_TYPES.EQUIPMENT &&
            buildingsList.length !== 0 &&
            equipmentTypeList.length !== 0
        ) {
            fetchAllEquipmentsList(buildingsList, equipmentTypeList);
        }
    }, [buildingsList, equipmentTypeList]);

    useEffect(() => {
        const label = renderTargetedBuildingsList(alertObj, originalBuildingsList);
        setTypeSelectedLabel(label);
    }, [alertObj?.target?.lists, originalBuildingsList]);

    useEffect(() => {
        if (alertObj?.target?.type === TARGET_TYPES.BUILDING) {
            setFetching(true);
            setOriginalBuildingsList([]);
            setBuildingsList([]);

            const promiseOne = getAllBuildingTypes();
            const promiseTwo = fetchBuildingsList(false);

            Promise.all([promiseOne, promiseTwo])
                .then((res) => {
                    const response = res;

                    if (response && response[0]?.status === 200 && response[1]?.status === 200) {
                        const buildingTypesResponse = response[0]?.data?.data?.data;
                        const buildingsListResponse = response[1]?.data;

                        if (buildingTypesResponse && buildingsListResponse) {
                            const newMappedBuildingTypesData = buildingTypesResponse.map((el) => ({
                                label: el?.building_type,
                                value: el?.building_type_id,
                            }));
                            setBuildingTypeList(newMappedBuildingTypesData);

                            const newMappedBldgsData = buildingsListResponse.map((el) => ({
                                label: el?.building_name,
                                value: el?.building_id,
                                building_type_id: el?.building_type_id,
                            }));
                            setOriginalBuildingsList(newMappedBldgsData);
                            setBuildingsList(newMappedBldgsData);

                            if (alertObj?.target?.typesList.length === 0 && alertObj?.target?.lists.length === 0) {
                                updateAlertForBuildingTypeData(newMappedBuildingTypesData, newMappedBldgsData);
                            } else {
                                const newFilteredBldgsList = filteredBuildingsList(
                                    alertObj?.target?.typesList,
                                    newMappedBldgsData
                                );
                                if (newFilteredBldgsList) setBuildingsList(newFilteredBldgsList);
                            }
                        }
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setFetching(false);
                });
        }

        if (alertObj?.target?.type === TARGET_TYPES.EQUIPMENT) {
            setFetching(true);
            setOriginalBuildingsList([]);
            setBuildingsList([]);
            setEquipmentTypeList([]);

            const promiseOne = fetchBuildingsList(false);
            const promiseTwo = getEquipTypeData();

            Promise.all([promiseOne, promiseTwo])
                .then((res) => {
                    const response = res;

                    if (response && response[0]?.status === 200 && response[1]?.status === 200) {
                        const buildingsListResponse = response[0]?.data ?? [];
                        const equipTypesResponse = response[1]?.data?.data ?? [];

                        if (buildingsListResponse && equipTypesResponse) {
                            const newMappedBldgsData = buildingsListResponse.map((el) => ({
                                label: el?.building_name,
                                value: el?.building_id,
                                building_type_id: el?.building_type_id,
                            }));
                            setOriginalBuildingsList(newMappedBldgsData);
                            setBuildingsList(newMappedBldgsData);

                            const newMappedEquipTypesData = equipTypesResponse.map((el) => ({
                                label: el?.equipment_type,
                                value: el?.equipment_id,
                            }));
                            setEquipmentTypeList(newMappedEquipTypesData);

                            if (
                                alertObj?.target?.typesList.length === 0 &&
                                alertObj?.target?.lists.length === 0 &&
                                alertObj?.target?.buildingIDs.length === 0
                            ) {
                                updateAlertForEquipmentTypeData(newMappedEquipTypesData, newMappedBldgsData);
                            }
                        }
                    }
                })
                .catch(() => {})
                .finally(() => {
                    setFetching(false);
                });
        }
    }, [alertObj?.target?.type]);

    return (
        <>
            <Row>
                <Col lg={9}>
                    <Target
                        isFetchingData={isFetchingData}
                        isFetchingEquipments={isFetchingEquipments}
                        buildingsList={buildingsList}
                        originalBuildingsList={originalBuildingsList}
                        buildingTypeList={buildingTypeList}
                        equipmentTypeList={equipmentTypeList}
                        equipmentsList={equipmentsList}
                        setEquipmentsList={setEquipmentsList}
                        setOriginalEquipmentsList={setOriginalEquipmentsList}
                        originalEquipmentsList={originalEquipmentsList}
                        renderTargetedBuildingsList={renderTargetedBuildingsList}
                        renderTargetTypeHeader={renderTargetTypeHeader}
                        filteredBuildingsList={filteredBuildingsList}
                        setBuildingsList={setBuildingsList}
                        fetchAllEquipmentsList={fetchAllEquipmentsList}
                        handleEquipmentListChange={handleEquipmentListChange}
                        {...props}
                    />
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <Condition {...props} />
                </Col>
            </Row>

            <Brick sizeInRem={2} />
        </>
    );
};

const NotificationSettings = (props) => {
    return (
        <>
            <AlertPreview {...props} />
            <Brick sizeInRem={2} />

            <NotificationMethod {...props} />
            <Brick sizeInRem={2} />
        </>
    );
};

const AddAlerts = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [alertObj, setAlertObj] = useState(defaultAlertObj);
    const [typeSelectedLabel, setTypeSelectedLabel] = useState(null);

    const handleTargetChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
        if (key === 'type' && obj?.target?.type !== value) obj = _.cloneDeep(defaultAlertObj);
        obj.target[key] = value;
        setAlertObj(obj);
    };

    const handleRecurrenceChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
        obj.recurrence[key] = value;
        setAlertObj(obj);
    };

    const handleConditionChange = (key, value) => {
        let obj = Object.assign({}, alertObj);

        // When Condition Type change
        if (key === 'type') {
            obj.condition = _.cloneDeep(defaultConditionObj);
        }

        // When Condition filter-type change
        if (key === 'filterType') {
            obj.condition.threshold50 = true;
            obj.condition.threshold75 = true;
            obj.condition.threshold90 = true;
            obj.condition.thresholdValue = '';
        }

        obj.condition[key] = value;
        setAlertObj(obj);
    };

    const handleNotificationChange = (key, value) => {
        let obj = Object.assign({}, alertObj);

        // When Notification Method change
        if (key === 'method') {
            obj.notification = _.cloneDeep(defaultNotificationObj);
        }

        obj.notification[key] = value;
        setAlertObj(obj);
    };

    const updateAlertForBuildingTypeData = (types_list, list) => {
        let obj = Object.assign({}, alertObj);
        obj.target.typesList = types_list ?? [];
        obj.target.lists = list ?? [];
        setAlertObj(obj);
    };

    const updateAlertForEquipmentTypeData = (types_list, bldgs_list) => {
        let obj = Object.assign({}, alertObj);
        obj.target.typesList = types_list ?? [];
        obj.target.buildingIDs = bldgs_list ?? [];
        setAlertObj(obj);
    };

    const handleCreateAlert = async (alert_obj) => {
        if (!alert_obj) return;

        let payload = {
            target: alert_obj?.target?.type,
            // building_id: 'string',
            target_type: alert_obj?.target?.typesList.map((item) => item?.value),
            target_list: alert_obj?.target?.lists.map((item) => item?.value),
            condition: alert_obj?.condition?.type,
            // condition_interval_period: 1,
            condition_type: alert_obj?.condition?.level,
            threshold_at: [],
            notify_type: alert_obj?.notification?.method,
            // notify_to: 'string',
            // notify_condition: 'immediate',
            // notify_in: 0,
            // snooze: 0,
        };

        if (alert_obj?.condition?.level === 'number' && alert_obj?.condition?.thresholdValue) {
            payload.condition_threshold = alert_obj?.condition?.thresholdValue;
        }

        if (alert_obj?.condition?.threshold50) payload.threshold_at.push(50);
        if (alert_obj?.condition?.threshold75) payload.threshold_at.push(75);
        if (alert_obj?.condition?.threshold90) payload.threshold_at.push(90);

        if (alert_obj?.condition?.filterType !== 'number') {
            if (alert_obj?.condition?.filterType.includes('month')) payload.condition_interval = 'month';
            if (alert_obj?.condition?.filterType.includes('year')) payload.condition_interval = 'year';
        }

        await createAlertServiceAPI(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Alert created successfully.';
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Failed to create Alert.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Failed to create Alert status due to Internal Server Error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {});
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/overview',
                    active: false,
                },
                {
                    label: 'Create Alert',
                    path: '/alerts/overview/add-alert',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    const isTargetSetAndSubmitted = alertObj?.target?.type !== '' && alertObj?.target?.submitted;

    const isBuildingConfigured =
        alertObj?.target?.type === TARGET_TYPES.BUILDING &&
        alertObj?.target?.lists.length !== 0 &&
        alertObj?.target?.typesList.length !== 0;

    const isEquipmentConfigured =
        alertObj?.target?.type === TARGET_TYPES.EQUIPMENT &&
        alertObj?.target?.lists.length !== 0 &&
        alertObj?.target?.typesList.length !== 0 &&
        alertObj?.target?.buildingIDs.length !== 0;

    const isConditionSet = alertObj?.condition?.type !== '';

    const isBuildingConditionsSet =
        alertObj?.target?.type === TARGET_TYPES.BUILDING &&
        (alertObj?.condition?.filterType === 'previous_month' ||
            alertObj?.condition?.filterType === 'previous_year' ||
            (alertObj?.condition?.filterType === 'number' && alertObj?.condition?.thresholdValue !== ''));

    const isEquipmentConditionsSet =
        alertObj?.target?.type === TARGET_TYPES.EQUIPMENT &&
        ((alertObj?.condition?.type === 'rms_current' && alertObj?.condition?.thresholdPercentage !== '') ||
            (alertObj?.condition?.type === 'shortcycling' && alertObj?.condition?.shortcyclingMinutes !== '') ||
            (alertObj?.condition?.type !== 'rms_current' &&
                alertObj?.condition?.type !== 'shortcycling' &&
                alertObj?.condition?.thresholdPercentage !== ''));

    const isTargetConfigured = isTargetSetAndSubmitted && (isBuildingConfigured || isEquipmentConfigured);
    const isConditionConfigured = isConditionSet && (isBuildingConditionsSet || isEquipmentConditionsSet);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
            alert('Are you sure you want to reload the page? Changes you have made wont be saved.');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <CreateAlertHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isAlertConfigured={isTargetConfigured && isConditionConfigured}
                        onAlertCreate={() => {
                            handleCreateAlert(alertObj);
                        }}
                    />
                </Col>
            </Row>

            <div className="custom-padding">
                {activeTab === 0 && (
                    <ConfigureAlerts
                        alertObj={alertObj}
                        handleTargetChange={handleTargetChange}
                        handleRecurrenceChange={handleRecurrenceChange}
                        handleConditionChange={handleConditionChange}
                        updateAlertForBuildingTypeData={updateAlertForBuildingTypeData}
                        updateAlertForEquipmentTypeData={updateAlertForEquipmentTypeData}
                        setTypeSelectedLabel={setTypeSelectedLabel}
                    />
                )}

                {activeTab === 1 && (
                    <NotificationSettings
                        alertObj={alertObj}
                        typeSelectedLabel={typeSelectedLabel}
                        handleConditionChange={handleConditionChange}
                        handleNotificationChange={handleNotificationChange}
                        handleRecurrenceChange={handleRecurrenceChange}
                    />
                )}
            </div>
        </React.Fragment>
    );
};

export default AddAlerts;
