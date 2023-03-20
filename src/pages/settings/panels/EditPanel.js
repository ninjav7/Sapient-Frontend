import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';

import {
    deleteCurrentPanel,
    getBreakersList,
    getEquipmentsList,
    getLocationData,
    getPanelsList,
    getPassiveDeviceList,
    resetAllBreakers,
    updateBreakersLink,
    updatePanelDetails,
} from './services';

import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreakersStore } from '../../../store/BreakersStore';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Brick from '../../../sharedComponents/brick';
import Panel from '../../../sharedComponents/widgets/panel/Panel';
import { Breaker } from '../../../sharedComponents/breaker';
import {
    compareSensorsCount,
    getEquipmentForBreaker,
    getPhaseConfigValue,
    getVoltageConfigValue,
    validateConfiguredEquip,
    validateDevicesForBreaker,
} from './utils';
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
import './styles.scss';
import UngroupAlert from './UngroupAlert';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

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
    const [isPanelFetched, setPanelFetching] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [breakerUpdateId, setBreakerUpdateId] = useState('');
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

    const linkMultipleBreakersAPI = async (breakerObjOne, breakerObjTwo, setIsLoading) => {
        const params = `?building_id=${bldgId}`;
        const payload = [breakerObjOne, breakerObjTwo];
        await updateBreakersLink(params, payload)
            .then((res) => {
                fetchBreakersData(panelId, bldgId, setIsLoading);
                fetchEquipmentData(bldgId);
            })
            .catch(() => {
                setIsLoading(false);
                setLinking(false);
            });
    };

    const linkTripleBreakersAPI = async (breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading) => {
        const params = `?building_id=${bldgId}`;
        const payload = [breakerObjOne, breakerObjTwo, breakerObjThree];
        await updateBreakersLink(params, payload)
            .then((res) => {
                fetchBreakersData(panelId, bldgId, setIsLoading);
                fetchEquipmentData(bldgId);
            })
            .catch(() => {
                setIsLoading(false);
                setLinking(false);
            });
    };

    const linkBreakers = (sourceBreakerObj, targetBreakerObj, setIsLoading) => {
        // Different Breaker Types cannot be linked -- restricted till all the conditions are shared
        if (sourceBreakerObj?.type !== targetBreakerObj?.type) {
            const source =
                sourceBreakerObj?.type !== ''
                    ? sourceBreakerObj?.type.charAt(0).toUpperCase() + sourceBreakerObj?.type.slice(1)
                    : 'Equipment';
            const target =
                targetBreakerObj?.type !== ''
                    ? targetBreakerObj?.type.charAt(0).toUpperCase() + targetBreakerObj?.type.slice(1)
                    : 'Equipment';
            setAdditionalMessage(true);
            setAlertMessage(`An ${source} breaker cannot be combined with a ${target} Breaker`);
            handleUngroupAlertOpen();
            return;
        }

        if (sourceBreakerObj?.breaker_type === 3 || targetBreakerObj?.breaker_type === 3) {
            setAlertMessage(
                `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
            );
            handleUngroupAlertOpen();
            return;
        }

        // --- breakerLink= 1:3 && breakerLink= 3:1 && breakerLink= 3:3 ---
        if (sourceBreakerObj?.breaker_type === 3 || targetBreakerObj?.breaker_type === 3) {
            setAlertMessage(
                `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
            );
            handleUngroupAlertOpen();
            return;
        }

        // --- breakerLink= 1:1 ---
        if (sourceBreakerObj?.breaker_type === 1 && targetBreakerObj?.breaker_type === 1) {
            if (panelObj?.voltage === '600') {
                const breakerCountToAdd = panelType === 'distribution' ? 2 : 1;
                // Setup Triple Breaker
                if (targetBreakerObj?.breaker_number + breakerCountToAdd > breakersList.length) {
                    setAlertMessage(
                        `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                    );
                    handleUngroupAlertOpen();
                    return;
                }

                let thirdBreakerObj = breakersList.find(
                    (record) => record?.breaker_number === targetBreakerObj?.breaker_number + breakerCountToAdd
                );

                if (sourceBreakerObj?.breaker_type === 3) {
                    setAlertMessage(
                        `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                    );
                    handleUngroupAlertOpen();
                    return;
                }

                if (targetBreakerObj?.breaker_type === 3) {
                    setAlertMessage(
                        `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                    );
                    handleUngroupAlertOpen();
                    return;
                }

                if (thirdBreakerObj?.breaker_type === 3) {
                    setAlertMessage(
                        `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                    );
                    handleUngroupAlertOpen();
                    return;
                }

                const { isLinkable, uniqueList } = validateDevicesForBreaker([
                    sourceBreakerObj?.device_link,
                    targetBreakerObj?.device_link,
                    thirdBreakerObj?.device_link,
                ]);

                if (!isLinkable) {
                    setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                    handleUngroupAlertOpen();
                    return;
                }

                let deviceID = '';

                if (uniqueList.length === 1) deviceID = uniqueList[0];
                if (uniqueList.length === 2) deviceID = uniqueList.find((el) => el !== '');

                let breakerOneEquip = sourceBreakerObj?.equipment_link[0] ? sourceBreakerObj?.equipment_link[0] : '';
                let breakerTwoEquip = targetBreakerObj?.equipment_link[0] ? targetBreakerObj?.equipment_link[0] : '';
                let breakerThreeEquip = thirdBreakerObj?.equipment_link[0] ? thirdBreakerObj?.equipment_link[0] : '';

                let equipmentID = '';
                let equipmentList = [breakerOneEquip, breakerTwoEquip, breakerThreeEquip];

                if (!(breakerOneEquip === '' && breakerTwoEquip === '' && breakerThreeEquip === '')) {
                    let configuredEquip = equipmentList.filter((el) => el !== '');
                    if (configuredEquip.length === 1) {
                        equipmentID = configuredEquip[0];
                    } else {
                        setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                        handleUngroupAlertOpen();
                        return;
                    }
                }

                setIsLoading(true);
                setLinking(true);

                let breakerObjOne = {
                    breaker_id: sourceBreakerObj?.id,
                    rated_amps: sourceBreakerObj.rated_amps
                        ? sourceBreakerObj.rated_amps
                        : targetBreakerObj.rated_amps
                        ? targetBreakerObj.rated_amps
                        : 0,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: '',
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjTwo = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps
                        ? sourceBreakerObj.rated_amps
                        : targetBreakerObj.rated_amps
                        ? targetBreakerObj.rated_amps
                        : 0,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj?.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjThree = {
                    breaker_id: thirdBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
                return;
            }

            const { isLinkable, uniqueList } = validateDevicesForBreaker([
                sourceBreakerObj?.device_link,
                targetBreakerObj?.device_link,
            ]);

            if (!isLinkable) {
                setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                handleUngroupAlertOpen();
                return;
            }

            let deviceID = '';

            if (uniqueList.length === 1) deviceID = uniqueList[0];
            if (uniqueList.length === 2) deviceID = uniqueList.find((el) => el !== '');

            const isEquipDiff = validateConfiguredEquip(sourceBreakerObj, targetBreakerObj);

            if (isEquipDiff) {
                setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                handleUngroupAlertOpen();
                return;
            }

            setIsLoading(true);
            setLinking(true);

            const equipmentID = getEquipmentForBreaker([sourceBreakerObj, targetBreakerObj]);

            let breakerObjOne = {
                breaker_id: sourceBreakerObj.id,
                rated_amps: sourceBreakerObj.rated_amps
                    ? sourceBreakerObj.rated_amps
                    : targetBreakerObj.rated_amps
                    ? targetBreakerObj.rated_amps
                    : 0,
                voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                breaker_type: 2,
                parent_breaker: '',
                is_linked: true,
                equipment_id: equipmentID,
                device_id: deviceID,
            };

            let breakerObjTwo = {
                breaker_id: targetBreakerObj.id,
                rated_amps: sourceBreakerObj.rated_amps
                    ? sourceBreakerObj.rated_amps
                    : targetBreakerObj.rated_amps
                    ? targetBreakerObj.rated_amps
                    : 0,
                voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                breaker_type: 2,
                parent_breaker: sourceBreakerObj.id,
                is_linked: true,
                equipment_id: equipmentID,
                device_id: deviceID,
            };
            linkMultipleBreakersAPI(breakerObjOne, breakerObjTwo, setIsLoading);
        }

        // breakerLink= 2:2
        if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 2) {
            setAlertMessage(
                `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
            );
            handleUngroupAlertOpen();
            return;
        }

        // breakerLink= 1:2 && breakerLink= 2:1
        if (sourceBreakerObj?.breaker_type === 2 || targetBreakerObj?.breaker_type === 2) {
            if (panelObj?.voltage === '120/240') {
                setAlertMessage(
                    `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                );
                handleUngroupAlertOpen();
                return;
            }

            // breakerLink= 2:1
            if (sourceBreakerObj?.breaker_type === 2) {
                let parentBreakerObj = breakersList.find((record) => record?.id === sourceBreakerObj?.parent_breaker);

                const { isLinkable, uniqueList } = validateDevicesForBreaker([
                    parentBreakerObj?.device_link,
                    sourceBreakerObj?.device_link,
                    targetBreakerObj?.device_link,
                ]);

                if (!isLinkable) {
                    setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                    handleUngroupAlertOpen();
                    return;
                }

                let deviceID = '';

                if (uniqueList.length === 1) deviceID = uniqueList[0];
                if (uniqueList.length === 2) deviceID = uniqueList.find((el) => el !== '');

                const isEquipDiff = validateConfiguredEquip(parentBreakerObj, targetBreakerObj);

                if (isEquipDiff) {
                    setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                    handleUngroupAlertOpen();
                    return;
                }

                setIsLoading(true);
                setLinking(true);

                const equipmentID = getEquipmentForBreaker([parentBreakerObj, targetBreakerObj]);

                let breakerObjOne = {
                    breaker_id: parentBreakerObj?.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: '',
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjTwo = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: parentBreakerObj?.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjThree = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: parentBreakerObj?.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
                return;
            }

            // breakerLink= 1:2
            if (targetBreakerObj?.breaker_type === 2) {
                let thirdBreakerObj = breakersList.find((record) => record?.parent_breaker === targetBreakerObj?.id);

                const { isLinkable, uniqueList } = validateDevicesForBreaker([
                    sourceBreakerObj?.device_link,
                    targetBreakerObj?.device_link,
                    thirdBreakerObj?.device_link,
                ]);

                if (!isLinkable) {
                    setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                    handleUngroupAlertOpen();
                    return;
                }

                let deviceID = '';

                if (uniqueList.length === 1) deviceID = uniqueList[0];
                if (uniqueList.length === 2) deviceID = uniqueList.find((el) => el !== '');

                const isEquipDiff = validateConfiguredEquip(sourceBreakerObj, targetBreakerObj);

                if (isEquipDiff) {
                    setAlertMessage(`Breaker cannot be linked due to different Device/Equipment configuration.`);
                    handleUngroupAlertOpen();
                    return;
                }

                setIsLoading(true);
                setLinking(true);

                const equipmentID = getEquipmentForBreaker([sourceBreakerObj, targetBreakerObj]);

                let breakerObjOne = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: targetBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: '',
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjTwo = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: targetBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };

                let breakerObjThree = {
                    breaker_id: thirdBreakerObj.id,
                    rated_amps: targetBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'triple'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'triple'),
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj.id,
                    is_linked: true,
                    equipment_id: equipmentID,
                    device_id: deviceID,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
                return;
            }
        }
    };

    const unlinkBreakers = (sourceBreakerObj, targetBreakerObj, setIsLoading) => {
        if (panelObj?.voltage === '600') {
            // Parent Breaker in Triple Linking
            if (sourceBreakerObj?.parent_breaker === '') {
                let linkedBreakerObjs = breakersList.filter(
                    (record) => record?.parent_breaker === sourceBreakerObj?.id
                );
                let thirdBreakerObj = linkedBreakerObjs[1];

                let equipmentId =
                    sourceBreakerObj?.equipment_link.length === 0 ? '' : sourceBreakerObj?.equipment_link[0];

                setIsLoading(true);
                setLinking(true);

                let breakerObjOne = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: equipmentId,
                };

                let breakerObjTwo = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };

                let breakerObjThree = {
                    breaker_id: thirdBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
                return;
            }
            // Child Breaker in Triple Linking
            if (sourceBreakerObj?.parent_breaker !== '') {
                if (sourceBreakerObj?.parent_breaker !== targetBreakerObj?.parent_breaker) {
                    return;
                }
                let parentBreakerObj = breakersList.find((record) => record?.id === sourceBreakerObj?.parent_breaker);

                let equipmentId =
                    parentBreakerObj?.equipment_link.length === 0 ? '' : parentBreakerObj?.equipment_link[0];

                setIsLoading(true);
                setLinking(true);

                let breakerObjOne = {
                    breaker_id: parentBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: equipmentId,
                };

                let breakerObjTwo = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };

                let breakerObjThree = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
            }
            return;
        }
        if (sourceBreakerObj?.breaker_type === 3 && targetBreakerObj?.breaker_type === 3) {
            // Parent Breaker in Triple Linking
            if (sourceBreakerObj?.parent_breaker === '') {
                let linkedBreakerObjs = breakersList.filter(
                    (record) => record?.parent_breaker === sourceBreakerObj?.id
                );
                let thirdBreakerObj = linkedBreakerObjs[1];

                let equipmentId =
                    sourceBreakerObj?.equipment_link.length === 0 ? '' : sourceBreakerObj?.equipment_link[0];

                setIsLoading(true);
                setLinking(true);

                let breakerObjOne = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };

                let breakerObjTwo = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                    breaker_type: 2,
                    parent_breaker: '',
                    is_linked: true,
                    equipment_id: equipmentId,
                };

                let breakerObjThree = {
                    breaker_id: thirdBreakerObj.id,
                    rated_amps: sourceBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                    breaker_type: 2,
                    parent_breaker: targetBreakerObj.id,
                    is_linked: true,
                    equipment_id: equipmentId,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
                return;
            }
            // Child Breaker in Triple Linking
            if (sourceBreakerObj?.parent_breaker !== '') {
                if (sourceBreakerObj?.parent_breaker !== targetBreakerObj?.parent_breaker) {
                    return;
                }
                let parentBreakerObj = breakersList.find((record) => record?.id === sourceBreakerObj?.parent_breaker);

                let equipmentId =
                    parentBreakerObj?.equipment_link.length === 0 ? '' : parentBreakerObj?.equipment_link[0];

                setIsLoading(true);
                setLinking(true);

                let breakerObjOne = {
                    breaker_id: parentBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                    breaker_type: 2,
                    parent_breaker: '',
                    is_linked: true,
                    equipment_id: equipmentId,
                };

                let breakerObjTwo = {
                    breaker_id: sourceBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'double'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'double'),
                    breaker_type: 2,
                    parent_breaker: parentBreakerObj.id,
                    is_linked: true,
                    equipment_id: equipmentId,
                };

                let breakerObjThree = {
                    breaker_id: targetBreakerObj.id,
                    rated_amps: parentBreakerObj.rated_amps,
                    voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                    phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                    equipment_id: '',
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree, setIsLoading);
            }
        }
        if (sourceBreakerObj?.breaker_type === 2 && targetBreakerObj?.breaker_type === 2) {
            let equipmentId = sourceBreakerObj?.equipment_link.length === 0 ? '' : sourceBreakerObj?.equipment_link[0];

            setIsLoading(true);
            setLinking(true);

            let breakerObjOne = {
                breaker_id: sourceBreakerObj.id,
                rated_amps: sourceBreakerObj.rated_amps
                    ? sourceBreakerObj.rated_amps
                    : targetBreakerObj.rated_amps
                    ? targetBreakerObj.rated_amps
                    : 0,
                voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                breaker_type: 1,
                parent_breaker: '',
                is_linked: false,
                equipment_id: equipmentId,
            };
            let breakerObjTwo = {
                breaker_id: targetBreakerObj.id,
                rated_amps: sourceBreakerObj.rated_amps
                    ? sourceBreakerObj.rated_amps
                    : targetBreakerObj.rated_amps
                    ? targetBreakerObj.rated_amps
                    : 0,
                voltage: getVoltageConfigValue(panelObj?.voltage, 'single'),
                phase_configuration: getPhaseConfigValue(panelObj?.voltage, 'single'),
                breaker_type: 1,
                parent_breaker: '',
                is_linked: false,
                equipment_id: '',
            };
            linkMultipleBreakersAPI(breakerObjOne, breakerObjTwo, setIsLoading);
            return;
        }
    };

    const handleBreakerLinkClicked = (breakerLinkObj, setIsLoading, is_linking) => {
        if (is_linking) return;

        const sourceBreakerObj = breakersList.find((el) => el?.id === breakerLinkObj?.source);
        const targetBreakerObj = breakersList.find((el) => el?.id === breakerLinkObj?.target);

        // linked - linked => user is trying to unlink 2 breakers
        if (sourceBreakerObj?.is_linked && targetBreakerObj?.is_linked) {
            if (
                !(
                    targetBreakerObj?.parent_breaker === sourceBreakerObj?.id ||
                    sourceBreakerObj?.parent_breaker === targetBreakerObj?.parent_breaker
                )
            ) {
                setAlertMessage(
                    `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                );
                handleUngroupAlertOpen();
                return;
            }
            unlinkBreakers(sourceBreakerObj, targetBreakerObj, setIsLoading);
        }

        // not linked - not linked => user is trying to link 2 breakers
        if (!sourceBreakerObj?.is_linked && !targetBreakerObj?.is_linked) {
            linkBreakers(sourceBreakerObj, targetBreakerObj, setIsLoading);
        }

        // linked - not linked && not-linked - linked
        if (!sourceBreakerObj?.is_linked && targetBreakerObj?.is_linked) {
            if (targetBreakerObj?.breaker_type !== 2 || panelObj?.voltage === '120/240') {
                setAlertMessage(
                    `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                );
                handleUngroupAlertOpen();
                return;
            }
            linkBreakers(sourceBreakerObj, targetBreakerObj, setIsLoading);
        }

        if (sourceBreakerObj?.is_linked && !targetBreakerObj?.is_linked) {
            if (sourceBreakerObj?.breaker_type !== 2 || panelObj?.voltage === '120/240') {
                setAlertMessage(
                    `Breaker ${sourceBreakerObj?.breaker_number} & Breaker ${targetBreakerObj?.breaker_number} cannot be linked!`
                );
                handleUngroupAlertOpen();
                return;
            }
            linkBreakers(sourceBreakerObj, targetBreakerObj, setIsLoading);
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

                // Apms set as undefined to restricts Amps reading to be displayed if its 0A
                response.forEach((record) => {
                    if (record?.type === '') record.type = 'equipment';
                    record.config_type = fetchBreakerType(record);
                    record.status = fetchBreakerStatus(record);
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
                <div>
                    <Typography.Header size={Typography.Sizes.lg}>Edit Panel</Typography.Header>
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
                        handleBreakerLinkClicked(props, setIsLoading, isLinking);
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
