import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {
    BaseUrl,
    listSensor,
} from '../../../services/Network';
import { Cookies } from 'react-cookie';
import ReactFlow, { isEdge, removeElements, addEdge, MiniMap, Controls, Handle, Position } from 'react-flow-renderer';
import '../style.css';
import './panel-style.css';

const DisconnectedBreakerFlow = ({ data, id }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    // Edit Breaker Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    const [sensorData, setSensorData] = useState([]);
    const [linkedSensors, setLinkedSensors] = useState([]);

    const [currentEquipIds, setCurrentEquipIds] = useState([]);
    const [currentBreakerData, setCurrentBreakerData] = useState({});

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
        let equip = data.equipment_data.find((record) => record.value === equipId);
        return equip.label;
    };

    useEffect(() => {
        let currentBreakerObj = Object.assign({}, data);
        setCurrentBreakerData(currentBreakerObj);
    }, []);

    return (
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

            <FormGroup className="form-group row m-1 mb-4">
                <div className="breaker-container">
                    <div className="sub-breaker-style">
                        <div className="breaker-content-middle">
                            <div className="breaker-index">{data.breaker_number}</div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="dot-status"></div>
                        </div>
                        <div className="breaker-content-middle">
                            <div className="breaker-content">
                                <span>{data.rated_amps === 0 ? '' : `${data.rated_amps}A`}</span>
                                <span>{data.voltage === '' ? '' : `${data.voltage}V`}</span>
                            </div>
                        </div>
                        {data.equipment_link && data.equipment_link.length !== 0 && (
                            <>
                                <div className="breaker-equipName-style">
                                    <h6 className=" ml-3 breaker-equip-name">
                                        {findEquipmentName(data.equipment_link[0])}
                                    </h6>
                                </div>
                                {!(
                                    (data.breaker_level === 'triple-breaker' && data.panel_voltage === '120/240') ||
                                    (data.breaker_level === 'double-breaker' && data.panel_voltage === '600')
                                ) && (
                                    <div
                                        className="breaker-content-middle"
                                        onClick={() => {
                                            // setCurrentBreakerObj(element);
                                            // setCurrentBreakerIndex(index);
                                            // setCurrentEquipIds(element.equipment_link);
                                            // handleCurrentLinkedBreaker(index);
                                            // if (element.device_id !== '') {
                                            //     fetchDeviceSensorData(element.device_id);
                                            // }
                                            handleEditBreakerShow();
                                        }}>
                                        <div className="edit-icon-bg-styling mr-2">
                                            <i className="uil uil-pen"></i>
                                        </div>
                                        <span className="font-weight-bold edit-btn-styling">Edit</span>
                                    </div>
                                )}
                            </>
                        )}

                        {data.equipment_link && data.equipment_link.length === 0 && (
                            <>
                                {!(
                                    (data.breaker_level === 'triple-breaker' && data.panel_voltage === '120/240') ||
                                    (data.breaker_level === 'double-breaker' && data.panel_voltage === '600')
                                ) && (
                                    <div
                                        className="breaker-content-middle"
                                        onClick={() => {
                                            // setCurrentBreakerObj(element);
                                            // setCurrentBreakerIndex(index);
                                            // setCurrentEquipIds(element.equipment_link);
                                            // handleCurrentLinkedBreaker(index);
                                            // if (element.device_id !== '') {
                                            //     fetchDeviceSensorData(element.device_id);
                                            // }
                                            handleEditBreakerShow();
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
                {!(data.breaker_level === 'triple-breaker') ? (
                    // For Single & Double Breaker
                    <>
                        <div className="mt-4 ml-4 mb-0">
                            <Modal.Title className="edit-breaker-title mb-0">
                                {data.breaker_level === 'single-breaker' ? 'Edit Breaker' : 'Edit Linked Breaker'}
                            </Modal.Title>
                            <Modal.Title className="edit-breaker-no mt-0">
                                {data.breaker_level === 'single-breaker' && `Breaker ${data.breaker_number}`}
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
                                                data.onChange(id, 'phase_configuration', +e.target.value);
                                            }}
                                            value={data.phase_configuration}
                                            disabled={true}
                                            min={0}></Input>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Apms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Amps"
                                            className="font-weight-bold"
                                            value={data.rated_amps}
                                            min={0}
                                            onChange={(e) => {
                                                data.onChange(id, 'rated_amps', +e.target.value);
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
                                                data.onChange(id, 'voltage', e.target.value);
                                            }}
                                            value={data.voltage}
                                            disabled={true}
                                            min={0}></Input>
                                    </Form.Group>
                                </div>

                                <div className="edit-form-breaker ml-2 mr-2 mb-2" />

                                <>
                                    {data.breaker_level === 'single-breaker' && (
                                        <div className="edit-breaker-subtitle mb-2 ml-2 mt-3">
                                            Breaker {data.breaker_number}
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
                                                    data.onChange(id, 'device_id', e.target.value);
                                                }}
                                                value={data.device_id}>
                                                <option>Select Device</option>
                                                {data.passive_data.map((record) => {
                                                    return <option value={record.value}>{record.label}</option>;
                                                })}
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
                                                    data.onChange(id, 'sensor_id', e.target.value);
                                                    handleLinkedSensor(data.sensor_id, e.target.value);
                                                }}
                                                value={data.sensor_id}>
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
                                            data.onChange(id, 'equipment_link', e.target.value);
                                        }}
                                        value={data?.equipment_link?.[0]}>
                                        <option>Select Equipment</option>
                                        {data.equipment_data.map((record) => {
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
                    //                     <Form.Label>Apms</Form.Label>
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
                    {data.breaker_level === 'single-breaker' && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                updateSingleBreakerData();
                                handleEditBreakerClose();
                            }}>
                            Update
                        </Button>
                    )}

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
        </>
    );
};

export default DisconnectedBreakerFlow;