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
import { getBreakerDeleted, getSensorsList, resetAllBreakers } from './services';
import DeleteBreaker from './DeleteBreaker';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Tabs from '../../../sharedComponents/tabs/Tabs';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plusBlue.svg';
import Radio from '../../../sharedComponents/form/radio/Radio';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';
import { voltsOption } from './utils';
import './breaker-config-styles.scss';

import Form from 'react-bootstrap/Form';
import Skeleton from 'react-loading-skeleton';
import AsyncSelect from 'react-select/async';
import Select from '../../../sharedComponents/form/select';

const BreakerConfiguration = ({ data, id }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [breakerObj, setBreakerObj] = useState(data);

    const [breakerData, setBreakerData] = useState(data);
    const [doubleBreakerData, setDoubleBreakerData] = useState({});
    const [tripleBreakerData, setTripleBreakerData] = useState({});
    const [activeTab, setActiveTab] = useState('edit-breaker');

    const [singleBreaker, setSingleBreaker] = useState({});
    const [doubleBreaker, setDoubleBreaker] = useState({});
    const [tripleBreaker, setTripleBreaker] = useState({});

    const [singleBreakerChanges, setSingleBreakerChanges] = useState({});
    const [doubleBreakerChanges, setDoubleBreakerChanges] = useState({});
    const [tripleBreakerChanges, setTripleBreakerChanges] = useState({});

    const [selectedDeviceData, setSelectedDeviceData] = useState({});

    const [isProcessing, setIsProcessing] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [linkedSensors, setLinkedSensors] = useState([]);

    // Edit Breaker Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    // Unlink Alert Modal
    const [showUnlinkAlert, setShowUnlinkAlert] = useState(false);
    const handleUnlinkAlertClose = () => setShowUnlinkAlert(false);
    const handleUnlinkAlertShow = () => setShowUnlinkAlert(true);

    // Delete Alert Modal
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleDeleteAlertClose = () => setShowDeleteAlert(false);
    const handleDeleteAlertShow = () => setShowDeleteAlert(true);

    const [sensorData, setSensorData] = useState([]);
    const [doubleSensorData, setDoubleSensorData] = useState([]);
    const [tripleSensorData, setTripleSensorData] = useState([]);

    const [isSensorDataFetched, setIsSensorDataFetched] = useState(false);
    const [isSensorDataFetchedForDouble, setIsSensorDataFetchedForDouble] = useState(false);
    const [isSensorDataFetchedForTriple, setIsSensorDataFetchedForTriple] = useState(false);

    const passiveDeviceData = BreakersStore.useState((s) => s.passiveDeviceData);
    const totalPassiveDeviceCount = BreakersStore.useState((s) => s.totalPassiveDeviceCount);
    const equipmentData = BreakersStore.useState((s) => s.equipmentData);
    const equipmentsList = BreakersStore.useState((s) => s.equipmentData);
    const distributedBreakersData = BreakersStore.useState((s) => s.distributedBreakersData);
    const isEditable = BreakersStore.useState((s) => s.isEditable);

    const [passiveDevicePageNo, setPassiveDevicePageNo] = useState(1);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const closeModalWithoutSave = () => {
        handleEditBreakerClose();
        setBreakerData(Object.assign({}, singleBreaker));
        setDoubleBreakerData(Object.assign({}, doubleBreaker));
        setTripleBreakerData(Object.assign({}, tripleBreaker));
        setLinkedSensors([]);
    };

    const fetchDeviceSensorData = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }

        setIsSensorDataFetched(true);
        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                setSensorData(unlinkedSensor.concat(linkedSensor));
                if (doubleBreakerData.data.device_id !== '') {
                    setDoubleSensorData(unlinkedSensor.concat(linkedSensor));
                }
                if (tripleBreakerData.data.device_id !== '') {
                    setTripleSensorData(unlinkedSensor.concat(linkedSensor));
                }
                setIsSensorDataFetched(false);
            })
            .catch(() => {
                setIsSensorDataFetched(false);
            });
    };

    const fetchSensorDataForSelectionOne = async (deviceId, breakerLvl) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }

        setIsSensorDataFetched(true);
        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                setSensorData(unlinkedSensor.concat(linkedSensor));
                setDoubleSensorData(unlinkedSensor.concat(linkedSensor));
                if (breakerLvl === 'triple') {
                    setTripleSensorData(unlinkedSensor.concat(linkedSensor));
                }
                setIsSensorDataFetched(false);
            })
            .catch(() => {
                setIsSensorDataFetched(false);
            });
    };

    const fetchSingleSensorList = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }
        if (deviceId === undefined) {
            return;
        }

        setIsSensorDataFetched(true);
        setIsSensorDataFetchedForDouble(true);
        setIsSensorDataFetchedForTriple(true);
        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                setSensorData(unlinkedSensor.concat(linkedSensor));
                setDoubleSensorData(unlinkedSensor.concat(linkedSensor));
                setTripleSensorData(unlinkedSensor.concat(linkedSensor));
                setIsSensorDataFetched(false);
                setIsSensorDataFetchedForDouble(false);
                setIsSensorDataFetchedForTriple(false);
            })
            .catch(() => {
                setIsSensorDataFetched(false);
                setIsSensorDataFetchedForDouble(false);
                setIsSensorDataFetchedForTriple(false);
            });
    };

    const fetchMultipleSensorList = async (deviceId, breakerNo) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }
        if (deviceId === undefined) {
            return;
        }
        if (breakerNo === 'first') {
            setIsSensorDataFetched(true);
        }
        if (breakerNo === 'second') {
            setIsSensorDataFetchedForDouble(true);
        }
        if (breakerNo === 'third') {
            setIsSensorDataFetchedForTriple(true);
        }

        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                if (breakerNo === 'first') {
                    setSensorData(unlinkedSensor.concat(linkedSensor));
                    setIsSensorDataFetched(false);
                }
                if (breakerNo === 'second') {
                    setDoubleSensorData(unlinkedSensor.concat(linkedSensor));
                    setIsSensorDataFetchedForDouble(false);
                }
                if (breakerNo === 'third') {
                    setTripleSensorData(unlinkedSensor.concat(linkedSensor));
                    setIsSensorDataFetchedForTriple(false);
                }
            })
            .catch(() => {
                if (breakerNo === 'first') {
                    setIsSensorDataFetched(false);
                }
                if (breakerNo === 'second') {
                    setIsSensorDataFetchedForDouble(false);
                }
                if (breakerNo === 'third') {
                    setIsSensorDataFetchedForTriple(false);
                }
            });
    };

    const unLinkCurrentBreaker = async () => {
        setIsResetting(true);

        let breakersList = [];

        if (breakerData.breakerType === 1) {
            breakersList.push(id);
        }
        if (breakerData.breakerType === 2) {
            breakersList.push(id);
            breakersList.push(doubleBreakerData.id);
        }
        if (breakerData.breakerType === 3) {
            breakersList.push(id);
            breakersList.push(doubleBreakerData.id);
            breakersList.push(tripleBreakerData.id);
        }

        let params = `?building_id=${bldgId}`;
        let payload = { breaker_id: breakersList };

        await resetAllBreakers(params, payload)
            .then((res) => {
                setIsResetting(false);
                window.scrollTo(0, 0);
                handleUnlinkAlertClose();
                triggerBreakerAPI();
            })
            .catch(() => {
                setIsResetting(false);
            });
    };

    const deleteCurrentBreaker = async () => {
        setIsDeleting(true);

        let params = `?breaker_id=${id}`;

        await getBreakerDeleted(params)
            .then((res) => {
                setIsDeleting(false);
                window.scrollTo(0, 0);
                handleDeleteAlertClose();
                triggerBreakerAPI();
            })
            .catch(() => {
                setIsDeleting(false);
            });
    };

    const fetchAllSensorData = (deviceOne, deviceTwo, deviceThree) => {
        if (deviceOne === deviceTwo && deviceOne === deviceThree) {
            fetchSingleSensorList(deviceOne);
        } else {
            fetchMultipleSensorList(deviceOne, 'first');
            fetchMultipleSensorList(deviceTwo, 'second');
            fetchMultipleSensorList(deviceThree, 'third');
        }
    };

    const fetchDeviceSensorDataForDouble = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }

        setIsSensorDataFetchedForDouble(true);
        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                setDoubleSensorData(unlinkedSensor.concat(linkedSensor));
                setIsSensorDataFetchedForDouble(false);
            })
            .catch(() => {
                setIsSensorDataFetchedForDouble(false);
            });
    };

    const fetchDeviceSensorDataForTriple = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === 'unlink') {
            return;
        }

        setIsSensorDataFetchedForTriple(true);
        let params = `?device_id=${deviceId}&building_id=${bldgId}`;
        await getSensorsList(params)
            .then((res) => {
                let response = res?.data;
                let linkedSensor = [];
                let unlinkedSensor = [];
                response.forEach((el) => (el?.breaker_id !== '' ? linkedSensor.push(el) : unlinkedSensor.push(el)));
                setTripleSensorData(unlinkedSensor.concat(linkedSensor));
                setIsSensorDataFetchedForTriple(false);
            })
            .catch(() => {
                setIsSensorDataFetchedForTriple(false);
            });
    };

    const triggerBreakerAPI = () => {
        LoadingStore.update((s) => {
            s.isBreakerDataFetched = true;
        });
    };

    // Single Level Breaker API
    const saveBreakerData = async () => {
        try {
            setIsProcessing(true);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let breakerObj = {
                ...singleBreakerChanges,
                breaker_id: id,
            };

            if (breakerObj.device_id || breakerObj.device_id === '') {
                breakerObj['device_link'] = breakerObj['device_id'];
                delete breakerObj['device_id'];
            }

            if (breakerObj.sensor_id || breakerObj.sensor_id === '') {
                breakerObj['sensor_link'] = breakerObj['sensor_id'];
                delete breakerObj['sensor_id'];
            }

            if (breakerObj.sensor_link) {
                if (!(breakerObj.device_link || breakerObj.device_link === '')) {
                    breakerObj.device_link = breakerData.device_id;
                }
            }

            let params = `?building_id=${bldgId}`;
            await axios.post(`${BaseUrl}${updateBreakers}${params}`, [breakerObj], { headers }).then((res) => {
                setIsProcessing(false);
                triggerBreakerAPI();
                handleEditBreakerClose();
            });
        } catch (error) {
            setIsProcessing(false);
            handleEditBreakerClose();
        }
    };

    // Two Level Breaker API
    const saveDoubleBreakerData = async () => {
        try {
            setIsProcessing(true);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let breakerObjOne = {
                ...singleBreakerChanges,
                breaker_id: id,
            };

            let breakerObjTwo = {
                ...doubleBreakerChanges,
                breaker_id: doubleBreakerData.id,
            };

            if (breakerObjOne.rated_amps) {
                breakerObjTwo.rated_amps = breakerObjOne.rated_amps;
            }

            if (breakerObjOne.equipment_link) {
                breakerObjTwo.equipment_link = breakerObjOne.equipment_link;
            }

            if (breakerObjOne.device_id || breakerObjOne.device_id === '') {
                breakerObjOne['device_link'] = breakerObjOne['device_id'];
                delete breakerObjOne['device_id'];
            }

            if (breakerObjOne.sensor_id || breakerObjOne.sensor_id === '') {
                breakerObjOne['sensor_link'] = breakerObjOne['sensor_id'];
                delete breakerObjOne['sensor_id'];
            }

            if (breakerObjTwo.device_id || breakerObjTwo.device_id === '') {
                breakerObjTwo['device_link'] = breakerObjTwo['device_id'];
                delete breakerObjTwo['device_id'];
            }

            if (breakerObjTwo.sensor_id || breakerObjTwo.sensor_id === '') {
                breakerObjTwo['sensor_link'] = breakerObjTwo['sensor_id'];
                delete breakerObjTwo['sensor_id'];
            }

            if (breakerObjOne.sensor_link) {
                if (!(breakerObjOne.device_link || breakerObjOne.device_link === '')) {
                    breakerObjOne.device_link = breakerData.device_id;
                }
            }

            if (breakerObjTwo.sensor_link) {
                if (!(breakerObjTwo.device_link || breakerObjTwo.device_link === '')) {
                    breakerObjTwo.device_link = breakerData.device_id;
                }
            }

            let params = `?building_id=${bldgId}`;
            await axios
                .post(`${BaseUrl}${updateBreakers}${params}`, [breakerObjOne, breakerObjTwo], { headers })
                .then((res) => {
                    setIsProcessing(false);
                    triggerBreakerAPI();
                    handleEditBreakerClose();
                });
        } catch (error) {
            setIsProcessing(false);
            handleEditBreakerClose();
        }
    };

    // Three Level Breaker API
    const saveTripleBreakerData = async () => {
        try {
            setIsProcessing(true);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let breakerObjOne = {
                ...singleBreakerChanges,
                breaker_id: id,
            };

            let breakerObjTwo = {
                ...doubleBreakerChanges,
                breaker_id: doubleBreakerData.id,
            };

            let breakerObjThree = {
                ...tripleBreakerChanges,
                breaker_id: tripleBreakerData.id,
            };

            if (breakerObjOne.rated_amps) {
                breakerObjTwo.rated_amps = breakerObjOne.rated_amps;
                breakerObjThree.rated_amps = breakerObjOne.rated_amps;
            }

            if (breakerObjOne.equipment_link) {
                breakerObjTwo.equipment_link = breakerObjOne.equipment_link;
                breakerObjThree.equipment_link = breakerObjOne.equipment_link;
            }

            if (breakerObjOne.device_id || breakerObjOne.device_id === '') {
                breakerObjOne['device_link'] = breakerObjOne['device_id'];
                delete breakerObjOne['device_id'];
            }

            if (breakerObjOne.sensor_id || breakerObjOne.sensor_id === '') {
                breakerObjOne['sensor_link'] = breakerObjOne['sensor_id'];
                delete breakerObjOne['sensor_id'];
            }

            if (breakerObjTwo.device_id || breakerObjTwo.device_id === '') {
                breakerObjTwo['device_link'] = breakerObjTwo['device_id'];
                delete breakerObjTwo['device_id'];
            }

            if (breakerObjTwo.sensor_id || breakerObjTwo.sensor_id === '') {
                breakerObjTwo['sensor_link'] = breakerObjTwo['sensor_id'];
                delete breakerObjTwo['sensor_id'];
            }

            if (breakerObjThree.device_id || breakerObjThree.device_id === '') {
                breakerObjThree['device_link'] = breakerObjThree['device_id'];
                delete breakerObjThree['device_id'];
            }

            if (breakerObjThree.sensor_id || breakerObjThree.sensor_id === '') {
                breakerObjThree['sensor_link'] = breakerObjThree['sensor_id'];
                delete breakerObjThree['sensor_id'];
            }

            if (breakerObjOne.sensor_link) {
                if (!(breakerObjOne.device_link || breakerObjOne.device_link === '')) {
                    breakerObjOne.device_link = breakerData.device_id;
                }
            }

            if (breakerObjTwo.sensor_link) {
                if (!(breakerObjTwo.device_link || breakerObjTwo.device_link === '')) {
                    breakerObjTwo.device_link = doubleBreakerData.data.device_id;
                }
            }

            if (breakerObjThree.sensor_link) {
                if (!(breakerObjThree.device_link || breakerObjThree.device_link === '')) {
                    breakerObjThree.device_link = tripleBreakerData.data.device_id;
                }
            }

            let params = `?building_id=${bldgId}`;
            await axios
                .post(`${BaseUrl}${updateBreakers}${params}`, [breakerObjOne, breakerObjTwo, breakerObjThree], {
                    headers,
                })
                .then((res) => {
                    setIsProcessing(false);
                    triggerBreakerAPI();
                    handleEditBreakerClose();
                });
        } catch (error) {
            setIsProcessing(false);
            handleEditBreakerClose();
        }
    };

    const findEquipmentName = (equipId) => {
        let equip = equipmentData?.find((record) => record?.value === equipId);
        return equip?.label;
    };

    const handleSingleBreakerChange = (id, key, value) => {
        let breaker = Object.assign({}, breakerData);
        let breakerChanges = Object.assign({}, singleBreakerChanges);

        if (key === 'equipment_link') {
            let arr = [];
            if (value !== '') {
                arr.push(value);
            }
            value = arr;
        }
        if (key === 'device_id') {
            if (value === '') {
                breaker.sensor_id = '';
                breakerChanges.sensor_id = '';
            }
        }
        if (key === 'sensor_id') {
            if (value === '') {
                breaker.device_id = '';
                breakerChanges.device_id = '';
            }
        }
        breaker[key] = value;
        breakerChanges[key] = value;

        setBreakerData(breaker);
        setSingleBreakerChanges(breakerChanges);
    };

    const handleDoubleBreakerChange = (id, key, value) => {
        let breaker = Object.assign({}, doubleBreakerData);
        let breakerTwo = Object.assign({}, doubleBreakerChanges);
        if (key === 'equipment_link') {
            let arr = [];
            if (value !== '') {
                arr.push(value);
            }
            value = arr;
        }
        let data = Object.assign({}, breaker.data);
        if (key === 'device_id') {
            if (value === '') {
                data.sensor_id = '';
                breakerTwo.sensor_id = '';
            }
        }
        if (key === 'sensor_id') {
            if (value === '') {
                data.device_id = '';
                breakerTwo.device_id = '';
            }
        }
        data[key] = value;
        breaker['data'] = data;
        breakerTwo[key] = value;
        setDoubleBreakerData(breaker);
        setDoubleBreakerChanges(breakerTwo);
    };

    const handleTripleBreakerChange = (id, key, value) => {
        let breaker = Object.assign({}, tripleBreakerData);
        let breakerThree = Object.assign({}, tripleBreakerChanges);
        if (key === 'equipment_link') {
            let arr = [];
            if (value !== '') {
                arr.push(value);
            }
            value = arr;
        }
        let data = Object.assign({}, breaker.data);
        if (key === 'device_id') {
            if (value === '') {
                data.sensor_id = '';
                breakerThree.sensor_id = '';
            }
        }
        if (key === 'sensor_id') {
            if (value === '') {
                data.device_id = '';
                breakerThree.device_id = '';
            }
        }
        data[key] = value;
        breaker['data'] = data;
        breakerThree[key] = value;
        setTripleBreakerData(breaker);
        setTripleBreakerChanges(breakerThree);
    };

    const handleLinkedSensor = (previousSensorId, newSensorId) => {
        if (previousSensorId === '') {
            let newSensorList = linkedSensors;
            newSensorList.push(newSensorId);
            setLinkedSensors(newSensorList);
        } else {
            let newSensorList = linkedSensors;
            let filteredList = newSensorList.filter((record) => {
                return record !== previousSensorId;
            });

            filteredList.push(newSensorId);
            setLinkedSensors(filteredList);
        }
    };

    useEffect(() => {
        if (breakerObj?.device_id !== '') {
            setSelectedDeviceData({
                value: breakerObj?.device_id,
                label: breakerObj?.device_name,
            });
        }

        if (!breakerObj.isLinked) {
            return;
        }

        if (breakerObj.breakerType === 2) {
            if (breakerObj.parentBreaker === '') {
                let obj = distributedBreakersData.find((obj) => obj.data.parentBreaker === id);
                setDoubleBreakerData(obj);
                setDoubleBreaker(obj);
            } else {
                let obj = distributedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                setDoubleBreakerData(obj);
                setDoubleBreaker(obj);
            }
        }

        if (breakerObj.breakerType === 3) {
            if (breakerObj.parentBreaker === '') {
                let breakersList = distributedBreakersData.filter((obj) => obj.data.parentBreaker === id);
                setDoubleBreakerData(breakersList[0]);
                setTripleBreakerData(breakersList[1]);
                setDoubleBreaker(breakersList[0]);
                setTripleBreaker(breakersList[1]);
            } else {
                let objOne = distributedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                let objTwo = distributedBreakersData.find(
                    (obj) => obj.data.parentBreaker === breakerObj.parentBreaker && obj.id !== id
                );
                setDoubleBreakerData(objOne);
                setTripleBreakerData(objTwo);
                setDoubleBreaker(objOne);
                setTripleBreaker(objTwo);
            }
        }
    }, [breakerObj]);

    useEffect(() => {
        const fetchPassiveDeviceData = async () => {
            if (passiveDevicePageNo === 1) {
                return;
            }
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&page_size=100&page_no=${passiveDevicePageNo}`;

                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let responseData = res.data.data;

                    let newArray = [...passiveDeviceData];
                    responseData.forEach((record) => {
                        let obj = {
                            label: record.identifier,
                            value: record.equipments_id,
                        };
                        newArray.push(obj);
                    });
                    BreakersStore.update((s) => {
                        s.passiveDeviceData = newArray;
                    });
                    BreakersStore.update((s) => {
                        s.totalPassiveDeviceCount = res?.data?.total_data;
                    });
                });
            } catch (error) {}
        };
        fetchPassiveDeviceData();
    }, [passiveDevicePageNo]);

    const [deviceIdDataLevelOne, setDeviceIdDataLevelOne] = useState([]);

    const addDevideIdType = () => {
        passiveDeviceData.map((item) => {
            setDeviceIdDataLevelOne((el) => [...el, { value: `${item?.value}`, label: `${item?.label}` }]);
        });
    };

    useEffect(() => {
        if (passiveDeviceData) {
            setDeviceIdDataLevelOne([]);
            addDevideIdType();
        }
    }, [passiveDeviceData]);

    const [sensorDataSearch, setSensorDataSearch] = useState([]);
    const [doubleSensorDataSearch, setDoubleSensorDataSearch] = useState([]);
    const [tripleSensorDataSearch, setTripleSensorDataSearch] = useState([]);

    const sensorDataFunc = () => {
        setDoubleSensorDataSearch([]);
        setTripleSensorDataSearch([]);
        sensorData.map((item) => {
            setSensorDataSearch((el) => [
                ...el,
                { value: `${item?.id}`, label: `${item?.name}`, breaker_id: `${item?.breaker_id}`, id: `${item?.id}` },
            ]);
        });
        doubleSensorData.map((item) => {
            setDoubleSensorDataSearch((el) => [
                ...el,
                { value: `${item?.id}`, label: `${item?.name}`, breaker_id: `${item?.breaker_id}`, id: `${item?.id}` },
            ]);
        });
        tripleSensorData.map((item) => {
            setTripleSensorDataSearch((el) => [
                ...el,
                { value: `${item?.id}`, label: `${item?.name}`, breaker_id: `${item?.breaker_id}`, id: `${item?.id}` },
            ]);
        });
    };

    useEffect(() => {
        if (sensorData || doubleSensorData || tripleSensorData) {
            setSensorDataSearch([]);
            sensorDataFunc();
        }
    }, [sensorData, doubleSensorData, tripleSensorData]);

    const [equipmentDataSearch, setEquipmentDataSearch] = useState([]);

    const equpimentDataFunc = () => {
        equipmentData.map((item) => {
            setEquipmentDataSearch((el) => [
                ...el,
                { value: `${item?.value}`, label: `${item?.label}`, breakerId: `${item?.breakerId}` },
            ]);
        });
    };

    useEffect(() => {
        if (equipmentData) {
            setEquipmentDataSearch([]);
            equpimentDataFunc();
        }
    }, [equipmentData]);

    const loadOptions = (inputValue) => {
        if (inputValue.length < 3) {
            return;
        }

        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        let searchTxt = encodeURIComponent(inputValue.trim());
        let params = `?device_type=passive&building_id=${bldgId}&mac=${searchTxt}`;

        return axios.post(`${BaseUrl}${searchDevices}${params}`, {}, { headers }).then((res) => {
            let response = res?.data;
            let results = [];
            response.forEach((record) => {
                let obj = {
                    label: record.identifier,
                    value: record.equipments_id,
                };
                results.push(obj);
                setSelectedDeviceData(obj);
            });
            return results;
        });
    };

    useEffect(() => {
        if (selectedDeviceData.value) {
            let newDeviceList = [];
            newDeviceList.push(selectedDeviceData);
            deviceIdDataLevelOne.forEach((record) => {
                if (record.value !== selectedDeviceData.value) {
                    newDeviceList.push(record);
                }
            });
            setDeviceIdDataLevelOne(newDeviceList);
        }
    }, [selectedDeviceData]);

    useEffect(() => {
        setSingleBreaker(data);
    }, []);

    return (
        <React.Fragment>
            {/* Left Breaker Connection Point  */}
            {breakerData.breaker_number % 2 === 1 && (
                <>
                    {breakerData.breaker_number !== 1 && (
                        <Handle
                            type="target"
                            position="left"
                            id="a"
                            style={{ top: 20, backgroundColor: '#bababa', width: '5px', height: '5px' }}
                        />
                    )}

                    <Handle
                        type="source"
                        position="left"
                        id="b"
                        style={{ bottom: 30, top: 'auto', backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                </>
            )}

            {/* Right Breaker Connection Point  */}
            {breakerData.breaker_number % 2 === 0 && (
                <>
                    {breakerData.breaker_number !== 2 && (
                        <Handle
                            type="target"
                            position="right"
                            id="a"
                            style={{ top: 20, backgroundColor: '#bababa', width: '5px', height: '5px' }}
                        />
                    )}
                    <Handle
                        type="source"
                        position="right"
                        id="b"
                        style={{ bottom: 30, top: 'auto', backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                </>
            )}

            <div className="breaker-container m-1 mb-4">
                <div className="sub-breaker-style">
                    <div className="breaker-content-middle">
                        <div className="breaker-index">{breakerData?.breaker_number}</div>
                    </div>
                    <div className="breaker-content-middle">
                        <div className="dot-status"></div>
                    </div>
                    <div className="breaker-content-middle">
                        <div className="breaker-content">
                            <div>{breakerData.rated_amps ? `${breakerData.rated_amps}A` : `0A`}</div>
                            <span>{breakerData.voltage ? `${breakerData.voltage}V` : `0V`}</span>
                        </div>
                    </div>
                    {!(breakerData.equipment_link.length === 0) ? (
                        <>
                            <div className="breaker-equipName-style">
                                <h6
                                    className="ml-3 breaker-equip-name"
                                    style={{ width: !isEditable ? '11rem' : '6.5rem' }}>
                                    {findEquipmentName(breakerData.equipment_link[0])}
                                </h6>
                            </div>
                            {!(
                                (breakerData.breaker_level === 'triple-breaker' &&
                                    breakerData.panel_voltage === '120/240') ||
                                (breakerData.breaker_level === 'double-breaker' && breakerData.panel_voltage === '600')
                            ) && (
                                <>
                                    {isEditable && (
                                        <div
                                            id={`breaker-${data?.breaker_number}`}
                                            className="breaker-content-middle"
                                            onClick={() => {
                                                handleEditBreakerShow();
                                                if (
                                                    data?.sensor_id === '' &&
                                                    doubleBreakerData?.data?.device_id === '' &&
                                                    tripleBreakerData?.data?.device_id === ''
                                                ) {
                                                    return;
                                                }
                                                fetchAllSensorData(
                                                    data?.device_id,
                                                    doubleBreakerData?.data?.device_id,
                                                    tripleBreakerData?.data?.device_id
                                                );
                                            }}>
                                            <PenSVG className="mr-2" />
                                            <div className="font-weight-bold edit-btn-styling">Edit</div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            {!(
                                (breakerData.breaker_level === 'triple-breaker' &&
                                    breakerData.panel_voltage === '120/240') ||
                                (breakerData.breaker_level === 'double-breaker' && breakerData.panel_voltage === '600')
                            ) && (
                                <>
                                    {isEditable && (
                                        <div
                                            id={`breaker-${data?.breaker_number}`}
                                            className="breaker-content-middle"
                                            onClick={() => {
                                                handleEditBreakerShow();
                                                if (
                                                    data?.sensor_id === '' &&
                                                    doubleBreakerData?.data?.device_id === '' &&
                                                    tripleBreakerData?.data?.device_id === ''
                                                ) {
                                                    return;
                                                }
                                                fetchAllSensorData(
                                                    data?.device_id,
                                                    doubleBreakerData?.data?.device_id,
                                                    tripleBreakerData?.data?.device_id
                                                );
                                            }}>
                                            <PenSVG className="mr-2" />

                                            <span className="font-weight-bold edit-btn-styling">Edit</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal show={showEditBreaker} onHide={handleEditBreakerClose} size="xl" centered>
                <div>
                    <div
                        className="passive-header-wrapper d-flex justify-content-between"
                        style={{ background: 'none' }}>
                        <div className="d-flex flex-column justify-content-between">
                            <Typography.Subheader size={Typography.Sizes.sm}>
                                {`Panel 2 > 00-08-20-83-53-D1`}
                            </Typography.Subheader>
                            <Typography.Header size={Typography.Sizes.md}>Breakers 15, 17</Typography.Header>
                            <div className="d-flex justify-content-start mouse-pointer ">
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    className={`typography-wrapper mr-4 ${
                                        activeTab === 'edit-breaker' ? 'active-tab-style' : ''
                                    }`}
                                    onClick={() => setActiveTab('edit-breaker')}>
                                    {`Edit Breaker(s)`}
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
                                    label="Save"
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    // onClick={handleEquipmentUpdate}
                                    className="ml-2"
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
                                            value={1}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Rated Amps</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <InputTooltip
                                            type="number"
                                            placeholder="Enter Amperage"
                                            labelSize={Typography.Sizes.md}
                                            value={100}
                                        />
                                    </div>

                                    <div>
                                        <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <Brick sizeInRem={0.25} />
                                        <Select placeholder="Select Volts" options={voltsOption} isSearchable={true} />
                                    </div>
                                </div>

                                <Brick sizeInRem={1} />
                                <hr />
                                <Brick sizeInRem={1} />

                                <div className="breaker-main-config">
                                    <div className="w-100">
                                        <>
                                            {/* Breaker 1 */}
                                            <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                                Breaker {breakerData?.breaker_number}
                                            </div>
                                            <div className="panel-edit-grid ml-2 mr-2">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Device ID</Form.Label>
                                                    <AsyncSelect
                                                        name="select"
                                                        defaultOptions={deviceIdDataLevelOne}
                                                        loadOptions={loadOptions}
                                                        placeholder="Select Device"
                                                        value={deviceIdDataLevelOne.filter(
                                                            (option) => option.value === breakerData.device_id
                                                        )}
                                                        onChange={(e) => {
                                                            fetchSensorDataForSelectionOne(e.value, 'triple');
                                                            handleSingleBreakerChange(id, 'device_id', e.value);
                                                            // if (doubleBreakerData.data.device_id === '') {
                                                            handleDoubleBreakerChange(id, 'device_id', e.value);
                                                            // }
                                                            // if (tripleBreakerData.data.device_id === '') {
                                                            handleTripleBreakerChange(id, 'device_id', e.value);
                                                            // }
                                                        }}
                                                        className="font-weight-bold"
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Sensor #</Form.Label>
                                                    {isSensorDataFetched ? (
                                                        <Skeleton count={1} height={35} />
                                                    ) : (
                                                        <Select
                                                            id="userState"
                                                            placeholder="Select Sensor"
                                                            name="select"
                                                            isSearchable={true}
                                                            defaultValue={'Select Sensor'}
                                                            options={sensorDataSearch}
                                                            value={sensorDataSearch.filter(
                                                                (option) => option.value === breakerData.sensor_id
                                                            )}
                                                            onChange={(e) => {
                                                                handleLinkedSensor(breakerData.sensor_id, e.value);
                                                                handleSingleBreakerChange(id, 'sensor_id', e.value);
                                                            }}
                                                            className="font-weight-bold"
                                                            isOptionDisabled={(option) =>
                                                                option.breaker_id !== '' ||
                                                                linkedSensors.includes(option.id)
                                                            }
                                                        />
                                                    )}
                                                </Form.Group>
                                            </div>

                                            {/* Breaker 2 */}
                                            <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                                Breaker {doubleBreakerData?.data?.breaker_number}
                                            </div>
                                            <div className="panel-edit-grid ml-2 mr-2">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Device ID</Form.Label>
                                                    <AsyncSelect
                                                        name="select"
                                                        defaultOptions={deviceIdDataLevelOne}
                                                        loadOptions={loadOptions}
                                                        placeholder="Select Device"
                                                        value={deviceIdDataLevelOne.filter(
                                                            (option) =>
                                                                option.value === doubleBreakerData?.data?.device_id
                                                        )}
                                                        onChange={(e) => {
                                                            fetchDeviceSensorDataForDouble(e.value);
                                                            handleDoubleBreakerChange(id, 'device_id', e.value);
                                                        }}
                                                        className="font-weight-bold"
                                                        isDisabled
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Sensor #</Form.Label>
                                                    {isSensorDataFetchedForDouble ? (
                                                        <Skeleton count={1} height={35} />
                                                    ) : (
                                                        <Select
                                                            id="userState"
                                                            placeholder="Select Sensor"
                                                            name="select"
                                                            isSearchable={true}
                                                            defaultValue={'Select Sensor'}
                                                            options={doubleSensorDataSearch}
                                                            value={doubleSensorDataSearch.filter(
                                                                (option) =>
                                                                    option.value === doubleBreakerData?.data?.sensor_id
                                                            )}
                                                            onChange={(e) => {
                                                                handleLinkedSensor(
                                                                    doubleBreakerData?.data?.sensor_id,
                                                                    e.value
                                                                );
                                                                handleDoubleBreakerChange(id, 'sensor_id', e.value);
                                                            }}
                                                            className="font-weight-bold"
                                                            isOptionDisabled={(option) =>
                                                                option.breaker_id !== '' ||
                                                                linkedSensors.includes(option.id)
                                                            }
                                                        />
                                                    )}
                                                </Form.Group>
                                            </div>

                                            {/* Breaker 3 */}
                                            <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                                Breaker {tripleBreakerData?.data?.breaker_number}
                                            </div>
                                            <div className="panel-edit-grid ml-2 mr-2">
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Device ID</Form.Label>
                                                    <AsyncSelect
                                                        name="select"
                                                        defaultOptions={deviceIdDataLevelOne}
                                                        loadOptions={loadOptions}
                                                        placeholder="Select Device"
                                                        value={deviceIdDataLevelOne.filter(
                                                            (option) =>
                                                                option.value === tripleBreakerData?.data?.device_id
                                                        )}
                                                        onChange={(e) => {
                                                            fetchDeviceSensorDataForTriple(e.value);
                                                            handleTripleBreakerChange(id, 'device_id', e.value);
                                                        }}
                                                        className="font-weight-bold"
                                                        isDisabled
                                                    />
                                                </Form.Group>

                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label>Sensor #</Form.Label>
                                                    {isSensorDataFetchedForTriple ? (
                                                        <Skeleton count={1} height={35} />
                                                    ) : (
                                                        <Select
                                                            id="userState"
                                                            placeholder="Select Sensor"
                                                            name="select"
                                                            isSearchable={true}
                                                            defaultValue={'Select Sensor'}
                                                            options={tripleSensorDataSearch}
                                                            value={tripleSensorDataSearch.filter(
                                                                (option) =>
                                                                    option.value === tripleBreakerData?.data?.sensor_id
                                                            )}
                                                            onChange={(e) => {
                                                                handleLinkedSensor(
                                                                    tripleBreakerData?.data?.sensor_id,
                                                                    e.value
                                                                );
                                                                handleTripleBreakerChange(id, 'sensor_id', e.value);
                                                            }}
                                                            className="font-weight-bold"
                                                            isOptionDisabled={(option) =>
                                                                option.breaker_id !== '' ||
                                                                linkedSensors.includes(option.id)
                                                            }
                                                        />
                                                    )}
                                                </Form.Group>
                                            </div>
                                            <div className="edit-form-breaker ml-2 mr-2 mb-2" />
                                        </>
                                    </div>
                                    <div className="w-100">
                                        <Tabs type={Tabs.Types.subsection} tabCustomStyle="p-2">
                                            <Tabs.Item eventKey="equip" title="Equipment">
                                                <div className="p-default">
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
                                                                    // currentValue={equipmentsList.filter(
                                                                    //     (option) =>
                                                                    //         (option.value === option.value) ===
                                                                    //         breakerData.equipment_link[0]
                                                                    // )}
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
                                                                Unlabelled
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
                                                                Quanity
                                                            </Typography.Body>
                                                            <Brick sizeInRem={0.25} />
                                                            <InputTooltip
                                                                placeholder="Enter Equipment Quanity"
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
                showUnlinkAlert={showUnlinkAlert}
                handleUnlinkAlertClose={handleUnlinkAlertClose}
                handleEditBreakerShow={handleEditBreakerShow}
                isResetting={isResetting}
                unLinkCurrentBreaker={unLinkCurrentBreaker}
            />

            <DeleteBreaker
                showDeleteAlert={showDeleteAlert}
                handleDeleteAlertClose={handleDeleteAlertClose}
                handleEditBreakerShow={handleEditBreakerShow}
                isDeleting={isDeleting}
                deleteCurrentBreaker={deleteCurrentBreaker}
            />
        </React.Fragment>
    );
};

export default BreakerConfiguration;
