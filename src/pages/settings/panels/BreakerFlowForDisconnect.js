import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, listSensor, updateBreakers } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls, Handle, Position } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import Skeleton from 'react-loading-skeleton';
import '../style.css';
import './panel-style.css';

const DisconnectedBreakerComponent = ({ data, id }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [breakerObj, setBreakerObj] = useState(data);
    const [breakerData, setBreakerData] = useState(data);
    const [doubleBreakerData, setDoubleBreakerData] = useState({});
    const [tripleBreakerData, setTripleBreakerData] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [linkedSensors, setLinkedSensors] = useState([]);

    // Edit Breaker Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    const [sensorData, setSensorData] = useState([]);
    const [doubleSensorData, setDoubleSensorData] = useState([]);
    const [tripleSensorData, setTripleSensorData] = useState([]);

    const [isSensorDataFetched, setIsSensorDataFetched] = useState(false);
    const [isSensorDataFetchedForDouble, setIsSensorDataFetchedForDouble] = useState(false);
    const [isSensorDataFetchedForTriple, setIsSensorDataFetchedForTriple] = useState(false);

    const [currentEquipIds, setCurrentEquipIds] = useState([]);

    const passiveDeviceData = BreakersStore.useState((s) => s.passiveDeviceData);
    const equipmentData = BreakersStore.useState((s) => s.equipmentData);
    const disconnectedBreakersData = BreakersStore.useState((s) => s.disconnectedBreakersData);
    const isEditable = BreakersStore.useState((s) => s.isEditable);

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
            let params = `?device_id=${deviceId}`;
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
            console.log(error);
            setIsSensorDataFetched(false);
            console.log('Failed to fetch Sensor Data');
        }
    };

    const fetchSensorDataForSelectionOne = async (deviceId) => {
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
            let params = `?device_id=${deviceId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setSensorData(response);
                setDoubleSensorData(response);
                setTripleSensorData(response);
                setIsSensorDataFetched(false);
            });
        } catch (error) {
            console.log(error);
            setIsSensorDataFetched(false);
            console.log('Failed to fetch Sensor Data');
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
            let params = `?device_id=${deviceId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setDoubleSensorData(response);
                setIsSensorDataFetchedForDouble(false);
            });
        } catch (error) {
            console.log(error);
            setIsSensorDataFetchedForDouble(false);
            console.log('Failed to fetch Sensor Data');
        }
    };

    const fetchDeviceSensorDataForTriple = async (deviceId) => {
        if (deviceId === null) {
            return;
        }
        if (deviceId === '') {
            return;
        }
        try {
            setIsSensorDataFetchedForTriple(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setTripleSensorData(response);
                setIsSensorDataFetchedForTriple(false);
            });
        } catch (error) {
            console.log(error);
            setIsSensorDataFetchedForTriple(false);
            console.log('Failed to fetch Sensor Data');
        }
    };

    const addSelectedBreakerEquip = (equipId) => {
        let newArray = [];
        newArray.push(equipId);
        setCurrentEquipIds(newArray);
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
                breaker_id: id,
                name: breakerData.name,
                breaker_number: breakerData.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: breakerData.sensor_id,
                device_link: breakerData.device_id,
                equipment_link: breakerData.equipment_link,
            };

            await axios.post(`${BaseUrl}${updateBreakers}`, [breakerObj], { headers }).then((res) => {
                setIsProcessing(false);
                setTimeout(() => {
                    triggerBreakerAPI();
                }, 1000);
                handleEditBreakerClose();
            });
        } catch (error) {
            console.log('Failed to update Breaker');
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
                breaker_id: id,
                name: breakerData.name,
                breaker_number: breakerData.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: breakerData.sensor_id,
                device_link: breakerData.device_id,
                equipment_link: breakerData.equipment_link,
            };

            let breakerObjTwo = {
                breaker_id: doubleBreakerData.id,
                name: doubleBreakerData.data.name,
                breaker_number: doubleBreakerData.data.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: breakerData.sensor_id,
                device_link: breakerData.device_id,
                equipment_link: breakerData.equipment_link,
            };

            await axios.post(`${BaseUrl}${updateBreakers}`, [breakerObjOne, breakerObjTwo], { headers }).then((res) => {
                setIsProcessing(false);
                setTimeout(() => {
                    triggerBreakerAPI();
                }, 1000);
                handleEditBreakerClose();
            });
        } catch (error) {
            console.log('Failed to update Double Breakers!');
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
                breaker_id: id,
                name: breakerData.name,
                breaker_number: breakerData.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: breakerData.sensor_id,
                device_link: breakerData.device_id,
                equipment_link: breakerData.equipment_link,
            };

            let breakerObjTwo = {
                breaker_id: doubleBreakerData.id,
                name: doubleBreakerData.data.name,
                breaker_number: doubleBreakerData.data.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: doubleBreakerData.data.sensor_id,
                device_link: doubleBreakerData.data.device_id,
                equipment_link: breakerData.equipment_link,
            };

            let breakerObjThree = {
                breaker_id: tripleBreakerData.id,
                name: tripleBreakerData.data.name,
                breaker_number: tripleBreakerData.data.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                sensor_link: tripleBreakerData.data.sensor_id,
                device_link: tripleBreakerData.data.device_id,
                equipment_link: breakerData.equipment_link,
            };

            await axios
                .post(`${BaseUrl}${updateBreakers}`, [breakerObjOne, breakerObjTwo, breakerObjThree], { headers })
                .then((res) => {
                    setIsProcessing(false);
                    setTimeout(() => {
                        triggerBreakerAPI();
                    }, 1000);
                    handleEditBreakerClose();
                });
        } catch (error) {
            console.log('Failed to update Triple Breakers!');
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
        if (key === 'equipment_link') {
            let arr = [];
            arr.push(value);
            value = arr;
        }
        if (value === 'Select Volts') {
            value = '';
        }
        if (key === 'device_id') {
            if (value === '') {
                breaker.sensor_id = '';
            }
        }
        breaker[key] = value;
        setBreakerData(breaker);
    };

    const handleDoubleBreakerChange = (id, key, value) => {
        let breaker = Object.assign({}, doubleBreakerData);
        if (key === 'equipment_link') {
            let arr = [];
            arr.push(value);
            value = arr;
        }
        if (value === 'Select Volts') {
            value = '';
        }
        let data = Object.assign({}, breaker.data);
        if (key === 'device_id') {
            if (value === '') {
                data.sensor_id = '';
            }
        }
        data[key] = value;
        breaker['data'] = data;
        setDoubleBreakerData(breaker);
    };

    const handleTripleBreakerChange = (id, key, value) => {
        let breaker = Object.assign({}, tripleBreakerData);
        if (key === 'equipment_link') {
            let arr = [];
            arr.push(value);
            value = arr;
        }
        if (value === 'Select Volts') {
            value = '';
        }
        let data = Object.assign({}, breaker.data);
        if (key === 'device_id') {
            if (value === '') {
                data.sensor_id = '';
            }
        }
        data[key] = value;
        breaker['data'] = data;
        setTripleBreakerData(breaker);
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
        if (!breakerObj.isLinked) {
            return;
        }

        if (breakerObj.breakerType === 2) {
            if (breakerObj.parentBreaker === '') {
                let obj = disconnectedBreakersData.find((obj) => obj.data.parentBreaker === id);
                setDoubleBreakerData(obj);
            } else {
                let obj = disconnectedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                setDoubleBreakerData(obj);
            }
        }

        if (breakerObj.breakerType === 3) {
            if (breakerObj.parentBreaker === '') {
                let breakersList = disconnectedBreakersData.filter((obj) => obj.data.parentBreaker === id);
                setDoubleBreakerData(breakersList[0]);
                setTripleBreakerData(breakersList[1]);
            } else {
                let objOne = disconnectedBreakersData.find((obj) => obj.id === breakerObj.parentBreaker);
                let objTwo = disconnectedBreakersData.find(
                    (obj) => obj.data.parentBreaker === breakerObj.parentBreaker && obj.id !== id
                );
                setDoubleBreakerData(objOne);
                setTripleBreakerData(objTwo);
            }
        }
    }, [breakerObj]);

    return (
        <React.Fragment>
            <>
                {breakerData.breaker_number !== 1 && (
                    <Handle
                        type="target"
                        position="left"
                        id="a"
                        style={{ top: 20, backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                )}
                {breakerData.breaker_number !== 3 && (
                    <Handle
                        type="source"
                        position="left"
                        id="b"
                        style={{ bottom: 30, top: 'auto', backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                )}
            </>

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
                                                    if (data?.sensor_id === '') {
                                                        return;
                                                    }
                                                    fetchDeviceSensorData(data?.device_id);
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
                                                    if (data?.sensor_id === '') {
                                                        return;
                                                    }
                                                    fetchDeviceSensorData(data?.device_id);
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

                                {breakerData.breakerType === 2 && (
                                    <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                        Breaker {breakerData.breaker_number}, {doubleBreakerData?.data?.breaker_number}
                                    </div>
                                )}

                                {(breakerData.breakerType === 1 || breakerData.breakerType === 2) && (
                                    <>
                                        <div className="panel-edit-grid ml-2 mr-2">
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Device ID</Form.Label>
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold breaker-phase-selection"
                                                    placeholder="Select Device"
                                                    onChange={(e) => {
                                                        if (e.target.value === 'Select Device') {
                                                            return;
                                                        }
                                                        fetchDeviceSensorData(e.target.value);
                                                        handleSingleBreakerChange(id, 'device_id', e.target.value);
                                                    }}
                                                    value={breakerData.device_id}>
                                                    <option>Select Device</option>
                                                    {passiveDeviceData.map((record) => {
                                                        return <option value={record.value}>{record.label}</option>;
                                                    })}
                                                    {breakerData.device_id !== '' && <option value="">None</option>}
                                                </Input>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Sensor #</Form.Label>
                                                {isSensorDataFetched ? (
                                                    <Skeleton count={1} height={35} />
                                                ) : (
                                                    <Input
                                                        type="select"
                                                        name="state"
                                                        id="userState"
                                                        className="font-weight-bold breaker-phase-selection"
                                                        placeholder="Select Sensor"
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Select Sensor') {
                                                                return;
                                                            }
                                                            handleLinkedSensor(breakerData.sensor_id, e.target.value);
                                                            handleSingleBreakerChange(id, 'sensor_id', e.target.value);
                                                        }}
                                                        value={breakerData.sensor_id}>
                                                        <option>Select Sensor</option>
                                                        {sensorData.map((record) => {
                                                            return (
                                                                <option
                                                                    value={record.id}
                                                                    disabled={
                                                                        record.breaker_id !== '' ||
                                                                        linkedSensors.includes(record.id)
                                                                    }
                                                                    className={
                                                                        (record.breaker_id !== '' ||
                                                                            linkedSensors.includes(record.id)) &&
                                                                        'fields-disabled-style'
                                                                    }>
                                                                    {record.name}
                                                                </option>
                                                            );
                                                        })}
                                                        {breakerData.sensor_id !== '' && <option value="">None</option>}
                                                    </Input>
                                                )}
                                            </Form.Group>
                                        </div>
                                        <div className="edit-form-breaker ml-2 mr-2 mb-2" />
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
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold breaker-phase-selection"
                                                    placeholder="Select Device"
                                                    onChange={(e) => {
                                                        if (e.target.value === 'Select Device') {
                                                            return;
                                                        }
                                                        fetchSensorDataForSelectionOne(e.target.value);
                                                        handleSingleBreakerChange(id, 'device_id', e.target.value);
                                                        if (doubleBreakerData.data.device_id === '') {
                                                            handleDoubleBreakerChange(id, 'device_id', e.target.value);
                                                        }
                                                        if (tripleBreakerData.data.device_id === '') {
                                                            handleTripleBreakerChange(id, 'device_id', e.target.value);
                                                        }
                                                    }}
                                                    value={breakerData.device_id}>
                                                    <option>Select Device</option>
                                                    {passiveDeviceData.map((record) => {
                                                        return <option value={record.value}>{record.label}</option>;
                                                    })}
                                                    {breakerData.device_id !== '' && <option value="">None</option>}
                                                </Input>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Sensor #</Form.Label>
                                                {isSensorDataFetched ? (
                                                    <Skeleton count={1} height={35} />
                                                ) : (
                                                    <Input
                                                        type="select"
                                                        name="state"
                                                        id="userState"
                                                        className="font-weight-bold breaker-phase-selection"
                                                        placeholder="Select Sensor"
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Select Sensor') {
                                                                return;
                                                            }
                                                            handleLinkedSensor(breakerData.sensor_id, e.target.value);
                                                            handleSingleBreakerChange(id, 'sensor_id', e.target.value);
                                                        }}
                                                        value={breakerData.sensor_id}>
                                                        <option>Select Sensor</option>
                                                        {sensorData.map((record) => {
                                                            return (
                                                                <option
                                                                    value={record.id}
                                                                    disabled={
                                                                        record.breaker_id !== '' ||
                                                                        linkedSensors.includes(record.id)
                                                                    }
                                                                    className={
                                                                        (record.breaker_id !== '' ||
                                                                            linkedSensors.includes(record.id)) &&
                                                                        'fields-disabled-style'
                                                                    }>
                                                                    {record.name}
                                                                </option>
                                                            );
                                                        })}
                                                        {breakerData.sensor_id !== '' && <option value="">None</option>}
                                                    </Input>
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
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold breaker-phase-selection"
                                                    placeholder="Select Device"
                                                    onChange={(e) => {
                                                        if (e.target.value === 'Select Device') {
                                                            return;
                                                        }
                                                        fetchDeviceSensorDataForDouble(e.target.value);
                                                        handleDoubleBreakerChange(id, 'device_id', e.target.value);
                                                    }}
                                                    value={doubleBreakerData?.data?.device_id}>
                                                    <option>Select Device</option>
                                                    {passiveDeviceData.map((record) => {
                                                        return <option value={record.value}>{record.label}</option>;
                                                    })}
                                                    {doubleBreakerData?.data?.device_id !== '' && (
                                                        <option value="">None</option>
                                                    )}
                                                </Input>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Sensor #</Form.Label>
                                                {isSensorDataFetchedForDouble ? (
                                                    <Skeleton count={1} height={35} />
                                                ) : (
                                                    <Input
                                                        type="select"
                                                        name="state"
                                                        id="userState"
                                                        className="font-weight-bold breaker-phase-selection"
                                                        placeholder="Select Sensor"
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Select Sensor') {
                                                                return;
                                                            }
                                                            handleLinkedSensor(
                                                                doubleBreakerData?.data?.sensor_id,
                                                                e.target.value
                                                            );
                                                            handleDoubleBreakerChange(id, 'sensor_id', e.target.value);
                                                        }}
                                                        value={doubleBreakerData?.data?.sensor_id}>
                                                        <option>Select Sensor</option>
                                                        {doubleSensorData.map((record) => {
                                                            return (
                                                                <option
                                                                    value={record.id}
                                                                    disabled={
                                                                        record.breaker_id !== '' ||
                                                                        linkedSensors.includes(record.id)
                                                                    }
                                                                    className={
                                                                        (record.breaker_id !== '' ||
                                                                            linkedSensors.includes(record.id)) &&
                                                                        'fields-disabled-style'
                                                                    }>
                                                                    {record.name}
                                                                </option>
                                                            );
                                                        })}
                                                        {doubleBreakerData?.data?.sensor_id !== '' && (
                                                            <option value="">None</option>
                                                        )}
                                                    </Input>
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
                                                <Input
                                                    type="select"
                                                    name="state"
                                                    id="userState"
                                                    className="font-weight-bold breaker-phase-selection"
                                                    placeholder="Select Device"
                                                    onChange={(e) => {
                                                        if (e.target.value === 'Select Device') {
                                                            return;
                                                        }
                                                        fetchDeviceSensorDataForTriple(e.target.value);
                                                        handleTripleBreakerChange(id, 'device_id', e.target.value);
                                                    }}
                                                    value={tripleBreakerData?.data?.device_id}>
                                                    <option>Select Device</option>
                                                    {passiveDeviceData.map((record) => {
                                                        return <option value={record.value}>{record.label}</option>;
                                                    })}
                                                    {tripleBreakerData?.data?.device_id !== '' && (
                                                        <option value="">None</option>
                                                    )}
                                                </Input>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Sensor #</Form.Label>
                                                {isSensorDataFetchedForTriple ? (
                                                    <Skeleton count={1} height={35} />
                                                ) : (
                                                    <Input
                                                        type="select"
                                                        name="state"
                                                        id="userState"
                                                        className="font-weight-bold breaker-phase-selection"
                                                        placeholder="Select Sensor"
                                                        onChange={(e) => {
                                                            if (e.target.value === 'Select Sensor') {
                                                                return;
                                                            }
                                                            handleLinkedSensor(
                                                                tripleBreakerData?.data?.sensor_id,
                                                                e.target.value
                                                            );
                                                            handleTripleBreakerChange(id, 'sensor_id', e.target.value);
                                                        }}
                                                        value={tripleBreakerData?.data?.sensor_id}>
                                                        <option>Select Sensor</option>
                                                        {tripleSensorData.map((record) => {
                                                            return (
                                                                <option
                                                                    value={record.id}
                                                                    disabled={
                                                                        record.breaker_id !== '' ||
                                                                        linkedSensors.includes(record.id)
                                                                    }
                                                                    className={
                                                                        (record.breaker_id !== '' ||
                                                                            linkedSensors.includes(record.id)) &&
                                                                        'fields-disabled-style'
                                                                    }>
                                                                    {record.name}
                                                                </option>
                                                            );
                                                        })}
                                                        {tripleBreakerData?.data?.sensor_id !== '' && (
                                                            <option value="">None</option>
                                                        )}
                                                    </Input>
                                                )}
                                            </Form.Group>
                                        </div>
                                        <div className="edit-form-breaker ml-2 mr-2 mb-2" />
                                    </>
                                )}
                            </>

                            <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Equipment</Form.Label>
                                <Input
                                    type="select"
                                    name="state"
                                    id="userState"
                                    className="font-weight-bold breaker-phase-selection"
                                    placeholder="Select Equipment"
                                    onChange={(e) => {
                                        if (e.target.value === 'Select Equipment') {
                                            return;
                                        }
                                        addSelectedBreakerEquip(e.target.value);
                                        handleSingleBreakerChange(id, 'equipment_link', e.target.value);
                                    }}
                                    value={breakerData.equipment_link[0]}>
                                    <option>Select Equipment</option>
                                    {equipmentData.map((record) => {
                                        return (
                                            <option
                                                value={record.value}
                                                disabled={record.breakerId !== ''}
                                                className={record.breakerId !== '' && 'fields-disabled-style'}>
                                                {record.label}
                                            </option>
                                        );
                                    })}
                                </Input>
                                {/* <MultiSelect
                                        options={equipmentData}
                                        value={selectedEquipOptions}
                                        onChange={setSelectedEquipOptions}
                                        labelledBy="Columns"
                                        hasSelectAll={false}
                                    /> */}
                            </Form.Group>
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
        </React.Fragment>
    );
};

export default DisconnectedBreakerComponent;
