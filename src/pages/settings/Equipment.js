import React, { useState, useEffect } from 'react';
import {Row, Col, Card, CardBody, Table, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button,Input,FormGroup} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BaseUrl, generalEquipments, getLocation, equipmentType, createEquipment, getEndUseId, updateEquipment, listSensor, searchEquipment} from '../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { ComponentStore } from '../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
import { ChevronDown, Search } from 'react-feather';
import './style.css';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SocketLogo from '../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../assets/images/active-devices/Union.svg';
import { faXmark, faPowerOff, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { MultiSelect } from 'react-multi-select-component';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { result } from 'lodash';
import EquipmentDeviceChartModel from '../settings/EquipmentDeviceChartModel';

const SingleActiveEquipmentModal = ({ show, equipData, close, equipmentTypeData,endUse,fetchEquipmentData }) => {
    const [selected,setSelected]=useState([]);
    const [sensors, setSensors] = useState([]);
    // console.log(equipmentTypeData)
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [updateEqipmentData, setUpdateEqipmentData] = useState({});

    useEffect(() => {
        const fetchActiveDeviceSensorData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${equipData.device_id}`;
                axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setSensors(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device sensor data');
            }
        };
        fetchActiveDeviceSensorData();
    }, [equipData]);
    var result=[];
        if(equipData!==null){
            result =  equipmentTypeData.find( ({ equipment_type }) => equipment_type === equipData.equipments_type )
            // var x=document.getElementById('endUsePop');
            // console.log(x);
            // if(x!==null)
            // x.value=result.end_use_name;
            // console.log(result);
        }
        console.log(equipData)
        const handleChange = (key, value) => {
            let obj = Object.assign({}, updateEqipmentData);
            if(key==="equipment_type"){
                const result1 =  equipmentTypeData.find( ({ equipment_id }) => equipment_id === value );
                // console.log(result1.end_use_name);
                const eq_id=endUse.find(({name})=>name===result1.end_use_name);
                // console.log(eq_id);
                // var x=document.getElementById("endUsePop");
                // x.value=(eq_id.end_user_id);
                obj['end_use']=eq_id.end_user_id;
            }
            obj[key] = value;
            // console.log(obj);
            setUpdateEqipmentData(obj);
        };
        const handleSave=()=>{
        try {
            let obj = Object.assign({}, updateEqipmentData);
            obj['tag']=selected;
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params=`?equipment_id=${equipData.equipments_id}`
            axios
                .post(`${BaseUrl}${updateEquipment}${params}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    fetchEquipmentData();
                    close();
                
                });
        } catch (error) {
            console.log('Failed to update Passive device data');
        }
        }
    return (
        <>
            {show ? (
                <Modal show={show} onHide={close} dialogClassName="modal-container-style" centered>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>
                                <h6 className="text-muted">{`Floor 1 > 252 > ${equipData.equipments_type}`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9}>
                                <div>
                                    <span className="heading-style">{equipData.equipments_type}</span>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className="button-wrapper">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-outline-danger font-weight-bold mr-4">
                                            <FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: 'red' }} />{' '}
                                            Turn Off
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-light font-weight-bold mr-4"
                                            onClick={close}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-primary font-weight-bold mr-4"
                                            onClick={handleSave}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className="mt-2 modal-tabs-style">
                                    <span className="mr-3">Metrics</span>
                                    <span className="mr-3 tab-styling">Configure</span>
                                    <span className="mr-3">History</span>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Body>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col lg={12}>
                                        <h4>Equipment Details</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Equipment Name"
                                                className="font-weight-bold"
                                                defaultValue={equipData.equipments_name}
                                                onChange={(e) => {
                                                    handleChange('name', e.target.value);
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={6}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Type</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold" 
                                                defaultValue={result.length===0?"":result.equipment_id}
                                                onChange={(e) => {
                                                    handleChange('equipment_type', e.target.value);
                                                }}>
                                                 <option selected>Select Type</option>
                                                     {equipmentTypeData.map((record) => {
                                                            return <option value={record.equipment_id}>{record.equipment_type}</option>;
                                                        })}
                                            </Input>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly
                                                placeholder="Enter Location"
                                                className="font-weight-bold"
                                                value={equipData.location}
                                            />
                                            <Form.Label>Location this equipment is installed in.</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Applied Rule</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold">
                                                <option selected>Desktop PC</option>
                                                <option>Refigerator</option>
                                            </Input>
                                            <Form.Label>
                                                The rule applied to this equipment to control when it is on.
                                            </Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Tags</Form.Label>
                                            <TagsInput
                                                 value={equipData.tags}
                                                onChange={setSelected}
                                                name="tag"
                                                placeHolder="+ Add Tag"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Notes</Form.Label>
                                            <Input
                                                type="textarea"
                                                name="text"
                                                id="exampleText"
                                                rows="3"
                                                placeholder="Enter a Note..."
                                                defaultValue={equipData.note}
                                                onChange={(e) => {
                                                    handleChange('note', e.target.value);
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={4}>
                                <div className="modal-right-container">
                                <div className="equip-socket-container">
                                <div className="mt-2 sockets-slots-container">
                                    {sensors.map((record, index) => {
                                        return (
                                            <>
                                                {record.status && (
                                                    <div>
                                                        <div className="power-off-style">
                                                            <FontAwesomeIcon
                                                                icon={faPowerOff}
                                                                size="lg"
                                                                color="#3C6DF5"
                                                            />
                                                        </div>
                                                        {record.equipment_type_id === '' ? (
                                                            <div className="socket-rect">
                                                                <img src={SocketLogo} alt="Socket" />
                                                            </div>
                                                        ) : (
                                                            <div className="online-socket-container">
                                                                <img
                                                                    src={UnionLogo}
                                                                    alt="Union"
                                                                    className="union-icon-style"
                                                                    width="35vw"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {!record.status && (
                                                    <div>
                                                        <div className="power-off-style">
                                                            <FontAwesomeIcon
                                                                icon={faPowerOff}
                                                                size="lg"
                                                                color="#EAECF0"
                                                            />
                                                        </div>
                                                        {record.equipment_type_id === '' ? (
                                                            <div className="socket-rect">
                                                                <img src={SocketLogo} alt="Socket" />
                                                            </div>
                                                        ) : (
                                                            <div className="online-socket-container">
                                                                <img
                                                                    src={UnionLogo}
                                                                    alt="Union"
                                                                    className="union-icon-style"
                                                                    width="35vw"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                                    <div className="modal-right-card mt-2">
                                        <span className="modal-right-card-title">Power Strip Socket 2</span>
                                        <Link
                                            to={{
                                                pathname: equipData.device_id!==""?`/settings/active-devices/single/${equipData.device_id}`:`equipment/#`,
                                            }}>
                                        <button
                                            type="button"
                                            class="btn btn-light btn-md font-weight-bold float-right mr-2" disabled={equipData.device_id===""?true:false}>
                                            View Devices
                                        </button>
                                        </Link>
                                    </div>
                                    <div>
                                        {equipData.status === 'Online' && (
                                            <div className="icon-bg-pop-styling">
                                                ONLINE <i className="uil uil-wifi mr-1 icon-styling"></i>
                                            </div>
                                        )}
                                        {equipData.status === 'Offline' && (
                                            <div className="icon-bg-pop-styling-slash">
                                                OFFLINE <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4 modal-right-group">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    MAC Address
                                                </h6>
                                                <h6 className="card-title">{equipData.device_mac}</h6>
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Device type
                                                </h6>
                                                <h6 className="card-title">{equipData.device_type}</h6>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Installed at
                                            </h6>
                                            <h6 className="card-title">{equipData.device_location}</h6>
                                        </div>
                                    </FormGroup>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            ) : null}
        </>
    );
};
const SinglePassiveEquipmentModal = ({ show, equipData, close, equipmentTypeData,endUse,fetchEquipmentData, locationData }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [selectedTags,setSelectedTags]=useState([]);
    const [selectedZones,setSelectedZones]=useState([]);
    const [endUseName,setEndUseName]=useState([]);
    const [updateEqipmentData, setUpdateEqipmentData] = useState({});
    
    var result=[];
    var loc=[];
        console.log(locationData)
        if(equipData!==null){
            console.log(equipData.location)
            result =  equipmentTypeData.find( ({ equipment_type }) => equipment_type === equipData.equipments_type )
            // loc = locationData.find(({location_name})=>location_name===equipData.location)
            // console.log(loc)
            // var x=document.getElementById('endUsePop');
            // console.log(x);
            // if(x!==null)
            // x.value=result.end_use_name;
            // console.log(result);
        }
        // console.log(equipData)
        const handleChange = (key, value) => {
            let obj = Object.assign({}, updateEqipmentData);
            if(key==="equipment_type"){
                const result1 =  equipmentTypeData.find( ({ equipment_id }) => equipment_id === value );
                // console.log(result1.end_use_name);
                const eq_id=endUse.find(({name})=>name===result1.end_use_name);
                // console.log(eq_id);
                var x=document.getElementById("endUsePop");
                x.value=(eq_id.end_user_id);
                obj['end_use']=eq_id.end_user_id;
            }
            obj[key] = value;
            // console.log(obj);
            setUpdateEqipmentData(obj);
        };
        const handleSave=()=>{
        try {
            let obj = Object.assign({}, updateEqipmentData);
            obj['tag']=selectedTags;
            console.log(obj);
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params=`?equipment_id=${equipData.equipments_id}`
            axios
                .post(`${BaseUrl}${updateEquipment}${params}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    fetchEquipmentData();
                    close();
                
                });
        } catch (error) {
            console.log('Failed to update Passive device data');
        }
        }
    return (
        <>
            {show ? (
                <Modal show={show} onHide={close} dialogClassName="modal-container-style" centered>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>
                                <h6 className="text-muted">{`Floor 1 > 252 > ${equipData.equipments_type}`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9}>
                                <div>
                                    <span className="heading-style">{equipData.equipments_type}</span>
                                </div>
                            </Col>
                            <Col lg={3}>
                           
                                <div className='button-wrapper'>
                                
                                    
                                <div>
                                    <button type="button" className="btn btn-md btn-light font-weight-bold mr-4" onClick={close}>
                                        Cancel
                                    </button>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-md btn-primary font-weight-bold mr-4" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={12}>
                                <div className="mt-2 modal-tabs-style">
                                    <span className="mr-3">Metrics</span>
                                    <span className="mr-3 tab-styling">Configure</span>
                                    <span className="mr-3">History</span>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Body>
                        <Row>
                            <Col lg={8}>
                                <Row>
                                    <Col lg={12}>
                                        <h4>Equipment Details</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter Equipment Name"
                                                className="font-weight-bold"
                                                defaultValue={equipData.equipments_name}
                                                onChange={(e) => {
                                                    handleChange('name', e.target.value);
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Type</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold" defaultValue={result.length===0?"":result.equipment_id}
                                                onChange={(e) => {
                                                    handleChange('equipment_type', e.target.value);
                                                }}>
                                                 <option selected>Select Type</option>
                                                     {equipmentTypeData.map((record) => {
                                                            return <option value={record.equipment_id}>{record.equipment_type}</option>;
                                                        })}
                                            </Input>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>End Use Category</Form.Label>
                                            <Input
                                                type="select"
                                                name="select"
                                                id="endUsePop"
                                                className="font-weight-bold"
                                                defaultValue={result.length===0?"":result.end_use_id}>
                                                 <option selected>Select Category</option>
                                                     {endUse.map((record) => {
                                                            return <option value={record.end_user_id}>{record.name}</option>;
                                                        })}
                                            </Input>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Equipment Location</Form.Label>
                                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                // defaultValue={loc.length===0?"":loc.location_id}
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option value="" selected>
                                    Select Location
                                </option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                                            <Form.Label>Location this equipment is installed in.</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Serves Zones</Form.Label>
                                            <TagsInput
                                                value={selectedZones}
                                                onChange={setSelectedZones}
                                                name="Zones"
                                                placeHolder="+ Add Location"
                                            />
                                            <Form.Label>What area this piece of equipment services.</Form.Label>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Tags</Form.Label>
                                            <TagsInput
                                                value={equipData.tags}
                                                onChange={setSelectedTags}
                                                name="tag"
                                                placeHolder="+ Add Tag"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Notes</Form.Label>
                                            <Input
                                                type="textarea"
                                                name="text"
                                                id="exampleText"
                                                rows="3"
                                                placeholder="Enter a Note..."
                                                defaultValue={equipData.note}
                                                onChange={(e) => {
                                                    handleChange('note', e.target.value);
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* <Row>
                                    <Col lg={12}>
                                        <h4>Equipment MetaData</h4>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Amps</Form.Label>
                                            <Form.Control type="text" placeholder="Amps" className="font-weight-bold" />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Volts</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Volts"
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Phases</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Phases"
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>% Efficiency</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="% Efficiency"
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>% PF</Form.Label>
                                            <Form.Control type="text" placeholder="% PF" className="font-weight-bold" />
                                        </Form.Group>
                                    </Col>
                                </Row> */}
                                {/* <Row>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>RLA (Amps)</Form.Label>
                                            <Form.Control type="text" placeholder="RLA" className="font-weight-bold" />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>VFD (hZ)</Form.Label>
                                            <Form.Control type="text" placeholder="VFD" className="font-weight-bold" />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>RPM</Form.Label>
                                            <Form.Control type="text" placeholder="RPM" className="font-weight-bold" />
                                        </Form.Group>
                                    </Col>
                                    
                                </Row> */}
                                {/* <Row>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Model #</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Model No."
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Serial #</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Serial No."
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={4}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Schedule Run Hours</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Run Hours"
                                                className="font-weight-bold"
                                            />
                                        </Form.Group>
                                    </Col>
                                    
                                </Row> */}
                            </Col>
                            <Col lg={4}>
                                <div className="modal-right-container">
                                    <div className="pic-container">
                                        <div className="modal-right-pic"></div>
                                        <div className="modal-right-card mt-2" style={{ padding: '1rem' }}>
                                            <span className="modal-right-card-title">Energy Monitoring</span>
                                            
                                        <Link
                                            to={{
                                                pathname: equipData.device_id!==""?`/settings/passive-devices/single/${equipData.device_id}`:`equipment/#`,
                                            }}>
                                            <button
                                                type="button"
                                                class="btn btn-light btn-md font-weight-bold float-right mr-2">
                                                View
                                            </button>
                                            </Link>
                                        </div>
                                    </div>
                                    {/* <div className='pic-container mt-3'> */}
                                    {/* <div className="modal-right-card mt-2 p-4">
                                        <span className="modal-right-card-title">Relationships</span>
                                    </div>
                                    <div className="modal-right-card mt-1 p-4">
                                        <span className="modal-right-card-title">Component of System</span>
                                                <button
                                                    type="button"
                                                    class="btn btn-light btn-md font-weight-bold float-right mr-2" style={{color:"blue"}}>
                                                    Add
                                                </button>

                                        <div className="grey-container">  <FontAwesomeIcon
                                        icon={faPlus}
                                        size="lg"
                                    /> Select the system</div>
                                    </div> */}
                                    {/* <div className="modal-right-card mt-1 p-4">
                                    <span className="modal-right-card-title">Related to System</span>
                                                <button
                                                    type="button"
                                                    class="btn btn-light btn-md font-weight-bold float-right mr-2" style={{color:"blue"}}>
                                                    Add
                                                </button>

                                        <div className="white-container">
                                            Chilled Water Plant
                                            <span className='float-right mr-2'>
                                            <FontAwesomeIcon
                                                    icon={faTrash}
                                                    size="lg"
                                                />
                                            </span> 
                                        </div>
                                    </div> */}
                                    {/* <div className="modal-right-card mt-1 p-4">
                                    <span className="modal-right-card-title">Parent Equipment</span>
                                                <button
                                                    type="button"
                                                    class="btn btn-light btn-md font-weight-bold float-right mr-2" style={{color:"blue"}}>
                                                    Add
                                                </button>

                                        <div className="grey-container">  <FontAwesomeIcon
                                        icon={faPlus}
                                        size="lg"
                                    /> Add Parent</div>
                                    </div> */}
                                    {/* <div className="modal-right-card mt-1 p-4">
                                    <span className="modal-right-card-title">Component Equipment</span>
                                                <button
                                                    type="button"
                                                    class="btn btn-light btn-md font-weight-bold float-right mr-2" style={{color:"blue"}}>
                                                    Add
                                                </button>

                                        <div className="white-container">
                                            Supply Fan
                                            <span className='float-right mr-2'>
                                            <FontAwesomeIcon
                                                    icon={faTrash}
                                                    size="lg"
                                                />
                                            </span> 
                                        </div> */}
                                        
                                        {/* <div className="white-container" style={{clear:"both"}}>
                                            Exhaust Fan
                                            <span className='float-right mr-2'>
                                            <FontAwesomeIcon
                                                    icon={faTrash}
                                                    size="lg"
                                                />
                                            </span> 
                                        </div> */}

                                    {/* </div>
                                    </div> */}
                                    {/* <div>
                                        {equipData.status === 'Online' && (
                                                        <div className="icon-bg-pop-styling">
                                                            ONLINE <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                        </div>
                                                    )}
                                                    {equipData.status === 'Offline' && (
                                                        <div className="icon-bg-pop-styling-slash">
                                                          OFFLINE  <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                        </div>
                                                    )}
                                        </div>
                                    <div className="mt-4 modal-right-group">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    MAC Address
                                                </h6>
                                                <h6 className="card-title">{equipData.device_mac}</h6>
                                            </div>
                                        </FormGroup>
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Device type
                                                </h6>
                                                <h6 className="card-title">{equipData.device_type}</h6>
                                            </div>
                                        </FormGroup>
                                    </div>
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Installed at
                                            </h6>
                                            <h6 className="card-title">{equipData.device_location}</h6>
                                        </div>
                                                    </FormGroup>*/}
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            ) : null}
        </>
    );
};

const EquipmentTable = ({ equipmentData, isEquipDataFetched, equipmentTypeData, endUse,fetchEquipmentData, selectedOptions,equipmentDataWithFilter,locationData }) => {
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [nameOrder, setNameOrder] = useState(false);
    const [equipTypeOrder, setEquipTypeOrder] = useState(false);
    const [locationOrder, setLocationOrder] = useState(false);
    const [TagsOrder, setTagsOrder] = useState(false);
    const [sensorOrder, setSensorOrder] = useState(false);
    const [lastDataOrder, setLastDataOrder] = useState(false);
    const [deviceIdOrder, setDeviceIdOrder] = useState(false);

    const handleColumnSort = (order, columnName) => {
        if (columnName === 'name') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'typee.name') {
            setNameOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'tag') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setNameOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'location') {
            setEquipTypeOrder(false);
            setNameOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'sensor_link') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setNameOrder(false);
            setLastDataOrder(false);
            setDeviceIdOrder(false);
        }
        if (columnName === 'device_mac') {
            setEquipTypeOrder(false);
            setLocationOrder(false);
            setTagsOrder(false);
            setSensorOrder(false);
            setLastDataOrder(false);
            setNameOrder(false);
        }
        // if (columnName === 'hardware_version') {
        //     setEquipTypeOrder(false);
        //     setLocationOrder(false);
        //     setTagsOrder(false);
        //     setSensorOrder(false);
        //     setLastDataOrder(false);
        //     setDeviceIdOrder(false);
        // }
        equipmentDataWithFilter(order, columnName);
    };


    const Close1 = () => {
        setModal1(false);
    };
    const Close2 = () => {
        setModal2(false);
    };
    const Toggle = (record) => {
        if (record.device_type === 'passive') {
            setModal2(!modal2);
        } else if (record.device_type === 'active') {
            setModal1(!modal1);
        } else {
            setModal2(!modal2);
        }
    };
    const [equipData, setEquipData] = useState(null);

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered table-hover">
                        <thead>
                            <tr className='mouse-pointer'>
                            {selectedOptions.some((record) => record.value === 'status') && (
                                <th >Status</th>
                                )}
                                {selectedOptions.some((record) => record.value === 'name') && (
                                <th className="active-device-header"
                                    onClick={() => setNameOrder(!nameOrder)}>
                                <div className="active-device-flex">
                                        <div>Name</div>
                                        {nameOrder ? (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort('ace', 'name')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort('dce', 'name')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                                 )}
                                 {selectedOptions.some((record) => record.value === 'equip_type') && (
                                <th className="active-device-header"
                                onClick={() => setEquipTypeOrder(!equipTypeOrder)}>
                            <div className="active-device-flex">
                                    <div>Equipment Type</div>
                                    {equipTypeOrder ? (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('ace', 'equipments_type')}>
                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                        </div>
                                    ) : (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('dce', 'equipments_type')}>
                                            <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                        </div>
                                    )}
                                </div>
                                </th>
                                 )}
                                 {selectedOptions.some((record) => record.value === 'location') && (
                                <th className="active-device-header"
                                onClick={() => setLocationOrder(!locationOrder)}>
                            <div className="active-device-flex">
                                    <div>Location</div>
                                    {locationOrder ? (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('ace', 'location')}>
                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                        </div>
                                    ) : (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('dce', 'location')}>
                                            <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                        </div>
                                    )}
                                </div>
                                </th>
                                 )}
                                 {selectedOptions.some((record) => record.value === 'tags') && (
                                <th className="active-device-header"
                                onClick={() => setTagsOrder(!TagsOrder)}>
                            <div className="active-device-flex">
                                    <div>Tags</div>
                                    {TagsOrder ? (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('ace', 'tag')}>
                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                        </div>
                                    ) : (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('dce', 'tag')}>
                                            <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                        </div>
                                    )}
                                </div>
                                </th>
                                 )}
                                {selectedOptions.some((record) => record.value === 'sensor_number') && (
                                <th className="active-device-header"
                                onClick={() => setSensorOrder(!sensorOrder)}>
                            <div className="active-device-flex">
                                    <div>Sensor Number</div>
                                    {sensorOrder ? (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('ace', 'sensor_link')}>
                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                        </div>
                                    ) : (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('dce', 'sensor_link')}>
                                            <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                        </div>
                                    )}
                                </div>
                                </th>
                                 )}
                                {selectedOptions.some((record) => record.value === 'last_data') && (
                                <th className="active-device-header">
                            <div className="active-device-flex">
                                    <div>Last Data</div>
                                </div>
                                </th>
                                 )}
                                {selectedOptions.some((record) => record.value === 'device_id') && (
                                <th className="active-device-header"
                                onClick={() => setDeviceIdOrder(!deviceIdOrder)}>
                            <div className="active-device-flex">
                                    <div>Device ID</div>
                                    {deviceIdOrder ? (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('ace', 'device_mac')}>
                                            <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                        </div>
                                    ) : (
                                        <div
                                            className="ml-2"
                                            onClick={() => handleColumnSort('dce', 'device_mac')}>
                                            <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                        </div>
                                    )}
                                </div>
                                </th>
                                 )}
                            </tr>
                        </thead>
                        {isEquipDataFetched ? (
                            <tbody>
                                <SkeletonTheme color="#202020" height={35}>
                                    <tr>
                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>
                                        <td>
                                            <Skeleton count={5} />
                                        </td>
                                        <td>
                                            <Skeleton count={5} />
                                        </td>
                                    </tr>
                                </SkeletonTheme>
                            </tbody>
                        ) : (
                            <tbody>
                                {equipmentData.map((record, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            onClick={() => {
                                                setEquipData(record);
                                                Toggle(record);
                                            }} className='mouse-pointer'>
                                                 {selectedOptions.some((record) => record.value === 'status') && (
                                            <td className="text-center">
                                                <div>
                                                    {record.status === 'Online' && (
                                                        <div className="icon-bg-styling">
                                                            <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                        </div>
                                                    )}
                                                    {record.status === 'Offline' && (
                                                        <div className="icon-bg-styling-slash">
                                                            <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                                 )}
                                                  {selectedOptions.some((record) => record.value === 'name') && (
                                            <td className="font-weight-bold">
                                                {!(record.equipments_name === '') ? record.equipments_name : '-'}
                                            </td>
                                                  )}
                                                  {selectedOptions.some((record) => record.value === 'equip_type') && (
                                            <td className="font-weight-bold">{record.equipments_type}</td>)}
                                            {selectedOptions.some((record) => record.value === 'location') && (
                                            <td>
                                                {record.location === ' > '
                                                    ? ' - '
                                                    : record.location.split('>').reverse().join(' > ')}
                                            </td>)}
                                            {selectedOptions.some((record) => record.value === 'tags') && (
                                            <td>
                                                {
                                                    <div className="badge badge-light mr-2 font-weight-bold week-day-style">
                                                        {record.tags.length === 0 ? 'None' : record.tags[0]}
                                                    </div>
                                                }
                                            </td>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'sensor_number') && (
                                            <td>{record.sensor_number===0?'-':record.sensor_number}</td>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'last_data') && (
                                            <td>{record.last_data === '' ? '-' : record.last_data}</td>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'device_id') && (
                                            <td className="font-weight-bold">{record.device_mac}</td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                    </Table>
                </CardBody>
            </Card>
            <div>
                <EquipmentDeviceChartModel showChart={modal1} handleChartClose={Close1} equipData={equipData} equipmentTypeData={equipmentTypeData} endUse={endUse} fetchEquipmentData={fetchEquipmentData} showWindow={"configure"} deviceType={"active"}/>
                <EquipmentDeviceChartModel showChart={modal2} handleChartClose={Close2} equipData={equipData} equipmentTypeData={equipmentTypeData} endUse={endUse} fetchEquipmentData={fetchEquipmentData} showWindow={"configure"} deviceType={"passive"} locationData={locationData}/>
                {/* <SingleActiveEquipmentModal show={modal1} equipData={equipData} close={Close1} equipmentTypeData={equipmentTypeData} endUse={endUse} fetchEquipmentData={fetchEquipmentData}/> */}
                {/* <SinglePassiveEquipmentModal show={modal2} equipData={equipData} close={Close2} equipmentTypeData={equipmentTypeData} endUse={endUse} fetchEquipmentData={fetchEquipmentData} locationData={locationData}/> */}
            </div>
        </>
    );
};

const Equipment = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isEquipDataFetched, setIsEquipDataFetched] = useState(true);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentData, setGeneralEquipmentData] = useState([]);
    const [DuplicateGeneralEquipmentData, setDuplicateGeneralEquipmentData] = useState([]);
    const [onlineEquipData, setOnlineEquipData] = useState([]);
    const [offlineEquipData, setOfflineEquipData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [equipmentSelectedTypeData, setEquipmentSelectedTypeData] = useState([]);
    const [createEqipmentData, setCreateEqipmentData] = useState({});
    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [selectedEndUse, setSelectedEndUse] = useState([]);
    const tableColumnOptions = [
        { label: 'Status', value: 'status' },
        { label: 'Name', value: 'name' },
        { label: 'Equipment Type', value: 'equip_type' },
        { label: 'Location', value: 'location' },
        { label: 'Tags', value: 'tags' },
        { label: 'Sensor Number', value: 'sensor_number' },
        { label: 'Last Data', value: 'last_data' },
        { label: 'Device Id', value: 'device_id' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [search, setSearch] = useState('');

    // search_by_equipment
const handleSearchtxt = (e) => {
    if (e.target.value !== '') {
        setSearch(e.target.value);
    } else {
        setGeneralEquipmentData(DuplicateGeneralEquipmentData);
    }
};

const handleSearch = async () => {
    if (search !== '') {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&name=${search}`;
            await axios.post(`${BaseUrl}${searchEquipment}${params}`,{}, { headers }).then((res) => {
                let response = res.data;
                setGeneralEquipmentData(res.data);
            });
            setIsEquipDataFetched(false);
        } catch (error) {
            console.log(error);
            setIsEquipDataFetched(false);
            console.log('Failed to fetch all Equipment Data');
        }
    } else {
        setGeneralEquipmentData(DuplicateGeneralEquipmentData);
    }
};


    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEqipmentData);
        if (key === 'equipment_type') {
            const result = equipmentTypeData.find(({ equipment_id }) => equipment_id === value);
            // console.log(result.end_use_name);
            const eq_id = endUseData.find(({ name }) => name === result.end_use_name);
            // console.log(eq_id.end_user_id);
            var x = document.getElementById('endUseSelect');
            x.value = eq_id.end_user_id;
            obj['end_use'] = eq_id.end_user_id;
        }
        obj[key] = value;
        setCreateEqipmentData(obj);
    };

    const handleEquipmentTypeCall = async (value) => {
        const result = endUseData.find(({ end_user_id }) => end_user_id === value);
        // console.log(result.name);
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&end_use=${result.name}&page_size=100&page_no=1`;
            await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                setEquipmentSelectedTypeData(res.data.data);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Equipment Type Data');
        }
    };
    const saveDeviceData = async () => {
        let obj = Object.assign({}, createEqipmentData);
        obj['building_id'] = bldgId;
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsProcessing(true);

            axios
                .post(`${BaseUrl}${createEquipment}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    setTimeout(function () {
                        fetchEquipmentData();
                    }, 3000);
                });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Passive device data');
        }
    };
    const equipmentDataWithFilter = async (order, filterBy) => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&ordered_by=${filterBy}&sort_by=${order}`;
            await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setGeneralEquipmentData(responseData);
                setDuplicateGeneralEquipmentData(responseData);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
            });
        } catch (error) {
            console.log(error);
            setIsEquipDataFetched(false);
            console.log('Failed to fetch all Equipments Data');
        }
    };
    const fetchEquipmentData = async () => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                let responseData = res.data;
                setGeneralEquipmentData(responseData);
                setDuplicateGeneralEquipmentData(responseData);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.forEach((record) => {
                    if (record.status === 'Online') {
                        onlineEquip.push(record);
                    }
                    if (record.status === 'Offline') {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
            });
        } catch (error) {
            console.log(error);
            setIsEquipDataFetched(false);
            console.log('Failed to fetch all Equipments Data');
        }
    };

    useEffect(() => {
        const fetchOnlineEquipData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?stat=true&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    setOnlineEquipData(res.data);
                    console.log(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch online Equipments Data');
            }
        };

        const fetchOfflineEquipData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?stat=false&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalEquipments}${params}`, { headers }).then((res) => {
                    setOfflineEquipData(res.data);
                    // console.log(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch offline Equipments Data');
            }
        };
        const fetchEndUseData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                    setEndUseData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch End Use Data');
            }
        };

        const fetchEquipTypeData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    response.sort((a, b) => {
                        return a.equipment_type.localeCompare(b.equipment_type);
                    });
                    setEquipmentTypeData(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Equipment Type Data');
            }
        };

        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    setLocationData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchEquipmentData();
        fetchEndUseData();
        // fetchOnlineEquipData();
        // fetchOfflineEquipData();
        fetchEquipTypeData();
        fetchLocationData();
    }, [bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment',
                        path: '/settings/equipment',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        let arr = [
            { label: 'Status', value: 'status' },
            { label: 'Name', value: 'name' },
            { label: 'Equipment Type', value: 'equip_type' },
            { label: 'Location', value: 'location' },
            { label: 'Tags', value: 'tags' },
            { label: 'Sensor Number', value: 'sensor_number' },
            { label: 'Last Data', value: 'last_data' },
            { label: 'Device Id', value: 'device_id' },
        ];
        setSelectedOptions(arr);
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Equipment</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Equipment
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            onChange={(e) => {
                                handleSearchtxt(e);
                            }}
                        />
                        <button class="input-group-text border-0" id="search-addon" onClick={handleSearch}>
                            <Search className="icon-sm" />
                        </button>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="btn-group ml-2" role="group" aria-label="Basic example">
                        <div>
                            <button
                                type="button"
                                className={
                                    selectedTab === 0
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopRightRadius: '0px', borderBottomRightRadius: '0px' }}
                                onClick={() => setSelectedTab(0)}>
                                All Statuses
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 1
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderRadius: '0px' }}
                                onClick={() => setSelectedTab(1)}>
                                <i className="uil uil-wifi mr-1"></i>Online
                            </button>

                            <button
                                type="button"
                                className={
                                    selectedTab === 2
                                        ? 'btn btn-light d-offline custom-active-btn'
                                        : 'btn btn-white d-inline custom-inactive-btn'
                                }
                                style={{ borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px' }}
                                onClick={() => setSelectedTab(2)}>
                                <i className="uil uil-wifi-slash mr-1"></i>Offline
                            </button>
                        </div>
                    </div>

                    <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button>

                    {/* ---------------------------------------------------------------------- */}
                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={11}>
                    {selectedTab === 0 && (
                        <EquipmentTable equipmentData={generalEquipmentData} isEquipDataFetched={isEquipDataFetched} equipmentTypeData={equipmentTypeData} endUse={endUseData} fetchEquipmentData={fetchEquipmentData} selectedOptions={selectedOptions}
                        equipmentDataWithFilter={equipmentDataWithFilter} locationData={locationData}/>
                    )}
                    {selectedTab === 1 && (
                        <EquipmentTable equipmentData={onlineEquipData} isEquipDataFetched={isEquipDataFetched} equipmentTypeData={equipmentTypeData} endUse={endUseData} fetchEquipmentData={fetchEquipmentData} selectedOptions={selectedOptions}
                        equipmentDataWithFilter={equipmentDataWithFilter} locationData={locationData}/>
                    )}
                    {selectedTab === 2 && (
                        <EquipmentTable equipmentData={offlineEquipData} isEquipDataFetched={isEquipDataFetched} equipmentTypeData={equipmentTypeData} endUse={endUseData} fetchEquipmentData={fetchEquipmentData} selectedOptions={selectedOptions}
                        equipmentDataWithFilter={equipmentDataWithFilter} locationData={locationData}/>
                    )}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('equipment_type', e.target.value);
                                }}>
                                <option value="" selected>
                                    Select Type
                                </option>
                                {equipmentTypeData.map((record) => {
                                    return <option value={record.equipment_id}>{record.equipment_type}</option>;
                                })}
                            </Input>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>End Use Category</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="endUseSelect"
                                className="font-weight-bold"
                                defaultValue={selectedEndUse}
                                onChange={(e) => {
                                    handleChange('end_use', e.target.value);
                                }}>
                                <option value="">Select Category</option>
                                {endUseData.map((record) => {
                                    return <option value={record.end_user_id}>{record.name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Location</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option value="" selected>
                                    Select Location
                                </option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            saveDeviceData();
                            handleClose();
                        }}
                        disabled={isProcessing}>
                        {isProcessing ? 'Adding...' : 'Add'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Equipment;
