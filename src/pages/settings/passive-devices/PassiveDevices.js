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
    Dropdown,
} from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    BaseUrl,
    generalPassiveDevices,
    getLocation,
    createDevice,
    generalGateway,
    searchDevices,
    updateDevice,
    deletePassiveDevice,
} from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { ChevronDown, Search } from 'react-feather';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import ThreeDots from '../../../assets/images/threeDots.png';
import './style.css';
import Pen from '../../../assets/images/pen.png';
import Delete from '../../../assets/images/delete.png';
import { useAtom } from 'jotai';
import { deviceId, identifier, passiveDeviceModal } from '../../../store/globalState';
import Select from 'react-select';

const PassiveDevicesTable = ({
    deviceData,
    nextPageData,
    previousPageData,
    paginationData,
    isDeviceProcessing,
    setIsDeviceProcessing,
    selectedOptions,
    passiveDeviceDataWithFilter,
    pageSize,
    setPageSize,
    setIsEdit,
    isEdit,
    setIsDelete,
}) => {
    const [identifierOrder, setIdentifierOrder] = useState(false);
    const [modelOrder, setModelOrder] = useState(false);
    const [locationOrder, setLocationOrder] = useState(false);
    const [sensorOrder, setSensorOrder] = useState(false);

    const handleColumnSort = (order, columnName) => {
        if (columnName === 'mac_address') {
            setModelOrder(false);
            setLocationOrder(false);
            setSensorOrder(false);
        }
        if (columnName === 'model') {
            setIdentifierOrder(false);
            setLocationOrder(false);
            setSensorOrder(false);
        }
        if (columnName === 'location') {
            setIdentifierOrder(false);
            setModelOrder(false);
            setSensorOrder(false);
        }
        if (columnName === 'sensor_count') {
            setIdentifierOrder(false);
            setModelOrder(false);
            setLocationOrder(false);
        }
        passiveDeviceDataWithFilter(order, columnName);
    };

    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [globalCoords, setGlobalCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // 👇️ get global mouse coordinates
        const handleWindowMouseMove = (event) => {
            setGlobalCoords({
                x: event.screenX,
                y: event.screenY,
            });
        };
        window.addEventListener('mousemove', handleWindowMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleWindowMouseMove);
        };
    }, []);

    const handleMouseMove = (event) => {
        setCoords({
            x: event.clientX - event.target.offsetLeft,
            y: event.clientY - event.target.offsetTop,
        });
    };

    const [toggleEdit, setToggleEdit] = useState(false);
    const [sensorId, setSensorId] = useState('');

    const [identifierVal, setIdentifierVal] = useAtom(identifier);
    const [deviceIdVal, setDeviceIdVal] = useAtom(deviceId);
    const [modalVal, setModalVal] = useAtom(passiveDeviceModal);

    return (
        <>
            <Card onMouseMove={handleMouseMove}>
                <CardBody>
                    <Table className="mb-0 bordered table-hover">
                        <thead>
                            <tr className="mouse-pointer">
                                {selectedOptions.some((record) => record.value === 'status') && (
                                    <th className="active-device-header">
                                        <div className="passive-device-flex">
                                            <div>Status</div>
                                        </div>
                                    </th>
                                )}
                                {selectedOptions.some((record) => record.value === 'identifier') && (
                                    <th
                                        className="active-device-header"
                                        onClick={() => setIdentifierOrder(!identifierOrder)}>
                                        <div className="passive-device-flex">
                                            <div>Identifier (MAC)</div>
                                            {identifierOrder ? (
                                                <div
                                                    className="ml-2"
                                                    onClick={() => handleColumnSort('ace', 'mac_address')}>
                                                    <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                </div>
                                            ) : (
                                                <div
                                                    className="ml-2"
                                                    onClick={() => handleColumnSort('ace', 'mac_address')}>
                                                    <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                )}
                                {selectedOptions.some((record) => record.value === 'model') && (
                                    <th className="active-device-header" onClick={() => setModelOrder(!modelOrder)}>
                                        <div className="passive-device-flex">
                                            <div>Model</div>
                                            {modelOrder ? (
                                                <div className="ml-2" onClick={() => handleColumnSort('ace', 'model')}>
                                                    <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                </div>
                                            ) : (
                                                <div className="ml-2" onClick={() => handleColumnSort('ace', 'model')}>
                                                    <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                )}
                                {selectedOptions.some((record) => record.value === 'location') && (
                                    <th
                                        className="active-device-header"
                                        onClick={() => setLocationOrder(!locationOrder)}>
                                        <div className="passive-device-flex">
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
                                                    onClick={() => handleColumnSort('ace', 'location')}>
                                                    <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                )}
                                {selectedOptions.some((record) => record.value === 'sensors') && (
                                    <th className="active-device-header" onClick={() => setSensorOrder(!sensorOrder)}>
                                        <div className="passive-device-flex">
                                            <div>Sensors</div>
                                            {sensorOrder ? (
                                                <div
                                                    className="ml-2"
                                                    onClick={() => handleColumnSort('ace', 'sensor_count')}>
                                                    <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                                </div>
                                            ) : (
                                                <div
                                                    className="ml-2"
                                                    onClick={() => handleColumnSort('ace', 'sensor_count')}>
                                                    <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                )}
                                <th className="active-device-header">
                                    <div className="passive-device-flex">
                                        <div>Actions</div>
                                    </div>
                                </th>
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

                                        <td>
                                            <Skeleton count={5} />
                                        </td>
                                    </tr>
                                </SkeletonTheme>
                            </tbody>
                        ) : (
                            <tbody style={{ position: 'relative' }}>
                                {deviceData.map((record, index) => {
                                    return (
                                        <>
                                            <tr key={index} className="mouse-pointer">
                                                {selectedOptions.some((record) => record.value === 'status') && (
                                                    <td scope="row" className="text-center">
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
                                                    </td>
                                                )}

                                                <Link
                                                    to={{
                                                        pathname: `/settings/passive-devices/single/${record.equipments_id}`,
                                                    }}>
                                                    {selectedOptions.some(
                                                        (record) => record.value === 'identifier'
                                                    ) && (
                                                        <td className="font-weight-bold panel-name">
                                                            {record.identifier}
                                                        </td>
                                                    )}
                                                </Link>

                                                {selectedOptions.some((record) => record.value === 'model') && (
                                                    <td>
                                                        {record.model.charAt(0).toUpperCase() + record.model.slice(1)}
                                                    </td>
                                                )}
                                                {selectedOptions.some((record) => record.value === 'location') && (
                                                    <td>
                                                        {record.location === ' > '
                                                            ? ' - '
                                                            : record.location.split('>').reverse().join(' > ')}
                                                    </td>
                                                )}
                                                {selectedOptions.some((record) => record.value === 'sensors') && (
                                                    <td>{record.sensor_number}</td>
                                                )}
                                                <td>
                                                    <img
                                                        onClick={() => {
                                                            setToggleEdit(true);
                                                            setSensorId(record?.identifier);
                                                            setIdentifierVal(record?.identifier);
                                                            setDeviceIdVal(record?.equipments_id);
                                                            setModalVal(record?.model);
                                                        }}
                                                        style={{ width: '20px' }}
                                                        src={ThreeDots}
                                                    />
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}

                                <Dropdown
                                    style={{
                                        width: '30px',
                                        position: 'absolute',
                                        top: '10px',
                                        right: 0,
                                    }}
                                    isOpen={toggleEdit}
                                    toggle={() => {
                                        setToggleEdit(!toggleEdit);
                                    }}>
                                    <DropdownToggle
                                        tag="button"
                                        size="sm"
                                        className="btn btn-link p-0 dropdown-toggle text-muted"></DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem
                                            onClick={() => {
                                                setIsEdit(true);
                                            }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    // justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                <img src={Pen} style={{ width: '20px' }} />
                                                <span style={{ marginLeft: '20px', fontWeight: '700' }}>Edit</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem onClick={() => {}}>
                                            <div
                                                onClick={() => {
                                                    setIsDelete(true);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    // justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}>
                                                <img src={Delete} style={{ width: '20px' }} />
                                                <span style={{ color: 'red', marginLeft: '20px', fontWeight: '700' }}>
                                                    Delete
                                                </span>
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </tbody>
                        )}
                    </Table>

                    <div className="page-button-style ml-2 ">
                        <div>
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4 mr-2"
                                onClick={() => {
                                    previousPageData(paginationData.pagination.previous);
                                }}>
                                Previous
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                onClick={() => {
                                    nextPageData(paginationData.pagination.next);
                                }}>
                                Next
                            </button>
                        </div>
                        <div>
                            <select
                                value={pageSize}
                                className="btn btn-md btn-light font-weight-bold mt-4"
                                onChange={(e) => {
                                    setPageSize(parseInt(e.target.value));
                                }}>
                                {[10, 25, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize} className="align-options-center">
                                        Show {pageSize} devices
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

const PassiveDevices = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [identifierVal, setIdentifierVal] = useAtom(identifier);
    const [deviceIdVal] = useAtom(deviceId);
    const [modalVal] = useAtom(passiveDeviceModal);

    const tableColumnOptions = [
        { label: 'Status', value: 'status' },
        { label: 'Identifier', value: 'identifier' },
        { label: 'Model', value: 'model' },
        { label: 'Location', value: 'location' },
        { label: 'Sensors', value: 'sensors' },
        { label: 'Actions', value: 'actions' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [pageRefresh, setPageRefresh] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);

    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [duplicatePassiveDeviceData, setDuplicatePassiveDeviceData] = useState([]);
    const [passiveDeviceModel, setPassiveDeviceModel] = useState([
        {
            value: 'hydra',
            label: 'Hydra',
        },
        {
            value: 'trident',
            label: 'Trident',
        },
    ]);
    const [paginationData, setPaginationData] = useState({});
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [generalGatewayData, setGeneralGatewayData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'passive',
    });
    const [search, setSearch] = useState('');

    const [locationDataNow, setLocationDataNow] = useState([]);

    const addLocationType = () => {
        locationData.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    useEffect(() => {
        if (locationData) {
            addLocationType();
        }
    }, [locationData]);

    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createDeviceData);
        obj[key] = value;
        setCreateDeviceData(obj);
    };

    const [isEdit, setIsEdit] = useState(false);
    const handleEditClose = () => setIsEdit(false);

    const [isDelete, setIsDelete] = useState(false);
    const handleDeleteClose = () => setIsDelete(false);

    const saveDeviceData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsProcessing(true);
            let params = `?building_id=${bldgId}`;
            await axios
                .post(`${BaseUrl}${createDevice}${params}`, createDeviceData, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setPageRefresh(!pageRefresh);

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Passive device data');
        }
    };

    const passiveDeviceDataWithFilter = async (order, filterBy) => {
        try {
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&page_size=40&page_no=1&ordered_by=${filterBy}&sort_by=${order}`;
            await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(response.data);
                setDuplicatePassiveDeviceData(response.data);
                setPaginationData(res.data);

                let onlineData = [];
                let offlineData = [];

                response.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch Filtered Active Devices');
        }
    };
    const handleSearchtxt = (e) => {
        if (e.target.value !== '') {
            setSearch(e.target.value.toUpperCase());
        } else {
            setPassiveDeviceData(duplicatePassiveDeviceData);
        }
    };

    const handleSearch = async () => {
        if (search !== '') {
            try {
                setIsDeviceProcessing(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_type=passive&building_id=${bldgId}&mac=${search}`;
                await axios.post(`${BaseUrl}${searchDevices}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setPassiveDeviceData(res.data);
                });
                setIsDeviceProcessing(false);
            } catch (error) {
                console.log(error);
                setIsDeviceProcessing(false);
                console.log('Failed to fetch all Active Devices');
            }
        } else {
            setPassiveDeviceData(duplicatePassiveDeviceData);
        }
    };

    const nextPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(response.data);
                setDuplicatePassiveDeviceData(response.data);
                setPaginationData(res.data);

                let onlineData = [];
                let offlineData = [];

                response.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch all Active Devices');
        }
    };

    const previousPageData = async (path) => {
        try {
            if (path === null) {
                return;
            }
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `&building_id=${bldgId}`;
            await axios.get(`${BaseUrl}${path}${params}`, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(response.data);
                setDuplicatePassiveDeviceData(response.data);
                setPaginationData(res.data);

                let onlineData = [];
                let offlineData = [];

                response.data.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch all Active Devices');
        }
    };

    const [updateDeviceBody, setUpdateDeviceBody] = useState({
        location_id: '',
        mac_address: '94:3C:C6:8D:28:78',
    });

    useEffect(() => {
        setUpdateDeviceBody({
            location_id: '',
            mac_address: identifierVal,
        });
    }, [identifierVal]);

    const updateDeviceData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?device_id=${deviceIdVal}`;
            await axios
                .post(`${BaseUrl}${updateDevice}${params}`, updateDeviceBody, {
                    headers: header,
                })
                .then((res) => {
                    passiveDeviceDataWithFilter('ace', 'mac_address');
                    handleEditClose();
                });
        } catch (error) {
            console.log('error', error);
            console.log('Failed to create Passive device data');
        }
    };

    const deleteDeviceData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?device_id=${deviceIdVal}`;
            await axios
                .delete(`${BaseUrl}${deletePassiveDevice}${params}`, {
                    headers: header,
                })
                .then((res) => {
                    passiveDeviceDataWithFilter('ace', 'mac_address');
                    handleDeleteClose();
                });
        } catch (error) {
            console.log('error', error);
            console.log('Failed to create Passive device data');
        }
    };

    const [deviceSearch, setDeviceSearch] = useState('');

    const fetchPassiveDeviceData = async () => {
        try {
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}&device_search=${deviceSearch}`;
            await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                let data = res.data;
                setPassiveDeviceData(data.data);
                setDuplicatePassiveDeviceData(data.data);
                let onlineData = [];
                let offlineData = [];

                data.forEach((record) => {
                    record.status === 'Online' ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsDeviceProcessing(false);
            console.log('Failed to fetch all Passive devices');
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
                let response = res.data;
                response.sort((a, b) => {
                    return a.location_name.localeCompare(b.location_name);
                });
                setLocationData(response);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Location Data');
        }
    };

    useEffect(() => {
        fetchPassiveDeviceData();
    }, [pageRefresh, bldgId, deviceSearch]);

    useEffect(() => {
        fetchLocationData();
    }, [pageRefresh, bldgId]);

    useEffect(() => {
        fetchPassiveDeviceData();
    }, [pageSize]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Passive Devices',
                        path: '/settings/passive-devices',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();

        let arr = [
            { label: 'Status', value: 'status' },
            { label: 'Identifier', value: 'identifier' },
            { label: 'Model', value: 'model' },
            { label: 'Location', value: 'location' },
            { label: 'Sensors', value: 'sensors' },
        ];
        setSelectedOptions(arr);
    }, []);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Passive Devices</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Passive Device
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
                                setDeviceSearch(e);
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
                <Col lg={8}>
                    {selectedTab === 0 && (
                        <PassiveDevicesTable
                            deviceData={passiveDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                            selectedOptions={selectedOptions}
                            passiveDeviceDataWithFilter={passiveDeviceDataWithFilter}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsEdit={setIsEdit}
                            setIsDelete={setIsDelete}
                            isEdit={isEdit}
                        />
                    )}
                    {selectedTab === 1 && (
                        <PassiveDevicesTable
                            deviceData={onlineDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                            selectedOptions={selectedOptions}
                            passiveDeviceDataWithFilter={passiveDeviceDataWithFilter}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsEdit={setIsEdit}
                            setIsDelete={setIsDelete}
                            isEdit={isEdit}
                        />
                    )}
                    {selectedTab === 2 && (
                        <PassiveDevicesTable
                            deviceData={offlineDeviceData}
                            nextPageData={nextPageData}
                            previousPageData={previousPageData}
                            paginationData={paginationData}
                            isDeviceProcessing={isDeviceProcessing}
                            setIsDeviceProcessing={setIsDeviceProcessing}
                            selectedOptions={selectedOptions}
                            passiveDeviceDataWithFilter={passiveDeviceDataWithFilter}
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setIsEdit={setIsEdit}
                            setIsDelete={setIsDelete}
                            isEdit={isEdit}
                        />
                    )}
                </Col>
            </Row>

            <Modal show={isEdit} onHide={handleEditClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Passive Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Model</Form.Label>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                value={modalVal}
                                disabled={true}>
                                <option selected>{modalVal}</option>
                            </Input>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    setIdentifierVal(e.target.value);
                                }}
                                value={identifierVal}
                                autoFocus
                            />
                        </Form.Group>
                        <button
                            style={{
                                backgroundColor: '#FFEEF1',
                                width: '200px',
                                paddingLeft: '10px',
                                borderRadius: '10px',
                                border: 'none',
                            }}
                            onClick={() => {
                                deleteDeviceData();
                            }}>
                            <img style={{ marginTop: '10px', marginBottom: '10px' }} src={Delete} />
                            <span style={{ color: 'red', marginTop: '10px', marginBottom: '10px', marginLeft: '5px' }}>
                                Delete Passive Device
                            </span>
                        </button>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}>
                    <Button
                        style={{ width: '50%', backgroundColor: '#ffffff', borderColor: '#000000', color: '#000000' }}
                        onClick={handleEditClose}>
                        Cancel
                    </Button>
                    <Button
                        style={{ width: '50%', backgroundColor: '#3A42EE', borderColor: '#3A42EE' }}
                        onClick={() => {
                            updateDeviceData();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal size="sm" show={isDelete} onHide={handleDeleteClose} centered>
                <Modal.Header>
                    <Modal.Title>Delete Passive Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <span>Are you sure you want to delete the passive device</span>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}>
                    <Button
                        style={{ width: '50%', backgroundColor: '#ffffff', borderColor: '#000000', color: '#000000' }}
                        onClick={handleDeleteClose}>
                        Cancel
                    </Button>
                    <Button
                        style={{ width: '50%', backgroundColor: '#b42318', borderColor: '#b42318' }}
                        onClick={() => {
                            deleteDeviceData();
                        }}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Create Passive Device</Modal.Title>
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
                            <Form.Label>Model</Form.Label>
                            {/* <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('model', e.target.value);
                                }}>
                                <option selected>Select Model</option>
                                {passiveDeviceModel.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input> */}
                            <Select
                                id="exampleSelect"
                                placeholder="Select Model"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Model'}
                                options={passiveDeviceModel}
                                onChange={(e) => {
                                    handleChange('model', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Location</Form.Label>
                            {/* <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option selected>Select Location</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
                                })}
                            </Input> */}
                            {/* locationDataNow */}
                            <Select
                                id="exampleSelect"
                                placeholder="Select Location"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Location'}
                                options={locationDataNow}
                                onChange={(e) => {
                                    handleChange('space_id', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
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

export default PassiveDevices;