import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    BaseUrl,
    generalPassiveDevices,
    getLocation,
    createDevice,
    searchDevices,
    updateDevice,
    deletePassiveDevice,
} from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Search } from 'react-feather';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import { faEllipsisVertical, faPen, faTrash } from '@fortawesome/pro-regular-svg-icons';
import { useAtom } from 'jotai';
import { deviceId, identifier, passiveDeviceModal, userPermissionData } from '../../../store/globalState';
import Select from 'react-select';
import Dropdown from 'react-bootstrap/Dropdown';
import './style.css';
import Typography from '../../../sharedComponents/typography';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import CreatePassiveDevice from './CreatePassiveDevice';

const PassiveDevicesTable = ({
    deviceData,
    nextPageData,
    previousPageData,
    paginationData,
    isDeviceProcessing,
    selectedOptions,
    passiveDeviceDataWithFilter,
    pageSize,
    setPageSize,
    setIsEdit,
    setIsDelete,
}) => {
    const [userPermission] = useAtom(userPermissionData);

    const [identifierOrder, setIdentifierOrder] = useState(false);
    const [modelOrder, setModelOrder] = useState(false);
    const [locationOrder, setLocationOrder] = useState(false);
    const [sensorOrder, setSensorOrder] = useState(false);

    const handleColumnSort = (order, columnName) => {
        if (columnName === 'identifier') {
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
                <Table className="mt-4 mb-0 bordered table-hover">
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
                                            <div className="ml-2" onClick={() => handleColumnSort('ace', 'identifier')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div className="ml-2" onClick={() => handleColumnSort('dce', 'identifier')}>
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
                                            <div className="ml-2" onClick={() => handleColumnSort('dce', 'model')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'location') && (
                                <th className="active-device-header" onClick={() => setLocationOrder(!locationOrder)}>
                                    <div className="passive-device-flex">
                                        <div>Location</div>
                                        {locationOrder ? (
                                            <div className="ml-2" onClick={() => handleColumnSort('ace', 'location')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div className="ml-2" onClick={() => handleColumnSort('dce', 'location')}>
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
                                                onClick={() => handleColumnSort('dce', 'sensor_count')}>
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
                                                    {record.status ? (
                                                        <div className="icon-bg-styling">
                                                            <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                        </div>
                                                    ) : (
                                                        <div className="icon-bg-styling-slash">
                                                            <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                        </div>
                                                    )}
                                                </td>
                                            )}
                                            {userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.advanced_passive_device_permission
                                                ?.edit ? (
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
                                            ) : (
                                                <>
                                                    {selectedOptions.some(
                                                        (record) => record.value === 'identifier'
                                                    ) && (
                                                        <td className="font-weight-bold panel-name">
                                                            {record.identifier}
                                                        </td>
                                                    )}
                                                </>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'model') && (
                                                <td>{record.model.charAt(0).toUpperCase() + record.model.slice(1)}</td>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'location') && (
                                                <td>{record.location === '' ? ' - ' : record.location}</td>
                                            )}
                                            {selectedOptions.some((record) => record.value === 'sensors') && (
                                                <td>{record.sensor_number}</td>
                                            )}
                                            <td>
                                                <Dropdown className="float-end" align="end">
                                                    <div
                                                        onClick={() => {
                                                            setToggleEdit(true);
                                                            setSensorId(record?.identifier);
                                                            setIdentifierVal(record?.identifier);
                                                            setDeviceIdVal(record?.equipments_id);
                                                            setModalVal(record?.model);
                                                        }}>
                                                        <Dropdown.Toggle
                                                            as="a"
                                                            className="cursor-pointer arrow-none text-muted">
                                                            <div className="triple-dot-style">
                                                                <FontAwesomeIcon
                                                                    icon={faEllipsisVertical}
                                                                    color="#1D2939"
                                                                    size="lg"
                                                                />
                                                            </div>
                                                        </Dropdown.Toggle>
                                                    </div>
                                                    <Dropdown.Menu>
                                                        <div
                                                            onClick={() => {
                                                                setIsEdit(true);
                                                            }}>
                                                            <Dropdown.Item>
                                                                <FontAwesomeIcon
                                                                    icon={faPen}
                                                                    color="#1D2939"
                                                                    size="lg"
                                                                    className="mr-4"
                                                                />
                                                                Edit
                                                            </Dropdown.Item>
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setIsDelete(true);
                                                            }}>
                                                            <Dropdown.Item>
                                                                <FontAwesomeIcon
                                                                    icon={faTrash}
                                                                    color="#d92d20"
                                                                    size="lg"
                                                                    className="mr-4"
                                                                />
                                                                <span className="delete-btn-style">Delete</span>
                                                            </Dropdown.Item>
                                                        </div>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    </>
                                );
                            })}
                        </tbody>
                    )}
                </Table>

                <div className="page-button-style">
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
        </>
    );
};

const PassiveDevices = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [formValidation, setFormValidation] = useState(false);

    const [userPermission] = useAtom(userPermissionData);

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

    // Add Device Modal states
    const [isAddDeviceModalOpen, setAddDeviceDeviceModal] = useState(false);
    const closeAddDeviceModal = () => setAddDeviceDeviceModal(false);
    const openAddDeviceModal = () => setAddDeviceDeviceModal(true);

    const [pageRefresh, setPageRefresh] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);

    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [duplicatePassiveDeviceData, setDuplicatePassiveDeviceData] = useState([]);

    const [paginationData, setPaginationData] = useState({});
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [generalGatewayData, setGeneralGatewayData] = useState([]);

    const [search, setSearch] = useState('');

    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);

    const [isEdit, setIsEdit] = useState(false);
    const handleEditClose = () => setIsEdit(false);

    const [isDelete, setIsDelete] = useState(false);
    const handleDeleteClose = () => setIsDelete(false);

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

                response.data.forEach((record) => {
                    record.status ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            setIsDeviceProcessing(false);
        }
    };
    const handleSearchtxt = (e) => {
        if (e.target.value !== '') {
            setSearch(e.target.value.toUpperCase());
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

                response.data.forEach((record) => {
                    record.status ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            setIsDeviceProcessing(false);
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
                    record.status ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            setIsDeviceProcessing(false);
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
                    passiveDeviceDataWithFilter('ace', 'identifier');
                    handleEditClose();
                });
        } catch (error) {}
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
                    passiveDeviceDataWithFilter('ace', 'identifier');
                    handleDeleteClose();
                });
        } catch (error) {}
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
            let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}&device_search=${encodeURIComponent(
                deviceSearch
            )}&sort_by=ace`;
            await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                let data = res.data;
                setPassiveDeviceData(data.data);
                setDuplicatePassiveDeviceData(data.data);
                setPaginationData(res.data);
                let onlineData = [];
                let offlineData = [];

                data.data.forEach((record) => {
                    record.status ? onlineData.push(record) : offlineData.push(record);
                });

                setOnlineDeviceData(onlineData);
                setOfflineDeviceData(offlineData);
                setIsDeviceProcessing(false);
            });
        } catch (error) {
            setIsDeviceProcessing(false);
        }
    };

    const handleSearch = async () => {
        try {
            setIsDeviceProcessing(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?device_type=passive&building_id=${bldgId}&mac=${encodeURIComponent(deviceSearch)}`;
            await axios.post(`${BaseUrl}${searchDevices}${params}`, {}, { headers }).then((res) => {
                let response = res.data;
                setPassiveDeviceData(res.data);
            });
            setIsDeviceProcessing(false);
        } catch (error) {
            setIsDeviceProcessing(false);
        }
    };

    useEffect(() => {
        if (deviceSearch.length === 0) fetchPassiveDeviceData();
    }, [deviceSearch, pageSize]);

    useEffect(() => {
        fetchPassiveDeviceData();
    }, [pageRefresh, bldgId]);

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
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Passive Devices</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Passive Device'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddDeviceModal();
                                    }}
                                    icon={<PlusSVG />}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col xl={3}>
                    <div class="input-group rounded">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            onChange={(e) => {
                                setDeviceSearch(e.target.value.trim());
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

                    {/* <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button> */}

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
                <Col lg={12}>
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
                            <Form.Control
                                type="text"
                                placeholder="Enter Model"
                                className="font-weight-bold"
                                disabled={true}
                                value={modalVal.charAt(0).toUpperCase() + modalVal.slice(1)}
                                style={{ backgroundColor: '#F5F5F5' }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Identifier</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Identifier"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    setIdentifierVal(e.target.value);
                                    setFormValidation(true);
                                }}
                                value={identifierVal}
                            />
                        </Form.Group>
                        {/* <button
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
                        </button> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                handleEditClose();
                            }}
                        />

                        <Button
                            label={'Edit'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            className="w-100"
                            onClick={() => {
                                updateDeviceData();
                            }}
                        />
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal size="sm" show={isDelete} onHide={handleDeleteClose} centered>
                <Modal.Header>
                    <Modal.Title>Delete Passive Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <span>Are you sure you want to delete the Passive Device?</span>
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

            <CreatePassiveDevice
                isAddDeviceModalOpen={isAddDeviceModalOpen}
                closeAddDeviceModal={closeAddDeviceModal}
                fetchPassiveDeviceData={fetchPassiveDeviceData}
            />
        </React.Fragment>
    );
};

export default PassiveDevices;
