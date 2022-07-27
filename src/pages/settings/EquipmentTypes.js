import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
    FormGroup,
} from 'reactstrap';
import axios from 'axios';
import {
    BaseUrl,
    generalEquipments,
    getLocation,
    equipmentType,
    addEquipmentType,
    updateEquipmentType,
    getEndUseId,
    createEquipment,
} from '../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { ComponentStore } from '../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
import { ChevronDown, Search } from 'react-feather';
import './style.css';
import { TagsInput } from 'react-tag-input-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { Cookies } from 'react-cookie';

const SingleEquipmentModal = ({ show, equipData, close, endUseData, getDevices }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [editEqipmentData, setEditEqipmentData] = useState({});

    const handleChange = (key, value) => {
        let obj = Object.assign({}, editEqipmentData);
        obj[key] = value;
        setEditEqipmentData(obj);
    };
    // console.log(equipData);
    //  console.log(endUseData);
    const editDeviceData = async () => {
        let obj = Object.assign({}, editEqipmentData);
        obj['eqt_id'] = equipData.equipment_id;
        obj['is_active'] = true;
        setEditEqipmentData(obj);
        // console.log(obj);
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            axios
                .post(`${BaseUrl}${updateEquipmentType}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    close();
                    getDevices();
                });
        } catch (error) {
            console.log('Failed to Edit Equipment data');
        }
    };

    return (
        <>
            {show ? (
                <Modal show={show} onHide={close} centered>
                    <Modal.Header>
                        <Modal.Title>Edit Equipment Type</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Name"
                                    readOnly
                                    className="font-weight-bold"
                                    defaultValue={equipData.equipment_type}
                                    onChange={(e) => {
                                        handleChange('name', e.target.value);
                                    }}
                                    autoFocus
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>End Use</Form.Label>
                                <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    className="font-weight-bold"
                                    defaultValue={equipData.end_use_id}
                                    onChange={(e) => {
                                        handleChange('end_use', e.target.value);
                                    }}>
                                    <option selected>Select End Use</option>
                                    {endUseData.map((record) => {
                                        return <option value={record.end_user_id}>{record.name}</option>;
                                    })}
                                </Input>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={close}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            //  onClick={()=>{editDeviceData();}}
                        >
                            Update
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : null}
        </>
    );
};

const EquipmentTable = ({
    equipmentTypeData,
    endUseData,
    getDevices,
    nextPageData,
    previousPageData,
    paginationData,
    pageSize,
    setPageSize,
    isDeviceProcessing,
}) => {
    const records = [
        {
            name: 'Air Handling Unit',
            status: 'Sapient',
            enduse_category: 'HVAC',
            equipment_count: 11,
        },
        {
            name: 'Laptop',
            status: 'Sapient',
            enduse_category: 'Plug',
            equipment_count: 452,
        },
        {
            name: 'Custom Equipment',
            status: 'Custom',
            enduse_category: 'HVAC',
            equipment_count: 138,
        },
    ];

    const [modal, setModal] = useState(false);
    const Toggle = () => setModal(!modal);
    const [equipData, setEquipData] = useState(null);

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered table-hover">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>End Use Category</th>
                                <th>Equipment Count</th>
                            </tr>
                        </thead>
                        {isDeviceProcessing ? (
                            <tbody>
                                <SkeletonTheme color="#202020" height={20}>
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
                                    </tr>
                                </SkeletonTheme>
                            </tbody>
                        ) : (
                            <tbody>
                                {equipmentTypeData.map((record, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            onClick={() => {
                                                setEquipData(record);
                                                Toggle();
                                            }}>
                                            <td className="equip-type-style">
                                                {record.equipment_type ? record.equipment_type : '-'}
                                            </td>
                                            <td>{record.status ? record.status : '-'}</td>
                                            <td>{record.end_use_name ? record.end_use_name : '-'}</td>
                                            <td>{record.equipment_count}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        )}
                    </Table>
                    <div className="page-button-style">
                        <button
                            type="button"
                            className="btn btn-md btn-light font-weight-bold mt-4"
                            disabled={
                                paginationData.pagination !== undefined
                                    ? paginationData.pagination.previous === null
                                        ? true
                                        : false
                                    : false
                            }
                            onClick={() => {
                                previousPageData(paginationData.pagination.previous);
                            }}>
                            Previous
                        </button>
                        <button
                            type="button"
                            className="btn btn-md btn-light font-weight-bold mt-4"
                            disabled={
                                paginationData.pagination !== undefined
                                    ? paginationData.pagination.next === null
                                        ? true
                                        : false
                                    : false
                            }
                            onClick={() => {
                                nextPageData(paginationData.pagination.next);
                            }}>
                            Next
                        </button>
                        <div>
                            <select
                                value={pageSize}
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                onChange={(e) => {
                                    setPageSize(parseInt(e.target.value));
                                }}>
                                {[20, 50, 100].map((pageSize) => (
                                    <option key={pageSize} value={pageSize} className="align-options-center">
                                        Show {pageSize} devices
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <div>
                <SingleEquipmentModal
                    show={modal}
                    equipData={equipData}
                    close={Toggle}
                    endUseData={endUseData}
                    getDevices={getDevices}
                />
            </div>
        </>
    );
};

const EquipmentTypes = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentTypeData, setGeneralEquipmentTypeData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [createEqipmentData, setCreateEqipmentData] = useState({});
    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);

    const handleChange = (key, value) => {
        // let endUseId=""
        // if(key==="end_use"){
        //     endUseData.forEach(ele=>{
        //         if(ele.name===value){
        //             endUseId=ele.end_user_id;
        //         }
        //     })
        //     let obj = Object.assign({}, createEqipmentData);
        // obj[key] = endUseId;
        // setCreateEqipmentData(obj);
        // }
        // else{
        let obj = Object.assign({}, createEqipmentData);
        obj[key] = value;
        setCreateEqipmentData(obj);
        // }
    };

    const saveDeviceData = async () => {
        let obj = Object.assign({}, createEqipmentData);
        obj['building_id'] = bldgId;
        obj['is_active'] = true;
        setCreateEqipmentData(obj);
        // console.log(obj);
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            setIsProcessing(true);

            axios
                .post(`${BaseUrl}${addEquipmentType}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    fetchEquipTypeData();
                });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Passive device data');
        }
    };

    const nextPageData = async (path) => {
        // console.log("next path ",path);
        try {
            setIsDeviceProcessing(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let response = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(response.data);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
            setIsDeviceProcessing(false);
        }
    };

    const previousPageData = async (path) => {
        try {
            setIsDeviceProcessing(true);
            if (path === null) {
                return;
            }
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let response = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(response.data);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch all Active Devices');
            setIsDeviceProcessing(false);
        }
    };

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
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);
    const fetchEquipTypeData = async () => {
        try {
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                // console.log('setGeneralEquipmentTypeData => ', res.data);
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(res.data.data);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Equipment Type Data');
            setIsDeviceProcessing(false);
        }
    };

    useEffect(() => {
        fetchEquipTypeData();
    }, [pageSize]);
    useEffect(() => {
        const getEndUseIds = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                    let response = res.data;
                    response.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });
                    setEndUseData(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch End Use Data');
            }
        };

        fetchEquipTypeData();
        getEndUseIds();
    }, [bldgId]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Equipment Types</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Equipment Type
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div className="search-container ml-4">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input className="search-box ml-2" type="search" name="search" placeholder="Search" />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={7}>
                    <EquipmentTable
                        equipmentTypeData={generalEquipmentTypeData}
                        endUseData={endUseData}
                        getDevices={fetchEquipTypeData}
                        nextPageData={nextPageData}
                        previousPageData={previousPageData}
                        paginationData={paginationData}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        isDeviceProcessing={isDeviceProcessing}
                    />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>End Use</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('end_use', e.target.value);
                                }}>
                                <option selected>Select End Use</option>
                                {endUseData.map((record) => {
                                    return <option value={record.end_user_id}>{record.name}</option>;
                                })}
                                {/* <option selected>Select End Use</option>
                                <option value="Plug">Plug</option>
                                <option value="Process">Process</option>
                                <option value="Lighting">Lighting</option>
                                <option value="HVAC">HVAC</option> */}
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

export default EquipmentTypes;
