import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, Input } from 'reactstrap';
import axios from 'axios';
import {
    BaseUrl,
    equipmentType,
    getEquipmentType,
    addEquipmentType,
    updateEquipmentType,
    getEndUseId,
} from '../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { ComponentStore } from '../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
// import { ChevronDown, Search } from 'react-feather';
import './style.css';
// import { TagsInput } from 'react-tag-input-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import Select from 'react-select';
import { Cookies } from 'react-cookie';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';

const SingleEquipmentModal = ({ show, equipData, close, endUseData, getDevices }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [editEqipmentData, setEditEqipmentData] = useState({});

    const handleChange = (key, value) => {
        let obj = Object.assign({}, editEqipmentData);
        obj[key] = value;
        setEditEqipmentData(obj);
    };
    const editDeviceData = async () => {
        let obj = Object.assign({}, editEqipmentData);
        obj['eqt_id'] = equipData.equipment_id;
        obj['is_active'] = true;
        setEditEqipmentData(obj);
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
                    close();
                    getDevices();
                });
        } catch (error) {}
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
                                    disabled={true}
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
                                    disabled={true}
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
                            disabled={true}
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
    const [userPermission] = useAtom(userPermissionData);

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
                <Table className="mt-4 mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Status</th>
                            <th>End Use Category</th>
                            <th>Equipment Count</th>
                        </tr>
                    </thead>
                    {isDeviceProcessing ? (
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
                                            if (userPermission?.user_role === 'admin') {
                                                setEquipData(record);
                                                Toggle();
                                            }
                                        }}
                                        className="mouse-pointer">
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
                                window.scrollTo(0, 0);
                            }}>
                            {[20, 50, 100].map((pageSize) => (
                                <option key={pageSize} value={pageSize} className="align-options-center">
                                    Show {pageSize} devices
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
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

    const [formValidation, setFormValidation] = useState(false);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [search, setSearch] = useState('');

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentTypeData, setGeneralEquipmentTypeData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [createEqipmentData, setCreateEqipmentData] = useState({
        name: '',
        end_use: '',
    });

    useEffect(() => {
        if (createEqipmentData.name.length > 0 && createEqipmentData.end_use.length > 0) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [createEqipmentData]);

    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [paginationData, setPaginationData] = useState({});
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);

    const [endUseDataNow, setEndUseDataNow] = useState([]);

    const addEndUseType = () => {
        endUseData.map((item) => {
            setEndUseDataNow((el) => [...el, { value: `${item?.end_user_id}`, label: `${item?.name}` }]);
        });
    };

    useEffect(() => {
        if (endUseData) {
            addEndUseType();
        }
    }, [endUseData]);

    const handleSearch = async (e) => {
        var txt = e.target.value;
        if (txt === '') {
            setGeneralEquipmentTypeData(equipmentTypeData);
        } else {
            if (txt.length > 0) {
                try {
                    setIsDeviceProcessing(true);
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    let params = `?equipment_search=${txt}`;
                    await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                        let response = res?.data?.data;
                        setGeneralEquipmentTypeData(response);
                        setIsDeviceProcessing(false);
                    });
                } catch (error) {
                    setIsDeviceProcessing(false);
                }
            }
        }
    };

    // const [first, setfirst] = useState(second);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEqipmentData);
        obj[key] = value;
        setCreateEqipmentData(obj);
    };

    const saveDeviceData = async () => {
        let obj = Object.assign({}, createEqipmentData);
        obj['is_active'] = true;
        setCreateEqipmentData(obj);
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
                    fetchEquipTypeData();
                    setFormValidation(false);
                });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    const nextPageData = async (path) => {
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
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(response.data);
                setEquipmentTypeData(response.data);
                setIsDeviceProcessing(false);
                setFormValidation(false);
            });
        } catch (error) {
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
            await axios.get(`${BaseUrl}${path}`, { headers }).then((res) => {
                let response = res.data;
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(response.data);
                setEquipmentTypeData(response.data);
                setIsDeviceProcessing(false);
                setFormValidation(false);
            });
        } catch (error) {
            setIsDeviceProcessing(false);
        }
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment Types',
                        path: '/settings/equipment-types',
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
            let params = `?page_size=${pageSize}&page_no=${pageNo}`;
            await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                setPaginationData(res.data);
                setGeneralEquipmentTypeData(res.data.data);
                setEquipmentTypeData(res.data.data);
                setIsDeviceProcessing(false);
                setFormValidation(false);
            });
        } catch (error) {
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
                await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                    let response = res.data;
                    response.sort((a, b) => {
                        return a.name.localeCompare(b.name);
                    });
                    setEndUseData(response);
                });
            } catch (error) {}
        };

        fetchEquipTypeData();
        getEndUseIds();
    }, [bldgId]);

    const [userPermission] = useAtom(userPermissionData);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Equipment Types</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.user_role === 'admin' ? (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        handleShow();
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>Add Equipment Type
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col xl={3}>
                    <div className="search-container">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                        <input
                            className="search-box ml-2"
                            type="search"
                            name="search"
                            placeholder="Search"
                            onChange={(e) => {
                                handleSearch(e);
                            }}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
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
                            {/* <Input
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
                            </Input> */}
                            {/* endUseDataNow */}
                            <Select
                                id="exampleSelect"
                                placeholder="Select End Use"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select End Use'}
                                options={endUseDataNow}
                                onChange={(e) => {
                                    handleChange('end_use', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
                        <Button
                            style={{ width: '50%', backgroundColor: '#fff', border: '1px solid black', color: '#000' }}
                            onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button
                            style={{ width: '50%', backgroundColor: '#444CE7', border: 'none' }}
                            onClick={() => {
                                saveDeviceData();
                                handleClose();
                            }}
                            disabled={!formValidation}>
                            {isProcessing ? 'Adding...' : 'Add'}
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default EquipmentTypes;
