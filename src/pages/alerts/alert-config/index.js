import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';

import Target from './Target';
import Condition from './Condition';
import AlertPreview from './AlertPreview';
import ResetTargetTypeAlert from './ResetTargetTypeAlert';
import BuildingConfig from './target-type-config/BuildingConfig';
import EquipConfig from './target-type-config/EquipConfig';
import NotificationMethod from './NotificationMethod';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';

import { UserStore } from '../../../store/UserStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as CheckMarkSVG } from '../../../assets/icon/check-mark.svg';

import { createAlertServiceAPI, fetchConfiguredAlertById, updateAlertServiceAPI } from '../services';

import {
    TARGET_TYPES,
    THRESHOLD_TYPES,
    TIMESPAN_TYPES,
    aggregationList,
    bldgAlertConditions,
    defaultAlertObj,
    defaultConditionObj,
    defaultNotificationObj,
    equipAlertConditions,
    thresholdConditionTimespanList,
    timespanList,
    timespanOptions,
} from '../constants';
import { formatConsumptionValue } from '../../../sharedComponents/helpers/helper';

import { convertStringToUniqueNumbers } from '../helpers';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const CreateAlertHeader = (props) => {
    const {
        activeTab,
        setActiveTab,
        isAlertConfigured = false,
        isNotificationConfigured = false,
        onAlertCreate,
        reqType,
        isCreatingAlert = false,
        renderAlertCondition,
        validateTriggerAlertInputs,
        alertObj,
    } = props;

    const history = useHistory();

    return (
        <div className="add-alerts-container d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">
                    {`${reqType === 'create' ? `Create New` : `Edit`} Alert`}
                </Typography.Header>
                <div className="d-flex" style={{ gap: '0.75rem' }}>
                    {activeTab === 0 ? (
                        <Button
                            label={'Cancel'}
                            size={Button.Sizes.md}
                            type={Button.Type.secondaryGrey}
                            onClick={() => {
                                history.push({ pathname: '/alerts/overview/alert-settings' });
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
                            onClick={() => {
                                renderAlertCondition(alertObj);
                                validateTriggerAlertInputs(alertObj);
                                setActiveTab(1);
                            }}
                            disabled={!isAlertConfigured}
                        />
                    ) : (
                        <Button
                            label={
                                reqType === 'create'
                                    ? isCreatingAlert
                                        ? 'Saving...'
                                        : 'Save'
                                    : isCreatingAlert
                                    ? 'Updating...'
                                    : 'Update'
                            }
                            size={Button.Sizes.md}
                            type={Button.Type.primary}
                            onClick={onAlertCreate}
                            disabled={isCreatingAlert || !isNotificationConfigured}
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
                    }}
                    onClick={() => setActiveTab(0)}>
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
                    style={{ color: activeTab === 1 ? colorPalette.primaryGray900 : colorPalette.primaryGray500 }}
                    onClick={() => isAlertConfigured && setActiveTab(1)}>
                    {`Add Notification Methods`}
                </Typography.Body>
            </div>
        </div>
    );
};

const RemoveAlert = () => {
    return (
        <Row>
            <Col lg={10}>
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
    const { alertObj = {}, setTypeSelectedLabel, originalBldgsList, originalEquipsList, handleChange } = props;

    const renderTargetedList = (alert_obj, originalDataList = []) => {
        const count = alert_obj?.target?.lists?.length ?? 0;
        const targetType = alert_obj?.target?.type;

        let label = '';

        if (count === 0) label = `No ${targetType} selected.`;
        else if (count === 1) label = alertObj?.target?.lists[0]?.label;
        else if (count > 1) label = `${count} ${targetType} selected.`;

        return label;
    };

    const renderTargetTypeHeader = (alert_obj) => {
        let label = '';
        if (alert_obj?.target?.type === TARGET_TYPES.BUILDING) label = 'Building';
        if (alert_obj?.target?.type === TARGET_TYPES.EQUIPMENT) label = 'Equipment';
        return label;
    };

    useEffect(() => {
        let label = '';
        if (alertObj?.target?.type === TARGET_TYPES.BUILDING) {
            label = renderTargetedList(alertObj, originalBldgsList);
        }
        if (alertObj?.target?.type === TARGET_TYPES.EQUIPMENT) {
            label = renderTargetedList(alertObj, originalEquipsList);
        }
        setTypeSelectedLabel(label);
    }, [alertObj?.target?.lists, originalBldgsList]);

    return (
        <>
            <Row>
                <Col lg={10}>
                    <div style={{ width: '35%' }}>
                        <Typography.Body size={Typography.Sizes.md}>
                            Alert Name
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter Alert Name"
                            type="text"
                            onChange={(e) => {
                                handleChange('alert_name', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={alertObj?.alert_name}
                        />
                    </div>

                    <Brick sizeInRem={2} />

                    <Target
                        renderTargetedList={renderTargetedList}
                        renderTargetTypeHeader={renderTargetTypeHeader}
                        {...props}
                    />
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={10}>
                    <Condition {...props} />

                    <Brick sizeInRem={2} />

                    <div className="w-100">
                        <Typography.Body size={Typography.Sizes.md}>Alert Description</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Textarea
                            type="textarea"
                            rows="4"
                            placeholder="Enter Alert description..."
                            value={alertObj?.alert_description}
                            onChange={(e) => {
                                handleChange('alert_description', e.target.value);
                            }}
                            inputClassName="pt-2"
                        />
                    </div>
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

const AlertConfig = () => {
    const { reqType, alertId } = useParams();

    const history = useHistory();

    const [activeTab, setActiveTab] = useState(0);
    const defaultAlertObjCloned = _.cloneDeep(defaultAlertObj);
    const [alertObj, setAlertObj] = useState(defaultAlertObjCloned);

    const [originalBldgsList, setOriginalBldgsList] = useState([]);
    const [originalEquipsList, setOriginalEquipsList] = useState([]);

    const [typeSelectedLabel, setTypeSelectedLabel] = useState(null);

    const [isCreatingAlert, setCreating] = useState(false);
    const [isFetchingAlertData, setFetchingAlertData] = useState(false);

    // Building Configuration Modal
    const [showBldgConfigModal, setBldgConfigModalStatus] = useState(false);
    const closeBldgConfigModel = () => setBldgConfigModalStatus(false);
    const openBldgConfigModel = () => setBldgConfigModalStatus(true);

    // Equipment Configuration Modal
    const [showEquipConfigModal, setEquipConfigModalStatus] = useState(false);
    const closeEquipConfigModel = () => setEquipConfigModalStatus(false);
    const openEquipConfigModel = () => setEquipConfigModalStatus(true);

    // Reset Target Type Modal
    const [showResetTargetModal, setResetTargetModalStatus] = useState(false);
    const closeResetTargetModel = () => setResetTargetModalStatus(false);
    const openResetTargetModel = () => setResetTargetModalStatus(true);

    const isBuildingConfigured =
        alertObj?.target?.type === TARGET_TYPES.BUILDING && alertObj?.target?.lists.length !== 0;

    const isEquipmentConfigured =
        alertObj?.target?.type === TARGET_TYPES.EQUIPMENT &&
        alertObj?.target?.lists.length !== 0 &&
        alertObj?.target?.buildingIDs !== '';

    const isConditionSet = alertObj?.condition?.type !== '';

    const isBasicConditionConfigured =
        alertObj?.condition?.condition_metric !== '' &&
        alertObj?.condition?.condition_metric_aggregate !== '' &&
        alertObj?.condition?.condition_timespan !== '' &&
        alertObj?.condition?.condition_operator !== '' &&
        alertObj?.condition?.condition_threshold_type !== '';

    const isConditionsConfigured =
        (alertObj?.condition?.condition_threshold_type === THRESHOLD_TYPES.STATIC_VALUE &&
            alertObj?.condition?.condition_threshold_value !== '') ||
        (alertObj?.condition?.condition_threshold_type === 'reference' &&
            alertObj?.condition?.condition_threshold_reference !== '') ||
        (alertObj?.condition?.condition_threshold_type === THRESHOLD_TYPES.CALCULATED &&
            alertObj?.condition?.condition_threshold_calculated !== '' &&
            alertObj?.condition?.condition_threshold_timespan !== '');

    const isAlertNameSet = alertObj?.alert_name !== '';
    const isTargetConfigured = isBuildingConfigured || isEquipmentConfigured;
    const isConditionConfigured = isConditionSet && isBasicConditionConfigured && isConditionsConfigured;

    const isNotificationConfigured =
        alertObj?.notification?.method.includes('none') ||
        (alertObj?.notification?.method.includes('user') &&
            alertObj?.notification?.selectedUserIds.length !== 0 &&
            alertObj?.notification?.submitted) ||
        (alertObj?.notification?.method.includes('email') &&
            alertObj?.notification?.selectedUserEmailIds !== '' &&
            alertObj?.notification?.submitted);

    const handleModalClick = (configType) => {
        if (configType) {
            if (configType === TARGET_TYPES.BUILDING) openBldgConfigModel();
            if (configType === TARGET_TYPES.EQUIPMENT) openEquipConfigModel();
        }
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
        obj[key] = value;
        setAlertObj(obj);
    };

    const handleTargetChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
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
        if (key === 'condition_metric') {
            obj.condition = _.cloneDeep(defaultConditionObj);
        }

        if (key === 'condition_threshold_type') {
            obj.condition.condition_threshold_value = '';
            obj.condition.condition_threshold_calculated = '';
            obj.condition.condition_threshold_timespan = '';
        }

        if (key === 'condition_timespan' || key === 'condition_threshold_calculated') {
            obj.condition.condition_threshold_timespan = '';
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

    const renderAlertCondition = (alert_obj) => {
        let text = '';

        let alertType = '';

        if (alert_obj?.target?.type === TARGET_TYPES.BUILDING) {
            alertType = bldgAlertConditions.find((el) => el?.value === alert_obj?.condition?.condition_metric);
        }

        if (alert_obj?.target?.type === TARGET_TYPES.EQUIPMENT) {
            alertType = equipAlertConditions.find((el) => el?.value === alert_obj?.condition?.condition_metric);
        }

        if (alertType) text += `${alertType?.label} `;

        if (alert_obj?.condition?.condition_metric_aggregate) {
            text += ` ${alert_obj?.condition?.condition_metric_aggregate}`;
        }

        if (alert_obj?.condition?.condition_timespan) {
            const conditionTimespan = timespanOptions.find(
                (el) => el?.value === alert_obj?.condition?.condition_timespan
            );

            const conditionTimespanType = timespanList.find(
                (el) => el?.value === alert_obj?.condition?.condition_timespan_type
            );

            const timespanValue = alert_obj?.condition?.condition_timespan_value;
            const isPastTimespan = alert_obj?.condition?.condition_timespan === TIMESPAN_TYPES.PAST;
            const isValueAbove1 = +timespanValue > 1;

            if (conditionTimespan) {
                const timespanText = isPastTimespan
                    ? `${timespanValue} ${conditionTimespanType?.value}${isValueAbove1 ? 's' : ''}`
                    : `${conditionTimespan?.value} ${conditionTimespanType?.value}`;

                text += ` for ${timespanText}`;
            }
        }

        if (alert_obj?.condition?.condition_operator) {
            text += ` is ${alert_obj?.condition?.condition_operator}`;
        }

        if (alertObj?.condition?.condition_threshold_type === THRESHOLD_TYPES.STATIC_VALUE) {
            const value = +alert_obj?.condition?.condition_threshold_value ?? 0;
            text += ` ${formatConsumptionValue(value, 2)} kWh.`;
        } else if (alertObj?.condition?.condition_threshold_type === THRESHOLD_TYPES.CALCULATED) {
            if (alert_obj?.condition?.condition_threshold_calculated) {
                const thresholdAggregationType = aggregationList.find(
                    (el) => el?.value === alert_obj?.condition?.condition_threshold_calculated
                );
                text += ` ${thresholdAggregationType?.renderTxt} of`;
            }

            const thresholdTimespan = thresholdConditionTimespanList.find(
                (el) => el?.value === alert_obj?.condition?.condition_threshold_timespan
            );
            text += ` ${thresholdTimespan?.label}.`;
        }

        handleConditionChange('alert_condition_description', `${text}`);
    };

    const validateTriggerAlertInputs = (alert_obj) => {
        const triggerAlertList = alert_obj?.condition?.condition_trigger_alert;

        if (triggerAlertList) {
            const filteredList = triggerAlertList.replace(/^,*(.*?),*$/, '$1');
            handleConditionChange('condition_trigger_alert', filteredList);
        }
    };

    const handleCreateAlert = async (alert_obj) => {
        if (!alert_obj) return;

        setCreating(true);

        const { target, recurrence, condition, notification } = alert_obj;

        // Alert Payload
        let payload = {
            name: alert_obj?.alert_name,
            description: alert_obj?.alert_description,
            target_type: target?.type,
            alert_condition_description: condition?.alert_condition_description ?? '',
            condition_metric: condition?.condition_metric,
            condition_metric_aggregate: condition?.condition_metric_aggregate,
            condition_timespan: condition?.condition_timespan,
            condition_timespan_type: condition?.condition_timespan_type,
            condition_operator: condition?.condition_operator,
            condition_threshold_type: condition?.condition_threshold_type,
        };

        // When Target type is 'Building'
        if (target?.type === TARGET_TYPES.BUILDING) {
            payload.building_ids = target?.lists.map((el) => el?.value);

            if (condition?.condition_metric === 'energy_consumption') {
                if (condition?.threshold50) payload.condition_alert_at.push(50);
                if (condition?.threshold75) payload.condition_alert_at.push(75);
                if (condition?.threshold100) payload.condition_alert_at.push(100);
            }
        }

        // When Target type is 'Equipment'
        if (target?.type === TARGET_TYPES.EQUIPMENT) {
            payload.building_ids = [target?.buildingIDs];
            payload.equipment_ids = target?.lists.map((el) => el?.value);
        }

        if (condition?.condition_timespan === TIMESPAN_TYPES.PAST) {
            payload.condition_timespan_value = +condition?.condition_timespan_value;
        }

        if (condition?.condition_threshold_type === THRESHOLD_TYPES.STATIC_VALUE) {
            payload.condition_threshold_value = +condition?.condition_threshold_value;
        }

        if (condition?.condition_threshold_type === THRESHOLD_TYPES.CALCULATED) {
            payload.condition_threshold_calculated = condition?.condition_threshold_calculated;
            payload.condition_threshold_timespan = condition?.condition_threshold_timespan;
        }

        if (condition?.condition_threshold_type === 'reference') {
            payload.condition_threshold_reference = condition?.condition_threshold_reference;
        }

        if (condition?.condition_trigger_alert) {
            const uniqueNumbersArray = convertStringToUniqueNumbers(condition?.condition_trigger_alert);
            if (uniqueNumbersArray) payload.condition_alert_at = uniqueNumbersArray;
        }

        // Notification and its recurrence setup
        const method = notification?.method[0];

        if (method === 'email') payload.alert_emails = notification?.selectedUserEmailIds;
        if (method === 'user') payload.alert_user_ids = notification?.selectedUserIds.map((el) => el?.value);

        if ((method === 'email' || method === 'user') && recurrence?.resendAlert) {
            payload.alert_recurrence = recurrence?.resendAlert;
            payload.alert_recurrence_minutes = +recurrence?.resendAt;
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
                    history.push({
                        pathname: '/alerts/overview/alert-settings',
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
            .finally(() => {
                setCreating(false);
            });
    };

    const handleEditAlert = async (alert_id, alert_obj) => {
        if (!alert_id || !alert_obj) return;

        setCreating(true);

        const { target, recurrence, condition, notification } = alert_obj;

        // Alert Payload
        let payload = {
            name: alert_obj?.alert_name,
            description: alert_obj?.alert_description,
            target_type: target?.type,
            alert_condition_description: condition?.alert_condition_description ?? '',
            condition_metric: condition?.condition_metric,
            condition_metric_aggregate: condition?.condition_metric_aggregate,
            condition_timespan: condition?.condition_timespan,
            condition_timespan_type: condition?.condition_timespan_type,
            condition_operator: condition?.condition_operator,
            condition_threshold_type: condition?.condition_threshold_type,
        };

        // When Target type is 'Building'
        if (target?.type === TARGET_TYPES.BUILDING) {
            payload.building_ids = target?.lists.map((el) => el?.value);

            if (condition?.condition_metric === 'energy_consumption') {
                if (condition?.threshold50) payload.condition_alert_at.push(50);
                if (condition?.threshold75) payload.condition_alert_at.push(75);
                if (condition?.threshold100) payload.condition_alert_at.push(100);
            }
        }

        // When Target type is 'Equipment'
        if (target?.type === TARGET_TYPES.EQUIPMENT) {
            payload.building_ids = [target?.buildingIDs];
            payload.equipment_ids = target?.lists.map((el) => el?.value);
        }

        if (condition?.condition_timespan === TIMESPAN_TYPES.PAST) {
            payload.condition_timespan_value = +condition?.condition_timespan_value;
        }

        if (condition?.condition_threshold_type === THRESHOLD_TYPES.STATIC_VALUE) {
            payload.condition_threshold_value = +condition?.condition_threshold_value;
        }

        if (condition?.condition_threshold_type === THRESHOLD_TYPES.CALCULATED) {
            payload.condition_threshold_calculated = condition?.condition_threshold_calculated;
            payload.condition_threshold_timespan = condition?.condition_threshold_timespan;
        }

        if (condition?.condition_threshold_type === 'reference') {
            payload.condition_threshold_reference = condition?.condition_threshold_reference;
        }

        if (condition?.condition_trigger_alert) {
            const uniqueNumbersArray = convertStringToUniqueNumbers(condition?.condition_trigger_alert);
            if (uniqueNumbersArray) payload.condition_alert_at = uniqueNumbersArray.filter((number) => number <= 100);
        }

        // Notification and its recurrence setup
        const method = notification?.method[0];

        if (method === 'email') payload.alert_emails = notification?.selectedUserEmailIds;
        if (method === 'user') payload.alert_user_ids = notification?.selectedUserIds.map((el) => el?.value);

        if ((method === 'email' || method === 'user') && recurrence?.resendAlert) {
            payload.alert_recurrence = recurrence?.resendAlert;
            payload.alert_recurrence_minutes = +recurrence?.resendAt;
        }

        await updateAlertServiceAPI(alert_id, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Alert updated successfully.';
                        s.notificationType = 'success';
                    });
                    history.push({
                        pathname: '/alerts/overview/alert-settings',
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Failed to update Alert.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Failed to update Alert status due to Internal Server Error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setCreating(false);
            });
    };

    const getConfiguredAlertById = async (alert_id) => {
        if (!alert_id) return;

        setFetchingAlertData(true);

        await fetchConfiguredAlertById(alert_id)
            .then((res) => {
                const response = res?.data;
                const { success: isSuccessful, data } = response;
                if (isSuccessful && data && data?.id) {
                    let alert_obj = _.cloneDeep(defaultAlertObj);

                    // name & desc integration
                    alert_obj.alert_name = data?.name ?? '';
                    alert_obj.alert_description = data?.description ?? '';

                    // target type and target integration
                    alert_obj.target.type = data?.target_type;

                    if (data?.target_type === TARGET_TYPES.BUILDING) {
                        alert_obj.target.lists = data?.building_ids;
                    }

                    if (data?.target_type === TARGET_TYPES.EQUIPMENT) {
                        alert_obj.target.lists = data?.equipment_ids;
                        alert_obj.target.buildingIDs = data?.building_ids[0]?.value;
                    }

                    // condition-metrics integration
                    alert_obj.condition.condition_metric = data?.condition_metric;
                    alert_obj.condition.condition_metric_aggregate = data?.condition_metric_aggregate;
                    alert_obj.condition.condition_timespan = data?.condition_timespan;
                    alert_obj.condition.condition_operator = data?.condition_operator;
                    alert_obj.condition.condition_threshold_type = data?.condition_threshold_type;

                    if (data?.condition_threshold_type === THRESHOLD_TYPES.STATIC_VALUE) {
                        alert_obj.condition.condition_threshold_value = data?.condition_threshold_value?.toString();
                    }

                    if (data?.condition_threshold_type === THRESHOLD_TYPES.CALCULATED) {
                        alert_obj.condition.condition_threshold_reference = data?.condition_threshold_reference;
                        alert_obj.condition.condition_threshold_calculated = data?.condition_threshold_calculated;
                        alert_obj.condition.condition_threshold_timespan = data?.condition_threshold_timespan;
                    }

                    alert_obj.condition.condition_trigger_alert = data?.condition_alert_at.toString();
                    alert_obj.condition.alert_condition_description = data?.alert_condition_description ?? '';

                    // notification integration
                    if (data?.alert_recurrence) {
                        alert_obj.recurrence.resendAlert = data?.alert_recurrence;
                        alert_obj.recurrence.resendAt = data?.alert_recurrence_minutes.toString();
                    }

                    if (data?.alert_user_ids && data?.alert_user_ids.length !== 0) {
                        alert_obj.notification.method = ['user'];
                        alert_obj.notification.selectedUserIds = data.alert_user_ids;
                        alert_obj.notification.submitted = true;
                    }

                    if (data?.alert_emails) {
                        alert_obj.notification.method = ['email'];
                        alert_obj.notification.selectedUserEmailIds = data?.alert_emails;
                        alert_obj.notification.submitted = true;
                    }

                    setAlertObj(alert_obj);
                }
            })
            .catch(() => {})
            .finally(() => {
                setFetchingAlertData(false);
            });
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/overview/alert-settings',
                    active: false,
                },
                {
                    label: `${reqType === 'create' ? `Create` : `Edit`} Alert`,
                    path: '/alerts/overview/alert/create',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    useEffect(() => {
        updateBreadcrumbStore();
        window.scrollTo(0, 0);
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

    useEffect(() => {
        if (alertId) getConfiguredAlertById(alertId);
    }, [alertId]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <CreateAlertHeader
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        isAlertConfigured={isTargetConfigured && isConditionConfigured && isAlertNameSet}
                        isNotificationConfigured={isNotificationConfigured}
                        onAlertCreate={() => {
                            reqType === 'create' && handleCreateAlert(alertObj);
                            reqType === 'edit' && handleEditAlert(alertId, alertObj);
                        }}
                        reqType={reqType}
                        isCreatingAlert={isCreatingAlert}
                        renderAlertCondition={renderAlertCondition}
                        validateTriggerAlertInputs={validateTriggerAlertInputs}
                        alertObj={alertObj}
                    />
                </Col>
            </Row>

            <div className="custom-padding">
                {activeTab === 0 && (
                    <ConfigureAlerts
                        alertObj={alertObj}
                        handleTargetChange={handleTargetChange}
                        originalBldgsList={originalBldgsList}
                        originalEquipsList={originalEquipsList}
                        handleRecurrenceChange={handleRecurrenceChange}
                        handleConditionChange={handleConditionChange}
                        setTypeSelectedLabel={setTypeSelectedLabel}
                        handleModalClick={handleModalClick}
                        openBldgConfigModel={openBldgConfigModel}
                        openEquipConfigModel={openEquipConfigModel}
                        setAlertObj={setAlertObj}
                        handleChange={handleChange}
                        showResetTargetModal={showResetTargetModal}
                        openResetTargetModel={openResetTargetModel}
                        reqType={reqType}
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

            <BuildingConfig
                isModalOpen={showBldgConfigModal}
                handleModalClose={closeBldgConfigModel}
                alertObj={alertObj}
                handleTargetChange={handleTargetChange}
                setOriginalBldgsList={setOriginalBldgsList}
            />

            <EquipConfig
                isModalOpen={showEquipConfigModal}
                handleModalClose={closeEquipConfigModel}
                alertObj={alertObj}
                handleTargetChange={handleTargetChange}
            />

            <ResetTargetTypeAlert
                isModalOpen={showResetTargetModal}
                handleModalClose={closeResetTargetModel}
                alertObj={alertObj}
                setAlertObj={setAlertObj}
            />
        </React.Fragment>
    );
};

export default AlertConfig;
