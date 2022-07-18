import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button,Alert, Input} from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, get_kasa_devices, get_kasa_account, kasaAuthenticate, insert_kasa_devices, doneProvisioning } from '../../../services/Network';
import { ChevronDown } from 'react-feather';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../store/BuildingStore';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import Pagination from 'react-bootstrap/Pagination';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import './style.css';
import { faCircleCheck, faGlobe, faClock, faRefresh, faArrowUpArrowDown, faCloudArrowDown,faCheck ,faSignalStream,faPencil,faPlus} from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import tplink from "../../../assets/images/tplink.png";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Container, Label, FormGroup, InputGroup, InputGroupAddon } from 'reactstrap';
import { Mail, Lock } from 'react-feather';
import { ConsoleView } from 'react-device-detect';


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
    const [showEmail, setShowEmail] = useState(false);
    const [showlink, setShowLink] = useState(false);
    const [showDone,setShowDone]=useState(false);
    const handleClose = () => setShow(false);
    const handleLinkClose=()=>setShowLink(false);
    const handleShow = () => setShow(true);
    const [linkedAccount, setLinkedAccount]=useState([]);
    const [provisioningData, setProvisioningData]=useState([]);
    const [readyData, setReadyData]=useState([]);
    const [progressData,setProgressData]=useState([]);
    const [total, setTotal]=useState([]);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [selectedKasaEmail,setSelectedKasaEmail]=useState("");
    const [selectedKasaId,setSelectedKasaId]=useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAddProcessing, setIsAddProcessing] = useState(false);

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
    const [auth,setAuth]=useState("");

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createDeviceData);
        obj[key] = value;
        setCreateDeviceData(obj);
    };
    const [error, setError]=useState(false);
    const [message,setMessage]=useState("");
    const [kasaDevices,setKasaDevices]=useState([]);
    
    const handleAuthorize =()=>{
        // console.log(email);
        // console.log(password);
        let authData={
            username:email,
            password:password,
            building_id:bldgId
        }
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?username=${email}&password=${password}`;

            axios
                .post(`${BaseUrl}${kasaAuthenticate}`,authData, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    if(res.status===200){
                        setShowLink(false);
                        // console.log(res.data.id);
                        localStorage.setItem("kasa_id",res.data.id)
                        setAuth(res.data.id);
                    }
                });

        } catch (error) {
            setError(true);
            console.log('Failed to Authenticate');
        }
    }  
    const handleAdd=()=>{
        linkedAccount.forEach(ele=>{
            if(ele.email===selectedKasaEmail){
                setSelectedKasaId(ele.id);
            }
        })
        setShowEmail(false);
        setShowDone(true);
    }
    const handleDone=()=>{
        // console.log(selectedKasaId);
        // console.log(selectedKasaEmail);
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let arr={
                "kasa_account_id":kasaDevices,
                "building_id":bldgId
            }
            // let params = `?kasa_account_id=${localStorage.getItem("kasa_id")}&building_id=${bldgId}`;
            axios
                .post(`${BaseUrl}${doneProvisioning}`,arr, {
                    headers: header,
                })
                .then((res) => {
                    setShowDone(false);
                    getKasaDevices();
                });

            } catch (error) {
                setError(true);
                console.log('Failed to Provision');
            }
    }
   const handleAddDevice=(e,kasa_account_id,device_id)=>{
    let authData={
        "building_id":bldgId,
        "device_id":device_id,
        "kasa_account_id":kasa_account_id
    }
    try {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        axios
            .post(`${BaseUrl}${insert_kasa_devices}`,authData, {
                headers: header,
            })
            .then((res) => {
                // console.log(res.data);
                if(res.status===200){
                    getKasaDevices();
                }
            });

    } catch (error) {
        setError(true);
        console.log('Failed to Authenticate');
    }

   }
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
    const getKasaAccount = () => {
        try {
            setIsProcessing(true);
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            axios
            .get(`${BaseUrl}${get_kasa_account}`, {
                headers: header,
            })
            .then((res) => {
                let kDevices=[];
                // console.log(res.data.data);
                setLinkedAccount(res.data.data);
                let Hs=0;
                let kp=0;
                let Hs1=0;
                let socket=0;
                let capy=0;
                res.data.data.forEach(ele => {
                    if(ele.is_provisioned===false){
                        kDevices.push(ele.id)
                    }
                    Hs=Hs+ele.HS110s;
                    kp=kp+ele.KP115s;
                    Hs1=Hs1+ele.HS300s;
                    socket=socket+ele.Socket;
                    capy=capy+ele.Remaining_Capacity;
                });
                let arr={
                    HS110s:Hs,
                    KP115s:kp,
                    HS300s:Hs1,
                    Socket:socket,
                    Remaining_Capacity:capy
                }
                setTotal(arr);
                // console.log(arr);
                setIsProcessing(false);
                // console.log("kasa devices",kDevices);
                setKasaDevices(kDevices);
            });
        } catch (error) {
            console.log('Failed to fetch kasa account');
            setIsProcessing(false);
        }
}
const getKasaDevices=()=>{
try {
    setIsAddProcessing(true);
    let ready=[];
    let progress=[];
    let header = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userdata.token}`,
    };
    // let params = `?kasa_account_id=${auth}`;
    axios
    .get(`${BaseUrl}${get_kasa_devices}`, {
        headers: header,
    })
    .then((res) => {
        // console.log(res.data.data);
        res.data.data.forEach(ele => {
            if(ele.action===1){
                ready.push(ele);
            }
            else{
                progress.push(ele);
            }
         });
         setReadyData(ready);
         setProgressData(progress);
        setProvisioningData(res.data.data);
        setIsAddProcessing(false);
        
    });
} catch (error) {
    console.log('Failed to fetch kasa account');
    setIsAddProcessing(false);
}

}
useEffect(()=>{
    getKasaAccount();
    //   getKasaDevices();
     // console.log(progressData);
    

},[auth])

    useEffect(()=>{
      // console.log(auth);

          
      getKasaAccount();
    //   getKasaDevices();

    },[])
    // useEffect(() => {
    //     // console.log('selectedOptions => ', selectedOptions);
    //     // console.log("readyData",readyData);
    //     // console.log("progressData",progressData);
       
        
    // });

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
                    {isProcessing ? (
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
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                    <tbody>
                                                
                        {linkedAccount.length!==0?
                            <>
                                {linkedAccount.map((record, index) => {
                                return ( 
                                <tr >
                                        <td scope="row" className="email-head">
                                            {record.email}
                                        </td>
                                        <td>{record.HS110s}</td>
                                        <td>{record.KP115s}</td>
                                        <td>{record.HS300s}</td>
                                        <td>{record.Socket}</td>
                                        <td>{record.Remaining_Capacity}</td>
                                </tr>)})}
                                <tr>
                                        <td scope="row" className="email-head">
                                            Totals
                                        </td>
                                        <td>{total.HS110s}</td>
                                        <td>{total.KP115s}</td>
                                        <td>{total.HS300s}</td>
                                        <td>{total.Socket}</td>
                                        <td>{total.Remaining_Capacity}</td>
                                </tr>
                        </>:
                        <tr>
                            <td colSpan={5}>No Account linked</td>
                        </tr>
                        }
                    </tbody>
                    )}
                </Table>

                </Col>
                <Col md={5}>
                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                      
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-outline-secondary font-weight-bold"
                                onClick={getKasaDevices}
                                >
                                <FontAwesomeIcon icon={faCheck} size="md" style={{marginRight:"0.5rem"}}/>
                                Find Devices
                            </button>
                        </div>
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={handleDone}
                                >
                                <FontAwesomeIcon icon={faSignalStream} size="md" style={{marginRight:"0.5rem"}}/>
                                Add to System
                            </button>
                        </div>
                    </div>
                    {/* <Row className='mt-5 ml-5 mr-3'>
                        <Col>
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
                    <button
                              type="button"
                              className="btn btn-md btn-outline-secondary font-weight-bold mr-4"
                              style={{width:"10rem"}}
                             >
                              <FontAwesomeIcon icon={faPencil} size="md" style={{marginRight:"0.5rem"}}/>Edit Networks
                          </button>
                          <button
                              type="button"
                              className="btn btn-md btn-outline-secondary font-weight-bold"
                              style={{width:"10rem"}}
                              onClick={() => {
                                  handleShow();
                              }}>
                              <FontAwesomeIcon icon={faPlus} size="md" style={{marginRight:"0.5rem"}}/>Network
                          </button>
                    </div>
                    
                        </Col> 
                        {/* <Col md={4}>
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
                        </Col> */}
                    {/* </Row> */}
                    
                </Col>
            </Row>

          

            <Row>
                <Col lg={11} >
                <span className='sub-heading' style={{ marginLeft: '20px' }}>Provisioning</span>
                
                <div className="nav-header-container" style={{ marginLeft: '20px' }}>
                <div className="passive-page-header">
                    <div className="mt-2 single-passive-tabs-style">
                    <button className='button-hide' onClick={()=>{setSelected(0)}}><span className={selected===0?"mr-3 single-passive-tab-active":"mr-3 single-passive-tab"}>In Progress({progressData.length})</span></button>
                    <button className="button-hide" onClick={()=>{setSelected(1)}}><span className={selected===1?"mr-3 single-passive-tab-active":"mr-3 single-passive-tab"}>Completed({readyData.length})</span></button>
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
                            {/* <th>Assigned</th> */}
                            <th>Kasa Account</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    {isAddProcessing ? (
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

                                    {/* <td>
                                        <Skeleton count={5} />
                                    </td> */}
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                    <tbody>
                    {progressData.map((record, index) => {
                        if(record.action!==1){
                            return (
                         
                                <tr >
                                        <td scope="row" >
                                        {/* <FontAwesomeIcon icon={faArrowUpArrowDown} size="lg" className="ml-2" style={{marginRight:"4px"}}/> In Progress */}
                                        {record.status}
                                        </td>
                                        <td>{record.device_mac}</td>
                                        <td>{record.vendor}</td>
                                        <td>{record.model}</td>
                                        {/* <td>{record.assigned}</td> */}
                                        <td>{record.kasa_account}</td>
                                        {/* <td>{record.action===0?
                                            <button type="button" className="btn btn-md btn-outline-secondary font-weight-bold">
                                             Waiting
                              </button> :<button type="button" className="btn btn-md btn-outline-secondary font-weight-bold" onClick={(e)=>{handleAddDevice(e,record.kasa_account_id,record.device_id)}}>
                                        <FontAwesomeIcon icon={faRefresh} size="lg"/> Retry
                          </button>   
                                    }</td> */}
                                </tr>
                            )}})}
              
                    </tbody>
                    )}
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
                    {isAddProcessing ? (
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
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                    <tbody>
                                {readyData.map((record, index) => {
                            if(record.action===1){
                            return (
                         
                                <tr >
                                        <td scope="row" >
                                        {/* <FontAwesomeIcon icon={faCircleCheck} size="lg" className="ml-2" style={{marginRight:"4px", color:"green"}}/> Completed */}
                                        {record.status}
                                        </td>
                                        <td>{record.device_mac}</td>
                                        <td>{record.vendor}</td>
                                        <td>{record.model}</td>
                                        <td>{record.kasa_account}</td>
                                </tr>
                            )}})}
                    </tbody>
                    )}
                </Table>:""}

                </Col>
            </Row>

            {/* Add network Modal */}
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

                        {/* Link Account Modal */}
            <Modal show={showlink} onHide={handleLinkClose} centered dialogClassName="my-modal1" contentClassName="my-modal1">
                <Modal.Header style={{marginLeft:"1rem",marginTop:"10px",padding:"0px"}}>
                    <Modal.Title>
                        {/* <img src={tplink} width="200px" height="80px"/> */}
                        <p style={{fontSize:"18px", fontWeight:"bold",marginBottom:"0px"}}>Add TP Link - Kasa Account</p>
                        </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{marginTop:"0px"}}>                    
                {/* <p style={{textAlign:"center"}}>Sign in to allow Sapient industries to control your TP-Link Kasa devices. Remote control should be enabled on your TP-Link Kasa device to work with Sapient Industries.</p> */}
                <AvForm className="authentication-form" autoComplete="off">
                {error && <Alert color="danger" isOpen={error ? true : false}>
                                                    <div>{message}</div>
                                                </Alert>}
                                                    <AvGroup className="">
                                                        <label>Email</label>
                                                        <InputGroup>
                                                           
                                                            <AvInput type="text" name="username" id="username" placeholder="Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
                                                        </InputGroup>
                                                        
                                                    </AvGroup>
                                                    <AvGroup className="mb-3">
                                                    <label>Password</label>
                                                        <InputGroup>
                                                           
                                                            <AvInput type="password" name="password" id="password" placeholder="Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
                                                        </InputGroup>
                                                        {/* <Link to="/account/forget-password" className="float-right text-muted text-unline-dashed ml-1">Forgot your password?</Link> */}
                                                        
                                                    </AvGroup>
                 </AvForm>
                    
                </Modal.Body>
                <Modal.Footer style={{justifyContent:"center",margin:"0rem"}}>
                    <button className='btn btn-outline-secondary' style={{width:"8rem"}}  onClick={handleLinkClose}>
                        Cancel
                    </button>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                         handleAuthorize();
                        }}
                        style={{width:"8rem"}}
                        >Add
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Done Provisioning */}
            <Modal show={showEmail} onHide={()=>{setShowEmail(false)}} centered>
                <Modal.Header>
                    <Modal.Title>Verify Provisioning</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Kasa Account</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    setSelectedKasaEmail(e.target.value);
                                }}>
                                <option selected>Select Kasa Account</option>
                                {linkedAccount.map((record) => {
                                    return <option value={record.email}>{record.email}</option>;
                                })}
                            </Input>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:"center",margin:"0rem"}}>
                    <button className='btn btn-outline-secondary' style={{width:"8rem"}}  onClick={()=>{setShowEmail(false)}}>
                        Cancel
                    </button>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                         handleAdd();
                        }}
                        style={{width:"8rem"}}
                        >Add
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDone} onHide={()=>{setShowDone(false)}} centered>
                <Modal.Body>
                    <p style={{textAlign:"center",marginTop:"1rem"}}>Are you sure you want to add this account devices<p style={{fontWeight:"bold"}}>{selectedKasaEmail}</p>in selected building <p style={{fontWeight:"bold"}}>{localStorage.getItem("buildingName")} ?</p></p>
                </Modal.Body>
                <Modal.Footer style={{justifyContent:"center",margin:"0rem"}}>
                    <button className='btn btn-outline-secondary' style={{width:"8rem"}}  onClick={()=>{setShowDone(false);setShowEmail(true);}}>
                        Cancel
                    </button>
                    <button
                        className='btn btn-primary'
                        onClick={() => {
                        //  handleDone();
                        }}
                        style={{width:"8rem"}}
                        >Done
                    </button>
                </Modal.Footer>
            </Modal>



        </React.Fragment>
    );
};

export default Provision;
