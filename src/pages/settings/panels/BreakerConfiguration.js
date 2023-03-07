import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { BreakersStore } from '../../../store/BreakersStore';
import { BuildingStore } from '../../../store/BuildingStore';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import UnlinkBreaker from './UnlinkBreaker';
import {
    createEquipmentData,
    getBreakerDeleted,
    getPassiveDeviceList,
    getSensorsList,
    resetAllBreakers,
    updateBreakerDetails,
    updateBreakersTypeLink,
} from './services';
import DeleteBreaker from './DeleteBreaker';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Tabs from '../../../sharedComponents/tabs/Tabs';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plusBlue.svg';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as UnlinkOldSVG } from '../../../assets/icon/panels/unlink_old.svg';
import Radio from '../../../sharedComponents/form/radio/Radio';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';
import {
    comparePanelData,
    compareSensorsCount,
    getBreakerType,
    getPhaseConfigValue,
    getVoltageConfigValue,
} from './utils';
import Select from '../../../sharedComponents/form/select';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Notification } from '../../../sharedComponents/notification/Notification';
import { useNotification } from '../../../sharedComponents/notification/useNotification';
import { getMetadataRequest } from '../../../services/equipment';
import { UserStore } from '../../../store/UserStore';
import useDebounce from '../../../sharedComponents/hooks/useDebounce';
import UnlabelEquipAlert from './UnlabelEquipAlert';
import './breaker-config-styles.scss';
import ReassignAlert from './ReassignAlert';

const BreakerConfiguration = ({
    showBreakerConfigModal,
    openBreakerConfigModal,
    closeBreakerConfigModal,
    selectedBreakerObj,
    setSelectedBreakerObj,
    panelObj,
    equipmentsList,
    passiveDevicesList,
    setBreakerAPITrigerred,
    fetchEquipmentData,
    isEquipmentListFetching,
    activeTab,
    setActiveTab,
    isEditingMode,
}) => {
    const [activeEquipTab, setActiveEquipTab] = useState('equip');

    const breakersList = BreakersStore.useState((s) => s.breakersList);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const defaultErrorObj = {
        rated_amps: null,
    };

    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [parentBreakerObj, setParentBreakerObj] = useState({});
    const [firstBreakerObj, setFirstBreakerObj] = useState({});

    const [secondBreakerObjOld, setSecondBreakerObjOld] = useState({});
    const [secondBreakerObj, setSecondBreakerObj] = useState({});

    const [thirdBreakerObjOld, setThirdBreakerObjOld] = useState({});
    const [thirdBreakerObj, setThirdBreakerObj] = useState({});

    const [selectedEquipment, setSelectedEquipment] = useState('');

    const [firstDeviceSearch, setFirstDeviceSearch] = useState('');
    const [secondDeviceSearch, setSecondDeviceSearch] = useState('');
    const [thirdDeviceSearch, setThirdDeviceSearch] = useState('');

    const debouncedFirstSearch = useDebounce(firstDeviceSearch, 500);
    const debouncedSecondSearch = useDebounce(secondDeviceSearch, 500);
    const debouncedThirdSearch = useDebounce(thirdDeviceSearch, 500);

    const [passiveDevicesListOne, setFirstPassiveDevicesList] = useState([]);
    const [passiveDevicesListTwo, setSecondPassiveDevicesList] = useState([]);
    const [passiveDevicesListThree, setThirdPassiveDevicesList] = useState([]);

    const [firstSensorList, setFirstSensorList] = useState([]);
    const [secondSensorList, setSecondSensorList] = useState([]);
    const [thirdSensorList, setThirdSensorList] = useState([]);

    // Unlink Alert Modal
    const [showUnlinkAlert, setShowUnlinkAlert] = useState(false);
    const handleUnlinkAlertClose = () => setShowUnlinkAlert(false);
    const handleUnlinkAlertShow = () => setShowUnlinkAlert(true);

    // Delete Alert Modal
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleDeleteAlertClose = () => setShowDeleteAlert(false);
    const handleDeleteAlertShow = () => setShowDeleteAlert(true);

    // Unlabeled Equip Alert Modal
    const [showUnlabeledAlert, setUnlabeledAlert] = useState(false);
    const closeUnlabelAlertModal = () => setUnlabeledAlert(false);
    const openUnlabelAlertModal = () => setUnlabeledAlert(true);

    // Reassign Alert Modal
    const [showReassignAlert, setReassignAlert] = useState(false);
    const closeReassignAlert = () => setReassignAlert(false);
    const openReassignAlert = () => setReassignAlert(true);

    const [isResetting, setIsResetting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [existingEquipId, setExistingEquipId] = useState('');

    const [currentEquipObj, setCurrentEquipObj] = useState({});
    const [newEquipObj, setNewEquipObj] = useState({});

    const defaultEquipmentObj = {
        name: '',
        equipment_type: '',
        end_use: '',
        space_id: '',
        quantity: '1',
    };

    const defaultErrors = {
        name: null,
        equipment_type: null,
        end_use: null,
        quantity: null,
    };

    const [openSnackbar] = useNotification();

    const [equipmentObj, setEquipmentObj] = useState(defaultEquipmentObj);
    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [isAdding, setAdding] = useState(false);
    const [equipmentErrors, setEquipmentErrors] = useState(defaultErrors);

    const handleCreateEquipChange = (key, value) => {
        let obj = Object.assign({}, equipmentObj);

        if (key === 'name' || key === 'quantity') setEquipmentErrors({ ...equipmentErrors, [key]: null });
        if (key === 'end_use' || key === 'equipment_type') setEquipmentErrors({ ...equipmentErrors, [key]: null });

        if (key === 'equipment_type') {
            let equipTypeObj = equipmentTypeData.find((el) => el.value === value);
            obj['end_use'] = equipTypeObj?.end_use_id;
            let errorObj = Object.assign({}, equipmentErrors);
            errorObj.equipment_type = null;
            errorObj.end_use = null;
            setEquipmentErrors(errorObj);
        }
        obj[key] = value;
        setEquipmentObj(obj);
    };

    const addEquipment = async () => {
        let alertObj = Object.assign({}, equipmentErrors);

        if ((equipmentObj?.name.trim()).length === 0) alertObj.name = 'Please enter equipment name';
        if (equipmentObj?.equipment_type.length === 0)
            alertObj.equipment_type = { text: 'Please select equipment type' };
        if (equipmentObj?.end_use.length === 0) alertObj.end_use = { text: 'Please select end use category' };
        if (equipmentObj?.quantity === '') alertObj.quantity = 'Please enter quantity';

        setEquipmentErrors(alertObj);

        if (!alertObj.name && !alertObj.equipment_type && !alertObj.end_use && !alertObj.quantity) {
            setAdding(true);
            let obj = Object.assign({}, equipmentObj);
            obj.building_id = bldgId;
            const params = `?quantity=${obj.quantity}`;
            delete obj.quantity;

            await createEquipmentData(params, obj)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        fetchEquipmentData(bldgId);
                        if (response?.id) {
                            setSelectedEquipment(response?.id);
                            setNewEquipObj({
                                id: response?.id,
                                name: obj?.name,
                            });
                        }
                        openSnackbar({
                            title: 'Equipment created successfully.',
                            type: Notification.Types.success,
                            duration: 5000,
                        });

                        setActiveEquipTab('equip');
                        handleChange('equipment_link', response?.id);
                        setEquipmentObj(defaultEquipmentObj);
                    } else {
                        openSnackbar({
                            title: response?.message
                                ? response?.message
                                : res
                                ? 'Unable to create equipment.'
                                : 'Unable to create equipment due to Internal Server Error!.',
                            type: Notification.Types.error,
                        });
                    }
                    setAdding(false);
                })
                .catch((e) => {
                    setAdding(false);
                    setEquipmentErrors(defaultErrors);
                });
        }
    };

    const closeModalWithoutSave = () => {
        closeBreakerConfigModal();
        setParentBreakerObj({});
        setFirstBreakerObj({});
        setSecondBreakerObj({});
        setThirdBreakerObj({});
        setSelectedEquipment('');
        setFirstSensorList([]);
        setSecondSensorList([]);
        setThirdSensorList([]);
        setActiveTab('edit-breaker');
        setActiveEquipTab('equip');
        setSelectedBreakerObj({});
        setEquipmentObj(defaultEquipmentObj);
        setEquipmentErrors(defaultErrors);
        setExistingEquipId('');
        setCurrentEquipObj({});
        setNewEquipObj({});
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, firstBreakerObj);
        obj[key] = value;
        setFirstBreakerObj(obj);
        if (key === 'equipment_link') {
            if (value === '') setNewEquipObj({});
            if (equipmentsList.length !== 0 && value !== '') {
                let equipObj = equipmentsList.find((record) => record?.value === value);
                if (equipObj?.value) setNewEquipObj({ id: equipObj?.value, name: equipObj?.label });
            }
        }
    };

    const handleBreakerConfigChange = (key, value, breakerLvl) => {
        if (breakerLvl === 'first') {
            let obj = Object.assign({}, firstBreakerObj);
            if (key === 'device_link') {
                if (obj?.breaker_type === 1) {
                    fetchSensorsList(value, 'first');
                }
                if (obj?.breaker_type === 2) {
                    let obj = Object.assign({}, secondBreakerObj);
                    obj['device_link'] = value;
                    setSecondBreakerObj(obj);
                    fetchSensorsList(value, 'first-second');
                }
                if (obj?.breaker_type === 3) {
                    let objTwo = Object.assign({}, secondBreakerObj);
                    let objThree = Object.assign({}, thirdBreakerObj);
                    objTwo['device_link'] = value;
                    objThree['device_link'] = value;
                    setSecondBreakerObj(objTwo);
                    setThirdBreakerObj(objThree);
                    fetchSensorsList(value, 'all');
                }
            }
            obj[key] = value;
            setFirstBreakerObj(obj);
        }
        if (breakerLvl === 'second') {
            let obj = Object.assign({}, secondBreakerObj);
            obj[key] = value;
            setSecondBreakerObj(obj);
            if (key === 'device_link') fetchSensorsList(value, 'second');
        }
        if (breakerLvl === 'third') {
            let obj = Object.assign({}, thirdBreakerObj);
            obj[key] = value;
            setThirdBreakerObj(obj);
            if (key === 'device_link') fetchSensorsList(value, 'third');
        }
    };

    const validateUnlabledChange = () => {
        if (equipmentsList.length === 0) {
            saveBreakersDetails();
            return;
        }
        const equipment = equipmentsList.find((record) => (record?.label).toLowerCase() === 'unlabeled');
        if (equipment?.value) {
            setExistingEquipId(equipment?.value);
            closeBreakerConfigModal();
            openUnlabelAlertModal();
        } else {
            saveBreakersDetails();
        }
    };

    const handleBreakerTypeChange = (key, defaultBreakerType, newBreakerType) => {
        let obj = Object.assign({}, firstBreakerObj);

        // Type 1
        if (newBreakerType === 'equipment') {
            obj.rated_amps = parentBreakerObj?.rated_amps;
            obj.voltage = parentBreakerObj?.voltage;
            obj.phase_configuration = parentBreakerObj?.phase_configuration;
            if (defaultBreakerType === 'blank') {
                obj.rated_amps = 0;
                obj.voltage = getVoltageConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
                obj.phase_configuration = getPhaseConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
            }
            if (defaultBreakerType === 'unlabeled') {
                obj.equipment_link = [];
                setSelectedEquipment('');
                setNewEquipObj({});
            }
            if (defaultBreakerType === 'equipment' && parentBreakerObj?.equipment_link !== 0) {
                obj.equipment_link = parentBreakerObj?.equipment_link;
                setSelectedEquipment(parentBreakerObj?.equipment_link[0]);
            }
        }

        // Type 2
        if (newBreakerType === 'unlabeled') {
            setSelectedEquipment('');
            handleChange('equipment_link', '');
            obj.rated_amps = parentBreakerObj?.rated_amps;
            obj.voltage = parentBreakerObj?.voltage;
            obj.phase_configuration = parentBreakerObj?.phase_configuration;

            if (defaultBreakerType === 'blank') {
                obj.rated_amps = 0;
                obj.voltage = getVoltageConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
                obj.phase_configuration = getPhaseConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
            }
        }

        // Type 3 & Type 4
        if (newBreakerType === 'unwired' || newBreakerType === 'blank') {
            // For Single Breaker Config OR Parent Breaker
            obj.device_link = '';
            obj.sensor_link = '';
            obj.equipment_links = [];
            obj.rated_amps = parentBreakerObj?.rated_amps;
            obj.voltage = parentBreakerObj?.voltage;
            obj.phase_configuration = parentBreakerObj?.phase_configuration;
            if (defaultBreakerType === 'blank' && newBreakerType === 'unwired') {
                obj.rated_amps = 0;
                obj.voltage = getVoltageConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
                obj.phase_configuration = getPhaseConfigValue(panelObj?.voltage, getBreakerType(obj?.breaker_type));
            }
            if (newBreakerType === 'blank') {
                obj.rated_amps = null;
                obj.phase_configuration = null;
                obj.voltage = null;
            }
            setFirstSensorList([]);

            // For Double Breaker
            if (obj?.breaker_type === 2 && obj?.is_linked) {
                let objTwo = Object.assign({}, secondBreakerObj);
                objTwo[key] = newBreakerType;
                objTwo.device_link = '';
                objTwo.sensor_link = '';
                objTwo.equipment_links = [];
                if (newBreakerType === 'blank') {
                    objTwo.rated_amps = null;
                    objTwo.voltage = null;
                }
                setSecondBreakerObj(objTwo);
                setSecondSensorList([]);
            }

            // For Triple Breaker
            if (obj?.breaker_type === 3 && obj?.is_linked) {
                let objTwo = Object.assign({}, secondBreakerObj);
                let objThree = Object.assign({}, thirdBreakerObj);
                objTwo[key] = newBreakerType;
                objThree[key] = newBreakerType;
                objTwo.device_link = '';
                objTwo.sensor_link = '';
                objTwo.equipment_links = [];
                objThree.device_link = '';
                objThree.sensor_link = '';
                objThree.equipment_links = [];
                if (newBreakerType === 'blank') {
                    objTwo.rated_amps = null;
                    objTwo.voltage = null;
                    objThree.rated_amps = null;
                    objThree.voltage = null;
                }
                setSecondBreakerObj(objTwo);
                setThirdBreakerObj(objThree);
                setSecondSensorList([]);
                setThirdSensorList([]);
            }
        }

        obj[key] = newBreakerType;
        setFirstBreakerObj(obj);
    };

    const handleSensorChange = (previousSensorId, newSensorId) => {
        if (firstSensorList.length !== 0) {
            let sensorListOne = firstSensorList;
            sensorListOne.forEach((record) => {
                if (record?.id === previousSensorId) record.isDisabled = false;
                if (record?.id === newSensorId) record.isDisabled = true;
            });
            sensorListOne.sort((a, b) => {
                if (!a.isDisabled && b.isDisabled) {
                    return -1;
                } else if (a.isDisabled && !b.isDisabled) {
                    return 1;
                } else {
                    return b.label - a.label;
                }
            });
            setFirstSensorList(sensorListOne);
        }
        if (secondSensorList.length !== 0) {
            let sensorListTwo = secondSensorList;
            sensorListTwo.forEach((record) => {
                if (record?.id === previousSensorId) record.isDisabled = false;
                if (record?.id === newSensorId) record.isDisabled = true;
            });
            sensorListTwo.sort((a, b) => {
                if (!a.isDisabled && b.isDisabled) {
                    return -1;
                } else if (a.isDisabled && !b.isDisabled) {
                    return 1;
                } else {
                    return b.label - a.label;
                }
            });
            setSecondSensorList(sensorListTwo);
        }
        if (thirdSensorList.length !== 0) {
            let sensorListThree = thirdSensorList;
            sensorListThree.forEach((record) => {
                if (record?.id === previousSensorId) record.isDisabled = false;
                if (record?.id === newSensorId) record.isDisabled = true;
            });
            sensorListThree.sort((a, b) => {
                if (!a.isDisabled && b.isDisabled) {
                    return -1;
                } else if (a.isDisabled && !b.isDisabled) {
                    return 1;
                } else {
                    return b.label - a.label;
                }
            });
            setThirdSensorList(sensorListThree);
        }
    };

    const unLinkCurrentBreaker = async () => {
        setIsResetting(true);

        const breakersList = [];
        const params = `?building_id=${bldgId}`;

        if (firstBreakerObj?.id) breakersList.push(firstBreakerObj?.id);
        if (secondBreakerObj?.id) breakersList.push(secondBreakerObj?.id);
        if (thirdBreakerObj?.id) breakersList.push(thirdBreakerObj?.id);

        const payload = { breaker_id: breakersList };

        await resetAllBreakers(params, payload)
            .then((res) => {
                setIsResetting(false);
                window.scrollTo(0, 0);
                handleUnlinkAlertClose();
                closeModalWithoutSave();
                setBreakerAPITrigerred(true);
            })
            .catch(() => {
                setIsResetting(false);
            });
    };

    const deleteCurrentBreaker = async () => {
        setIsDeleting(true);
        const params = `?breaker_id=${firstBreakerObj?.id}`;
        await getBreakerDeleted(params)
            .then((res) => {
                setIsDeleting(false);
                const response = res;
                handleDeleteAlertClose();

                if (response?.status === 200) {
                    closeModalWithoutSave();
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Breaker deleted successfully.';
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
                            ? 'Unable to delete Breaker.'
                            : 'Unable to delete Breaker due to Internal Server Error.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                setIsDeleting(false);
            });
    };

    const saveBreakersDetails = async (update_type) => {
        let alertObj = Object.assign({}, errorObj);
        if (firstBreakerObj?.rated_amps === '' && firstBreakerObj?.type !== 'blank')
            alertObj.rated_amps = 'Please enter Amps';
        if (firstBreakerObj?.rated_amps % 5 !== 0 && firstBreakerObj?.type !== 'blank')
            alertObj.rated_amps = 'Amps must be in increments of 5';
        setErrorObj(alertObj);

        if (alertObj.rated_amps) return;

        setIsProcessing(true);

        let breakerTypeObj = {};

        let params = `?building_id=${bldgId}`;

        if (update_type === 'forceSave') params = params.concat(`&force_save=true`);

        const breakersList = [];

        let breakerObjOne = { breaker_id: firstBreakerObj?.id };
        let breakerObjTwo = { breaker_id: secondBreakerObj?.id };
        let breakerObjThree = { breaker_id: thirdBreakerObj?.id };

        if (firstBreakerObj?.rated_amps !== parentBreakerObj?.rated_amps) {
            breakerObjOne.rated_amps = firstBreakerObj?.rated_amps;
            if (breakerObjTwo?.breaker_id) breakerObjTwo.rated_amps = firstBreakerObj?.rated_amps;
            if (breakerObjThree?.breaker_id) breakerObjThree.rated_amps = firstBreakerObj?.rated_amps;
        }

        if (firstBreakerObj?.voltage !== parentBreakerObj?.voltage) {
            breakerObjOne.voltage = firstBreakerObj?.voltage;
            if (breakerObjTwo?.breaker_id) breakerObjTwo.voltage = firstBreakerObj?.voltage;
            if (breakerObjThree?.breaker_id) breakerObjThree.voltage = firstBreakerObj?.voltage;
        }

        if (firstBreakerObj?.phase_configuration !== parentBreakerObj?.phase_configuration) {
            breakerObjOne.phase_configuration = firstBreakerObj?.phase_configuration;
            if (breakerObjTwo?.breaker_id) breakerObjTwo.phase_configuration = firstBreakerObj?.phase_configuration;
            if (breakerObjThree?.breaker_id) breakerObjThree.phase_configuration = firstBreakerObj?.phase_configuration;
        }

        let equipLink;

        // Equip TO No-Equip attached
        if (currentEquipObj?.id && !newEquipObj?.id) equipLink = [];

        // No-Equip TO Equip attached
        if (!currentEquipObj?.id && newEquipObj?.id) equipLink = [newEquipObj?.id];

        // Equip Changed
        if (currentEquipObj?.id && newEquipObj?.id) equipLink = [newEquipObj?.id];

        breakerObjOne.equipment_link = equipLink;
        if (breakerObjTwo?.breaker_id) breakerObjTwo.equipment_link = equipLink;
        if (breakerObjThree?.breaker_id) breakerObjThree.equipment_link = equipLink;

        if (firstBreakerObj?.device_link !== parentBreakerObj?.device_link) {
            breakerObjOne.device_link = firstBreakerObj?.device_link;
        }

        if (firstBreakerObj?.sensor_link !== parentBreakerObj?.sensor_link) {
            breakerObjOne.sensor_link = firstBreakerObj?.sensor_link;
            breakerObjOne.device_link = firstBreakerObj?.device_link;
        }

        if (secondBreakerObj?.device_link !== secondBreakerObjOld?.device_link) {
            breakerObjTwo.device_link = secondBreakerObj?.device_link;
        }

        if (secondBreakerObj?.sensor_link !== secondBreakerObjOld?.sensor_link) {
            breakerObjTwo.sensor_link = secondBreakerObj?.sensor_link;
            breakerObjTwo.device_link = secondBreakerObj?.device_link;
        }

        if (thirdBreakerObj?.device_link !== thirdBreakerObjOld?.device_link) {
            breakerObjThree.device_link = thirdBreakerObj?.device_link;
        }

        if (thirdBreakerObj?.sensor_link !== thirdBreakerObjOld?.sensor_link) {
            breakerObjThree.sensor_link = thirdBreakerObj?.sensor_link;
            breakerObjThree.device_link = thirdBreakerObj?.device_link;
        }

        breakersList.push(breakerObjOne);
        if (breakerObjTwo?.breaker_id) breakersList.push(breakerObjTwo);
        if (breakerObjThree?.breaker_id) breakersList.push(breakerObjThree);

        let breakerTypeUpdateList = [];

        if (firstBreakerObj?.type !== parentBreakerObj?.type) {
            breakerTypeObj.type = firstBreakerObj?.type;
        }

        if (firstBreakerObj?.notes !== parentBreakerObj?.notes) {
            breakerTypeObj.notes = firstBreakerObj?.notes ? firstBreakerObj?.notes : '';
        }

        breakerTypeUpdateList.push(firstBreakerObj?.id);

        if (firstBreakerObj?.breaker_type === 2) breakerTypeUpdateList.push(secondBreakerObj?.id);

        if (firstBreakerObj?.breaker_type === 3) {
            breakerTypeUpdateList.push(secondBreakerObj?.id);
            breakerTypeUpdateList.push(thirdBreakerObj?.id);
        }

        breakerTypeObj.breaker_id = breakerTypeUpdateList;

        const promisesList = [];

        if (!(breakerTypeObj?.type === 'blank' || breakerTypeObj?.type === 'unwired')) {
            const promiseOne = updateBreakerDetails(params, breakersList);
            promisesList.push(promiseOne);
        }

        if (breakerTypeObj?.notes || breakerTypeObj?.type || breakerTypeObj?.type === 'equipment') {
            let params = '';
            if (update_type === 'forceUpdate') {
                params = `?force_save=true`;
                if (existingEquipId !== '') breakerTypeObj.equipment_id = existingEquipId;
            }
            const promiseTwo = updateBreakersTypeLink(breakerTypeObj, params);
            promisesList.push(promiseTwo);
        }

        Promise.all(promisesList)
            .then((res) => {
                const response = res;
                if (
                    (response.length === 1 && response[0]?.status === 200) ||
                    (response.length === 2 && response[0]?.status === 200 && response[1]?.status === 200)
                ) {
                    closeModalWithoutSave();
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Breaker configuration updated successfully.';
                        s.notificationType = 'success';
                    });
                    setIsProcessing(false);
                    window.scrollTo(0, 0);
                    setBreakerAPITrigerred(true);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Unable to update Breaker configuration.';
                        s.notificationType = 'error';
                    });
                    setIsProcessing(false);
                }
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    const onSaveButonClick = () => {
        if (parentBreakerObj?.type !== 'unlabeled' && firstBreakerObj?.type === 'unlabeled') {
            validateUnlabledChange();
            return;
        }
        if (currentEquipObj?.id && newEquipObj?.id && currentEquipObj?.id !== newEquipObj?.id) {
            closeBreakerConfigModal();
            openReassignAlert();
            return;
        }
        saveBreakersDetails();
    };

    const fetchSensorsList = async (deviceId, breakerLvl) => {
        if (deviceId === null || deviceId === undefined || deviceId === '') return;

        const params = `?device_id=${deviceId}&building_id=${bldgId}`;

        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;

                let linkedSensor = [];
                let unlinkedSensor = [];

                if (response.length !== 0) {
                    response.forEach((record) => {
                        record.label = record?.name;
                        record.value = record?.id;
                        record.isDisabled = record?.breaker_id !== '';
                        record?.breaker_id !== '' ? linkedSensor.push(record) : unlinkedSensor.push(record);
                    });
                }

                if (breakerLvl === 'first' || breakerLvl === 'first-second' || breakerLvl === 'all')
                    setFirstSensorList(unlinkedSensor.concat(linkedSensor));

                if (breakerLvl === 'second' || breakerLvl === 'first-second' || breakerLvl === 'all')
                    setSecondSensorList(unlinkedSensor.concat(linkedSensor));

                if (breakerLvl === 'third' || breakerLvl === 'all')
                    setThirdSensorList(unlinkedSensor.concat(linkedSensor));
            })
            .catch(() => {});
    };

    const fetchMetadata = async () => {
        await getMetadataRequest(bldgId)
            .then((res) => {
                const { end_uses, equipment_type, location } = res?.data;
                location.forEach((record) => {
                    record.label = record?.location_name;
                    record.value = record?.location_id;
                });
                equipment_type.forEach((record) => {
                    record.label = `${record?.equipment_type} (${record?.end_use_name})`;
                    record.value = record?.equipment_id;
                });
                end_uses.forEach((record) => {
                    record.label = record?.name;
                    record.value = record?.end_use_id;
                });
                setEndUseData(end_uses);
                setLocationData(location);
                setEquipmentTypeData(equipment_type);
            })
            .catch((e) => {
                setEndUseData([]);
                setLocationData([]);
                setEquipmentTypeData([]);
            });
    };

    const fetchPassiveDeviceList = async (bldg_id, device_search, type) => {
        let params = `?building_id=${bldg_id}&page_no=1&page_size=150`;
        if (device_search && device_search !== 'default-list')
            params = params.concat(`&device_search=${device_search}`);

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

                if (type === 'first') setFirstPassiveDevicesList(newArray);
                if (type === 'second') setSecondPassiveDevicesList(newArray);
                if (type === 'third') setThirdPassiveDevicesList(newArray);
            })
            .catch(() => {
                if (type === 'first') setFirstPassiveDevicesList([]);
                if (type === 'second') setSecondPassiveDevicesList([]);
                if (type === 'third') setThirdPassiveDevicesList([]);
            });
    };

    useEffect(() => {
        if (!selectedBreakerObj?.id) return;

        const breakerObj = Object.assign({}, selectedBreakerObj);
        if (breakerObj?.rated_amps === undefined && breakerObj?.type !== 'blank') breakerObj.rated_amps = '0';

        setFirstBreakerObj(breakerObj);
        setParentBreakerObj(breakerObj); // Added to track for any configuration change

        if (breakerObj?.equipment_link) setSelectedEquipment(breakerObj?.equipment_link[0]);
        if (breakerObj?.equipment_links.length !== 0) setCurrentEquipObj(breakerObj?.equipment_links[0]);

        // Conditions to check if Sensors List is required to be fetched
        // For Breaker Type 1
        if (breakerObj?.breaker_type === 1 && breakerObj?.device_link !== '') {
            fetchSensorsList(breakerObj?.device_link, 'first');
            return;
        }

        // For Breaker Type 2
        if (breakerObj?.breaker_type === 2) {
            let obj = breakersList.find((el) => el?.parent_breaker === breakerObj?.id);
            setSecondBreakerObj(obj);
            setSecondBreakerObjOld(obj); // Added to track for any configuration change

            if (breakerObj?.device_link === '' && obj?.device_link === '') return;

            if (breakerObj?.device_link === obj?.device_link) {
                fetchSensorsList(breakerObj?.device_link, 'first-second');
            } else {
                fetchSensorsList(breakerObj?.device_link, 'first');
                fetchSensorsList(obj?.device_link, 'second');
            }
        }

        // For Breaker Type 3
        if (breakerObj?.breaker_type === 3) {
            let childbreakers = breakersList.filter((el) => el?.parent_breaker === breakerObj?.id);
            setSecondBreakerObj(childbreakers[0]);
            setSecondBreakerObjOld(childbreakers[0]); // Added to track for any configuration change
            setThirdBreakerObj(childbreakers[1]);
            setThirdBreakerObjOld(childbreakers[1]); // Added to track for any configuration change

            if (
                breakerObj?.device_link === '' &&
                childbreakers[0]?.device_link === '' &&
                childbreakers[1]?.device_link === ''
            ) {
                return;
            }

            if (
                breakerObj?.device_link === childbreakers[0]?.device_link &&
                breakerObj?.device_link === childbreakers[1]?.device_link
            ) {
                fetchSensorsList(breakerObj?.device_link, 'all');
            } else {
                if (breakerObj?.device_link !== '') fetchSensorsList(breakerObj?.device_link, 'first');
                if (childbreakers[0]?.device_link) fetchSensorsList(childbreakers[0]?.device_link, 'second');
                if (childbreakers[1]?.device_link !== '') fetchSensorsList(childbreakers[1]?.device_link, 'third');
            }
        }
    }, [selectedBreakerObj]);

    useEffect(() => {
        if (activeEquipTab === 'create-equip') fetchMetadata();
    }, [activeEquipTab]);

    useEffect(() => {
        if (showBreakerConfigModal) fetchPassiveDeviceList(bldgId, debouncedFirstSearch, 'first');
    }, [debouncedFirstSearch]);

    useEffect(() => {
        if (showBreakerConfigModal) fetchPassiveDeviceList(bldgId, debouncedSecondSearch, 'second');
    }, [debouncedSecondSearch]);

    useEffect(() => {
        if (showBreakerConfigModal) fetchPassiveDeviceList(bldgId, debouncedThirdSearch, 'third');
    }, [debouncedThirdSearch]);

    useEffect(() => {
        const newList = passiveDevicesList;
        setFirstPassiveDevicesList(newList);
        setSecondPassiveDevicesList(newList);
        setThirdPassiveDevicesList(newList);
    }, [passiveDevicesList]);

    return (
        <React.Fragment>
            <Modal
                show={showBreakerConfigModal}
                onHide={closeModalWithoutSave}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}
                dialogClassName={showUnlabeledAlert || showReassignAlert ? 'child-modal-style' : ''}>
                <div>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm}>
                                {panelObj?.panel_name}
                                {firstBreakerObj?.device_name === '' ? '' : `> ${firstBreakerObj?.device_name}`}
                            </Typography.Subheader>
                            <Typography.Header size={Typography.Sizes.md}>
                                {firstBreakerObj?.breaker_type === 1 && `Breaker ${firstBreakerObj?.breaker_number}`}
                                {firstBreakerObj?.breaker_type === 2 &&
                                    `Breakers ${firstBreakerObj?.breaker_number}, ${secondBreakerObj?.breaker_number}`}
                                {firstBreakerObj?.breaker_type === 3 &&
                                    `Breakers ${firstBreakerObj?.breaker_number}, ${secondBreakerObj?.breaker_number}, ${thirdBreakerObj?.breaker_number}`}
                            </Typography.Header>
                            <div className="d-flex justify-content-start mouse-pointer ">
                                {isEditingMode && (
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        className={`typography-wrapper mr-4 ${
                                            activeTab === 'edit-breaker' ? 'active-tab-style' : ''
                                        }`}
                                        onClick={() => setActiveTab('edit-breaker')}>
                                        {`Edit Breaker${firstBreakerObj?.breaker_type !== 1 ? `(s)` : ''}`}
                                    </Typography.Subheader>
                                )}
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper ${
                                        activeTab === 'metrics' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('metrics')}>
                                    {`Metrics`}
                                </Typography.Subheader>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={closeModalWithoutSave}
                                />
                            </div>

                            <div>
                                <Button
                                    label={isProcessing ? 'Saving...' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={onSaveButonClick}
                                    className="ml-2"
                                    disabled={comparePanelData(firstBreakerObj, parentBreakerObj) || isProcessing}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-default">
                        {/* Edit Breakers */}
                        {activeTab === 'edit-breaker' && (
                            <>
                                <div className="breaker-basic-config">
                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Phase</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        {firstBreakerObj?.phase_configuration ? (
                                            <InputTooltip
                                                type="number"
                                                placeholder="Enter Phase"
                                                labelSize={Typography.Sizes.md}
                                                value={firstBreakerObj?.phase_configuration}
                                                disabled
                                            />
                                        ) : (
                                            <Select placeholder="Enter Phase" isDisabled={true} />
                                        )}
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Rated Amps</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        {firstBreakerObj?.type !== 'blank' ? (
                                            <InputTooltip
                                                type="number"
                                                placeholder="Enter Amperage"
                                                labelSize={Typography.Sizes.md}
                                                min={0}
                                                step={5}
                                                value={firstBreakerObj?.rated_amps}
                                                onChange={(e) => {
                                                    handleChange('rated_amps', +e.target.value);
                                                    setErrorObj({ ...errorObj, ['rated_amps']: null });
                                                }}
                                                disabled={firstBreakerObj?.type === 'blank'}
                                                error={errorObj?.rated_amps}
                                            />
                                        ) : (
                                            <Select placeholder="Enter Amperage" isDisabled={true} />
                                        )}
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        {firstBreakerObj?.voltage ? (
                                            <InputTooltip
                                                type="number"
                                                placeholder="Enter Voltage"
                                                labelSize={Typography.Sizes.md}
                                                value={firstBreakerObj?.voltage}
                                                disabled
                                            />
                                        ) : (
                                            <Select placeholder="Enter Voltage" isDisabled={true} />
                                        )}
                                    </div>
                                </div>

                                <Brick sizeInRem={1} />
                                <hr />
                                <Brick sizeInRem={1} />

                                <div className="breaker-main-config">
                                    <div className="w-100">
                                        <Tabs
                                            type={Tabs.Types.subsection}
                                            tabClassName="p-2"
                                            activeKey={activeEquipTab}
                                            onSelect={(e) => {
                                                setActiveEquipTab(e);
                                            }}>
                                            <Tabs.Item eventKey="equip" title="Equipment">
                                                <div className="p-default">
                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio
                                                                    name="radio-1"
                                                                    checked={firstBreakerObj?.type === 'equipment'}
                                                                    onClick={(e) => {
                                                                        if (firstBreakerObj?.type === 'equipment')
                                                                            return;
                                                                        handleBreakerTypeChange(
                                                                            'type',
                                                                            parentBreakerObj?.type,
                                                                            ''
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="w-100">
                                                                {isEquipmentListFetching ? (
                                                                    <Skeleton count={1} height={35} />
                                                                ) : (
                                                                    <Select
                                                                        id="exampleSelect"
                                                                        placeholder="Select Equipment"
                                                                        name="select"
                                                                        isSearchable={true}
                                                                        options={equipmentsList}
                                                                        currentValue={equipmentsList.filter(
                                                                            (option) =>
                                                                                option.value === selectedEquipment
                                                                        )}
                                                                        onChange={(e) => {
                                                                            handleChange('equipment_link', e.value);
                                                                            setSelectedEquipment(e.value);
                                                                        }}
                                                                        className="basic-single"
                                                                        isDisabled={firstBreakerObj?.type !== ''}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Brick sizeInRem={0.65} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio
                                                                    name="radio-2"
                                                                    checked={firstBreakerObj?.type === 'unlabeled'}
                                                                    onClick={(e) => {
                                                                        if (firstBreakerObj?.type === 'unlabeled')
                                                                            return;
                                                                        handleBreakerTypeChange(
                                                                            'type',
                                                                            parentBreakerObj?.type,
                                                                            'unlabeled'
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unlabeled
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio
                                                                    name="radio-3"
                                                                    checked={firstBreakerObj?.type === 'unwired'}
                                                                    onClick={(e) => {
                                                                        if (firstBreakerObj?.type === 'unwired') return;
                                                                        handleBreakerTypeChange(
                                                                            'type',
                                                                            parentBreakerObj?.type,
                                                                            'unwired'
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unwired Breaker
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio
                                                                    name="radio-4"
                                                                    checked={firstBreakerObj?.type === 'blank'}
                                                                    onClick={(e) => {
                                                                        if (firstBreakerObj?.type === 'blank') return;
                                                                        handleBreakerTypeChange(
                                                                            'type',
                                                                            parentBreakerObj?.type,
                                                                            'blank'
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Blank
                                                            </Typography.Body>
                                                        </div>
                                                    </div>
                                                    <Brick sizeInRem={2} />
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Notes
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Textarea
                                                            type="textarea"
                                                            rows="4"
                                                            placeholder="Enter Notes here"
                                                            value={firstBreakerObj?.notes || ''}
                                                            onChange={(e) => {
                                                                handleChange('notes', e.target.value);
                                                            }}
                                                            inputClassName="pt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Item>

                                            {/* Create Equipment  */}
                                            <Tabs.Item eventKey="create-equip" title="Create Equipment">
                                                <div className="p-default">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="w-100 mr-4">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Name
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            {firstBreakerObj?.type === 'equipment' ? (
                                                                <InputTooltip
                                                                    placeholder="Enter Equipment Name"
                                                                    onChange={(e) => {
                                                                        handleCreateEquipChange('name', e.target.value);
                                                                    }}
                                                                    value={equipmentObj?.name}
                                                                    labelSize={Typography.Sizes.md}
                                                                    error={equipmentErrors?.name}
                                                                />
                                                            ) : (
                                                                <Select
                                                                    placeholder="Enter Equipment Name"
                                                                    isDisabled={true}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Quantity
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            {firstBreakerObj?.type === 'equipment' ? (
                                                                <InputTooltip
                                                                    type="number"
                                                                    placeholder="Enter Equipment Quantity"
                                                                    onChange={(e) => {
                                                                        handleCreateEquipChange(
                                                                            'quantity',
                                                                            e.target.value
                                                                        );
                                                                    }}
                                                                    value={equipmentObj?.quantity}
                                                                    labelSize={Typography.Sizes.md}
                                                                    error={equipmentErrors?.quantity}
                                                                />
                                                            ) : (
                                                                <Select
                                                                    placeholder="Enter Equipment Quantity"
                                                                    isDisabled={true}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Brick sizeInRem={1.5} />
                                                    <div className="d-flex justify-content-between">
                                                        <div className="w-100 mr-4">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Equipment Type
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <Select
                                                                id="exampleSelect"
                                                                placeholder="Select Equipment Type"
                                                                name="select"
                                                                isSearchable={true}
                                                                currentValue={equipmentTypeData.filter(
                                                                    (option) =>
                                                                        option.value === equipmentObj?.equipment_type
                                                                )}
                                                                options={equipmentTypeData}
                                                                onChange={(e) => {
                                                                    handleCreateEquipChange('equipment_type', e.value);
                                                                }}
                                                                className="basic-single"
                                                                error={equipmentErrors?.equipment_type}
                                                                isDisabled={firstBreakerObj?.type !== ''}
                                                            />
                                                        </div>

                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                End Use Category
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <Select
                                                                id="endUseSelect"
                                                                placeholder="Select End Use"
                                                                name="select"
                                                                isSearchable={true}
                                                                currentValue={endUseData.filter(
                                                                    (option) => option.value === equipmentObj?.end_use
                                                                )}
                                                                options={endUseData}
                                                                onChange={(e) => {
                                                                    handleCreateEquipChange('end_use', e.value);
                                                                }}
                                                                className="basic-single"
                                                                error={equipmentErrors?.end_use}
                                                                isDisabled={firstBreakerObj?.type !== ''}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Brick sizeInRem={1.5} />
                                                    <div>
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Equipment Location
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Equipment Location"
                                                            name="select"
                                                            isSearchable={true}
                                                            currentValue={locationData.filter(
                                                                (option) => option.value === equipmentObj?.space_id
                                                            )}
                                                            options={locationData}
                                                            onChange={(e) => {
                                                                handleCreateEquipChange('space_id', e.value);
                                                            }}
                                                            className="basic-single"
                                                            isDisabled={firstBreakerObj?.type !== ''}
                                                        />
                                                    </div>
                                                    <Brick sizeInRem={1.5} />
                                                    {firstBreakerObj?.type === 'equipment' && (
                                                        <div className="d-flex justify-content-end">
                                                            <Button
                                                                label={isAdding ? 'Adding...' : 'Add Equipment'}
                                                                size={Button.Sizes.md}
                                                                type={Button.Type.secondary}
                                                                disabled={isAdding}
                                                                icon={<PlusSVG />}
                                                                onClick={addEquipment}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </Tabs.Item>
                                        </Tabs>
                                    </div>

                                    <div className="w-100">
                                        {/* Breaker 1 */}
                                        <div>
                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                {firstBreakerObj?.name}
                                            </Typography.Subheader>
                                            <Brick sizeInRem={1} />
                                            <div className="d-flex justify-content-between">
                                                <div className="w-100 mr-4">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Device ID
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        id="exampleSelect"
                                                        placeholder="Select Device ID Name"
                                                        name="select"
                                                        isSearchable={true}
                                                        options={passiveDevicesListOne}
                                                        currentValue={passiveDevicesList.filter(
                                                            (option) => option.value === firstBreakerObj?.device_link
                                                        )}
                                                        onChange={(e) => {
                                                            handleBreakerConfigChange('device_link', e.value, 'first');
                                                            if (firstDeviceSearch !== '') {
                                                                fetchPassiveDeviceList(bldgId, 'default-list', 'first');
                                                            }
                                                        }}
                                                        onInputChange={(e) => setFirstDeviceSearch(e)}
                                                        className="basic-single"
                                                        isDisabled={
                                                            firstBreakerObj?.type === 'unwired' ||
                                                            firstBreakerObj?.type === 'blank'
                                                        }
                                                    />
                                                </div>
                                                <div className="w-100">
                                                    <Typography.Body size={Typography.Sizes.md}>
                                                        Sensor #
                                                    </Typography.Body>
                                                    <Brick sizeInRem={0.25} />
                                                    <Select
                                                        id="exampleSelect"
                                                        placeholder="Select Sensor Number"
                                                        name="select"
                                                        isSearchable={true}
                                                        options={firstSensorList}
                                                        currentValue={firstSensorList.filter(
                                                            (option) => option.value === firstBreakerObj?.sensor_link
                                                        )}
                                                        onChange={(e) => {
                                                            handleBreakerConfigChange('sensor_link', e.value, 'first');
                                                            handleSensorChange(firstBreakerObj?.sensor_link, e.value);
                                                        }}
                                                        className="basic-single"
                                                        isDisabled={
                                                            firstBreakerObj?.type === 'unwired' ||
                                                            firstBreakerObj?.type === 'blank'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <Brick sizeInRem={firstBreakerObj?.breaker_type !== 3 ? 1 : 0.25} />
                                            <hr />
                                            <Brick sizeInRem={firstBreakerObj?.breaker_type !== 3 ? 1 : 0.25} />
                                        </div>

                                        {/* Breaker 2 */}
                                        {(firstBreakerObj?.breaker_type === 2 ||
                                            firstBreakerObj?.breaker_type === 3) && (
                                            <div>
                                                <Typography.Subheader size={Typography.Sizes.md}>
                                                    {secondBreakerObj?.name}
                                                </Typography.Subheader>
                                                <Brick sizeInRem={1} />
                                                <div className="d-flex justify-content-between">
                                                    <div className="w-100 mr-4">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Device ID
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Device ID Name"
                                                            name="select"
                                                            isSearchable={true}
                                                            options={passiveDevicesListTwo}
                                                            currentValue={passiveDevicesList.filter(
                                                                (option) =>
                                                                    option.value === secondBreakerObj?.device_link
                                                            )}
                                                            onChange={(e) => {
                                                                handleBreakerConfigChange(
                                                                    'device_link',
                                                                    e.value,
                                                                    'second'
                                                                );
                                                                if (secondDeviceSearch !== '') {
                                                                    fetchPassiveDeviceList(
                                                                        bldgId,
                                                                        'default-list',
                                                                        'second'
                                                                    );
                                                                }
                                                            }}
                                                            onInputChange={(e) => setSecondDeviceSearch(e)}
                                                            className="basic-single"
                                                            isDisabled={
                                                                firstBreakerObj?.type === 'unwired' ||
                                                                firstBreakerObj?.type === 'blank'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Sensor #
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Sensor Number"
                                                            name="select"
                                                            isSearchable={true}
                                                            options={secondSensorList}
                                                            currentValue={secondSensorList.filter(
                                                                (option) =>
                                                                    option.value === secondBreakerObj?.sensor_link
                                                            )}
                                                            onChange={(e) => {
                                                                handleBreakerConfigChange(
                                                                    'sensor_link',
                                                                    e.value,
                                                                    'second'
                                                                );
                                                                handleSensorChange(
                                                                    secondBreakerObj?.sensor_link,
                                                                    e.value
                                                                );
                                                            }}
                                                            className="basic-single"
                                                            isDisabled={
                                                                firstBreakerObj?.type === 'unwired' ||
                                                                firstBreakerObj?.type === 'blank'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <Brick sizeInRem={firstBreakerObj?.breaker_type !== 3 ? 1 : 0.25} />
                                                <hr />
                                                <Brick sizeInRem={firstBreakerObj?.breaker_type !== 3 ? 1 : 0.25} />
                                            </div>
                                        )}

                                        {/* Breaker 3 */}
                                        {firstBreakerObj?.breaker_type === 3 && (
                                            <div>
                                                <Typography.Subheader size={Typography.Sizes.md}>
                                                    {thirdBreakerObj?.name}
                                                </Typography.Subheader>
                                                <Brick sizeInRem={1} />
                                                <div className="d-flex justify-content-between">
                                                    <div className="w-100 mr-4">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Device ID
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Device ID Name"
                                                            name="select"
                                                            isSearchable={true}
                                                            options={passiveDevicesListThree}
                                                            currentValue={passiveDevicesList.filter(
                                                                (option) =>
                                                                    option.value === thirdBreakerObj?.device_link
                                                            )}
                                                            onChange={(e) => {
                                                                handleBreakerConfigChange(
                                                                    'device_link',
                                                                    e.value,
                                                                    'third'
                                                                );
                                                                if (thirdDeviceSearch !== '') {
                                                                    fetchPassiveDeviceList(
                                                                        bldgId,
                                                                        'default-list',
                                                                        'third'
                                                                    );
                                                                }
                                                            }}
                                                            onInputChange={(e) => setThirdDeviceSearch(e)}
                                                            className="basic-single"
                                                            isDisabled={
                                                                firstBreakerObj?.type === 'unwired' ||
                                                                firstBreakerObj?.type === 'blank'
                                                            }
                                                        />
                                                    </div>
                                                    <div className="w-100">
                                                        <Typography.Body size={Typography.Sizes.md}>
                                                            Sensor #
                                                        </Typography.Body>
                                                        <Brick sizeInRem={0.25} />
                                                        <Select
                                                            id="exampleSelect"
                                                            placeholder="Select Sensor Number"
                                                            name="select"
                                                            isSearchable={true}
                                                            options={thirdSensorList}
                                                            currentValue={thirdSensorList.filter(
                                                                (option) =>
                                                                    option.value === thirdBreakerObj?.sensor_link
                                                            )}
                                                            onChange={(e) => {
                                                                handleBreakerConfigChange(
                                                                    'sensor_link',
                                                                    e.value,
                                                                    'third'
                                                                );
                                                                handleSensorChange(
                                                                    thirdBreakerObj?.sensor_link,
                                                                    e.value
                                                                );
                                                            }}
                                                            className="basic-single"
                                                            isDisabled={
                                                                firstBreakerObj?.type === 'unwired' ||
                                                                firstBreakerObj?.type === 'blank'
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <Brick sizeInRem={0.25} />
                                                <hr />
                                                <Brick sizeInRem={0.25} />
                                            </div>
                                        )}

                                        <div className="d-flex justify-content-between">
                                            <div className="w-100">
                                                <Button
                                                    label="Reset Configuration"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryDistructive}
                                                    onClick={() => {
                                                        if (
                                                            parentBreakerObj?.type === 'blank' ||
                                                            parentBreakerObj?.type === 'unwired'
                                                        )
                                                            return;
                                                        closeModalWithoutSave();
                                                        handleUnlinkAlertShow();
                                                    }}
                                                    icon={<UnlinkOldSVG />}
                                                    className="w-100 mr-3"
                                                />
                                            </div>

                                            <div className="w-100">
                                                <Button
                                                    label="Delete Breaker"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryDistructive}
                                                    onClick={() => {
                                                        if (
                                                            firstBreakerObj?.breaker_type === 1 &&
                                                            breakersList.length === firstBreakerObj?.breaker_number
                                                        ) {
                                                            closeModalWithoutSave();
                                                            handleDeleteAlertShow();
                                                        }
                                                    }}
                                                    icon={<DeleteSVG />}
                                                    className="w-100 ml-3"
                                                />
                                            </div>
                                        </div>

                                        {firstBreakerObj?.breaker_type !== 1 && (
                                            <div className="float-right mr-2">
                                                <Brick sizeInRem={0.25} />
                                                <Typography.Body size={Typography.Sizes.sm} className="txt-warn-color">
                                                    Grouped breakers cannot be deleted
                                                </Typography.Body>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Metrics  */}
                        {activeTab === 'metrics' && <div>Edit Metric Page</div>}
                    </div>
                </div>
            </Modal>

            <UnlinkBreaker
                isResetting={isResetting}
                showUnlinkAlert={showUnlinkAlert}
                handleEditBreakerShow={openBreakerConfigModal}
                handleUnlinkAlertClose={handleUnlinkAlertClose}
                unLinkCurrentBreaker={unLinkCurrentBreaker}
            />

            <DeleteBreaker
                isDeleting={isDeleting}
                showDeleteAlert={showDeleteAlert}
                handleDeleteAlertClose={handleDeleteAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                deleteCurrentBreaker={deleteCurrentBreaker}
            />

            <UnlabelEquipAlert
                showUnlabeledAlert={showUnlabeledAlert}
                closeUnlabelAlertModal={closeUnlabelAlertModal}
                saveBreakersDetails={saveBreakersDetails}
                openBreakerConfigModal={openBreakerConfigModal}
            />

            <ReassignAlert
                showReassignAlert={showReassignAlert}
                closeReassignAlert={closeReassignAlert}
                currentEquipObj={currentEquipObj}
                newEquipObj={newEquipObj}
                saveBreakersDetails={saveBreakersDetails}
                openBreakerConfigModal={openBreakerConfigModal}
            />
        </React.Fragment>
    );
};

export default BreakerConfiguration;
