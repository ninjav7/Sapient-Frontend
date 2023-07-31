import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import {
    deleteCurrentPanel,
    getBreakersGrouped,
    getBreakersList,
    getBreakersUngrouped,
    getEquipmentsList,
    getLocationData,
    getPanelsList,
    getPassiveDeviceList,
    resetAllBreakers,
    updatePanelDetails,
} from './services';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreakersStore } from '../../../store/BreakersStore';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Brick from '../../../sharedComponents/brick';
import Panel from '../../../sharedComponents/widgets/panel/Panel';
import { Breaker } from '../../../sharedComponents/breaker';
import { compareSensorsCount, getVoltageConfigValue, toFindDuplicates, validateBreakerConfiguration } from './utils';
import { comparePanelData } from './utils';
import { buildingData, userPermissionData } from '../../../store/globalState';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Select from '../../../sharedComponents/form/select';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import BreakerConfiguration from './BreakerConfiguration';
import UnlinkAllBreakers from './UnlinkAllBreakers';
import { UserStore } from '../../../store/UserStore';
import { DangerZone } from '../../../sharedComponents/dangerZone';
import DeletePanel from './DeletePanel';
import UngroupAlert from './UngroupAlert';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import './styles.scss';

const EditPanel = () => {
    const history = useHistory();

    const { panelType } = useParams();
    const { panelId } = useParams();

    const [userPermission] = useAtom(userPermissionData);
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const [isBreakerApiTrigerred, setBreakerAPITrigerred] = useState(false);

    // Edit Breaker Modal
    const [showBreakerConfigModal, setBreakerConfigModalState] = useState(false);
    const closeBreakerConfigModal = () => setBreakerConfigModalState(false);
    const openBreakerConfigModal = () => setBreakerConfigModalState(true);
    const [activeTab, setActiveTab] = useState('edit-breaker');

    // Unlink Alert Modal
    const [showUnlinkAlert, setShowUnlinkAlert] = useState(false);
    const handleUnlinkAlertClose = () => setShowUnlinkAlert(false);
    const handleUnlinkAlertShow = () => setShowUnlinkAlert(true);

    // Delete Panel Modal
    const [showDeletePanelAlert, setShowDeletePanelAlert] = useState(false);
    const handleDeletePanelAlertClose = () => setShowDeletePanelAlert(false);
    const handleDeletePanelAlertShow = () => setShowDeletePanelAlert(true);

    // Ungroup Alert Modal
    const [alertMessage, setAlertMessage] = useState('');
    const [showUngroupAlert, setUngroupAlert] = useState(false);
    const handleUngroupAlertClose = () => setUngroupAlert(false);
    const handleUngroupAlertOpen = () => setUngroupAlert(true);
    const [additionalMessage, setAdditionalMessage] = useState(false);

    const [isResetting, setIsResetting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [panelsList, setPanelsList] = useState([]);
    const [locationsList, setLocationsList] = useState([]);
    const [passiveDevicesList, setPassiveDevicesList] = useState([]);
    const [equipmentsList, setEquipmentsList] = useState([]);
    const breakersList = BreakersStore.useState((s) => s.breakersList);
    const [breakerLinks, setBreakerLinks] = useState([]);
    const [isEquipmentListFetching, setEquipmentFetching] = useState(false);
    const [isLinking, setLinking] = useState(false);
    const [isEditingMode, setEditingMode] = useState(false);

    const [panelObj, setPanelObj] = useState({});
    const [selectedBreakerObj, setSelectedBreakerObj] = useState({});
    const [originalPanelObj, setOriginalPanelObj] = useState({});
    const [panelDevicesList, setPanelDevicesList] = useState([]);
    const [isPanelFetched, setPanelFetching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [breakerUpdateId, setBreakerUpdateId] = useState('');
    const [startingBreaker, setStartingBreaker] = useState(1);
    const [mainBreakerConfig, setMainBreakerConfig] = useState({
        items: [
            {
                id: 'M',
                status: Breaker.Status.online,
            },
        ],
        type: Breaker.Type.configured,
        ratedAmps: `0 A`,
        ratedVolts: `0 V`,
    });

    const panelTypeList = [
        { label: 'Distribution', value: 'distribution' },
        { label: 'Disconnect', value: 'disconnect' },
    ];

    const [breakerCountObj, setBreakerCountObj] = useState({
        onChange: (e) => null,
        defaultValue: 0,
    });

    const [breakerType, setBreakerType] = useState({
        onChange: null,
        defaultValue: 'distribution',
    });

    const [panelStates, setPanelStates] = useState({
        isEditingModeState: false,
        isViewDeviceIdsState: false,
    });

    const onCancelClick = () => {
        history.push({
            pathname: `/settings/panels/${bldgId}`,
        });
        BreakersStore.update((s) => {
            s.breakersList = [];
        });
    };

    const fetchBreakerType = (obj) => {
        // Below condition is for Initial Breaker state
        if (
            obj?.equipment_link.length === 0 &&
            obj?.sensor_link === '' &&
            obj?.device_link === '' &&
            obj?.breaker_type === 1 &&
            obj?.parent_breaker === '' &&
            obj?.is_linked === false &&
            obj?.type === 'equipment' &&
            (obj?.rated_amps === 0 || typeof obj?.rated_amps === 'undefined')
        ) {
            return Breaker.Type.notConfigured;
        }

        // For Breaker Type is Blank it is considered as Fully Configured
        if (obj?.type === 'blank') return Breaker.Type.configured;

        // If Breaker Type is Unwired
        if (obj?.type === 'unwired') {
            if (obj?.rated_amps > 0) {
                return Breaker.Type.configured;
            } else {
                return Breaker.Type.partiallyConfigured;
            }
        }

        if (obj?.type === 'unlabeled') {
            // Below condition is for Single Lvl Breaker
            if (obj?.breaker_type === 1) {
                if (obj?.device_link !== '' && obj?.sensor_link !== '' && obj?.rated_amps > 0) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }

            // Below condition is for Double Lvl Breaker
            if (obj?.breaker_type === 2) {
                const objTwo = breakersList.find((record) => record?.parent_breaker === obj?.id);

                if (
                    obj?.device_link !== '' &&
                    objTwo?.device_link !== '' &&
                    obj?.sensor_link !== '' &&
                    objTwo?.sensor_link !== '' &&
                    obj?.rated_amps > 0 &&
                    objTwo?.rated_amps > 0
                ) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }

            // Below condition is for Triple Lvl Breaker
            if (obj?.breaker_type === 3) {
                const [objTwo, objThree] = breakersList.filter((record) => record?.parent_breaker === obj?.id);

                if (
                    obj?.device_link !== '' &&
                    objTwo?.device_link !== '' &&
                    objThree?.device_link !== '' &&
                    obj?.sensor_link !== '' &&
                    objTwo?.sensor_link !== '' &&
                    objThree?.sensor_link !== '' &&
                    obj?.rated_amps > 0 &&
                    objTwo?.rated_amps > 0 &&
                    objThree?.rated_amps > 0
                ) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }
        }

        if (obj?.type === 'equipment') {
            // Below condition is for Single Lvl Breaker
            if (obj?.breaker_type === 1) {
                if (
                    obj?.equipment_link.length !== 0 &&
                    obj?.device_link !== '' &&
                    obj?.sensor_link !== '' &&
                    obj?.rated_amps > 0
                ) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }

            // Below condition is for Double Lvl Breaker
            if (obj?.breaker_type === 2) {
                const objTwo = breakersList.find((record) => record?.parent_breaker === obj?.id);

                if (
                    obj?.equipment_link.length !== 0 &&
                    objTwo?.equipment_link.length !== 0 &&
                    obj?.device_link !== '' &&
                    objTwo?.device_link !== '' &&
                    obj?.sensor_link !== '' &&
                    objTwo?.sensor_link !== '' &&
                    obj?.rated_amps > 0 &&
                    objTwo?.rated_amps > 0
                ) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }

            // Below condition is for Triple Lvl Breaker
            if (obj?.breaker_type === 3) {
                const [objTwo, objThree] = breakersList.filter((record) => record?.parent_breaker === obj?.id);

                if (
                    obj?.equipment_link.length !== 0 &&
                    objTwo?.equipment_link.length !== 0 &&
                    objThree?.equipment_link.length !== 0 &&
                    obj?.device_link !== '' &&
                    objTwo?.device_link !== '' &&
                    objThree?.device_link !== '' &&
                    obj?.sensor_link !== '' &&
                    objTwo?.sensor_link !== '' &&
                    objThree?.sensor_link !== '' &&
                    obj?.rated_amps > 0 &&
                    objTwo?.rated_amps > 0 &&
                    objThree?.rated_amps > 0
                ) {
                    return Breaker.Type.configured;
                } else {
                    return Breaker.Type.partiallyConfigured;
                }
            }
        }
    };

    const fetchBreakerStatus = (breaker_obj) => {
        if (breaker_obj?.type === 'blank' || breaker_obj?.type === 'unwired') return null;
        if (breaker_obj.status === null) return Breaker.Status.noSensors;
        if (breaker_obj.status) return Breaker.Status.online;
        if (!breaker_obj.status) return Breaker.Status.offline;
    };

    const unLinkAllBreakers = async () => {
        setIsResetting(true);
        const params = `?panel_id=${panelId}`;
        const payload = { panel_id: panelId };
        await resetAllBreakers(params, payload)
            .then((res) => {
                setIsResetting(false);
                const response = res?.data;
                handleUnlinkAlertClose();
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Panel has been reset successfully';
                        s.notificationType = 'success';
                    });
                    setBreakerAPITrigerred(true);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to reset Panel.'
                            : 'Unable to reset Panel due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                setIsResetting(false);
            });
    };

    const deletePanel = async () => {
        setIsDeleting(true);
        const params = `?panel_id=${panelId}`;
        await deleteCurrentPanel(params)
            .then((res) => {
                const response = res?.data;
                setIsDeleting(false);
                handleDeletePanelAlertClose();
                if (response?.success) {
                    history.push({
                        pathname: `/settings/panels`,
                    });
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Panel has been deleted successfully.';
                        s.notificationType = 'success';
                    });
                    window.scrollTo(0, 0);
                    setBreakerAPITrigerred(true);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to delete Panel.'
                            : 'Unable to delete Panel due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                setIsDeleting(false);
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to delete Panel';
                    s.notificationType = 'error';
                });
            });
    };

    const updateBreakerGrouping = async (payload, setIsLoading) => {
        await getBreakersGrouped(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    fetchBreakersData(panelId, bldgId, setIsLoading);
                    fetchEquipmentData(bldgId);
                } else {
                    setIsLoading(false);
                    setLinking(false);
                    setAlertMessage(response?.message);
                    handleUngroupAlertOpen();
                }
            })
            .catch(() => {
                setIsLoading(false);
                setLinking(false);
            });
    };

    const updateBreakerUngrouping = async (ungroupBreakerId, setIsLoading) => {
        const params = `?breaker_id=${ungroupBreakerId}`;
        await getBreakersUngrouped(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    fetchBreakersData(panelId, bldgId, setIsLoading);
                    fetchEquipmentData(bldgId);
                } else {
                    setIsLoading(false);
                    setLinking(false);
                    setAlertMessage(response?.message);
                    handleUngroupAlertOpen();
                }
            })
            .catch(() => {
                setIsLoading(false);
                setLinking(false);
            });
    };

    const handleBreakerGrouping = (breakerLinkObj, setIsLoading, is_linking) => {
        if (is_linking) return;

        const sourceBreakerObj = breakersList.find((el) => el?.id === breakerLinkObj?.source);
        const targetBreakerObj = breakersList.find((el) => el?.id === breakerLinkObj?.target);

        // For Panel Voltage 600 - where we only can form triple breaker grouping
        if (panelObj?.voltage === '600') {
            // Breaker lvl is 1:1 => Will be grouped
            if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 1) {
                const breakerCountToAdd = panelType === 'distribution' ? 2 : 1;
                const thirdBreakerObj = breakersList.find(
                    (el) => el?.breaker_number === targetBreakerObj?.breaker_number + breakerCountToAdd
                );

                // When 3rd breaker not found
                if (!thirdBreakerObj?.id) {
                    const alertMsg = `600 V panel requires groups of 1 or 3 breakers - Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because there is not a third breaker available.`;
                    setAlertMessage(alertMsg);
                    handleUngroupAlertOpen();
                    return;
                }

                // When 3rd breaker is already grouped
                if (thirdBreakerObj?.breaker_type !== 1) {
                    const alertMsg = `600 V panel requires groups of 1 or 3 breakers - Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because Breaker ${thirdBreakerObj?.breaker_number} is already grouped.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }

                // Get grouping breaker type list
                const breakersType = [sourceBreakerObj?.type, targetBreakerObj?.type, thirdBreakerObj?.type];

                // For Unlabeled Type
                const isUnlabeledTypeExist = breakersType.some((el) => el === 'unlabeled');
                if (isUnlabeledTypeExist) {
                    // Condition to handle when breaker is of unlabeled type
                    const typeListForUnlabeled = [
                        sourceBreakerObj?.type,
                        targetBreakerObj?.type,
                        thirdBreakerObj?.type,
                    ];
                    const unlabeledList = typeListForUnlabeled.filter((el) => el === 'unlabeled');

                    // When multiple unlabeled breaker type found
                    if (unlabeledList.length > 1) {
                        const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because multiple breakers are of unlabeled type.`;
                        setAlertMessage(alertMsg);
                        handleUngroupAlertOpen();
                        setAdditionalMessage(true);
                        return;
                    }

                    // When only 1 breaker is of unlabeled type
                    if (unlabeledList.length === 1) {
                        if (typeListForUnlabeled.includes('unwired') || typeListForUnlabeled.includes('blank')) {
                            const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because only an unconfigured breaker may be grouped with Unlabeled breaker.`;
                            setAlertMessage(alertMsg);
                            handleUngroupAlertOpen();
                            setAdditionalMessage(true);
                            return;
                        }

                        if (
                            (sourceBreakerObj?.type === 'equipment' &&
                                sourceBreakerObj?.breaker_state !== Breaker.Type.notConfigured) ||
                            (targetBreakerObj?.type === 'equipment' &&
                                targetBreakerObj?.breaker_state !== Breaker.Type.notConfigured) ||
                            (thirdBreakerObj?.type === 'equipment' &&
                                thirdBreakerObj?.breaker_state !== Breaker.Type.notConfigured)
                        ) {
                            const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because only an unconfigured breaker may be grouped with Unlabeled breaker. `;
                            setAlertMessage(alertMsg);
                            setAdditionalMessage(true);
                            handleUngroupAlertOpen();
                            return;
                        }

                        // Below grouping will execute when both equipment type breaker are in 'not-configured' state
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    }
                }

                // For Unwired or Blank Type
                const isUnwiredTypeExist = breakersType.some((el) => el === 'unwired');
                const isBlankTypeExist = breakersType.some((el) => el === 'blank');
                if (isUnwiredTypeExist || isBlankTypeExist) {
                    // When all breakers are of type unwired or blank
                    if (
                        sourceBreakerObj?.type === targetBreakerObj?.type &&
                        sourceBreakerObj?.type === thirdBreakerObj?.type &&
                        (sourceBreakerObj?.type === 'unwired' || sourceBreakerObj?.type === 'blank')
                    ) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    }

                    const uniqueBreakerTypes = [...new Set(breakersType.map(JSON.stringify))].map(JSON.parse);
                    if (uniqueBreakerTypes.length === 2 && uniqueBreakerTypes.includes('equipment')) {
                        if (
                            (sourceBreakerObj?.type === 'equipment' &&
                                sourceBreakerObj?.breaker_state !== Breaker.Type.notConfigured) ||
                            (targetBreakerObj?.type === 'equipment' &&
                                targetBreakerObj?.breaker_state !== Breaker.Type.notConfigured) ||
                            (thirdBreakerObj?.type === 'equipment' &&
                                thirdBreakerObj?.breaker_state !== Breaker.Type.notConfigured)
                        ) {
                            const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because only unconfigured breaker can be grouped together.`;
                            setAlertMessage(alertMsg);
                            setAdditionalMessage(true);
                            handleUngroupAlertOpen();
                            return;
                        }

                        // Below grouping with exeucte when Breaker of type equipment is in 'not-configured' state
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    } else {
                        const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because they are different breaker types.`;
                        setAlertMessage(alertMsg);
                        setAdditionalMessage(true);
                        handleUngroupAlertOpen();
                        return;
                    }
                }

                // For Equipment Type
                const isEquipmentTypeExist = breakersType.some((el) => el === 'equipment');
                if (isEquipmentTypeExist) {
                    // When all breakers are of type equipment, not-configured state handled
                    if (
                        sourceBreakerObj?.type === targetBreakerObj?.type &&
                        sourceBreakerObj?.type === thirdBreakerObj?.type &&
                        sourceBreakerObj?.type === 'equipment'
                    ) {
                        const breakersState = [
                            sourceBreakerObj?.breaker_state,
                            targetBreakerObj?.breaker_state,
                            thirdBreakerObj?.breaker_state,
                        ];

                        // When all 3 breakers are of not-configured state
                        const isAllBreakersNotConfigured = breakersState.every(
                            (el) => el === Breaker.Type.notConfigured
                        );
                        if (isAllBreakersNotConfigured) {
                            setIsLoading(true);
                            setLinking(true);
                            updateBreakerGrouping(
                                [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                                setIsLoading
                            );
                            return;
                        }

                        // When 2 breakers are of not-configured state
                        const fetchNotConfiguredBreakers = breakersState.filter(
                            (el) => el === Breaker.Type.notConfigured
                        );
                        if (fetchNotConfiguredBreakers.length === 2) {
                            setIsLoading(true);
                            setLinking(true);
                            updateBreakerGrouping(
                                [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                                setIsLoading
                            );
                            return;
                        }

                        // When there is only one breaker in not-configured or when breaker are in partially-configured or configured state
                        if (fetchNotConfiguredBreakers.length !== 2) {
                            const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number}, ${targetBreakerObj?.breaker_number} & ${thirdBreakerObj?.breaker_number} cannot be grouped because multiple breakers must be in unconfigured state for grouping together.`;
                            setAlertMessage(alertMsg);
                            setAdditionalMessage(true);
                            handleUngroupAlertOpen();
                            return;
                        }
                    }
                }

                // get from notepad ++ , if further code is required
            }

            // Breaker lvl is 3:3 => Will be ungrouped => We will not be validating anything to send as alert to the user
            if (sourceBreakerObj?.breaker_type === 3 && targetBreakerObj?.breaker_type === 3) {
                // When both breakers are grouped seperately, so they cannot be grouped
                if (
                    sourceBreakerObj?.id !== targetBreakerObj?.parent_breaker &&
                    sourceBreakerObj?.parent_breaker !== targetBreakerObj?.parent_breaker
                ) {
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they are both already in another group.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }

                // When source breaker is parent breaker - can be ungrouped
                if (sourceBreakerObj?.parent_breaker === '') {
                    setIsLoading(true);
                    setLinking(true);
                    updateBreakerUngrouping(sourceBreakerObj?.id, setIsLoading);
                    return;
                }

                // When source breaker is not parent breaker - can be ungrouped
                if (sourceBreakerObj?.parent_breaker !== '') {
                    const parentBreakerObj = breakersList.find((el) => el?.id === sourceBreakerObj?.parent_breaker);
                    if (parentBreakerObj?.id) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(parentBreakerObj?.id, setIsLoading);
                        return;
                    }
                }
            }

            // Breaker lvl is 1:3 & 3:! => Will show up alert
            // When one of the breaker is already grouped then it cannot form triple breaker grouping with 600 voltage config
            if (sourceBreakerObj?.breaker_type !== targetBreakerObj?.breaker_type) {
                const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because Breaker ${sourceBreakerObj?.breaker_number} or ${targetBreakerObj?.breaker_number} is already grouped.`;
                setAlertMessage(alertMsg);
                setAdditionalMessage(true);
                handleUngroupAlertOpen();
                return;
            }
        }

        // When both Breaker Types are same
        if (sourceBreakerObj?.type === targetBreakerObj?.type) {
            // When Breaker is of type unlabeld
            if (sourceBreakerObj?.type === 'unlabeled') {
                const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they have different unlabeled equipment.`;
                setAlertMessage(alertMsg);
                setAdditionalMessage(true);
                handleUngroupAlertOpen();
                return;
            }

            // Breaker Lvl 1:1
            if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 1) {
                const { isGroupable, alertText } = validateBreakerConfiguration(sourceBreakerObj, targetBreakerObj);

                if (isGroupable) {
                    setIsLoading(true);
                    setLinking(true);
                    updateBreakerGrouping([sourceBreakerObj?.id, targetBreakerObj?.id], setIsLoading);
                    return;
                } else {
                    setAlertMessage(alertText);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }
            }

            // Breaker Lvl 1:3, 3:1, 3:3
            if (sourceBreakerObj?.breaker_type === 3 || targetBreakerObj?.breaker_type === 3) {
                // Breaker Lvl 1:3 && 3:1
                if (
                    (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 3) ||
                    (sourceBreakerObj?.breaker_type === 3 && targetBreakerObj?.breaker_type === 1)
                ) {
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because Breaker ${sourceBreakerObj?.breaker_number} or ${targetBreakerObj?.breaker_number} is already grouped in the maximum group size of 3 breakers.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }

                // Breaker Lvl 3:3
                if (sourceBreakerObj?.breaker_type === 3 && targetBreakerObj?.breaker_type === 3) {
                    // When ungrouping 1st breaker out of triple breaker
                    if (sourceBreakerObj?.id === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(sourceBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When ungrouping 3rd breaker out of triple breaker
                    if (sourceBreakerObj?.parent_breaker === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(targetBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When both the breaker are grouped seperately
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because the resulting group would exceed a maximum group size of 3 breakers.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }
            }

            // Breaker Lvl 1:2, 2:1, 2:2
            if (sourceBreakerObj?.breaker_type === 2 || targetBreakerObj?.breaker_type === 2) {
                // Breaker Lvl 2:2
                if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 2) {
                    // When both Breaker are grouped together
                    if (sourceBreakerObj?.id === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(targetBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When both Breakers are grouped seperately
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because the resulting group would exceed a maximum group size of 3 breakers.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }

                // Panel voltage - 120/240 => cannot form triple grouping
                if (panelObj?.voltage === '120/240') {
                    const alertMsg = `120/240 V panels have maximum group size of 2 breakers - grouping more than 2 breakers would exceed that size.`;
                    setAlertMessage(alertMsg);
                    handleUngroupAlertOpen();
                    return;
                }

                // Breaker Lvl 1:2
                if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 2) {
                    const { isGroupable, alertText } = validateBreakerConfiguration(sourceBreakerObj, targetBreakerObj);

                    if (isGroupable) {
                        const thirdBreakerObj = breakersList.find((el) => el?.parent_breaker === targetBreakerObj?.id);
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    } else {
                        setAlertMessage(alertText);
                        handleUngroupAlertOpen();
                        setAdditionalMessage(true);
                        return;
                    }
                }

                // Breaker Lvl 2:1
                if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 1) {
                    const { isGroupable, alertText } = validateBreakerConfiguration(sourceBreakerObj, targetBreakerObj);

                    if (isGroupable) {
                        const parentBreakerObj = breakersList.find((el) => el?.id === sourceBreakerObj?.parent_breaker);
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [parentBreakerObj?.id, sourceBreakerObj?.id, targetBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    } else {
                        setAlertMessage(alertText);
                        setAdditionalMessage(true);
                        handleUngroupAlertOpen();
                        return;
                    }
                }
            }
        }

        // When both Breaker Types are different
        if (sourceBreakerObj?.type !== targetBreakerObj?.type) {
            // When breaker type is different and not equipment (default state)
            if (sourceBreakerObj?.type !== 'equipment' && targetBreakerObj?.type !== 'equipment') {
                const source = sourceBreakerObj?.type.charAt(0).toUpperCase() + sourceBreakerObj?.type.slice(1);
                const target = targetBreakerObj?.type.charAt(0).toUpperCase() + targetBreakerObj?.type.slice(1);
                setAlertMessage(`Only an unconfigured breaker may be grouped with Blank or Unwired breakers.`);
                setAdditionalMessage(true);
                handleUngroupAlertOpen();
                return;
            }

            // Breaker Lvl 3:1, 1:3, 3:3, 2:3, 3:2
            if (sourceBreakerObj?.breaker_type === 3 || targetBreakerObj?.breaker_type === 3) {
                // Breaker Type 3-3
                if (sourceBreakerObj?.breaker_type === 3 && targetBreakerObj?.breaker_type === 3) {
                    // When ungrouping 1st breaker out of triple breaker
                    if (sourceBreakerObj?.id === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(sourceBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When ungrouping 3rd breaker out of triple breaker
                    if (sourceBreakerObj?.parent_breaker === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(targetBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When both breaker are not grouped & one breaker is already triple breaker
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because they are both already in another group.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                } else {
                    // Breaker Type 3:1, 1:3, 2:3, 3:2
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because breaker ${sourceBreakerObj?.breaker_number} or ${targetBreakerObj?.breaker_number} is already grouped in the maximum group size of 3 breakers.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }
            }

            // Breaker Lvl 1:1
            if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 1) {
                // When source breaker is of type equipment and in not configured state
                if (
                    sourceBreakerObj?.type === 'equipment' &&
                    sourceBreakerObj?.breaker_state === Breaker.Type.notConfigured
                ) {
                    setIsLoading(true);
                    setLinking(true);
                    updateBreakerGrouping([sourceBreakerObj?.id, targetBreakerObj?.id], setIsLoading);
                    return;
                }

                // When target breaker is of type equipment and in not configured state
                if (
                    targetBreakerObj?.type === 'equipment' &&
                    targetBreakerObj?.breaker_state === Breaker.Type.notConfigured
                ) {
                    setIsLoading(true);
                    setLinking(true);
                    updateBreakerGrouping([sourceBreakerObj?.id, targetBreakerObj?.id], setIsLoading);
                    return;
                }

                // When both condition fails
                const alertMsg = `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be grouped because only an unconfigured breaker may be grouped.`;
                setAlertMessage(alertMsg);
                setAdditionalMessage(true);
                handleUngroupAlertOpen();
                return;
            }

            // Breaker Lvl 2:2, 1:2, 2:1
            if (sourceBreakerObj?.breaker_type === 2 || targetBreakerObj?.breaker_type === 2) {
                // Breaker Lvl 2:2
                if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 2) {
                    // When both Breaker are grouped together
                    if (sourceBreakerObj?.id === targetBreakerObj?.parent_breaker) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerUngrouping(targetBreakerObj?.id, setIsLoading);
                        return;
                    }

                    // When both Breakers are grouped seperately
                    const alertMsg = `Breakers ${sourceBreakerObj?.breaker_number} & ${targetBreakerObj?.breaker_number} cannot be grouped because the resulting group would exceed a maximum group size of 3 breakers.`;
                    setAlertMessage(alertMsg);
                    setAdditionalMessage(true);
                    handleUngroupAlertOpen();
                    return;
                }

                // Panel voltage 120/240 cannot form Triple Grouping
                if (panelObj?.voltage === '120/240') {
                    const alertMsg = `120/240 V panels have maximum group size of 2 breakers - grouping more than 2 breakers would exceed that size.`;
                    setAlertMessage(alertMsg);
                    handleUngroupAlertOpen();
                    return;
                }

                // Breaker Lvl 1:2
                if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 2) {
                    const thirdBreakerObj = breakersList.find((el) => el?.parent_breaker === targetBreakerObj?.id);

                    if (
                        sourceBreakerObj?.type === 'equipment' &&
                        sourceBreakerObj?.breaker_state === Breaker.Type.notConfigured
                    ) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [sourceBreakerObj?.id, targetBreakerObj?.id, thirdBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    } else {
                        const alertMsg = `Only an unconfigured breaker may be grouped with Equipment attached breakers.`;
                        setAlertMessage(alertMsg);
                        setAdditionalMessage(true);
                        handleUngroupAlertOpen();
                        return;
                    }
                }

                // Breaker Lvl 2:1
                if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 1) {
                    const parentBreakerObj = breakersList.find((el) => el?.id === sourceBreakerObj?.parent_breaker);

                    if (
                        targetBreakerObj?.type === 'equipment' &&
                        targetBreakerObj?.breaker_state === Breaker.Type.notConfigured
                    ) {
                        setIsLoading(true);
                        setLinking(true);
                        updateBreakerGrouping(
                            [parentBreakerObj?.id, sourceBreakerObj?.id, targetBreakerObj?.id],
                            setIsLoading
                        );
                        return;
                    } else {
                        const alertMsg = `Only an unconfigured breaker may be grouped with Equipment attached breakers.`;
                        setAlertMessage(alertMsg);
                        setAdditionalMessage(true);
                        handleUngroupAlertOpen();
                        return;
                    }
                }
            }
        }
    };

    const getTargetBreakerId = (targetBreakerNo) => {
        let targetObj = breakersList?.find((obj) => obj?.breaker_number === targetBreakerNo);
        return targetObj?.id;
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panelObj);
        obj[key] = value;
        setPanelObj(obj);
    };

    const savePanelData = async () => {
        setIsProcessing(true);
        const params = `?panel_id=${panelId}`;
        const panel_obj = {
            name: panelObj?.panel_name,
            parent_panel: panelObj?.parent_id,
            space_id: panelObj?.location_id,
        };
        if (panelObj?.starting_breaker) panel_obj.starting_breaker = panelObj?.starting_breaker;
        await updatePanelDetails(params, panel_obj)
            .then((res) => {
                setIsProcessing(false);
                history.push({
                    pathname: `/settings/panels/${bldgId}`,
                });
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    const fetchSinglePanelData = async (panel_id, bldg_id) => {
        setPanelFetching(true);
        const params = `?building_id=${bldg_id}&panel_id=${panel_id}`;
        await getPanelsList(params)
            .then((res) => {
                const response = res?.data;
                setPanelObj(response);
                setOriginalPanelObj(response);

                if (response?.connected_devices.length !== 0) {
                    let devicesList = [];
                    response.connected_devices.forEach((record) => {
                        devicesList.push({
                            label: record?.device_identifier,
                            value: record?.device_id,
                            isDisabled: false,
                        });
                    });
                    setPanelDevicesList(devicesList);
                }

                if (response) {
                    setMainBreakerConfig({
                        items: [
                            {
                                id: 'M',
                                status: Breaker.Status.online,
                            },
                        ],
                        type: Breaker.Type.configured,
                        ratedAmps: `${response?.rated_amps} A`,
                        ratedVolts: `${getVoltageConfigValue(response?.voltage, 'single')} V`,
                    });
                }

                if (response?.starting_breaker) setStartingBreaker(response?.starting_breaker);

                setBreakerCountObj({ ...breakerCountObj, defaultValue: response?.breakers });
                setBreakerType({ ...breakerType, defaultValue: response?.panel_type });

                BreakersStore.update((s) => {
                    s.panelData = response;
                });

                setPanelFetching(false);
            })
            .catch(() => {
                setPanelFetching(false);
            });
    };

    const fetchBreakersData = async (panel_id, bldg_id, setIsLoading) => {
        const params = `?panel_id=${panel_id}&building_id=${bldg_id}`;

        await getBreakersList(params)
            .then((res) => {
                let response = res?.data?.data;

                response.forEach((record) => {
                    if (record?.type === '') record.type = 'equipment';
                    // Configuration check is done on UI until Backend validation gets fixed
                    // record.breaker_custom_state = fetchBreakerType(record);
                    // record.status = fetchBreakerStatus(record);

                    // Note - Apms set as undefined to restricts Amps reading to be displayed if its 0A
                    if (record?.rated_amps === 0 || !record?.rated_amps) record.rated_amps = undefined;
                    if (record?.voltage === 0 || !record?.voltage) record.voltage = undefined;
                });

                BreakersStore.update((s) => {
                    s.breakersList = response;
                });

                setLinking(false);
                if (setIsLoading) setIsLoading(false);

                setBreakerAPITrigerred(false);
                setBreakerUpdateId('');
            })
            .catch(() => {
                setBreakerAPITrigerred(false);
                BreakersStore.update((s) => {
                    s.breakersList = [];
                });
                if (setIsLoading) setIsLoading(false);
                setBreakerUpdateId('');
                setLinking(false);
            });
    };

    const fetchEquipmentData = async (bldg_id) => {
        setEquipmentFetching(true);
        const params = `?building_id=${bldg_id}&occupancy_filter=true`;
        await getEquipmentsList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const equipArray = [];
                responseData.forEach((record) => {
                    if (record.equipments_name === '') return;
                    const obj = {
                        label: record?.equipments_name,
                        value: record?.equipments_id,
                        breakerId: record?.breaker_id,
                        isDisabled: record?.breaker_id !== '',
                    };
                    equipArray.push(obj);
                });
                setEquipmentsList(equipArray);
                BreakersStore.update((s) => {
                    s.equipmentData = equipArray;
                });
                setEquipmentFetching(false);
            })
            .catch(() => {
                setEquipmentsList([]);
                setEquipmentFetching(false);
            });
    };

    const fetchPanelsData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}`;
        await getPanelsList(params)
            .then((res) => {
                const response = res?.data?.data;
                if (response.length !== 0) {
                    response.forEach((record) => {
                        record.label = record?.panel_name;
                        record.value = record?.panel_id;
                    });
                }
                response.length === 0 ? setPanelsList([]) : setPanelsList(response);
            })
            .catch(() => {
                setPanelsList([]);
            });
    };

    const fetchPassiveDeviceData = async (bldg_id) => {
        let params = `?building_id=${bldg_id}&page_no=1&page_size=150`;

        await getPassiveDeviceList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const newArray = [];

                responseData.forEach((record) => {
                    const obj = {
                        label: record?.identifier,
                        value: record?.equipments_id,
                        isDisabled: compareSensorsCount(record?.sensor_number),
                    };
                    newArray.push(obj);
                });

                setPassiveDevicesList(newArray);

                BreakersStore.update((s) => {
                    s.passiveDeviceData = newArray;
                });
            })
            .catch(() => {});
    };

    const fetchLocationData = async (bldg_id) => {
        const params = `/${bldg_id}`;
        await getLocationData(params)
            .then((res) => {
                const response = res?.data;
                if (response.length !== 0) {
                    response.forEach((record) => {
                        record.label = record?.location_name;
                        record.value = record?.location_id;
                    });
                }
                response.length === 0 ? setLocationsList([]) : setLocationsList(response);
            })
            .catch(() => {
                setLocationsList([]);
            });
    };

    const pageDefaultStates = () => {
        BreakersStore.update((s) => {
            s.breakersList = [];
        });
        BreadcrumbStore.update((bs) => {
            const newList = [
                {
                    label: 'Panels',
                    path: `/settings/panels/${bldgId}`,
                    active: true,
                },
            ];
            bs.items = newList;
            bs.isEditable = false;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const links = [];
        let breakerCountToAdd;
        panelType === 'distribution' ? (breakerCountToAdd = 2) : (breakerCountToAdd = 1);
        breakersList.forEach((record) => {
            if (record?.breaker_number + breakerCountToAdd > breakersList.length) return;

            const obj = {
                id: `breaker-${record?.breaker_number}`,
                source: record?.id,
                target: getTargetBreakerId(record?.breaker_number + breakerCountToAdd),
                type: 'breakerLink',
            };
            links.push(obj);
        });
        setBreakerLinks(links);
    }, [breakersList]);

    useEffect(() => {
        if (!isBreakerApiTrigerred) return;

        fetchBreakersData(panelId, bldgId);
        fetchEquipmentData(bldgId);
    }, [isBreakerApiTrigerred]);

    useEffect(() => {
        fetchSinglePanelData(panelId, bldgId);
        fetchBreakersData(panelId, bldgId);
        fetchEquipmentData(bldgId);
        fetchPanelsData(bldgId);
        fetchPassiveDeviceData(bldgId);
        fetchLocationData(bldgId);
    }, [panelId]);

    useEffect(() => {
        isEditingMode ? setActiveTab('edit-breaker') : setActiveTab('metrics');
    }, [isEditingMode]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(bldgObj?.building_id, bldgObj?.building_name, bldgObj?.timezone);
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        if (originalPanelObj?.panel_id) {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Panels',
                        path: `/settings/panels/${bldgId}`,
                        active: false,
                    },
                    {
                        label: originalPanelObj?.panel_name,
                        path: '/settings/panels/edit-panel',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        }
    }, [originalPanelObj]);

    useEffect(() => {
        pageDefaultStates();
    }, []);

    return (
        <React.Fragment>
            <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center ">
                    <Typography.Header size={Typography.Sizes.lg}>{originalPanelObj?.panel_name}</Typography.Header>
                    {originalPanelObj?.flag_count && originalPanelObj?.flag_count !== 0 ? (
                        <StatusBadge
                            text={`${originalPanelObj?.flag_count}`}
                            type={StatusBadge.Type.warning}
                            className="flag-container ml-2"
                            textStyle="flag-text"
                        />
                    ) : null}
                </div>
                {isPanelFetched ? (
                    <Skeleton count={1} height={35} width={135} />
                ) : (
                    <div className="d-flex">
                        <div>
                            <Button
                                label="Cancel"
                                size={Button.Sizes.md}
                                type={Button.Type.secondaryGrey}
                                onClick={onCancelClick}
                            />
                        </div>
                        <div>
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.building_panels_permission?.edit ? (
                                <Button
                                    label={isProcessing ? 'Saving' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={savePanelData}
                                    className="ml-2"
                                    disabled={comparePanelData(panelObj, originalPanelObj)}
                                />
                            ) : null}
                        </div>
                    </div>
                )}
            </div>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={10}>
                    <div className="edit-panel-custom-grid">
                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Name</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {isPanelFetched ? (
                                <Skeleton count={1} height={35} width={250} />
                            ) : (
                                <InputTooltip
                                    placeholder="Enter Panel Name"
                                    onChange={(e) => {
                                        handleChange('panel_name', e.target.value);
                                    }}
                                    labelSize={Typography.Sizes.md}
                                    value={panelObj?.panel_name}
                                    disabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>

                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Parent Panel</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {isPanelFetched ? (
                                <Skeleton count={1} height={35} width={250} />
                            ) : (
                                <Select
                                    placeholder="Select Parent Panel"
                                    options={panelsList}
                                    currentValue={panelsList.filter((option) => option.value === panelObj?.parent_id)}
                                    onChange={(e) => {
                                        handleChange('parent_id', e.value);
                                    }}
                                    isSearchable={true}
                                    isDisabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>

                        <div>
                            <Typography.Body size={Typography.Sizes.md}>Location</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {isPanelFetched ? (
                                <Skeleton count={1} height={35} width={475} />
                            ) : (
                                <Select
                                    placeholder="Select Location"
                                    options={locationsList}
                                    currentValue={locationsList.filter(
                                        (option) => option.value === panelObj?.location_id
                                    )}
                                    onChange={(e) => {
                                        handleChange('location_id', e.value);
                                    }}
                                    isSearchable={true}
                                    isDisabled={
                                        !(
                                            userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.building_panels_permission?.edit
                                        )
                                    }
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Panel
                typeOptions={panelTypeList}
                typeProps={breakerType}
                numberOfBreakers={breakerCountObj}
                startingBreaker={{
                    onChange: () => {
                        let count = startingBreaker;
                        count = count + 1;
                        setStartingBreaker(count);
                        handleChange('starting_breaker', count);
                    },
                    defaultValue: startingBreaker,
                    type: 'number',
                    min: 1,
                }}
                isEditable={
                    userPermission?.user_role === 'admin' ||
                    userPermission?.permissions?.permissions?.building_panels_permission?.edit
                }
                states={panelStates}
                mainBreaker={panelType === 'disconnect' ? null : mainBreakerConfig}
                dangerZoneProps={{
                    labelButton: 'Reset all Equipment & Device Links',
                    onClickButton: (event) => handleUnlinkAlertShow(),
                }}
                onEdit={(props) => {
                    const breakerObj = breakersList.find((el) => el?.id === props._id);
                    setSelectedBreakerObj(breakerObj);
                    setActiveTab('edit-breaker');
                    if (breakerObj) openBreakerConfigModal();
                }}
                onShowChart={(props) => {
                    const breakerObj = breakersList.find((el) => el?.id === props._id);
                    setSelectedBreakerObj(breakerObj);
                    setActiveTab('metrics');
                    if (breakerObj) openBreakerConfigModal();
                }}
                callBackBreakerProps={({ breakerProps, breakerData }) => {
                    const type = fetchBreakerType(breakerData);
                    const equipmentName = breakerData?.equipment_links[0]?.name;
                    const status = breakerData?.status;
                    const isLoading = breakerData?.id === breakerUpdateId;
                    return {
                        ...breakerProps,
                        equipmentName,
                        items: breakerProps.items.map((breakerProp) => ({ ...breakerProp, status })),
                        type,
                        isLoading,
                    };
                }}
                onPanelEditClick={({ isEditingMode }) => setEditingMode(isEditingMode)}
                breakerPropsAccessor={{
                    id: 'breaker_number',
                    status: 'status',
                    deviceId: 'device_name',
                    sensorId: 'sensor_name',
                    ratedAmps: 'rated_amps',
                    ratedVolts: 'voltage',
                    equipmentName: 'equipment_name',
                    isFlagged: 'is_flagged',
                    type: 'type',
                    parentBreaker: 'parent_breaker',
                    _id: 'id',
                    isLinked: 'is_linked',
                }}
                onBreakerLinkedClick={(props, setIsLoading) => {
                    if (
                        props?.source &&
                        props?.target &&
                        props?.source !== breakerUpdateId &&
                        props?.target !== breakerUpdateId
                    )
                        handleBreakerGrouping(props, setIsLoading, isLinking);
                }}
                nodes={breakersList}
                edges={breakerLinks}
                isOneColumn={panelType === 'disconnect'}
                style={{ width: '66vw' }}
            />

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={10}>
                    <div>
                        <DangerZone
                            title="Danger Zone"
                            labelButton="Delete Panel"
                            iconButton={<DeleteSVG />}
                            onClickButton={(event) => handleDeletePanelAlertShow()}
                        />
                    </div>
                </Col>
            </Row>

            <BreakerConfiguration
                showBreakerConfigModal={showBreakerConfigModal}
                openBreakerConfigModal={openBreakerConfigModal}
                closeBreakerConfigModal={closeBreakerConfigModal}
                selectedBreakerObj={selectedBreakerObj}
                setSelectedBreakerObj={setSelectedBreakerObj}
                panelObj={panelObj}
                equipmentsList={equipmentsList}
                passiveDevicesList={passiveDevicesList}
                setBreakerAPITrigerred={setBreakerAPITrigerred}
                fetchEquipmentData={fetchEquipmentData}
                isEquipmentListFetching={isEquipmentListFetching}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isEditingMode={isEditingMode}
                setBreakerUpdateId={setBreakerUpdateId}
                panelDevicesList={panelDevicesList}
            />

            <UnlinkAllBreakers
                isResetting={isResetting}
                showUnlinkAlert={showUnlinkAlert}
                handleUnlinkAlertClose={handleUnlinkAlertClose}
                unLinkAllBreakers={unLinkAllBreakers}
            />

            <DeletePanel
                isDeleting={isDeleting}
                showDeletePanelAlert={showDeletePanelAlert}
                handleDeletePanelAlertShow={handleDeletePanelAlertShow}
                handleDeletePanelAlertClose={handleDeletePanelAlertClose}
                deletePanel={deletePanel}
            />

            <UngroupAlert
                showUngroupAlert={showUngroupAlert}
                handleUngroupAlertClose={handleUngroupAlertClose}
                alertMessage={alertMessage}
                setAlertMessage={setAlertMessage}
                additionalMessage={additionalMessage}
                setAdditionalMessage={setAdditionalMessage}
            />
        </React.Fragment>
    );
};

export default EditPanel;
