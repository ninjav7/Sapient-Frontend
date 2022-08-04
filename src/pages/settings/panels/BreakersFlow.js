import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, listSensor, updateBreaker } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls, Handle, Position } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import '../style.css';
import './panel-style.css';

const BreakersComponent = ({ data, id }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [breakerData, setBreakerData] = useState(data);
    const [isProcessing, setIsProcessing] = useState(false);

    // Edit Breaker Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    const [sensorData, setSensorData] = useState([]);
    const [linkedSensors, setLinkedSensors] = useState([]);

    const [currentEquipIds, setCurrentEquipIds] = useState([]);
    // const [currentBreakerObj, setCurrentBreakerObj] = useState({});

    const passiveDeviceData = BreakersStore.useState((s) => s.passiveDeviceData);
    const equipmentData = BreakersStore.useState((s) => s.equipmentData);

    const fetchDeviceSensorData = async (deviceId) => {
        try {
            if (deviceId === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_id=${deviceId}`;
            await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                let response = res.data;
                setSensorData(response);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Sensor Data');
        }
    };

    const addSelectedBreakerEquip = (equipId) => {
        let newArray = [];
        newArray.push(equipId);
        setCurrentEquipIds(newArray);
    };

    const updateSingleBreakerData = () => {
        // if (activePanelType === 'distribution') {
        //     let newArray = normalStruct;
        //     newArray[currentBreakerIndex] = currentBreakerObj;
        //     setNormalStruct(newArray);
        // }
        // if (activePanelType === 'disconnect') {
        //     let newArray = disconnectBreakerConfig;
        //     newArray[currentBreakerIndex] = currentBreakerObj;
        //     setDisconnectBreakerConfig(newArray);
        // }
        data.onChange(id, breakerData);
    };

    const triggerBreakerAPI = () => {
        LoadingStore.update((s) => {
            s.isBreakerDataFetched = true;
        });
    };

    const saveBreakerData = async () => {
        try {
            setIsProcessing(true);
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let breakerObj = {
                name: breakerData.name,
                breaker_number: breakerData.breaker_number,
                phase_configuration: breakerData.phase_configuration,
                rated_amps: breakerData.rated_amps,
                voltage: breakerData.voltage,
                link_type: breakerData.link_type,
                link_id: breakerData.link_id,
                sensor_link: breakerData.sensor_id,
                device_link: breakerData.device_id,
                equipment_link: breakerData.equipment_link,
            };

            let params = `?breaker_id=${id}`;

            await axios
                .post(`${BaseUrl}${updateBreaker}${params}`, breakerObj, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    setIsProcessing(false);
                    triggerBreakerAPI();
                    handleEditBreakerClose();
                });
        } catch (error) {
            console.log('Failed to update Breaker');
            setIsProcessing(false);
            handleEditBreakerClose();
        }
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

    const findEquipmentName = (equipId) => {
        let equip = breakerData?.equipment_data?.find((record) => record?.value === equipId);
        return equip?.label;
    };

    const handleChange = (id, key, value) => {
        let breaker = Object.assign({}, breakerData);
        if (key === 'equipment_link') {
            let arr = [];
            arr.push(value);
            value = arr;
        }
        if (value === 'Select Volts') {
            value = '';
        }
        breaker[key] = value;
        setBreakerData(breaker);
    };

    return (
        <React.Fragment>
            {breakerData.breaker_number % 2 === 1 && (
                <>
                    <Handle
                        type="source"
                        position="left"
                        id="a"
                        style={{ top: 20, backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                    <Handle
                        type="target"
                        position="left"
                        id="b"
                        style={{ bottom: 30, top: 'auto', backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                </>
            )}

            {breakerData.breaker_number % 2 === 0 && (
                <>
                    <Handle
                        type="source"
                        position="right"
                        id="a"
                        style={{ top: 20, backgroundColor: '#bababa', width: '5px', height: '5px' }}
                    />
                    <Handle
                        type="target"
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
                        ) : (
                            <>
                                {!(
                                    (breakerData.breaker_level === 'triple-breaker' &&
                                        breakerData.panel_voltage === '120/240') ||
                                    (breakerData.breaker_level === 'double-breaker' &&
                                        breakerData.panel_voltage === '600')
                                ) && (
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
                    </div>
                </div>
            </FormGroup>

            <Modal show={showEditBreaker} onHide={handleEditBreakerClose} centered backdrop="static" keyboard={false}>
                {!(breakerData.breaker_level === 'triple-breaker') ? (
                    // For Single & Double Breaker
                    <>
                        <div className="mt-4 ml-4 mb-0">
                            <Modal.Title className="edit-breaker-title mb-0">
                                {breakerData.breaker_level === 'single-breaker'
                                    ? 'Edit Breaker'
                                    : 'Edit Linked Breaker'}
                            </Modal.Title>
                            <Modal.Title className="edit-breaker-no mt-0">
                                {breakerData.breaker_level === 'single-breaker' &&
                                    `Breaker ${breakerData.breaker_number}`}
                                {/* {data.breaker_level === 'double-breaker' &&
                                    `Breaker ${doubleLinkedBreaker[0].map((number) => ` ${number}`)}`} */}
                            </Modal.Title>
                        </div>
                        <Modal.Body>
                            <Form>
                                <div className="panel-model-row-style ml-2 mr-2">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Phase</Form.Label>
                                        <Input
                                            type="number"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Phase"
                                            onChange={(e) => {
                                                handleChange(id, 'phase_configuration', +e.target.value);
                                            }}
                                            value={breakerData.phase_configuration}
                                            disabled={true}
                                            min={0}></Input>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Amps</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Amps"
                                            className="font-weight-bold"
                                            value={breakerData.rated_amps}
                                            min={0}
                                            onChange={(e) => {
                                                handleChange(id, 'rated_amps', +e.target.value);
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Volts</Form.Label>
                                        <Input
                                            type="number"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold breaker-phase-selection"
                                            placeholder="Select Volts"
                                            onChange={(e) => {
                                                handleChange(id, 'voltage', e.target.value);
                                            }}
                                            value={breakerData.voltage}
                                            disabled={true}
                                            min={0}></Input>
                                    </Form.Group>
                                </div>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <>
                                    {breakerData.breaker_level === 'single-breaker' && (
                                        <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                            Breaker {breakerData.breaker_number}
                                        </div>
                                    )}

                                    {/* {currentBreakerLevel === 'double-breaker' && (
                                        <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                            Breaker {doubleLinkedBreaker[0][0]} & {doubleLinkedBreaker[0][1]}
                                        </div>
                                    )} */}

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
                                                    fetchDeviceSensorData(e.target.value);
                                                    handleChange(id, 'device_id', e.target.value);
                                                }}
                                                value={breakerData.device_id}>
                                                <option>Select Device</option>
                                                {passiveDeviceData.map((record) => {
                                                    return <option value={record.value}>{record.label}</option>;
                                                })}
                                                <option value="unlink">None</option>
                                            </Input>
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Sensor #</Form.Label>
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-phase-selection"
                                                placeholder="Select Sensor"
                                                onChange={(e) => {
                                                    handleChange(id, 'sensor_id', e.target.value);
                                                    handleLinkedSensor(breakerData.sensor_id, e.target.value);
                                                }}
                                                value={breakerData.sensor_id}>
                                                <option>Select Sensor</option>
                                                {sensorData.map((record) => {
                                                    return (
                                                        <option
                                                            value={record.id}
                                                            disabled={linkedSensors.includes(record.id)}>
                                                            {record.name}
                                                        </option>
                                                    );
                                                })}
                                                <option value="unlink">None</option>
                                            </Input>
                                        </Form.Group>
                                    </div>
                                </>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Equipment</Form.Label>
                                    <Input
                                        type="select"
                                        name="state"
                                        id="userState"
                                        className="font-weight-bold breaker-phase-selection"
                                        placeholder="Select Equipment"
                                        onChange={(e) => {
                                            addSelectedBreakerEquip(e.target.value);
                                            handleChange(id, 'equipment_link', e.target.value);
                                        }}
                                        value={breakerData.equipment_link[0]}>
                                        <option>Select Equipment</option>
                                        {equipmentData.map((record) => {
                                            return <option value={record.value}>{record.label}</option>;
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
                ) : (
                    <></>
                    // For Triple Breaker
                    // <>
                    //     <div className="mt-4 ml-4 mb-0">
                    //         <Modal.Title className="edit-breaker-title mb-0">Edit Linked Breaker</Modal.Title>
                    //         <Modal.Title className="edit-breaker-no mt-0">
                    //             {currentBreakerLevel === 'triple-breaker' &&
                    //                 `Breaker ${tripleLinkedBreaker[0].map((number) => ` ${number}`)}`}
                    //         </Modal.Title>
                    //     </div>
                    //     <Modal.Body>
                    //         <Form>
                    //             <div className="panel-model-row-style ml-2 mr-2">
                    //                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                     <Form.Label>Phase</Form.Label>
                    //                     {/* <Input
                    //                         type="select"
                    //                         name="state"
                    //                         id="userState"
                    //                         className="font-weight-bold breaker-phase-selection"
                    //                         placeholder="Select Phase"
                    //                         onChange={(e) => {
                    //                             handleBreakerConfigChange('phase_configuration', e.target.value);
                    //                         }}
                    //                         value={currentBreakerObj.phase_configuration}
                    //                         disabled={true}>
                    //                         <option>Select Phase</option>
                    //                         <option value="3">3</option>
                    //                         <option value="1">1</option>
                    //                     </Input> */}
                    //                     <Input
                    //                         type="number"
                    //                         name="state"
                    //                         id="userState"
                    //                         className="font-weight-bold breaker-phase-selection"
                    //                         placeholder="Select Phase"
                    //                         onChange={(e) => {
                    //                             handleBreakerConfigChange('phase_configuration', e.target.value);
                    //                         }}
                    //                         value={3}
                    //                         disabled={true}></Input>
                    //                 </Form.Group>

                    //                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                     <Form.Label>Amps</Form.Label>
                    //                     <Form.Control
                    //                         type="number"
                    //                         placeholder="Enter Amps"
                    //                         className="font-weight-bold"
                    //                         value={currentBreakerObj.rated_amps}
                    //                         onChange={(e) => {
                    //                             handleBreakerConfigChange('rated_amps', e.target.value);
                    //                         }}
                    //                     />
                    //                 </Form.Group>

                    //                 <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                     <Form.Label>Volts</Form.Label>

                    //                     <Input
                    //                         type="select"
                    //                         name="state"
                    //                         id="userState"
                    //                         className="font-weight-bold breaker-phase-selection"
                    //                         placeholder="Select Volts"
                    //                         onChange={(e) => {
                    //                             handleBreakerConfigChange('voltage', e.target.value);
                    //                         }}
                    //                         value={currentBreakerObj.voltage}
                    //                         disabled={true}>
                    //                         <option>Select Volts</option>
                    //                         <option value="120">120</option>
                    //                         <option value="208">208</option>
                    //                         <option value="277">277</option>
                    //                         <option value="347">347</option>
                    //                     </Input>
                    //                 </Form.Group>
                    //             </div>

                    //             <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                    //             <>
                    //                 <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                    //                     Breaker {tripleLinkedBreaker[0][0]}
                    //                 </div>
                    //                 <div className="panel-edit-grid ml-2 mr-2">
                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Device ID</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Device"
                    //                             onChange={(e) => {
                    //                                 fetchDeviceSensorData(e.target.value);
                    //                                 handleBreakerConfigChange('device_id', e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.device_id}>
                    //                             <option>Select Device</option>
                    //                             {passiveDeviceData.map((record) => {
                    //                                 return (
                    //                                     <option value={record.equipments_id}>
                    //                                         {record.identifier}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>

                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Sensor #</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Sensor"
                    //                             onChange={(e) => {
                    //                                 handleBreakerConfigChange('sensor_id', e.target.value);
                    //                                 handleLinkedSensor(currentBreakerObj.sensor_id, e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.sensor_id}>
                    //                             <option>Select Sensor</option>
                    //                             {sensorData.map((record) => {
                    //                                 return (
                    //                                     <option
                    //                                         value={record.id}
                    //                                         disabled={linkedSensors.includes(record.id)}>
                    //                                         {record.name}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>
                    //                 </div>

                    //                 <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                    //                     Breaker {tripleLinkedBreaker[0][1]}
                    //                 </div>
                    //                 <div className="panel-edit-grid ml-2 mr-2">
                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Device ID</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Device"
                    //                             onChange={(e) => {
                    //                                 fetchDeviceSensorData(e.target.value);
                    //                                 handleBreakerConfigChange('device_id1', e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.device_id1}>
                    //                             <option>Select Device</option>
                    //                             {passiveDeviceData.map((record) => {
                    //                                 return (
                    //                                     <option value={record.equipments_id}>
                    //                                         {record.identifier}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>

                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Sensor #</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Sensor"
                    //                             onChange={(e) => {
                    //                                 handleBreakerConfigChange('sensor_id1', e.target.value);
                    //                                 handleLinkedSensor(currentBreakerObj.sensor_id, e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.sensor_id1}>
                    //                             <option>Select Sensor</option>
                    //                             {sensorData.map((record) => {
                    //                                 return (
                    //                                     <option
                    //                                         value={record.id}
                    //                                         disabled={linkedSensors.includes(record.id)}>
                    //                                         {record.name}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>
                    //                 </div>

                    //                 <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                    //                     Breaker {tripleLinkedBreaker[0][2]}
                    //                 </div>
                    //                 <div className="panel-edit-grid ml-2 mr-2">
                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Device ID</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Device"
                    //                             onChange={(e) => {
                    //                                 fetchDeviceSensorData(e.target.value);
                    //                                 handleBreakerConfigChange('device_id2', e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.device_id2}>
                    //                             <option>Select Device</option>
                    //                             {passiveDeviceData.map((record) => {
                    //                                 return (
                    //                                     <option value={record.equipments_id}>
                    //                                         {record.identifier}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>

                    //                     <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    //                         <Form.Label>Sensor #</Form.Label>
                    //                         <Input
                    //                             type="select"
                    //                             name="state"
                    //                             id="userState"
                    //                             className="font-weight-bold breaker-phase-selection"
                    //                             placeholder="Select Sensor"
                    //                             onChange={(e) => {
                    //                                 handleBreakerConfigChange('sensor_id2', e.target.value);
                    //                                 handleLinkedSensor(currentBreakerObj.sensor_id, e.target.value);
                    //                             }}
                    //                             value={currentBreakerObj.sensor_id2}>
                    //                             <option>Select Sensor</option>
                    //                             {sensorData.map((record) => {
                    //                                 return (
                    //                                     <option
                    //                                         value={record.id}
                    //                                         disabled={linkedSensors.includes(record.id)}>
                    //                                         {record.name}
                    //                                     </option>
                    //                                 );
                    //                             })}
                    //                         </Input>
                    //                     </Form.Group>
                    //                 </div>
                    //             </>

                    //             <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                    //             <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                    //                 <Form.Label>Equipment</Form.Label>
                    //                 <Input
                    //                     type="select"
                    //                     name="state"
                    //                     id="userState"
                    //                     className="font-weight-bold breaker-phase-selection"
                    //                     placeholder="Select Equipment"
                    //                     onChange={(e) => {
                    //                         addSelectedBreakerEquip(e.target.value);
                    //                         handleBreakerConfigChange('equipment_link', e.target.value);
                    //                     }}
                    //                     value={currentEquipIds[0]}>
                    //                     <option>Select Equipment</option>
                    //                     {equipmentData.map((record) => {
                    //                         return (
                    //                             <option value={record.equipments_id}>{record.equipments_name}</option>
                    //                         );
                    //                     })}
                    //                 </Input>
                    //             </Form.Group>
                    //         </Form>
                    //     </Modal.Body>
                    // </>
                )}

                <Modal.Footer>
                    <Button variant="light" onClick={handleEditBreakerClose}>
                        Cancel
                    </Button>
                    {/* {breakerData.breaker_level === 'single-breaker' && ( */}
                    <Button
                        variant="primary"
                        onClick={() => {
                            updateSingleBreakerData();
                            saveBreakerData();
                        }}>
                        {isProcessing ? 'Saving...' : 'Save'}
                    </Button>
                    {/* )} */}

                    {/* {data.breaker_level === 'double-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateDoubleBreakerData(doubleLinkedBreaker[0][0], doubleLinkedBreaker[0][1]);
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )} */}

                    {/* {data.breaker_level === 'triple-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateTripleBreakerData(
                                    tripleLinkedBreaker[0][0],
                                    tripleLinkedBreaker[0][1],
                                    tripleLinkedBreaker[0][2]
                                );
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )} */}
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default BreakersComponent;
