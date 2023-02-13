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
import { getBreakerDeleted, getSensorsList, resetAllBreakers, updateBreakerDetails } from './services';
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
}) => {
    const [activeTab, setActiveTab] = useState('edit-breaker');
    const breakersList = BreakersStore.useState((s) => s.breakersList);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [parentBreakerObj, setParentBreakerObj] = useState({});
    const [firstBreakerObj, setFirstBreakerObj] = useState({});
    const [secondBreakerObj, setSecondBreakerObj] = useState({});
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
            console.log('SSR obj => ', obj);
            console.log('SSR key => ', key);
            console.log('SSR value => ', value);
            console.log('SSR breakerLvl => ', breakerLvl);
            setFirstBreakerObj(obj);
            if (obj?.breaker_type === 1) fetchSensorsList(value, 'first');
        }
        if (breakerLvl === 'second') {
            let obj = Object.assign({}, secondBreakerObj);
            obj[key] = value;
            setSecondBreakerObj(obj);
            fetchSensorsList(value, 'second');
        }
        if (breakerLvl === 'third') {
            let obj = Object.assign({}, thirdBreakerObj);
            obj[key] = value;
            setThirdBreakerObj(obj);
            fetchSensorsList(value, 'third');
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

    const handleBreakerUpdate = async () => {
        setIsProcessing(true);

        const params = `?building_id=${bldgId}`;
        const breakersList = [];

        // {
        //     "breaker_id": "string",
        //     "name": "string",
        //     "breaker_number": 0,
        //     "phase_configuration": 0,
        //     "rated_amps": 0,
        //     "voltage": 0,
        //     "sensor_link": "string",
        //     "device_link": "string",
        //     "equipment_link": [
        //       "string"
        //     ]
        //   }

        let breakerObjOne = {
            breaker_id: firstBreakerObj?.id,
        };
        let breakerObjTwo = {
            breaker_id: secondBreakerObj?.id,
        };
        let breakerObjThree = {
            breaker_id: thirdBreakerObj?.id,
        };

        if (firstBreakerObj?.rated_amps !== parentBreakerObj?.rated_amps) {
            breakerObjOne.rated_amps = firstBreakerObj?.rated_amps;
        }

        if (firstBreakerObj?.device_link !== parentBreakerObj?.device_link) {
            breakerObjOne.device_link = firstBreakerObj?.device_link;
        }

        if (firstBreakerObj?.sensor_link !== parentBreakerObj?.sensor_link) {
            breakerObjOne.sensor_link = firstBreakerObj?.sensor_link;
        }

        if (firstBreakerObj?.equipment_link[0] !== parentBreakerObj?.equipment_link[0]) {
            breakerObjOne.equipment_link = [firstBreakerObj?.equipment_link];
        }

        console.log('SSR breakerObjOne => ', breakerObjOne);

        // await updateBreakerDetails(params, breakersList)
        //     .then((res) => {
        //         setIsProcessing(false);
        //         closeBreakerConfigModal();
        //         window.scrollTo(0, 0);
        //         triggerBreakerAPI(true);
        //     })
        //     .catch(() => {
        //         setIsProcessing(false);
        //     });
    };

    const onLoadSensorsListFetch = async (deviceId) => {
        if (deviceId === null || deviceId === undefined || deviceId === '') return;

        // setIsSensorDataFetched(true);
        // setIsSensorDataFetchedForDouble(true);
        // setIsSensorDataFetchedForTriple(true);

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
                        record?.breaker_id !== '' ? linkedSensor.push(record) : unlinkedSensor.push(record);
                    });
                }

                setFirstSensorList(unlinkedSensor.concat(linkedSensor));
                setSecondSensorList(unlinkedSensor.concat(linkedSensor));
                setThirdSensorList(unlinkedSensor.concat(linkedSensor));

                // setIsSensorDataFetched(false);
                // setIsSensorDataFetchedForDouble(false);
                // setIsSensorDataFetchedForTriple(false);
            })
            .catch(() => {
                // setIsSensorDataFetched(false);
                // setIsSensorDataFetchedForDouble(false);
                // setIsSensorDataFetchedForTriple(false);
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

            if (selectedBreakerObj?.device_link !== '' && selectedBreakerObj?.device_link === obj?.device_link) {
                onLoadSensorsListFetch(selectedBreakerObj?.device_link);
            }
        }

        if (selectedBreakerObj?.breaker_type === 3) {
            let childbreakers = breakersList.filter((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(childbreakers[0]);
            setThirdBreakerObj(childbreakers[1]);

            if (
                selectedBreakerObj?.device_link !== '' &&
                selectedBreakerObj?.device_link === childbreakers[0]?.device_link &&
                selectedBreakerObj?.device_link === childbreakers[1]?.device_link
            ) {
                onLoadSensorsListFetch(selectedBreakerObj?.device_link);
            }
        }
    }, [selectedBreakerObj]);

    return (
        <React.Fragment>
            <Modal show={showBreakerConfigModal} onHide={closeBreakerConfigModal} size="xl" centered>
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
                                    onClick={handleBreakerUpdate}
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
                                        <Tabs type={Tabs.Types.subsection} tabCustomStyle="p-2">
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
                                                            // value={equipData?.note}
                                                            // onChange={(e) => {
                                                            //     handleDataChange('note', e.target.value);
                                                            // }}
                                                            inputClassName="pt-2"
                                                            // disabled={
                                                            //     !(
                                                            //         userPermission?.user_role === 'admin' ||
                                                            //         userPermission?.permissions?.permissions
                                                            //             ?.account_buildings_permission?.edit
                                                            //     )
                                                            // }
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
                                                                // onChange={(e) => {
                                                                //     handleChange('name', e.target.value);
                                                                //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                                // }}
                                                                // value={equipmentObj?.name}
                                                                labelSize={Typography.Sizes.md}
                                                                // error={equipmentErrors?.name}
                                                            />
                                                        </div>
                                                        <div className="w-100">
                                                            <Typography.Body size={Typography.Sizes.md}>
                                                                Quantity
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                placeholder="Enter Equipment Quantity"
                                                                // onChange={(e) => {
                                                                //     handleChange('name', e.target.value);
                                                                //     setEquipmentErrors({ ...equipmentErrors, name: null });
                                                                // }}
                                                                // value={equipmentObj?.name}
                                                                labelSize={Typography.Sizes.md}
                                                                // error={equipmentErrors?.name}
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
                                                                // currentValue={equipmentTypeDataAll.filter(
                                                                //     (option) =>
                                                                //         option.value === equipmentObj?.equipment_type
                                                                // )}
                                                                // options={equipmentTypeDataAll}
                                                                // onChange={(e) => {
                                                                //     handleChange('equipment_type', e.value);
                                                                // }}
                                                                // error={equipmentErrors?.equipment_type}
                                                                className="basic-single"
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
                                                                // currentValue={endUseDataNow.filter(
                                                                //     (option) => option.value === equipmentObj?.end_use
                                                                // )}
                                                                // options={endUseDataNow}
                                                                // onChange={(e) => {
                                                                //     handleChange('end_use', e.value);
                                                                //     setEquipmentErrors({
                                                                //         ...equipmentErrors,
                                                                //         end_use: null,
                                                                //     });
                                                                // }}
                                                                // error={equipmentErrors?.end_use}
                                                                className="basic-single"
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
                                                            // currentValue={locationDataNow.filter(
                                                            //     (option) => option.value === equipmentObj?.space_id
                                                            // )}
                                                            // options={locationDataNow}
                                                            // onChange={(e) => {
                                                            //     handleChange('space_id', e.value);
                                                            // }}
                                                            className="basic-single"
                                                        />
                                                        <Brick sizeInRem={0.25} />
                                                        <Typography.Body size={Typography.Sizes.sm}>
                                                            Select Equipment Location
                                                        </Typography.Body>
                                                    </div>
                                                    <Brick sizeInRem={1.5} />
                                                    <div className="d-flex justify-content-end">
                                                        <Button
                                                            label={'Add Equipment'}
                                                            size={Button.Sizes.md}
                                                            type={Button.Type.secondary}
                                                            icon={<PlusSVG className="plus-icon-style" />}
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
