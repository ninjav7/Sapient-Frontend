import React, { useState, useEffect } from 'react';
import { Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {
    BaseUrl,
    listSensor,
    updateBreakers,
    generalPassiveDevices,
    resetBreakers,
    deleteBreaker,
    searchDevices,
} from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { Handle } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import { BuildingStore } from '../../../store/BuildingStore';
import Skeleton from 'react-loading-skeleton';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faTrash } from '@fortawesome/pro-regular-svg-icons';
import '../style.css';
import './panel-style.css';

const DistributedBreakerComponent = ({ data, id }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [breakerObj, setBreakerObj] = useState(data);

    const [breakerData, setBreakerData] = useState(data);
    const [doubleBreakerData, setDoubleBreakerData] = useState({});
    const [tripleBreakerData, setTripleBreakerData] = useState({});

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
    const distributedBreakersData = BreakersStore.useState((s) => s.distributedBreakersData);
    const isEditable = BreakersStore.useState((s) => s.isEditable);

    const [passiveDevicePageNo, setPassiveDevicePageNo] = useState(1);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const fetchDeviceSensorData = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }
        try {
            setIsSensorDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setSensorData(response);
                if (doubleBreakerData.data.device_id !== '') {
                    setDoubleSensorData(response);
                }
                if (tripleBreakerData.data.device_id !== '') {
                    setTripleSensorData(response);
                }
                setIsSensorDataFetched(false);
            });
        } catch (error) {
            setIsSensorDataFetched(false);
        }
    };

    const fetchSensorDataForSelectionOne = async (deviceId, breakerLvl) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }
        try {
            setIsSensorDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setSensorData(response);
                setDoubleSensorData(response);
                if (breakerLvl === 'triple') {
                    setTripleSensorData(response);
                }
                setIsSensorDataFetched(false);
            });
        } catch (error) {
            setIsSensorDataFetched(false);
        }
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
        try {
            setIsSensorDataFetched(true);
            setIsSensorDataFetchedForDouble(true);
            setIsSensorDataFetchedForTriple(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res?.data;
                setSensorData(response);
                setDoubleSensorData(response);
                setTripleSensorData(response);
                setIsSensorDataFetched(false);
                setIsSensorDataFetchedForDouble(false);
                setIsSensorDataFetchedForTriple(false);
            });
        } catch (error) {
            setIsSensorDataFetched(false);
            setIsSensorDataFetchedForDouble(false);
            setIsSensorDataFetchedForTriple(false);
        }
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
        try {
            if (breakerNo === 'first') {
                setIsSensorDataFetched(true);
            }
            if (breakerNo === 'second') {
                setIsSensorDataFetchedForDouble(true);
            }
            if (breakerNo === 'third') {
                setIsSensorDataFetchedForTriple(true);
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res?.data;
                if (breakerNo === 'first') {
                    setSensorData(response);
                    setIsSensorDataFetched(false);
                }
                if (breakerNo === 'second') {
                    setDoubleSensorData(response);
                    setIsSensorDataFetchedForDouble(false);
                }
                if (breakerNo === 'third') {
                    setTripleSensorData(response);
                    setIsSensorDataFetchedForTriple(false);
                }
            });
        } catch (error) {
            if (breakerNo === 'first') {
                setIsSensorDataFetched(false);
            }
            if (breakerNo === 'second') {
                setIsSensorDataFetchedForDouble(false);
            }
            if (breakerNo === 'third') {
                setIsSensorDataFetchedForTriple(false);
            }
        }
    };

    const unLinkCurrentBreaker = async () => {
        try {
            let breakersList = [];
            setIsResetting(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
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
            await axios
                .post(`${BaseUrl}${resetBreakers}${params}`, { breaker_id: breakersList }, { headers })
                .then((res) => {
                    setIsResetting(false);
                    window.scrollTo(0, 0);
                    handleUnlinkAlertClose();
                    triggerBreakerAPI();
                });
        } catch (error) {
            setIsResetting(false);
        }
    };

    const deleteCurrentBreaker = async () => {
        try {
            setIsDeleting(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?breaker_id=${id}`;
            await axios.delete(`${BaseUrl}${deleteBreaker}${params}`, { headers }).then((res) => {
                let response = res.data;
                setIsDeleting(false);
                handleDeleteAlertClose();
                triggerBreakerAPI();
            });
        } catch (error) {
            setIsDeleting(false);
        }
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
        try {
            setIsSensorDataFetchedForDouble(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setDoubleSensorData(response);
                setIsSensorDataFetchedForDouble(false);
            });
        } catch (error) {
            setIsSensorDataFetchedForDouble(false);
        }
    };

    const fetchDeviceSensorDataForTriple = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === 'unlink') {
            return;
        }
        try {
            setIsSensorDataFetchedForTriple(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setTripleSensorData(response);
                setIsSensorDataFetchedForTriple(false);
            });
        } catch (error) {
            setIsSensorDataFetchedForTriple(false);
        }
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
            } else {
                let obj = distributedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                setDoubleBreakerData(obj);
            }
        }

        if (breakerObj.breakerType === 3) {
            if (breakerObj.parentBreaker === '') {
                let breakersList = distributedBreakersData.filter((obj) => obj.data.parentBreaker === id);
                setDoubleBreakerData(breakersList[0]);
                setTripleBreakerData(breakersList[1]);
            } else {
                let objOne = distributedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                let objTwo = distributedBreakersData.find(
                    (obj) => obj.data.parentBreaker === breakerObj.parentBreaker && obj.id !== id
                );
                setDoubleBreakerData(objOne);
                setTripleBreakerData(objTwo);
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

            <FormGroup className="form-group row m-1 mb-4">
                <div className="breaker-container">
                    <div className="sub-breaker-style">
                        <div className="breaker-content-middle">
                            <div className="breaker-index">{breakerData.breaker_number}</div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="dot-status"></div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="breaker-content">
                                <span>{breakerData.rated_amps === 0 ? '' : `${breakerData.rated_amps}A`}</span>
                                <span>{breakerData.voltage === '' ? '' : `${breakerData.voltage}V`}</span>
                            </div>
                        </div>
                        {!(breakerData.equipment_link.length === 0) ? (
                            <>
                                <div className="breaker-equipName-style">
                                    <h6 className=" ml-3 breaker-equip-name">
                                        {findEquipmentName(breakerData.equipment_link[0])}
                                    </h6>
                                </div>
                                {!(
                                    (breakerData.breaker_level === 'triple-breaker' &&
                                        breakerData.panel_voltage === '120/240') ||
                                    (breakerData.breaker_level === 'double-breaker' &&
                                        breakerData.panel_voltage === '600')
                                ) && (
                                    <>
                                        {isEditable && (
                                            <div
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
                                                <div className="edit-icon-bg-styling mr-2">
                                                    <i className="uil uil-pen"></i>
                                                </div>

                                                <span className="font-weight-bold edit-btn-styling">Edit</span>
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
                                    (breakerData.breaker_level === 'double-breaker' &&
                                        breakerData.panel_voltage === '600')
                                ) && (
                                    <>
                                        {isEditable && (
                                            <div
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
                                                <div className="edit-icon-bg-styling mr-2">
                                                    <i className="uil uil-pen"></i>
                                                </div>

                                                <span className="font-weight-bold edit-btn-styling">Edit</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </FormGroup>

            <Modal show={showEditBreaker} onHide={handleEditBreakerClose} centered backdrop="static" keyboard={false}>
                <>
                    <div className="mt-4 ml-4 mb-0">
                        <Modal.Title className="edit-breaker-title mb-0">
                            {breakerData.breakerType === 1 ? 'Edit Breaker' : 'Edit Linked Breaker'}
                        </Modal.Title>
                        <Modal.Title className="edit-breaker-no mt-0">
                            {breakerData.breakerType === 1 && `Breaker ${breakerData.breaker_number}`}
                            {breakerData.breakerType === 2 &&
                                `Breaker ${breakerData.breaker_number}, ${doubleBreakerData?.data?.breaker_number}`}
                            {breakerData.breakerType === 3 &&
                                `Breaker ${breakerData.breaker_number}, ${doubleBreakerData?.data?.breaker_number}, ${tripleBreakerData?.data?.breaker_number}`}
                        </Modal.Title>
                    </div>
                    <Modal.Body>
                        <Form>
                            <div className="panel-model-row-style ml-2 mr-2">
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Phase</Form.Label>
                                    <Input
                                        type="select"
                                        name="state"
                                        id="userState"
                                        className="font-weight-bold breaker-phase-selection fields-disabled-style"
                                        placeholder="Select Phase"
                                        onChange={(e) => {
                                            if (e.target.value === 'Select Phase') {
                                                return;
                                            }
                                            handleSingleBreakerChange(id, 'phase_configuration', +e.target.value);
                                        }}
                                        value={breakerData.phase_configuration}
                                        disabled={true}>
                                        <option>Select Phase </option>
                                        <option value="3">3</option>
                                        <option value="1">1</option>
                                    </Input>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Amps</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter Amps"
                                        className="font-weight-bold"
                                        value={breakerData.rated_amps}
                                        min={0}
                                        step={breakerData.rated_amps < 50 ? 5 : 10}
                                        onChange={(e) => {
                                            handleSingleBreakerChange(id, 'rated_amps', +e.target.value);
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Volts</Form.Label>
                                    <Input
                                        type="select"
                                        name="state"
                                        id="userState"
                                        className="font-weight-bold breaker-phase-selection fields-disabled-style"
                                        placeholder="Select Volts"
                                        onChange={(e) => {
                                            if (e.target.value === 'Select Volts') {
                                                return;
                                            }
                                            handleSingleBreakerChange(id, 'voltage', e.target.value);
                                        }}
                                        value={breakerData.voltage}
                                        disabled={true}>
                                        <option>Select Volts</option>
                                        <option value="120">120</option>
                                        <option value="208">208</option>
                                        <option value="240">240</option>
                                        <option value="277">277</option>
                                        <option value="347">347</option>
                                        <option value="415">415</option>
                                        <option value="480">480</option>
                                        <option value="520">520</option>
                                        <option value="600">600</option>
                                    </Input>
                                </Form.Group>
                            </div>

                            <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                            <>
                                {breakerData.breakerType === 1 && (
                                    <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                        Breaker {breakerData.breaker_number}
                                    </div>
                                )}

                                {breakerData.breakerType === 1 && (
                                    <>
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
                                                        fetchDeviceSensorData(e.value);
                                                        handleSingleBreakerChange(id, 'device_id', e.value);
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
                                                        id="exampleSelect"
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
                                        <div className="edit-form-breaker ml-2 mr-2 mb-2" />
                                    </>
                                )}

                                {breakerData.breakerType === 2 && (
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
                                                        fetchSensorDataForSelectionOne(e.value, 'double');
                                                        handleSingleBreakerChange(id, 'device_id', e.value);
                                                        // if (doubleBreakerData.data.device_id === '') {
                                                        handleDoubleBreakerChange(id, 'device_id', e.value);
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
                                                        (option) => option.value === doubleBreakerData?.data?.device_id
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
                                                        value={doubleSensorDataSearch.filter((option) => {
                                                            return option.value === doubleBreakerData?.data?.sensor_id;
                                                        })}
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
                                    </>
                                )}

                                {breakerData.breakerType === 3 && (
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
                                                        (option) => option.value === doubleBreakerData?.data?.device_id
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
                                                        (option) => option.value === tripleBreakerData?.data?.device_id
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
                                )}
                            </>

                            <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Equipment</Form.Label>
                                <Select
                                    name="state"
                                    id="userState"
                                    placeholder="Select Equipment"
                                    isSearchable={true}
                                    options={equipmentDataSearch}
                                    value={equipmentDataSearch.filter(
                                        (option) => option.value === breakerData.equipment_link[0]
                                    )}
                                    onChange={(e) => {
                                        handleSingleBreakerChange(id, 'equipment_link', e.value);
                                    }}
                                    className="font-weight-bold"
                                    isOptionDisabled={(option) => option.breakerId !== ''}
                                />
                            </Form.Group>

                            <div className="edit-form-breaker ml-2 mr-2 mb-3" />

                            <FormGroup>
                                <div className="unlink-delete-breaker ml-2 mr-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleEditBreakerClose();
                                            handleUnlinkAlertShow();
                                        }}
                                        className="btn btn-md btn-danger font-weight-bold unlink-breaker-style">
                                        <FontAwesomeIcon
                                            icon={faLinkHorizontalSlash}
                                            color="#B42318"
                                            size="md"
                                            className="mr-2"
                                        />
                                        Unlink Breaker
                                    </button>
                                    {distributedBreakersData.length !== breakerData.breaker_number ? (
                                        <button
                                            type="button"
                                            className="btn btn-md btn-danger font-weight-bold disabled-breaker-style"
                                            disabled>
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                color="#FDA29B"
                                                size="md"
                                                className="mr-2"
                                            />
                                            Delete Breaker
                                        </button>
                                    ) : (
                                        <>
                                            {breakerData.breakerType === 2 || breakerData.breakerType === 3 ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-md btn-danger font-weight-bold disabled-breaker-style"
                                                        disabled>
                                                        <FontAwesomeIcon
                                                            icon={faTrash}
                                                            color="#FDA29B"
                                                            size="md"
                                                            className="mr-2"
                                                        />
                                                        Delete Breaker
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="btn btn-md btn-danger font-weight-bold unlink-breaker-style"
                                                    onClick={() => {
                                                        handleEditBreakerClose();
                                                        handleDeleteAlertShow();
                                                    }}>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        color="#B42318"
                                                        size="md"
                                                        className="mr-2"
                                                    />
                                                    Delete Breaker
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                                {distributedBreakersData.length === breakerData.breaker_number && (
                                    <>
                                        {(breakerData.breakerType === 2 || breakerData.breakerType === 3) && (
                                            <div className="grouped-breaker-warn mt-2 mr-2">
                                                Grouped breakers cannot be deleted
                                            </div>
                                        )}
                                    </>
                                )}
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                </>

                <Modal.Footer>
                    <Button variant="light" onClick={handleEditBreakerClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (breakerData.breakerType === 1) {
                                saveBreakerData();
                            }
                            if (breakerData.breakerType === 2) {
                                saveDoubleBreakerData();
                            }
                            if (breakerData.breakerType === 3) {
                                saveTripleBreakerData();
                            }
                        }}>
                        {isProcessing ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showUnlinkAlert} onHide={handleUnlinkAlertClose} centered backdrop="static" keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="unlink-heading-style ml-2 mb-0">Unlink Breaker</h5>
                    </div>
                    <div className="m-2">
                        <div className="unlink-alert-styling mb-1">Are you sure you want to unlink this breaker?</div>
                        <div className="unlink-alert-styling">All links to equipment and sensors will be lost.</div>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            handleUnlinkAlertClose();
                            handleEditBreakerShow();
                        }}
                        className="unlink-cancel-style">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            unLinkCurrentBreaker();
                        }}
                        className="unlink-reset-style">
                        {isResetting ? 'Resetting' : 'Reset'}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteAlert} onHide={handleDeleteAlertClose} centered backdrop="static" keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="unlink-heading-style ml-2 mb-0">Delete Breaker</h5>
                    </div>
                    <div className="m-2">
                        <div className="unlink-alert-styling mb-1">Are you sure you want to delete the Breaker?</div>
                        <div className="unlink-alert-styling">
                            This will remove the breaker from the panel and is not recoverable.
                        </div>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            handleDeleteAlertClose();
                            handleEditBreakerShow();
                        }}
                        className="unlink-cancel-style">
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            deleteCurrentBreaker();
                        }}
                        className="unlink-reset-style">
                        {isDeleting ? 'Deleting' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default DistributedBreakerComponent;
