import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { BaseUrl, listSensor, updateBreakers, generalPassiveDevices, searchDevices } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { Handle } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import { BuildingStore } from '../../../store/BuildingStore';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import Typography from '../../../sharedComponents/typography';
import UnlinkBreaker from './UnlinkBreaker';
import {
    createEquipmentData,
    getBreakerDeleted,
    getSensorsList,
    resetAllBreakers,
    updateBreakerDetails,
} from './services';
import DeleteBreaker from './DeleteBreaker';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Tabs from '../../../sharedComponents/tabs/Tabs';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plusBlue.svg';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as UnlinkOldSVG } from '../../../assets/icon/panels/unlink_old.svg';
import Radio from '../../../sharedComponents/form/radio/Radio';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';
import { comparePanelData, voltsOption } from './utils';
import './breaker-config-styles.scss';

import Select from '../../../sharedComponents/form/select';
import { Notification } from '../../../sharedComponents/notification/Notification';
import { addNewEquipment, getLocationDataRequest, getMetadataRequest } from '../../../services/equipment';
import { UserStore } from '../../../store/UserStore';

const BreakerConfiguration = ({
    showBreakerConfigModal,
    openBreakerConfigModal,
    closeBreakerConfigModal,
    selectedBreakerObj,
    setSelectedBreakerObj,
    panelObj,
    equipmentsList,
    passiveDevicesList,
    triggerBreakerAPI,
    fetchEquipmentData,
}) => {
    const [activeTab, setActiveTab] = useState('edit-breaker');
    const [activeEquipTab, setActiveEquipTab] = useState('equip');
    const breakersList = BreakersStore.useState((s) => s.breakersList);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [parentBreakerObj, setParentBreakerObj] = useState({});
    const [firstBreakerObj, setFirstBreakerObj] = useState({});

    const [secondBreakerObjOld, setSecondBreakerObjOld] = useState({});
    const [secondBreakerObj, setSecondBreakerObj] = useState({});

    const [thirdBreakerObjOld, setThirdBreakerObjOld] = useState({});
    const [thirdBreakerObj, setThirdBreakerObj] = useState({});

    const [selectedEquipment, setSelectedEquipment] = useState('');

    const [firstSensorList, setFirstSensorList] = useState([]);
    const [secondSensorList, setSecondSensorList] = useState([]);
    const [thirdSensorList, setThirdSensorList] = useState([]);

    // Unlink Alert Modal
    const [showUnlinkAlert, setShowUnlinkAlert] = useState(false);
    const handleUnlinkAlertClose = () => setShowUnlinkAlert(false);
    const handleUnlinkAlertShow = () => setShowUnlinkAlert(true);
    const [isResetting, setIsResetting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const defaultEquipmentObj = {
        name: '',
        equipment_type: '',
        end_use: '',
        space_id: '',
        quantity: '',
    };

    const defaultErrors = {
        name: null,
        equipment_type: null,
        end_use: null,
        quantity: null,
    };

    const [equipmentObj, setEquipmentObj] = useState(defaultEquipmentObj);
    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [isAdding, setAdding] = useState(false);
    const [equipmentErrors, setEquipmentErrors] = useState(defaultErrors);

    const handleCreateEquipChange = (key, value) => {
        let obj = Object.assign({}, equipmentObj);
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
            await createEquipmentData(params, obj)
                .then((res) => {
                    const response = res;
                    if (response?.status === 200) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Equipment created successfully.';
                            s.notificationType = 'success';
                        });
                        handleChange('equipment_link', response?.data);
                        setSelectedEquipment(response?.data);
                        fetchEquipmentData(bldgId);
                        setActiveEquipTab('equip');
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Unable to create Equipment.';
                            s.notificationType = 'error';
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
        setSelectedBreakerObj({});
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, firstBreakerObj);
        obj[key] = value;
        setFirstBreakerObj(obj);
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
                closeBreakerConfigModal();
                triggerBreakerAPI(true);
            })
            .catch(() => {
                setIsResetting(false);
            });
    };

    const saveBreakersDetails = async () => {
        // setIsProcessing(true);

        const params = `?building_id=${bldgId}`;
        const breakersList = [];

        let breakerObjOne = { breaker_id: firstBreakerObj?.id };
        let breakerObjTwo = { breaker_id: secondBreakerObj?.id };
        let breakerObjThree = { breaker_id: thirdBreakerObj?.id };

        if (firstBreakerObj?.rated_amps !== parentBreakerObj?.rated_amps) {
            breakerObjOne.rated_amps = firstBreakerObj?.rated_amps;
            if (breakerObjTwo?.breaker_id) breakerObjTwo.rated_amps = firstBreakerObj?.rated_amps;
            if (breakerObjThree?.breaker_id) breakerObjThree.rated_amps = firstBreakerObj?.rated_amps;
        }

        if (firstBreakerObj?.equipment_link[0] !== parentBreakerObj?.equipment_link[0]) {
            breakerObjOne.equipment_link = [firstBreakerObj?.equipment_link];
            if (breakerObjTwo?.breaker_id) breakerObjTwo.equipment_link = [firstBreakerObj?.equipment_link];
            if (breakerObjThree?.breaker_id) breakerObjThree.equipment_link = [firstBreakerObj?.equipment_link];
        }

        if (firstBreakerObj?.note !== parentBreakerObj?.note) {
            breakerObjOne.note = firstBreakerObj?.note ? firstBreakerObj?.note : '';
            if (breakerObjTwo?.breaker_id) breakerObjTwo.note = firstBreakerObj?.note ? firstBreakerObj?.note : '';
            if (breakerObjThree?.breaker_id) breakerObjThree.note = firstBreakerObj?.note ? firstBreakerObj?.note : '';
        }

        if (firstBreakerObj?.device_link !== parentBreakerObj?.device_link) {
            breakerObjOne.device_link = firstBreakerObj?.device_link;
        }

        if (firstBreakerObj?.sensor_link !== parentBreakerObj?.sensor_link) {
            breakerObjOne.sensor_link = firstBreakerObj?.sensor_link;
        }

        if (secondBreakerObj?.device_link !== secondBreakerObjOld?.device_link) {
            breakerObjTwo.device_link = secondBreakerObj?.device_link;
        }

        if (secondBreakerObj?.sensor_link !== secondBreakerObjOld?.sensor_link) {
            breakerObjTwo.sensor_link = secondBreakerObj?.sensor_link;
        }

        if (thirdBreakerObj?.device_link !== thirdBreakerObjOld?.device_link) {
            breakerObjThree.device_link = thirdBreakerObj?.device_link;
        }

        if (thirdBreakerObj?.sensor_link !== thirdBreakerObjOld?.sensor_link) {
            breakerObjThree.sensor_link = thirdBreakerObj?.sensor_link;
        }

        breakersList.push(breakerObjOne);
        if (breakerObjTwo?.breaker_id) breakersList.push(breakerObjTwo);
        if (breakerObjThree?.breaker_id) breakersList.push(breakerObjThree);

        await updateBreakerDetails(params, breakersList)
            .then((res) => {
                const response = res;
                setIsProcessing(false);
                if (response?.status === 200) {
                    closeBreakerConfigModal();
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Breaker configuration updated successfully.';
                        s.notificationType = 'success';
                    });
                    window.scrollTo(0, 0);
                    triggerBreakerAPI(true);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to update Breaker configuration.'
                            : 'Unable to update Breaker configuration due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    const onLoadSensorsListFetch = async (deviceId) => {
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

                setFirstSensorList(unlinkedSensor.concat(linkedSensor));
                setSecondSensorList(unlinkedSensor.concat(linkedSensor));
                setThirdSensorList(unlinkedSensor.concat(linkedSensor));
            })
            .catch(() => {
                setFirstSensorList([]);
                setSecondSensorList([]);
                setThirdSensorList([]);
            });
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

    useEffect(() => {
        if (!selectedBreakerObj?.id) return;

        setFirstBreakerObj(selectedBreakerObj);
        setParentBreakerObj(selectedBreakerObj);

        if (selectedBreakerObj?.equipment_link) setSelectedEquipment(selectedBreakerObj?.equipment_link[0]);

        if (selectedBreakerObj?.breaker_type === 1 && selectedBreakerObj?.device_link !== '') {
            onLoadSensorsListFetch(selectedBreakerObj?.device_link);
        }

        if (selectedBreakerObj?.breaker_type === 2) {
            let obj = breakersList.find((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(obj);
            setSecondBreakerObjOld(obj);

            if (selectedBreakerObj?.device_link !== '' && selectedBreakerObj?.device_link === obj?.device_link) {
                onLoadSensorsListFetch(selectedBreakerObj?.device_link);
            }
        }

        if (selectedBreakerObj?.breaker_type === 3) {
            let childbreakers = breakersList.filter((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(childbreakers[0]);
            setSecondBreakerObjOld(childbreakers[0]);
            setThirdBreakerObj(childbreakers[1]);
            setThirdBreakerObjOld(childbreakers[1]);

            if (
                selectedBreakerObj?.device_link !== '' &&
                selectedBreakerObj?.device_link === childbreakers[0]?.device_link &&
                selectedBreakerObj?.device_link === childbreakers[1]?.device_link
            ) {
                onLoadSensorsListFetch(selectedBreakerObj?.device_link);
            }
        }
    }, [selectedBreakerObj]);

    useEffect(() => {
        if (activeEquipTab === 'create-equip') fetchMetadata();
    }, [activeEquipTab]);

    return (
        <React.Fragment>
            <Modal
                show={showBreakerConfigModal}
                onHide={closeBreakerConfigModal}
                size="xl"
                centered
                backdrop="static"
                keyboard={false}>
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
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper mr-4 ${
                                        activeTab === 'edit-breaker' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('edit-breaker')}>
                                    {`Edit Breaker${firstBreakerObj?.breaker_type !== 1 ? `(s)` : ''}`}
                                </Typography.Subheader>
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
                                    onClick={saveBreakersDetails}
                                    className="ml-2"
                                    disabled={comparePanelData(firstBreakerObj, parentBreakerObj)}
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
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Phase"
                                            labelSize={Typography.Sizes.md}
                                            value={firstBreakerObj?.phase_configuration}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Rated Amps</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Amperage"
                                            labelSize={Typography.Sizes.md}
                                            value={firstBreakerObj?.rated_amps}
                                            onChange={(e) => {
                                                handleChange('rated_amps', +e.target.value);
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Voltage"
                                            labelSize={Typography.Sizes.md}
                                            value={firstBreakerObj?.voltage}
                                        />
                                    </div>
                                </div>

                                <Brick sizeInRem={1} />
                                <hr />
                                <Brick sizeInRem={1} />

                                <div className="breaker-main-config">
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
                                                        options={passiveDevicesList}
                                                        currentValue={passiveDevicesList.filter(
                                                            (option) => option.value === firstBreakerObj?.device_link
                                                        )}
                                                        onChange={(e) => {
                                                            handleBreakerConfigChange('device_link', e.value, 'first');
                                                        }}
                                                        className="basic-single"
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
                                                        }}
                                                        className="basic-single"
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
                                                            options={passiveDevicesList}
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
                                                            }}
                                                            className="basic-single"
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
                                                            }}
                                                            className="basic-single"
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
                                                            options={passiveDevicesList}
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
                                                            }}
                                                            className="basic-single"
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
                                                            }}
                                                            className="basic-single"
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
                                                        closeBreakerConfigModal();
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
                                                    // onClick={() => {
                                                    //     handleEditBreakerClose();
                                                    //     handleDeleteAlertShow();
                                                    // }}
                                                    icon={<DeleteSVG />}
                                                    // disabled={
                                                    //     distributedBreakersData.length !==
                                                    //         breakerData.breaker_number ||
                                                    //     breakerData.breakerType === 2 ||
                                                    //     breakerData.breakerType === 3
                                                    // }
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
                                    <div className="w-100">
                                        <Tabs
                                            type={Tabs.Types.subsection}
                                            tabCustomStyle="p-2"
                                            activeKey={activeEquipTab}
                                            onSelect={(e) => {
                                                setActiveEquipTab(e);
                                            }}>
                                            <Tabs.Item eventKey="equip" title="Equipment">
                                                <div className="p-default">
                                                    {/* <div>
                                                        <Notification
                                                            type={Notification.Types.success}
                                                            component={Notification.ComponentTypes.alert}
                                                            description={'Equipment created successfully.'}
                                                            closeAutomatically={true}
                                                        />
                                                        <Brick sizeInRem={1.5} />
                                                    </div> */}

                                                    <div>
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-1" checked={true} />
                                                            </div>
                                                            <div className="w-100">
                                                                <Select
                                                                    id="exampleSelect"
                                                                    placeholder="Select Equipment"
                                                                    name="select"
                                                                    isSearchable={true}
                                                                    options={equipmentsList}
                                                                    currentValue={equipmentsList.filter(
                                                                        (option) => option.value === selectedEquipment
                                                                    )}
                                                                    onChange={(e) => {
                                                                        handleChange('equipment_link', e.value);
                                                                        setSelectedEquipment(e.value);
                                                                    }}
                                                                    className="basic-single"
                                                                />
                                                            </div>
                                                        </div>
                                                        <Brick sizeInRem={0.65} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-2" />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unlabeled
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-3" />
                                                            </div>
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Unwired Breaker
                                                            </Typography.Body>
                                                        </div>
                                                        <Brick sizeInRem={1} />
                                                        <div className="d-flex align-items-center">
                                                            <div className="mr-2">
                                                                <Radio name="radio-4" />
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
                                                            value={firstBreakerObj?.note || ''}
                                                            onChange={(e) => {
                                                                handleChange('note', e.target.value);
                                                            }}
                                                            inputClassName="pt-2"
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Item>

                                            {/* Create Equipment  */}
                                            <Tabs.Item eventKey="create-equip" title="Create Equipment">
                                                <div className="p-default">
                                                    {/* <div>
                                                        <Notification
                                                            type={Notification.Types.error}
                                                            component={Notification.ComponentTypes.alert}
                                                            description={'Unable to create equipment.'}
                                                            closeAutomatically={false}
                                                        />
                                                        <Brick sizeInRem={1.5} />
                                                    </div> */}
                                                    <div className="d-flex justify-content-between">
                                                        <div className="w-100 mr-4">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Name
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                placeholder="Enter Equipment Name"
                                                                onChange={(e) => {
                                                                    handleCreateEquipChange('name', e.target.value);
                                                                }}
                                                                value={equipmentObj?.name}
                                                                labelSize={Typography.Sizes.md}
                                                                error={equipmentErrors?.name}
                                                            />
                                                        </div>
                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Quantity
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                type="number"
                                                                placeholder="Enter Equipment Quantity"
                                                                onChange={(e) => {
                                                                    handleCreateEquipChange('quantity', e.target.value);
                                                                }}
                                                                value={equipmentObj?.quantity}
                                                                labelSize={Typography.Sizes.md}
                                                                error={equipmentErrors?.quantity}
                                                            />
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
                                                        />
                                                    </div>
                                                    <Brick sizeInRem={1.5} />
                                                    <div className="d-flex justify-content-end">
                                                        <Button
                                                            label={isAdding ? 'Adding...' : 'Add Equipment'}
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.secondary}
                                                            disabled={isAdding}
                                                            icon={<PlusSVG className="plus-icon-style" />}
                                                            onClick={addEquipment}
                                                        />
                                                    </div>
                                                </div>
                                            </Tabs.Item>
                                        </Tabs>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Metrics  */}
                        {activeTab === 'metrics' && <div>Edit Metrices</div>}
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

            {/* <DeleteBreaker
                showDeleteAlert={showDeleteAlert}
                handleDeleteAlertClose={handleDeleteAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                isDeleting={isDeleting}
                deleteCurrentBreaker={deleteCurrentBreaker}
            /> */}
        </React.Fragment>
    );
};

export default BreakerConfiguration;
