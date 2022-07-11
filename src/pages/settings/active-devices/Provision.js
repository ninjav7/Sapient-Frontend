import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Input} from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalActiveDevices, getLocation, createDevice } from '../../../services/Network';
import { ChevronDown } from 'react-feather';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../store/BuildingStore';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Pagination from 'react-bootstrap/Pagination';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import './style.css';
import { faCircleCheck, faGlobe, faClock, faRefresh, faArrowUpArrowDown, faCloudArrowDown } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tplink from "../../../assets/images/tplink.png";


const Provision = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const tableColumnOptions = [
        { label: 'Provisioner 1', value: 'Pro1'},
        { label: 'Provisioner 2', value: 'Pro2'},
        { label: 'Provisioner 3', value: 'Pro3'},
        { label: 'Provisioner 4', value: 'Pro4'},
        { label: 'Provisioner 5', value: 'Pro5'},
        { label: 'Provisioner 6', value: 'Pro6'},
        { label: 'Provisioner 7', value: 'Pro7'},
        { label: 'Provisioner 8', value: 'Pro8'},
        { label: 'NZ Provisioner 1', value: 'Pro9'},
        { label: 'NZ Provisioner 2', value: 'Pro10'},
        { label: 'NZ Provisioner 3', value: 'Pro11'},
        { label: 'STARTLABSPRSVN-01', value: 'Pro12'}
    ];

    const tableColumnOptions1 = [
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    // Modal states
    const [selected, setSelected] = useState(0);
    const [tabclass,setTabclass]=useState('');
    const [show, setShow] = useState(false);
    const [showlink, setShowLink] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(false);

    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);

    const [pageRequest, setPageRequest] = useState('');

    const [activeDeviceModal, setActiveDeviceModal] = useState([
        {
            value: 'KP115',
            label: 'KP115',
        },
        {
            value: 'HS300',
            label: 'HS300',
        },
    ]);
    const [activeDeviceData, setActiveDeviceData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'active',
    });

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createDeviceData);
        obj[key] = value;
        setCreateDeviceData(obj);
    };

   
    useEffect(() => {
        setShow(false);
        setShowLink(false);
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Active Devices',
                        path: '/settings/active-devices',
                        active: true,
                    },
                    {
                        label: 'Provisioning',
                        path: '/settings/active-devices/provision',
                        active: false,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
           
        };
        updateBreadcrumbStore();

        // let arr = [
        //     { label: 'Status', value: 'status' },
        //     { label: 'Identifier (MAC)', value: 'identifier' },
        //     { label: 'Model', value: 'model' },
        //     { label: 'Location', value: 'location' },
        //     { label: 'Sensors', value: 'sensors' },
        //     { label: 'Firmware Version', value: 'firmware-version' },
        //     { label: 'Hardware Version', value: 'hardware-version' },
        // ];
        // setSelectedOptions(arr);
    }, []);

    useEffect(() => {
        console.log('selectedOptions => ', selectedOptions);
    });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Provision Devices
                    </span>
                   
                    </Col>
            </Row>
            <Row>
                <Col md={7}>
                    <span className='sub-heading' style={{ marginLeft: '20px' }}>Linked TP-Link Accounts</span>
                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                      
                      <div className="mr-2">
                          <button
                              type="button"
                              className="btn btn-md btn-outline-secondary font-weight-bold"
                              onClick={() => {
                                setShowLink(true);
                            }}>
                              <i className="uil uil-link mr-1"></i>Link Account
                          </button>
                      </div>
                  </div>
                  <Table className="m-4 bordered table-hover border" style={{borderRadius:"6px"}}>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>HS110s</th>
                            <th>KP115s</th>
                            <th>HS300s</th>
                            <th>Sockets</th>
                            <th>Remaining Capacity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {deviceData.map((record, index) => {
                            return ( */}
                                <tr >
                                        <td scope="row" className="email-head">
                                            kasa+sapientlab01@sapient.industries
                                        </td>
                                        <td>0</td>
                                        <td>19</td>
                                        <td>10</td>
                                        <td>31</td>
                                        <td>255</td>
                                </tr>
                                <tr>
                                        <td scope="row" className="email-head">
                                            kasa+sapientlab02@sapient.industries
                                        </td>
                                        <td>0</td>
                                        <td>19</td>
                                        <td>10</td>
                                        <td>31</td>
                                        <td>255</td>
                                </tr>
                                <tr>
                                        <td scope="row" className="email-head">
                                            Totals
                                        </td>
                                        <td>0</td>
                                        <td>19</td>
                                        <td>10</td>
                                        <td>31</td>
                                        <td>255</td>
                                </tr>
                    </tbody>
                </Table>

                </Col>
                <Col md={5}>
                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                      
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                >
                                Done Provisioning
                            </button>
                        </div>
                    </div>
                    <Row className='mt-5'>
                        <Col md={8}>
                        <div className='m-3' >
                        <label>Wi-Fi Network</label>
                        <MultiSelect
                            options={tableColumnOptions1}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Select Wi-Fi Network';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                    <div className='m-3'>
                        <label>Provisioners</label>
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'US Provisioners';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                        </Col>
                        <Col md={4}>
                        <div className='m-3'>
                        <label style={{visibility:"hidden"}}>Provisioners</label>
                          <button
                              type="button"
                              className="btn btn-md btn-outline-secondary font-weight-bold"
                              onClick={() => {
                                  handleShow();
                              }}>
                              <i className="uil uil-plus mr-1"></i>Network
                          </button>
                      </div>
                      <div className='m-3'>
                        <label style={{visibility:"hidden"}}>Provisioners</label>
                          <button
                              type="button"
                              className="btn btn-md btn-outline-primary font-weight-bold">
                              Provision
                          </button>
                      </div>
                        </Col>
                    </Row>
                    
                </Col>
            </Row>

          

            <Row>
                <Col lg={11} >
                <span className='sub-heading' style={{ marginLeft: '20px' }}>Provisioning</span>
                
                <div className="nav-header-container" style={{ marginLeft: '20px' }}>
                <div className="passive-page-header">
                    <div className="mt-2 single-passive-tabs-style">
                    <button className='button-hide' onClick={()=>{setSelected(0)}}><span className={selected===0?"mr-3 single-passive-tab-active":"mr-3 single-passive-tab"}>In Progress(6)</span></button>
                    <button className="button-hide" onClick={()=>{setSelected(1)}}><span className={selected===1?"mr-3 single-passive-tab-active":"mr-3 single-passive-tab"}>Completed(5)</span></button>
                    </div>
                </div>
            </div>
            {selected===0?
            <Table className="m-4 bordered table-hover border" style={{borderRadius:"6px",color:"#475467"}}>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Device ID</th>
                            <th>Vendor</th>
                            <th>Model</th>
                            <th>Assigned</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {deviceData.map((record, index) => {
                            return ( */}
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faGlobe} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Ready
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Pending</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg"/> Retry
                          </button></td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faClock} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Queued
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Provisionor 9</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg" /> Retry
                          </button></td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faArrowUpArrowDown} size="lg" className="ml-2" style={{marginRight:"4px"}}/> In Progress
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Provisionor 10</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg" /> Retry
                          </button></td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faCloudArrowDown} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Awaiting Sync
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Provisionor 11</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg"/> Retry
                          </button></td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faGlobe} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Ready
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Pending</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg" /> Retry
                          </button></td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faGlobe} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Ready
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>Pending</td>
                                        <td><button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                        <FontAwesomeIcon icon={faRefresh} size="lg"/>  Retry
                          </button></td>
                                </tr>
                    </tbody>
                </Table>:""}
                {selected ===1?
            <Table className="m-4 bordered table-hover border" style={{borderRadius:"6px",color:"#475467"}}>
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Device ID</th>
                            <th>Vendor</th>
                            <th>Model</th>
                            <th>Kasa Account</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {deviceData.map((record, index) => {
                            return ( */}
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Completed
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>kasa+sapientlab01@sapient.industries</td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Completed
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>kasa+sapientlab01@sapient.industries</td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Completed
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>kasa+sapientlab01@sapient.industries</td>
                                </tr>
                                <tr >
                                        <td scope="row">
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Completed
                                         </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>kasa+sapientlab01@sapient.industries</td>
                                </tr>
                                <tr >
                                        <td scope="row" >
                                        <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px"}}/> Completed
                                        </td>
                                        <td>AA:AA:AA:AA</td>
                                        <td>TP-Link</td>
                                        <td>KP115s</td>
                                        <td>kasa+sapientlab01@sapient.industries</td>
                                </tr>
                    </tbody>
                </Table>:""}

                </Col>
            </Row>
            <Modal show={show} onHide={handleClose} centered dialogClassName="my-modal" contentClassName="my-modal">
                <Modal.Header>
                    <Modal.Title>Add Network</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('mac_address', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Password</Form.Label>
                            <Input
                                type="text"
                                placeholder="Enter Password"
                                className="font-weight-bold">
                                {/* <option selected>Enter Password</option> */}
                                {/* {activeDeviceModal.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })} */}
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Building</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option selected>Select Building</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:"center",margin:"0rem"}}>
                    <button className='btn btn-outline-secondary' style={{width:"8rem"}}  onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                            handleClose();
                        }}
                        style={{width:"8rem"}}
                        >Add
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showlink} onHide={handleClose} centered dialogClassName="my-modal" contentClassName="my-modal" >
                <Modal.Header style={{margin:"0 auto"}}>
                    <Modal.Title><img src={tplink} width="200px" height="80px"/></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{textAlign:"center"}}>Sign in to allow Sapient industries to control your TP-Link Kasa devices. Remote control should be enabled on your TP-Link Kasa device to work with Sapient Industries.</p>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                           
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                className="font-weight-bold"
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            
                            <Input
                                type="text"
                                placeholder="Password"
                                className="font-weight-bold">
                                {/* <option selected>Enter Password</option> */}
                                {/* {activeDeviceModal.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })} */}
                            </Input>
                        </Form.Group>
                        <div style={{color:"blue",textAlign:"right",fontWeight:"bold"}}>Forgot Password?</div>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:"center",margin:"0rem"}}>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                            setShowLink(false);
                        }}
                        style={{width:"100%"}}
                        >Authorize
                    </button>
                </Modal.Footer>
            </Modal>

        </React.Fragment>
    );
};

export default Provision;
